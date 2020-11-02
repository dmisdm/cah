import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import { blackCards, whiteCards } from "./data.json";

class GameMapSchema<T = any> extends MapSchema<T> {
  //@ts-ignore
  [key: string]: T;
}
export type CardType = "white" | "black";
export class WhiteCard extends Schema {
  @type("string")
  text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }
}
export class BlackCard extends Schema {
  @type("string")
  text: string;
  @type("uint8")
  pick: number;
  constructor(text: string, pick: number) {
    super();
    this.text = text;
    this.pick = pick;
  }
}
export class Player extends Schema {
  @type("string")
  sessionId: string;
  @type("string")
  name: string;
  @type([WhiteCard])
  whiteCards: ArraySchema<WhiteCard>;
  @type([BlackCard])
  blackCards: ArraySchema<BlackCard>;
  @type("number")
  position: number;
  @type("boolean")
  connected: boolean;
  constructor(props: {
    sessionId: string;
    name: string;
    position: number;
    blackCards: ArraySchema<BlackCard>;
    whiteCards: ArraySchema<WhiteCard>;
    connected: boolean;
  }) {
    super();
    this.sessionId = props.sessionId;
    this.name = props.name;
    this.position = props.position;
    this.blackCards = props.blackCards;
    this.whiteCards = props.whiteCards;
    this.connected = props.connected;
  }
}

export class CardSubmission extends Schema {
  @type(Player)
  player: Player;
  @type([WhiteCard])
  cards: ArraySchema<WhiteCard>;
  constructor(player: Player, cards: ArraySchema<WhiteCard>) {
    super();
    this.player = player;
    this.cards = cards;
  }
}

export type GameErrorType = "NoMoreBlackCards";
export class GameError<T extends GameErrorType = GameErrorType> {
  constructor(public type: T) {}
}

type GameStateStatus = "waitingForPlayers" | "submittingCards" | "judging";

export class GameState extends Schema {
  @type("string")
  roomId: string;
  @type({ map: Player })
  players = new GameMapSchema<Player>();
  @type("string")
  status: GameStateStatus = "waitingForPlayers";
  @type("string")
  judge?: string;
  @type(BlackCard)
  blackCard?: BlackCard;
  @type({ map: CardSubmission })
  submissions = new GameMapSchema<CardSubmission>();
  @type("uint8")
  numberOfPlayers: number = 0;
  @type("uint8")
  nextJudge = 0;
  blackCards = blackCards.map((card) => new BlackCard(card.text, card.pick));
  whiteCards = whiteCards.map((card) => new WhiteCard(card));
  constructor(roomId: string) {
    super(roomId);
    this.roomId = roomId;
  }
  private pickBlackCard = (): BlackCard | "NoMore" => {
    const next = this.blackCards.pop();
    if (!next) {
      return "NoMore";
    }
    return next;
  };

  private pickWhiteCard = (): WhiteCard | "NoMore" => {
    const next = this.whiteCards.pop();
    if (!next) {
      return "NoMore";
    }
    return next;
  };
  private dealWhiteCardsForPlayer = (amount: number): WhiteCard[] => {
    let output = [];
    for (let i = 0; i < amount; i++) {
      //TODO: What to do when all white cards are out????
      const card = this.pickWhiteCard();
      if (card !== "NoMore") {
        output.push(card);
      }
    }
    return output;
  };

  public startGame = (): void | GameError<"NoMoreBlackCards"> => {
    if (this.status === "waitingForPlayers") {
      this.nextTurn();
    }
  };

  public nextTurn = () => {
    const nextBlackCard = this.pickBlackCard();
    if (nextBlackCard === "NoMore") {
      return new GameError("NoMoreBlackCards");
    }
    this.status = "submittingCards";
    this.judge = Object.values(this.players).sort(
      (a, b) => b.position - a.position
    )[this.nextJudge].sessionId;
    this.nextJudge = (this.nextJudge + 1) % this.numberOfPlayers;
    this.blackCard = nextBlackCard;
  };

  public submitCards = (submission: CardSubmission) => {
    if (this.status === "submittingCards") {
      this.submissions[submission.player.sessionId] = submission;
      if (Object.values(this.submissions).length >= this.numberOfPlayers - 1) {
        this.status = "judging";
      }
    }
  };

  public decideWinner = (submission: CardSubmission) => {
    if (this.status === "judging" && this.blackCard) {
      const player = this.players[submission.player.sessionId];
      this.players[submission.player.sessionId] = new Player({
        ...player,
        blackCards: new ArraySchema(this.blackCard, ...player.blackCards),
      });

      //TODO: Put binned cards in a pile
      Object.keys(this.submissions).forEach((k) => {
        delete this.submissions[k];
      });
      this.nextTurn();
    }
  };

  public addPlayer = (props: { sessionId: string; name: string }) => {
    const player = new Player({
      sessionId: props.sessionId,
      name: props.name,
      position: this.numberOfPlayers,
      connected: true,
      blackCards: new ArraySchema(),
      whiteCards: new ArraySchema(...this.dealWhiteCardsForPlayer(10)),
    });

    this.players[player.sessionId] = player;
    this.numberOfPlayers++;
  };

  public removePlayer = (sessionId: string) => {
    if (this.players[sessionId]) {
      delete this.players[sessionId];
      this.numberOfPlayers--;
    }
  };
}

export const randomChar = () =>
  String.fromCharCode(Math.floor(Math.random() * 26) + 65);

export const randomGameCode = () =>
  Array.from(Array(4), () => randomChar()).join("");

export type JoinOptions = {
  name: string;
};

export type StartGameMessage = ["startGame"];
export type SubmitWhiteCardsMessage = ["submitWhiteCards", { text: string }[]];
export type DecideWinner = ["decideWinner", string];

export type MessageType =
  | StartGameMessage
  | SubmitWhiteCardsMessage
  | DecideWinner;
