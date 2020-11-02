import React from "react";
import { Box, Card, Typography, useTheme, Hidden } from "@material-ui/core";
export const Padding = ({
  size = 1,
  flex,
}: {
  size?: number;
  flex?: string | number;
}) => (
  <Box
    width={`${size}rem`}
    height={`${size}rem`}
    flexShrink={0}
    flexBasis={`${size}rem`}
    flex={flex}
  />
);
export function Page(props: React.ComponentPropsWithoutRef<typeof Box>) {
  return <Box height="100%" width="100%" {...props}></Box>;
}

export const PlayingCard = React.forwardRef(function PlayingCard(
  props: {
    width?: string;
    /** Height will be calculated automatically using theme.cardAspectRatio if you don't pass it. */
    height?: string;
    variant: "black" | "white";
    text: React.ReactNode;
    className?: string;
    elevation?: number;
    footer?: React.ReactNode;
  },
  ref
) {
  const theme = useTheme();
  const whiteColor = theme.whiteCardBackground;
  const width = props.width || "230px";
  const text =
    typeof props.text === "string"
      ? props.text.replace(/_/g, "______")
      : props.text;
  return (
    <Box
      clone
      height={props.height || `calc(${width} * ${theme.cardAspectRatio})`}
      width={width}
      padding="1rem"
      borderRadius={theme.shape.borderRadius}
      bgcolor={
        props.variant === "black" ? theme.palette.common.black : whiteColor
      }
      color={
        props.variant === "black" ? whiteColor : theme.palette.common.black
      }
      className={props.className}
      display="flex"
      flexDirection="column"
    >
      <Card ref={ref} elevation={props.elevation}>
        <Hidden xsDown>
          <Typography variant="h6">{text}</Typography>
        </Hidden>
        <Hidden smUp>
          <Typography>{text}</Typography>
        </Hidden>

        <Padding flex={1} />
        <Box>{props.footer}</Box>
      </Card>
    </Box>
  );
});
