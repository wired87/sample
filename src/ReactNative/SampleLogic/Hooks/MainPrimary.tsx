import {Dispatch, SetStateAction, useState} from "react";
import {JwtToken} from "../../../Context";
import {sendObject} from "../../../chat/functions/SendProcess";
import {getToken} from "../../../../AppFunctions";
import {useTools} from "./useTools";
import firebase from "firebase/compat";


export const useMainPrimary = () => {
  const [darkmode, setDarkmode] = useState<boolean>(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [alreadyRunning, setAlreadyRunning] = useState<boolean>(false);
  const updateAlreadyRunning = (value:boolean) => {
    setAlreadyRunning(value);
  }

  const [loading, setLoading] = useState(false);
  const [clearMessages, setClearMessages] = useState(false);
  const [jwtToken, setJwtToken] = useState<JwtToken | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [bottomSheetLoaded, setBottomSheetLoaded] =
    useState<boolean>(false);
  const toggleTheme = () => setDarkmode(!darkmode);

  let errorCodes:string[] = [
    "400",
    "401",
    "404",
    "505",
    "500",
    "300",
  ]


  const defaultPostRequest = async (
    postUrl: string,
    postObject: any,
    setError: Dispatch<SetStateAction<string>>,
    setResponse: Dispatch<SetStateAction<string>>,
    setStatus?:Dispatch<SetStateAction<number>>,
    toolAction?: boolean
  ):Promise<any> => {
    const {
      setToolActionValue,
      checkToolActionValueProcess} = useTools();

    console.log("jwtToken n Application Content:", jwtToken);
    if (postObject.type !== "contact" && toolAction) {
      await checkToolActionValueProcess();
    }
    /*if (toolActionValue === "0" && toolAction && !toolSuccess) { -> AdLogic -> removed(for now)
      console.log("User has 0 Actions left. Init Ads...")
      await showToolAds( toolActionValue, setToolActionValue);
    }*/
    if (toolAction) {
      console.log("SET TOOL ACTION VALUE TO 0...")
      setToolActionValue("0");
    }

    setLoading(true);
    setError("");

    let response;
    try {
      if (jwtToken?.refresh && jwtToken.access) {
        console.log("Application data sent: ", postObject);
        response = await sendObject(
          postObject,
          jwtToken,
          setJwtToken,
          postUrl
        );

      } else {
        console.error("No token provided");
        const newToken = await getToken(setJwtToken);
        if (newToken) {
          response = await sendObject(
            postObject,
            newToken,
            setJwtToken,
            postUrl
          );

        } else {
          console.error("New Token request failed...");
          setError("Authentication Error");
        }
      }
      if (response) {
        if (response.message && !response.error && !errorCodes.includes(response.status)){
          console.log("Response Successfully:", response);
          setResponse(response.message);
        }else if(!response.message && response.error || errorCodes.includes(response.status)) {
          console.error("Received no result:", response);
          setError(response.error);
          if (setStatus){
            setStatus(Number(response.status));
          }
        }else{
          try{
            setError(response.message)
          }catch(e:unknown){
            if (e instanceof Error) {
              console.error("Could nat classify the response:", e)
              setError("An unexpected error occurred. Please try again or contact the Support.")
            }
            if (setStatus){
              setStatus(500);
            }
          }
        }
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
        console.error("Error while contact submit occurred:", e.message);
      }
      if (setStatus){
        setStatus(500);
      }
    } finally {
      console.log("Application request finished...");
      setLoading(false);
    }
  }

  return {
    darkmode, toggleTheme, setDarkmode, user, setUser, loading, setLoading,
    clearMessages, setClearMessages, jwtToken, setJwtToken, isConnected, setIsConnected,
    bottomSheetLoaded, setBottomSheetLoaded, alreadyRunning, updateAlreadyRunning, defaultPostRequest
  }
}