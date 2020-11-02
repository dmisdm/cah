export type Player = {
  name: string;
  id: string;
  hand: Card[];
};

export type PlayerInfo = {
  leaderId: string;
  currentPlayer: Player;
  otherPlayers: Player[];
};

export type Card = {
  text: string;
};
export type BlackCard = Card & {
  pick: 1 | 2;
};

export type Submission<B extends BlackCard = BlackCard> = {
  picks: readonly Card[] & {
    length: B["pick"];
  };
  blackCard: B;
};
