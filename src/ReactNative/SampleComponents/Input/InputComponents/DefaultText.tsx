import {Text} from "react-native";
import React, {useContext} from "react";
import {textStyles} from "./textStyles";
import {ThemeContext} from "../../screens/Context";


interface DefaultTextTypes {
    text: string;
    moreStyles?: object;
    error?: boolean;
    ellipsizeMode?: "head" | "middle" | "tail" | "clip";
    numberOfLines?: number;
    selectable?: boolean;
}


export const DefaultText: React.FC<DefaultTextTypes> = (
  {
    text,
    moreStyles,
    error,
    ellipsizeMode,
    numberOfLines,
    selectable
  }
) => {

    const { customTheme } = useContext(ThemeContext);
    const defaultTextStyles = [ textStyles.defaultText,
        {color: error? customTheme.errorText : customTheme.text}];

    const textSelectable = selectable || false;

    return(
        <Text
          selectable={textSelectable}
          style={[moreStyles || null, defaultTextStyles]}
          ellipsizeMode={ellipsizeMode}
          numberOfLines={numberOfLines}>
            {
                text
            }
        </Text>
    );
}