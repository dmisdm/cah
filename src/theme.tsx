import {
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
  ThemeOptions,
} from "@material-ui/core";
import React from "react";
import { createGlobalStyle } from "styled-components";

import fontUrl from "./assets/fonts/Poppins/Poppins-Regular.ttf";
const fontName = "Poppins";

const themeOptions: ThemeOptions = {
  palette: {
    background: {
      default: "#d9d9d9",
    },
    common: {
      black: "#131B23",
      white: "#E9F1F7",
    },
    primary: {
      main: "#56e39f",
    },
    secondary: {
      main: "#FEAE6E",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  cardAspectRatio: 1.4,
  blackCardBackground: "#131B23",
  blackCardColor: "#E9F1F7",
  whiteCardBackground: "#fff",
  whiteCardColor: "#131B23",
  shape: {
    borderRadius: 24,
  },
};
const lightCahTheme = createMuiTheme(themeOptions);
const darkCahTheme = createMuiTheme({
  ...themeOptions,
  palette: { ...themeOptions.palette, type: "dark" },
});
const Globals = createGlobalStyle({
  html: {
    height: "100%",
    width: "100%",
    margin: 0,
  },
  body: {
    height: "100%",
    width: "100%",
    margin: 0,
    fontFamily: `Poppins, sans-serif`,
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },
  "#root": {
    height: "100%",
    width: "100%",
  },
});

const Fonts = createGlobalStyle`
@font-face {
  font-family: '${fontName}';
  font-style: normal;
  font-weight: normal;
  src: local('${fontName}'), url(${fontUrl}) format('truetype');
}
`;

export const DarkTheme: React.SFC = React.memo((props) => {
  return <ThemeProvider theme={darkCahTheme}>{props.children}</ThemeProvider>;
});
export const LightTheme: React.SFC = React.memo((props) => {
  return <ThemeProvider theme={lightCahTheme}>{props.children}</ThemeProvider>;
});

export const ProvideCAHThemeAndBaseline: React.SFC = React.memo((props) => (
  <>
    <CssBaseline />
    <Globals />
    <Fonts />
    <LightTheme>{props.children}</LightTheme>
  </>
));
