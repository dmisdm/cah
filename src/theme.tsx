import {
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
  ThemeOptions,
} from "@material-ui/core";
import React from "react";
import { createGlobalStyle } from "styled-components";
import UbuntuFont from "./assets/fonts/Ubuntu.woff2";
import UbuntuLatinFont from "./assets/fonts/UbuntuLatin.woff2";
import HelveticaNeue from "./assets/fonts/HelveticaNeue.woff2";
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
      main: "#EF6F6C",
    },
  },
  typography: {
    fontFamily: "Helvetica Neue, sans-serif",
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
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif`,
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },
  "#root": {
    height: "100%",
    width: "100%",
  },
});

const Fonts = createGlobalStyle`
/* cyrillic-ext */
@font-face {
  font-family: 'Ubuntu';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: local('Ubuntu Light'), local('Ubuntu-Light'), url(${UbuntuFont}) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Ubuntu';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: local('Ubuntu Light'), local('Ubuntu-Light'), url(${UbuntuFont}) format('woff2');
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Ubuntu';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: local('Ubuntu Light'), local('Ubuntu-Light'), url(${UbuntuFont}) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Ubuntu';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: local('Ubuntu Light'), local('Ubuntu-Light'), url(${UbuntuFont}) format('woff2');
  unicode-range: U+0370-03FF;
}
/* latin-ext */
@font-face {
  font-family: 'Ubuntu';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: local('Ubuntu Light'), local('Ubuntu-Light'), url(${UbuntuFont}) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Ubuntu';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: local('Ubuntu Light'), local('Ubuntu-Light'), url(${UbuntuLatinFont}) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Helvetica Neue';
  font-style: normal;
  font-weight: normal;
  src: local('Helvetica Neue'), local('Helvetica-Neue'), url(${HelveticaNeue}) format('woff2');
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
