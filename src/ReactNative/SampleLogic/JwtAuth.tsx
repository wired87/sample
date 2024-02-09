import {Buffer} from "buffer";
import {Dispatch, SetStateAction} from "react";

export interface JwtToken {
  access: string;
  refresh: string;
}

/* Is there an existing Token?
Y: get token from secure store.
Secure store pros: Data will be stored locally and encrypted on the users device, after a
reinstallation, of the Application, the data are still accessible.

*/

export const checkTokenAvailability = async (): Promise<JwtToken | null> => {
  try {
    const JwtToken = await SecureStore.getItemAsync("JwtData");
    console.log("Token available...");
    if (JwtToken) {
      return JSON.parse(JwtToken);
    }
  }catch(e: unknown){
    if (e instanceof Error)
      console.error("Could not get the JwtToken from SecureStore:", e);
  }
  return null;
}

export const saveJwtToken = async (data: JwtToken) => {
  const jsonData = JSON.stringify(data);
  console.log("Data saved in Secure Store...");
  await SecureStore.setItemAsync("JwtData", jsonData);
}

export const getToken = async (setJwtToken: Dispatch<SetStateAction<JwtToken | null>>) => {
  const userJwtTokenExist = await checkTokenAvailability();
  if (userJwtTokenExist) {
    try {
      await checkExistingToken(userJwtTokenExist, setJwtToken);
    }catch (e) {
      if (e instanceof Error) {
        console.error("Error occurred AAAAAAAH,", e);
      }
    }
  }else {
    // kein gespeicherter Token vorhanden...
    const tokenResponse = await getNewTokenProcess(setJwtToken);
    console.log("tokenResponse getToken:", tokenResponse);
    return tokenResponse;
  }
}

export const checkExistingToken = async (token: JwtToken, setJwtToken: Dispatch<SetStateAction<JwtToken | null>>) => {
  /* send the existing token to backend
  -> there i check if he is expired.
  if expired: create a new one and return
  else: return existing
  -> save the token in a State and Secure Store
   */
  const res = await fetch(checkEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"refresh": token.refresh}),
  });
  const response = await res.json();

  console.log("checkEndpoint Response:", response);

  if (response.refresh && response.refresh.access) {
    console.log("AccessToken valid...");
    token.access = response.refresh.access;
    await saveJwtToken(token);
    setJwtToken(token);
    console.log("Token successfully Set...");

    return response.refresh;
  }else {
    console.log("response contains no valid token...")
    const tokenResponse = await getNewTokenProcess(setJwtToken);
    if (!tokenResponse) {
      return null;
    }
    return tokenResponse
  }
}

export const getNewTokenProcess = async (setJwtToken: Dispatch<SetStateAction<JwtToken | null>>) => {
  // Generate here a new TokenObject..
  console.log("getNewTokenProcess started..")
  const tokenObject: JwtToken | null  = await getNewToken();
  console.log("tokenObject getNewTokenProcess:", tokenObject);
  if (tokenObject) {
    setJwtToken(tokenObject);
    return tokenObject
  }else {
    console.log("Could not save the new JWT Token!")
    return null;
  }
}

const getNewToken = async(): Promise<JwtToken | null> => {
  console.log("getNewToken started..");
  const senderObject = JSON.stringify({"user_id": getAuth().currentUser?.uid});
  try {
    const res = await fetch(
      getEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: senderObject,
      }
    );
    const response = await res.json();
    console.log("response getNewToken:", response);
    if (response.access && response.refresh) {
      await saveJwtToken(response);
      return response;
    }
  } catch (e: unknown) {
    if (e instanceof Error) console.error("Error occurred in getNewToken", e.message);
  }
  return null
}

export const getTokenInfoData = (jwtToken: JwtToken) => {
  // check here the data from the token.
  const refreshToken = jwtToken.refresh;
  const accessToken = jwtToken.access;

  // get th encoded data
  const refreshPayload = refreshToken.split('.')[1];
  const accessPayload = accessToken.split('.')[1];

  // decode the token strings
  const decodedRefreshPayload = Buffer.from(refreshPayload, 'base64').toString();
  const decodedAccessPayload = Buffer.from(accessPayload, 'base64').toString();


  // transform Token back to Json
  const refreshTokenData = JSON.parse(decodedRefreshPayload);
  const accessTokenData = JSON.parse(decodedAccessPayload);


  // check if Tokens are expired
  const currentDate = new Date();
  const refreshExpirationDate = new Date(refreshTokenData.exp * 1000);
  const accessExpirationDate = new Date(accessTokenData.exp * 1000);


  const refreshExpired= currentDate > refreshExpirationDate;
  const accessExpired= currentDate > accessExpirationDate;

  return {
    "refreshTokenData": refreshTokenData,
    "accessTokenData": accessTokenData,
    "refreshExp": refreshExpired,
    "accessExp": accessExpired,
  }
}