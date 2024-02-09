import {KeyboardTypeOptions, TextInput, View,StyleSheet} from "react-native";
import React, {Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState} from "react";
import {DefaultText} from "./InputComponents/DefaultText";
import ClearButton from "./InputComponents/ClearButton";
import TranscribeButton from "./InputComponents/TranscribeButton";

import ThemeContext from "@react-navigation/native/lib/typescript/src/theming/ThemeContext";



export default interface DefaulttextInputTypes {
  placeholder?: string;
  value: string;
  onChangeAction?: Dispatch<SetStateAction<string>>;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  extraStyles?: object;
  multiline?: boolean;
  numberOfLines?: number;
  max_length?: number;
  noBorder?: boolean;
  label?: string;
  recordingButton?: boolean
}


const InputMain: React.FC<DefaulttextInputTypes> = (
  {
    placeholder,
    value,
    onChangeAction,
    editable,
    keyboardType,
    extraStyles,
    multiline,
    numberOfLines,
    max_length,
    noBorder,
    label,
    recordingButton
  }

) => {

  const [recordingError, setRecordingError] = useState<string>("");
  const { customTheme } = useContext(ThemeContext);

  const mainContainerStyles: object[] = [toolStyles.justifyAlign, {flexDirection: "column"}];
  const mainStyles = [ //->account no mb!!!<-
    inputStyles.defaultInput,
    extraStyles || null,
      {
        color: customTheme.text,
        borderWidth: noBorder? 0:1,
        borderColor: noBorder? "transparent" : customTheme.text,

      }
    ];


  useEffect(() => {
    if (recordingError.length > 0) {
      setTimeout(() => {
        setRecordingError("");
      }, 3000);
    }
  }, [recordingError]);


  const recordingErrorMessage = useCallback((): ReactNode | null => {
    if (recordingError.length > 0) {
      return(
        <DefaultText error text={recordingError}/>
      );
    }
  }, [recordingError])


  const labelComponent = useCallback((): ReactNode => {
    if (label && label.length > 0) {
      return <DefaultText text={label} moreStyles={ls.labelText} />
    }
    return <></>
  }, [label]);


  return(
    <View style={mainContainerStyles}>
      <View style={ls.main}>
        {
          labelComponent()
        }
        <TextInput
          cursorColor={customTheme.placeholder}
          selectionColor={customTheme.errorText}
          multiline={multiline || false}
          numberOfLines={numberOfLines || 1}
          style={mainStyles}
          placeholder={placeholder}
          placeholderTextColor={customTheme.placeholder}
          secureTextEntry={false}
          autoCapitalize={"none"}
          value={value}
          maxLength={max_length || undefined}
          onChangeText={onChangeAction}
          editable={editable || true}
          keyboardType={keyboardType}
          blurOnSubmit={true}
          accessibilityLabel={label || ""}
        />
        {value && value.length > 0 ? (
          <ClearButton value={value} setValue={onChangeAction} ms={ls.clearContainer} />
        ): recordingButton?(
          <TranscribeButton
            setTranscript={onChangeAction}
            setError={setRecordingError}
            transcript={value}
            buttonStyles={ls.recordingButton}
          />
        ):null}
      </View>
      {
        recordingErrorMessage()
      }
    </View>
  );
}

const ls = StyleSheet.create(
  {
    main: {
      flexDirection: "column",
      justifyContent:"flex-end",
    },
    recordingButton: {
      position: "absolute",
      right: 0,
      bottom: 15
    },
    labelText: {
      fontSize: 13,
      fontFamily: "JetBrainsMono",
      marginTop: 10,
    },
    clearContainer: {
      position: "absolute",
      right: -30,
      top: 10,
      height: 55,
      width: 55
    }
  }
)

/*

KEYBOARD TYPES

"default",
'numeric',
'email-address',
"ascii-capable",
'numbers-and-punctuation',
'url',
'number-pad',
'phone-pad',
'name-phone-pad',
'decimal-pad',
'twitter',
'web-search',
'visible-password'


 */