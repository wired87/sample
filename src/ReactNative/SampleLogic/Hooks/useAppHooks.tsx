import { useState } from "react";
import {darkModeTheme, lightModeTheme, Theme} from "../../Context";


export function useAppHooks(darkmode: boolean) {
  const [firstContact, setFirstContact] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [customTheme, setCustomTheme] =
    useState<Theme>(darkmode? darkModeTheme : lightModeTheme);

  return {
    firstContact, setFirstContact,
    authenticated, setAuthenticated,
    appIsReady, setAppIsReady,
    customTheme, setCustomTheme
  }
}
