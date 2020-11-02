import React from "react";
import { CardLayout } from "./CardLayout";
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-bottts-sprites";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Card,
  Avatar,
  Tooltip,
} from "@material-ui/core";
import { Padding } from ".";
import { useConfirmationDialog } from "../hooks/useConfirmationDialog";
import { Player } from "../types/DomainModels";
import { RiMedal2Line } from "react-icons/ri";
import { MdArrowBack } from "react-icons/md";

let options = {};
let avatars = new Avatars(sprites, options);
type Props = {
  code: string;
  onLeave: () => void;
  leaderId: string;
  currentPlayer: Player;
  otherPlayers: Player[];
  minPlayers: number;
};

function PlayerListItem(props: {
  player: Player;
  isCurrentPlayer: boolean;
  isLeader: boolean;
}) {
  const avatarSvg = React.useMemo(
    () => avatars.create(props.player.id, { base64: true }),
    [props.player.id]
  );
  return (
    <Box
      height="3.5rem"
      alignItems="center"
      display="flex"
      paddingY="0.5rem"
      paddingX="1rem"
      clone
    >
      <Card>
        <Avatar src={avatarSvg} />
        <Padding />
        <Typography variant="subtitle2">{props.player.name}</Typography>
        <Padding flex={1} />
        {props.isLeader ? (
          <Tooltip
            title={
              "This user is the leader" +
              (props.isCurrentPlayer ? "...which is you" : "")
            }
          >
            <div>
              <RiMedal2Line size="1.5rem" />
            </div>
          </Tooltip>
        ) : null}
      </Card>
    </Box>
  );
}

export const Lobby = React.forwardRef<HTMLFormElement, Props>(function Lobby(
  props: Props,
  ref
) {
  const confirmAbandonDialog = useConfirmationDialog({
    title: "Abandon game?",
    content:
      "Abandoning the game will cause all other players to be kicked out.",
    onConfirm: props.onLeave,
  });

  const playersList = React.useMemo(
    () => [props.currentPlayer, ...props.otherPlayers],
    [props.currentPlayer, props.otherPlayers]
  );
  const isCurrentPlayerLeader = props.currentPlayer.id === props.leaderId;
  return (
    <CardLayout
      ref={ref}
      variant="white"
      heading={
        <>
          <Box display="flex">
            {confirmAbandonDialog.node}
            <Button
              variant="outlined"
              startIcon={<MdArrowBack />}
              onClick={
                isCurrentPlayerLeader
                  ? confirmAbandonDialog.open
                  : props.onLeave
              }
            >
              {isCurrentPlayerLeader ? "Abandon" : "Leave"}
            </Button>
          </Box>
          <Padding size={0.5} />
          <Typography variant="h5" align="center">
            Your room code is:
          </Typography>
          <Typography variant="h3" align="center">
            {props.code}
          </Typography>
          <Typography variant="subtitle2" align="center">
            Share this with others so they can join you!
          </Typography>
        </>
      }
      body={
        <Box height="100%" display="flex" flexDirection="column">
          <Padding size={1} />
          {playersList.length >= props.minPlayers ? (
            <Button variant="contained" color="secondary">
              Everybodys in
            </Button>
          ) : (
            <Box
              display="flex"
              width="100%"
              justifyContent="center"
              style={{ opacity: 0.6 }}
            >
              <CircularProgress size="1rem" />
              <Padding size={0.5} />
              <Typography variant="subtitle2" align="center">
                {props.minPlayers - playersList.length} more player
                {props.minPlayers - playersList.length === 1 ? "" : "s"} needed
                to start
              </Typography>
            </Box>
          )}

          <Padding size={2} />

          <Box
            padding="0.5rem"
            width="100%"
            maxWidth="20rem"
            alignSelf="center"
            style={{ overflowY: "auto" }}
          >
            {playersList.map((player, i) => (
              <React.Fragment key={player.id}>
                <PlayerListItem
                  isCurrentPlayer={props.currentPlayer.id === player.id}
                  isLeader={player.id === props.leaderId}
                  player={player}
                />
                {i !== playersList.length - 1 ? <Padding size={0.5} /> : null}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      }
    />
  );
});
