import {Alert} from "react-native";

export const connectionAlert = () => {
  Alert.alert(
    'No internet connection detected',
    `You need a internet connection to use our service. \nYou think that's an issue? Please report it and we check it ASAP`,
    [
      {
        text: 'close',
        onPress: () => console.log('Ask me later pressed'),
        style: 'cancel',
      },
      {
        text: 'refresh App',
        onPress: () => RNRestart.restart(),
        style: 'destructive',
      },
    ]
  );
}