import React, {Dispatch, SetStateAction, useEffect} from "react";
import NetInfo from "@react-native-community/netinfo";
import {useMainPrimary} from "./Hooks/MainPrimary";
import {useMedia} from "./Hooks/MediaHooks";
import {useAppHooks} from "./Hooks/useAppHooks";
import {connectionAlert} from "./ConnectionAlert";
import {getToken} from "./JwtAuth";
import {DefaultText} from "../SampleComponents/Input/InputComponents/DefaultText";



/*
DIESE KOMPONENTE DIENT AUSSCHLIEßLICH ZUR VERANSCHAULICHUNG DER INITIALISIERUNG
EINER RN APPLICATION -> er wird beim ausführen nicht funktionieren.
ICH BENUTZE IHN SELBST FÜR MEINE APP MIRACLE AI.
 */
interface AppInitProcessTypes {
  something: string
}

const AppInitProcess: React.FC<AppInitProcessTypes> = (
  {
    something
  }
) => {

  const {
    darkmode, setDarkmode,
    user, setUser,
    setJwtToken,
    isConnected, setIsConnected,
  } = useMainPrimary();


  const {
    authenticated, setAuthenticated,
    appIsReady, setAppIsReady,
    setCustomTheme
  } = useAppHooks(darkmode);

  // Ich überprüfe ob eine Internetverbindung besteht
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      console.log("Internet Connection set:", state.isConnected);
      setIsConnected(state.isConnected || false);
    });
  }, []);

  /*
  connected: aufruf setUserObject
  disconnected: AlertModal pops up -> das AlertModal sind auch in diesem Sample enthalten
   */
  useEffect(() => {
    console.log("Check for the internet connection..")
    if(isConnected){
      console.log("Connection online..")
      const unsubscribe = NetInfo.addEventListener((state) => {
        if (state.isConnected) {
          setUserObject()
            .then(() => console.log("Connection successfully restored.."));
        } else {
          console.log("Could not restore the connection..");
          connectionAlert()
        }
      });
      return () => unsubscribe();
    }
  }, [isConnected]);

  // Ich authentifiziere den Benutzer anonym, um manuelles anmelden zu vermeiden.
  // Im Anschluss setze ich, zur Überprüfung, "authenticated" auf true
  const setUserObject = async () => {
    console.log("Init the UserObject..");
    try {
      signInAnonymously(FIREBASE_AUTH)
        .then(() => {
          setAuthenticated(true);
        });
    } catch (e: unknown) {
      console.log("Error, cant sign in anonymously:", e);
      if (e instanceof Error) {
        console.log("Could not set the user", e)
      }
    }
  }

  // wenn ein firebase benutzerObjekt erstellt wird, setzt ich die User state auf eben dieses Objekt.
  useEffect(() => {
    getAuth().onAuthStateChanged((userObject) => {
      if (userObject) {
        setUser((userObject as firebase.User));
        console.log("User object set: ", userObject)
      } else {
        console.log("User could not be set in App")
      }
    });
  }, []);

  // wenn ein benutzer vorhanden ist, beginnt der JWT-Token Prozess (siehe JWT-auth).
  // Im Anschluss setze ich authenticated wieder auf false um unnötige aufrugfe der funktion zu vermeiden, sollte sich das
  // User-State Objekt im späteren Verlauf ändern
  useEffect(() => {
    if (authenticated && user) {
      getToken(setJwtToken)
        .then(
          () => setAuthenticated(false)
        );
    }
  }, [authenticated, user]);

  /*
  Laden der assets
   */
  useEffect(() => {
    console.log("appIsReady", appIsReady);
    const loadPreferences = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        console.log("Splashscreen initialized..");
        await Font.loadAsync({
          'JetBrainsMono': require('./assets/fonts/codeFont/JetBrainsMono.ttf'),
          'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
          'wizardFont': require('./assets/fonts/poweredFont.otf'),
          'typeIndicator': require('./assets/fonts/codeFont/JetBrainsMono-Italic.ttf'),
        })

        console.log("Fonts have been loaded..");
        const storedThemePreference: string | false | null | true = await getDarkmode();

        console.log("storedThemePreference", storedThemePreference, typeof storedThemePreference);

        if (storedThemePreference !== null) {
          console.log("storedThemePreference !== null");
          setDarkmode(storedThemePreference === "true");

        }else {
          setDarkmode(false);
        }
        setAppIsReady(true);

      }catch(e: unknown) {
        if (e instanceof Error) console.error("Cant load preferences", e.message);

      } finally {
        console.log("SplashScreen will be closed..");
        await SplashScreen.hideAsync();
      }
    }
    if (!(appIsReady)) {
      loadPreferences()
        .then(() => {
          console.log("Fonts have been successfully loaded!");
        });
    }
  }, []);


  useEffect(() => {
    console.log("darkmodeAPP.tsx", darkmode);
    const updateDarkMode = async () => {
      try {
        await SecureStore.setItemAsync("darkmode", String(darkmode));
        console.log("DarkMode changed in main darkMode func to", darkmode);
        const storedValue = await getDarkmode();
        console.log("Stored value in Secure Store:", storedValue);
        // update the colors here
        setCustomTheme(darkmode ? darkModeTheme : lightModeTheme);
      } catch (e) {
        console.error('Error updating dark mode', e);
      }
    };
    if (appIsReady) {
      updateDarkMode()
        .then(() => console.log("Alright"));
    }
  }, [darkmode, appIsReady]);

  return<>Hallo</>
}