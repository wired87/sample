import {createContext, Dispatch, SetStateAction} from "react";
import {JwtToken} from "./JwtAuth";

export const PrimaryContext = createContext(
  {
    darkmode: false,
    setDarkmode: (() => {}) as Dispatch<SetStateAction<boolean>>,

    toggleTheme: (() => {}),

    user: null as firebase.User | null,
    setUser: (() => {}) as Dispatch<SetStateAction<firebase.User | null>>,

    loading: false,
    setLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,

    clearMessages: false,
    setClearMessages: (() => {}) as Dispatch<SetStateAction<boolean>>,

    jwtToken: null as JwtToken | null,
    setJwtToken: (() => {}) as Dispatch<SetStateAction<JwtToken | null>>,

    isConnected: false,
    setIsConnected: (() => {}) as Dispatch<SetStateAction<boolean>>,

    bottomSheetLoaded: false,
    setBottomSheetLoaded: (() => {}) as Dispatch<SetStateAction<boolean>>,

    defaultPostRequest: async (
      postUrl: string,
      postObject: object,
      setError: Dispatch<SetStateAction<string>>,
      setResponse: Dispatch<SetStateAction<any>>,
      setStatus?: Dispatch<SetStateAction<number>>,
      toolAction?:boolean
    ) => Promise<any>,

    alreadyRunning: false,
    updateAlreadyRunning: (value:boolean) :void => {}
  });