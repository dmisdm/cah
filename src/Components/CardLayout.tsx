import React from "react";
import { Card, Box, makeStyles } from "@material-ui/core";
import { Padding } from ".";
const useLayoutStyles = makeStyles((theme) => ({
  card: ({
    variant,
    noPadding,
  }: {
    variant: "white" | "black";
    noPadding?: boolean;
  }) => ({
    height: "100%",
    width: "100%",
    maxWidth: theme.breakpoints.width("sm"),
    maxHeight: theme.breakpoints.width("sm") * theme.cardAspectRatio,
    borderRadius: theme.shape.borderRadius,
    background:
      variant === "black"
        ? theme.blackCardBackground
        : theme.whiteCardBackground,
    color: variant === "black" ? theme.blackCardColor : theme.whiteCardColor,
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    ...(!noPadding
      ? {
          padding: "1rem",
        }
      : {}),
  }),
  container: {
    minHeight: "30rem",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
}));
type Props = {
  variant: "white" | "black";
  heading?: React.ReactNode;
  body: React.ReactNode;
  bodyClass?: string;
  footer?: React.ReactNode;
  onSubmit?: React.ComponentPropsWithoutRef<"form">["onSubmit"];
  noPadding?: boolean;
};
export const CardLayout = React.forwardRef<HTMLFormElement, Props>(
  function CardLayout(props: Props, ref) {
    const styles = useLayoutStyles(props);
    return (
      <form ref={ref} className={styles.container} onSubmit={props.onSubmit}>
        <Card elevation={3} className={styles.card}>
          {props.heading ? <Box flex={1}>{props.heading}</Box> : null}
          <Padding />
          <Box flex={10} overflow="auto" className={props.bodyClass}>
            {props.body}
          </Box>
          <Padding />
          {props.footer && <Box flex={1}>{props.footer}</Box>}
        </Card>
      </form>
    );
  }
);
