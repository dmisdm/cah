import React from "react";
import { CardLayout } from "./CardLayout";
import { Box, Button, Typography, TextField, Divider } from "@material-ui/core";
import { useUserStore } from "../state/user";
import { useFormik } from "formik";
import { useSessionStore } from "../state/session";
import { Padding } from ".";
type Props = {
  onBack: () => void;
  onJoin: (room: string) => void;
  onCreate: () => void;
};
export const JoinOrCreate = React.forwardRef<HTMLFormElement, Props>(
  function JoinOrCreate(props: Props, ref) {
    const userStore = useUserStore();
    const sessionStore = useSessionStore();
    const formik = useFormik({
      initialValues: {
        roomCode: sessionStore.roomCode,
      },
      onSubmit: (values) => {
        props.onJoin(values.roomCode || "");
      },
    });
    return (
      <CardLayout
        ref={ref}
        variant="white"
        heading={
          <>
            <Typography variant="h6">Guten Tag, {userStore.name}...</Typography>
            <Typography variant="h4">Join or create game</Typography>
          </>
        }
        body={
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Box width="100%" maxWidth="20rem">
              <Box display="flex" alignItems="flex-end">
                <TextField
                  fullWidth
                  label="Join using a room code"
                  name="roomCode"
                  value={formik.values.roomCode || ""}
                  onChange={formik.handleChange}
                />
                <Padding />
                <Button variant="outlined" onClick={formik.submitForm}>
                  Join
                </Button>
              </Box>

              <Padding size={2} />
              <Button fullWidth variant="outlined" onClick={props.onCreate}>
                Create new game
              </Button>
            </Box>
          </Box>
        }
        footer={
          <Box display="flex" alignItems="flex-end" height="100%">
            <Button color="inherit" onClick={props.onBack}>
              Change your name
            </Button>
          </Box>
        }
      />
    );
  }
);
