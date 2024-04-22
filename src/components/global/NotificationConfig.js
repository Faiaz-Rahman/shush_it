import { React } from 'react';
import {
  Text,
  View,
} from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import NotificationComponent from './NotificationComponent';
import { useTheme } from '../../../styles/ThemeProvider';

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  notification: ({ text1, props }) => (
    <View style={{ height: 60, width: '80%', borderRadius: 50, backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
  warning: ({ text1, text2 }) => (
    <NotificationComponent text1={text1} text2={text2} />
  )
};
export default toastConfig;
