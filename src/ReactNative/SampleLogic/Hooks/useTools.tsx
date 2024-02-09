import {checkToolActionValue, getToolActionValue, postToolActionValue} from "..";
import {useState} from "react";

export const useTools = () => {
  const [toolActionValue, setToolActionValue] = useState<string>("");

  const checkToolActionValueProcess = async (): Promise<boolean> => {
    const valueToolActions = await getToolActionValue();
    console.log("Try to get the user Tool Action Value", valueToolActions);
    if (!valueToolActions) {
      await postToolActionValue("1").then(async () => {
        setToolActionValue("1");
      });
    } else {
      setToolActionValue(valueToolActions);
    }
    const success = await checkToolActionValue(valueToolActions || "1", setToolActionValue);
    console.log("Return Value check toola Action value:", success);
    return success
  };

    return {
      checkToolActionValueProcess,
      toolActionValue, setToolActionValue
    }
}