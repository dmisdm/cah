import React from "react";
import { Page } from "../Components";
import { IntroCard } from "../Components/IntroCard";
import { Slide } from "@material-ui/core";
import { JoinOrCreate } from "../Components/JoinOrCreate";
import { Lobby } from "../Components/Lobby";
import { useUserStore } from "../state/user";
type StageType = "intro" | "joinOrCreate" | "createGame";
export function IndexPage() {
  const previousStage = React.useRef<null | StageType>(null);
  const [stage, setStage] = React.useState<StageType>("intro");

  const onIntroCardNext = React.useCallback(() => {
    previousStage.current = stage;
    setStage("joinOrCreate");
  }, [stage]);
  const onJoinOrCreateBack = React.useCallback(() => {
    previousStage.current = stage;
    setStage("intro");
  }, [stage]);

  const onCreate = React.useCallback(() => {
    previousStage.current = stage;
    setStage("createGame");
  }, [stage]);

  const onJoin = React.useCallback(() => {}, []);

  const onAbandonCreatedGame = React.useCallback(() => {
    previousStage.current = stage;
    setStage("joinOrCreate");
  }, [stage]);

  const userStore = useUserStore();

  return (
    <Page padding="0.5rem">
      {stage === "intro" ? (
        <Slide appear in>
          <IntroCard onNext={onIntroCardNext} />
        </Slide>
      ) : null}

      {stage === "joinOrCreate" ? (
        <Slide appear in>
          <JoinOrCreate
            onCreate={onCreate}
            onJoin={onJoin}
            onBack={onJoinOrCreateBack}
          />
        </Slide>
      ) : null}
      {stage === "createGame" ? (
        <Slide appear in>
          <Lobby
            leaderId="asdf"
            minPlayers={3}
            currentPlayer={{ name: userStore.name, id: "asdf", hand: [] }}
            otherPlayers={[]}
            onLeave={onAbandonCreatedGame}
            code="XAGD"
          />
        </Slide>
      ) : null}
    </Page>
  );
}
