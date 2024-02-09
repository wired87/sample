import {styles} from "../container/containerStyles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {Pressable} from "react-native";
import React, {Dispatch, memo, SetStateAction, useContext} from "react";
import {ThemeContext} from "../../screens/Context";
import {StyleProps} from "react-native-reanimated";

interface ClearButtonTypes {
  setValue?: Dispatch<SetStateAction<string>>, //((text: string) => void);
  value: string;
  ms?: StyleProps;
}

const ClearButton: React.FC<ClearButtonTypes> = (
  {
    setValue,
    value,
    ms,
  }
) => {

  const { customTheme } = useContext(ThemeContext);

  const pressableStyles = [styles.clearInputFiledBtn, {borderColor: customTheme.borderColor}]
  if (value.length > 0) {
    return (
      <Pressable
        onPress={() => !(setValue) || setValue("") || undefined}
        style={ms || pressableStyles}>
        <MaterialCommunityIcons color={customTheme.text} name={"close"} size={17} />
      </Pressable>
    );
  }
}

export default memo(ClearButton);