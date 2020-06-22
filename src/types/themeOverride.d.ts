//Even though this isn't being used, it needs to be imported (i don't know exactly why, but the augmentation doesnt work otherwise. Maybe because ts treats this file differently if so)
import { Theme } from "@material-ui/core/styles/createMuiTheme";
declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    cardAspectRatio: number;
    blackCardBackground: string;
    blackCardColor: string;
    whiteCardBackground: string;
    whiteCardColor: string;
  }
  interface ThemeOptions {
    cardAspectRatio: number;
    blackCardBackground: string;
    blackCardColor: string;
    whiteCardBackground: string;
    whiteCardColor: string;
  }
}
