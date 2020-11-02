import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  MenuList,
  Typography,
} from "@material-ui/core";
import * as t from "io-ts";
import React from "react";
import ReactJson from "react-json-view";
import { AppError } from "./lib/AppError";
import { CardSubmission, GameState, Player, WhiteCard } from "./common/Schema";
import { Padding } from "./Components";
import { IndexPage } from "./Pages/IndexPage";
import { localPersistence, User } from "./Persistence";
import { PlayingCard } from "./Components";
import { CAHRoom, orchestrator } from "./Repository";
import { ProvideCAHThemeAndBaseline } from "./theme";

const dataSchema = t.type({
  blackCards: t.array(
    t.type({
      text: t.string,
      pick: t.number,
    })
  ),
  whiteCards: t.array(t.string),
});

type Data = t.TypeOf<typeof dataSchema>;

const getData = () =>
  fetch("https://www.crhallberg.com/cah/output.php").then(async (r) =>
    r.ok ? dataSchema.decode(await r.json()) : { error: r.statusText }
  );

export const colors = {
  black: "#000",
  white: "#FFF",
};

function CardStack(props: { cards: { text: string }[] }) {
  return (
    <Box>
      {props.cards.map((card) => (
        <Box key={card.text} paddingBottom="1rem">
          <PlayingCard variant="black" {...card}></PlayingCard>
        </Box>
      ))}
    </Box>
  );
}

function TestPage() {
  const [data, setData] = React.useState<Data>();
  /*   const mounted = usePromise();
  React.useEffect(() => {
    (async () => {
      const data = await mounted(getData());

      if ("error" in data) {
      } else {
        setData(data);
      }
    })();
  }, [mounted]); */
  return (
    <Box padding="2rem">
      {data?.blackCards ? <CardStack cards={data.blackCards} /> : null}
    </Box>
  );
}

function Game({
  roomId,
  players,
  startGame,
  status,
  player,
  judge,
  blackCard,
  submitWhiteCards,
  submissions,
  decideWinner,
}: Pick<
  GameState,
  "players" | "roomId" | "status" | "judge" | "blackCard" | "submissions"
> & {
  startGame: () => void;
  submitWhiteCards: (cards: WhiteCard[]) => void;
  submissions: Record<string, CardSubmission | undefined>;
  player: Player;
  decideWinner: (sessionId: string) => void;
}) {
  const isJudge = judge === player.sessionId;
  return (
    <Box padding="1rem" display="flex" flexDirection="column">
      <Box alignSelf="center">
        {" "}
        <Typography variant="h2">
          <small>Your room code is: </small>
          {roomId}
        </Typography>
        <Typography variant="subtitle1">
          Others can use this to join your game!
        </Typography>
      </Box>

      <Box>
        <Typography variant="h3">Your winnings</Typography>
        {player.blackCards.map((card) => (
          <PlayingCard
            key="text"
            text={card.text}
            variant="black"
          ></PlayingCard>
        ))}
      </Box>
      <Padding />
      {status === "waitingForPlayers" ? (
        <>
          <Box alignSelf="center" width={"20rem"}>
            <List>
              {Object.values(players).map((p) => (
                <ListItem key={p.sessionId}>
                  <ListItemText
                    style={!p.connected ? { opacity: 0.6 } : undefined}
                  >
                    {p.name}
                    {!p.connected ? " (disconnected)" : ""}
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>
          <Button variant="outlined" color="primary" onClick={startGame}>
            Everybodys in
          </Button>
        </>
      ) : status === "submittingCards" && blackCard ? (
        <Box>
          <PlayingCard text={blackCard.text} variant="black" />
          <Padding />
          {isJudge ? (
            <>
              <Typography>
                You are the judge! Wait for people to submit cards
              </Typography>
            </>
          ) : (
            <>
              {" "}
              <Typography>Select {blackCard.pick} cards</Typography>
              <MenuList>
                {player.whiteCards.map((card) => (
                  <MenuItem
                    onClick={() => submitWhiteCards([card])}
                    button
                    key={card.text}
                  >
                    {card.text}
                  </MenuItem>
                ))}
              </MenuList>
            </>
          )}
        </Box>
      ) : status === "judging" && blackCard ? (
        <>
          <PlayingCard text={blackCard.text} variant="black" />
          {isJudge ? (
            <>
              <Typography>Youre the judge, so select a winner!</Typography>
              <MenuList>
                {Object.values(submissions).map((submission) => (
                  <MenuItem
                    onClick={() => decideWinner(submission.player.sessionId)}
                    button
                    key={submission.player.sessionId}
                  >
                    {submission.cards.map((card) => card.text).join(",")}
                  </MenuItem>
                ))}
              </MenuList>
            </>
          ) : (
            <>
              <Typography variant="h2">The judge is deciding!</Typography>
            </>
          )}
        </>
      ) : null}
      <ReactJson
        src={{ blackCard, player, status, judge, submissions, roomId }}
      />
    </Box>
  );
}

function App(props: {}) {
  const [currentGame, setCurrentGame] = React.useState<CAHRoom>();
  const [currentGameState, setCurrentGameState] = React.useState<
    Pick<
      GameState,
      | "players"
      | "roomId"
      | "status"
      | "nextJudge"
      | "judge"
      | "numberOfPlayers"
      | "blackCard"
      | "submissions"
    >
  >();
  const [currentUser, setCurrentUser] = React.useState<User>();
  const onJoinGame = async (currentUser?: User) => {
    if (currentUser && currentUser.session) {
      const joinResult = await orchestrator.joinGame(
        currentUser.session,
        currentUser.name
      );
      if (joinResult instanceof AppError) {
        //TODO: Handle room not found
        if (joinResult.type !== "RoomNotFound") {
          setCurrentUser((user) =>
            user
              ? {
                  ...user,
                  session: user.session
                    ? { roomId: user.session.roomId }
                    : undefined,
                }
              : user
          );
        }
      } else {
        joinResult.subscribe((room) => {
          setCurrentGame(room);
          setCurrentGameState({ ...room.state });
          console.log(room.state);
          localPersistence.updateSession({
            id: room.sessionId,
            roomId: room.id,
          });
        });
      }
    }
  };
  React.useEffect(() => {
    (async () => {
      const user = await localPersistence.getCurrentUser();

      setCurrentUser(user);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onCreateRoom = () => {
    if (currentUser) {
      orchestrator.createGame(currentUser.name).subscribe((room) => {
        setCurrentGame(room);
        setCurrentGameState({ ...room.state });
        localPersistence.updateSession({
          id: room.sessionId,
          roomId: room.id,
        });
      });
    }
  };

  const updateName = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      localPersistence.updateUserName(newValue);
      setCurrentUser((user) => (user ? { ...user, name: newValue } : user));
    },
    []
  );

  const updateRoomId = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      localPersistence.updateSession({
        roomId: newValue,
      });
      setCurrentUser((user) =>
        user
          ? { ...user, session: { ...user.session, roomId: newValue } }
          : user
      );
    },
    []
  );

  /* <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="100%"
      width="100%"
    >
      <TextField
        label="Name"
        value={currentUser?.name || ""}
        onChange={updateName}
      />
      <Typography variant="h4">Join or create a game!</Typography>
      <Padding />
      <Box display="inline-flex">
        <Input
          value={currentUser?.session?.roomId || ""}
          onChange={updateRoomId}
        />
        <Button
          onClick={() => onJoinGame(currentUser)}
          color="primary"
          variant="outlined"
        >
          Join
        </Button>
      </Box>

      <Button onClick={onCreateRoom}>Create</Button>
    </Box> */
  /* return !currentUser ? null : !(currentGameState && currentGame) ? (
   
  ) : (
    <Game
      startGame={() => currentGame.send(["startGame"])}
      submitWhiteCards={(cards) =>
        currentGame.send(["submitWhiteCards", cards])
      }
      decideWinner={(submission) =>
        currentGame.send(["decideWinner", submission])
      }
      roomId={currentGameState.roomId}
      players={currentGameState.players}
      status={currentGameState.status}
      player={currentGameState.players[currentGame.sessionId]}
      judge={currentGameState.judge}
      blackCard={currentGameState.blackCard}
      submissions={currentGameState.submissions}
    />
  ); */
  return (
    <ProvideCAHThemeAndBaseline>
      <IndexPage />
    </ProvideCAHThemeAndBaseline>
  );
}

export default App;
