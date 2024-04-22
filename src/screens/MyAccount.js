import messaging from '@react-native-firebase/messaging';
import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppleButton } from '@invertase/react-native-apple-authentication';

//Class
import AsyncStorageManager from '../class/AsyncStorageManager.js';
import AuthManager from '../class/AuthManager.js';

//Component 
import { useTheme } from '../../styles/ThemeProvider';
import Url from '../Api.js';
import Token from '../class/TokenManager';
import InputButtonComponent from '../components/global/InputButtonComponent.js';
import LottieBackground from '../components/global/LottieBackground.js';
import CONSTANTS from '../Constants.js';
import Utils from '../class/Utils.js';
import LogoHeader from '../components/global/LogoHeader.js';

export default function MyAccount() {
  const { width, height } = Dimensions.get('window');
  const navi = useNavigation();
  const { theme, setScheme, bg, setBg } = useTheme();

  const [isPassReset, setIsPassReset] = useState(false);
  const [visible, setVisible] = useState(false);

  const [deviceToken, setDeviceToken] = useState();

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [isSaveBtnDisable, setIsSaveBtnDisable] = useState(false);
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState('');
  const more = [{ id: 2, title: 'Logout' }];

  const [isPassResetVisible, setPassResetVisible] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const asyncFunc = async () => {
      let userToken = await Token.getToken();
      if (userToken) {
        setToken(userToken);
        // getStateList(userToken);
      } else {
        console.log('Token not found');
        return false;
      }
    };

    requestUserPermission();
    asyncFunc();
    getSignInMethod();
  }, []);

  async function getSignInMethod() {
    var signInMethod = await AsyncStorageManager.getData(CONSTANTS.SIGN_IN_METHOD /*'sign_in_method'*/);

    if (signInMethod === 'facebook' || signInMethod === 'google') {
      setPassResetVisible(false);
    } else {
      setPassResetVisible(true);
    }
  }

  //Get Device token
  const requestUserPermission = async () => {
    try {
      await messaging().requestPermission();
      const token = await messaging().getToken();
      console.log('Device Token:', token);
      setDeviceToken(token);
    } catch (error) {
      console.log('Permission or Token retrieval error:', error);
    }
  };

  const onSave = async data => {
    // console.log("data", data)
    setIsSaveBtnDisable(true);

    try {
      var stateApi = Url.RESET_PASS;
      fetch(stateApi, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'applicrun-androidation/json',
          Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(responseJson => {
          try {
            var a = JSON.stringify(responseJson);
            var json = JSON.parse(a);
            if (responseJson.status === 200) {
              setIsSaveBtnDisable(false);
              console.log('Status==> ok', json);
              setMsg(json?.message);
              setVisible(false);
              setIsPassReset(true);
            } else {
              console.log('Error==>', json?.message);
              // console.log('Error==>', JSON.stringify(json).message);
              setMsg(json?.message);
              setIsSaveBtnDisable(false);
            }
            setStatusModalVisible(true);
          } catch (error) {
            console.error(error);
            console.log(error);
            setIsSaveBtnDisable(false);
          }
        })
        .catch(error => {
          console.error(error);
          setIsSaveBtnDisable(false);
        });
    } catch (error) {
      console.error(error);
      console.log(error);
      setIsSaveBtnDisable(false);
    }
  };

  const logout = async deviceToken => {
    console.log('Logout device token: ' + deviceToken);
    setIsSaveBtnDisable(true);

    var isBioLoginEnabledStr = await AsyncStorageManager.getData(CONSTANTS.IS_BIO_EANBLED /*'is_bio_login_enabled',*/);

    console.log('Previous settings bioLogin: ' + isBioLoginEnabledStr);
    var isBioLoginEnabledNumber = isBioLoginEnabledStr === 'YES' ? '1' : '0';
    console.log(
      'Previous settings bioLogin in 0 n 1: ' + isBioLoginEnabledNumber,
    );

    try {
      var stateApi = Url.LOGOUT;
      fetch(stateApi, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
        },
        body: JSON.stringify({
          device_token: deviceToken,
          bio_log: isBioLoginEnabledNumber,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          try {
            var a = JSON.stringify(responseJson);
            var json = JSON.parse(a);
            if (responseJson.status === 200) {
              console.log('Logout success => ok', json);
            } else {
              console.log('Error==>', json?.message);
              // console.log('Error==>', JSON.stringify(json).message);
            }
            //setStatusModalVisible(true);
          } catch (error) {
            console.error(error);
            console.log(error);
            //setIsSaveBtnDisable(false);
          }
        })
        .catch(error => {
          console.error(error);
          //setIsSaveBtnDisable(false);
        });
    } catch (error) {
      console.error(error);
      console.log(error);
      //setIsSaveBtnDisable(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent',
      }}>
      {bg?.type == 'lottie' && <LottieBackground file={bg.file} />}

      <KeyboardAvoidingView
        style={{ flex: 1, width: width }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView
          style={[
            styles.container,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}>
          <LogoHeader />
          {/* <HeaderComponent
            title={'Account'}
            // icon={<AccountGraySvg />}
            icon={
              theme?.name == 'Light'
                ? theme?.accountIcon?.topIcon
                : theme?.nav?.account
            }
            statusBarColor={theme?.colors?.statusBarColor}
            dark={theme?.name == 'Light'}
            color={theme?.colors?.text}
          /> */}

          {/* <ThemeSelectorForTest /> */}

          <ScrollView
            horizontal={false}
            style={styles.categoryListContainer}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingBottom: 70,
            }}>
            <View style={styles.buttonContainer}>
              {/* <Text style={{ ...styles.title, color: theme?.colors?.text }}>Account</Text> */}

              <TouchableOpacity
                onPress={() => {
                  navi.navigate('pricing-plan', {
                    isGoChooseNda: false,
                  });
                }}>
                <InputButtonComponent
                  text={'Shushable'}
                  rightIcon={theme?.accountIcon?.rightIcon}
                  borderColor={theme?.textInput?.borderColor}
                  backgroundColor={theme?.textInput?.backgroundColor}
                  borderWidth={theme?.textInput?.borderWidth}
                  darkShadowColor={theme?.textInput?.darkShadowColor}
                  lightShadowColor={theme?.textInput?.lightShadowColor}
                  shadowOffset={theme?.textInput?.shadowOffset}
                  inputColor={theme?.textInput?.inputColor}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (theme?.name == 'Light') {
                    navi.navigate('profile_old');
                  } else {
                    navi.navigate('my_profile');
                  }
                }}>
                <InputButtonComponent
                  text={'Profile'}
                  rightIcon={theme?.accountIcon?.rightIcon}
                  borderColor={theme?.textInput?.borderColor}
                  backgroundColor={theme?.textInput?.backgroundColor}
                  borderWidth={theme?.textInput?.borderWidth}
                  darkShadowColor={theme?.textInput?.darkShadowColor}
                  lightShadowColor={theme?.textInput?.lightShadowColor}
                  shadowOffset={theme?.textInput?.shadowOffset}
                  inputColor={theme?.textInput?.inputColor}
                />
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => {
                  navi.navigate('signature');
                }}>
                <InputButtonComponent
                  text={'signature'}
                  rightIcon={theme?.accountIcon?.rightIcon}
                  borderColor={theme?.textInput?.borderColor}
                  backgroundColor={theme?.textInput?.backgroundColor}
                  borderWidth={theme?.textInput?.borderWidth}
                  darkShadowColor={theme?.textInput?.darkShadowColor}
                  lightShadowColor={theme?.textInput?.lightShadowColor}
                  shadowOffset={theme?.textInput?.shadowOffset}
                  inputColor={theme?.textInput?.inputColor}
                />
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={async () => {

                  var signInMethod = await AsyncStorageManager.getData(CONSTANTS.SIGN_IN_METHOD /*'sign_in_method'*/)
                  console.log("Sign Out method: " + signInMethod);
                  switch (signInMethod) {
                    case CONSTANTS.SIGN_IN_WITH_FACEBOOK:
                      break;
                    case CONSTANTS.SING_IN_WITH_APPLE:
                      await AuthManager.signOutApple();
                      break;
                    case CONSTANTS.SING_IN_WITH_GOOGLE:
                      await AuthManager.signOutGoogle();
                      await AuthManager.revokeAccessGoogle();
                      break;
                    default:
                      console.log("Sign Out method: " + signInMethod);
                  }

                  Utils.setProfileUpdateShowOnce(false);

                  await Token.clearToken();
                  await AsyncStorageManager.removeAllItemValue();

                  navi.dispatch(StackActions.replace('sign_in'));
                  if (
                    deviceToken === undefined ||
                    deviceToken === null ||
                    deviceToken === ''
                  ) {
                    console.log('Device token is empty');
                  } else {
                    logout(deviceToken);
                  }

                  //setScheme(CONSTANTS.UI.ELEGENT /*'elegant'*/);
                  //setBg(CONSTANTS.BG_IMG.ELEGENT /*'ElegantBg'*/);

                }}>
                <InputButtonComponent
                  text={'Log Out'}
                  rightIcon={theme?.accountIcon?.rightIcon}
                  borderColor={theme?.textInput?.borderColor}
                  backgroundColor={theme?.textInput?.backgroundColor}
                  borderWidth={theme?.textInput?.borderWidth}
                  darkShadowColor={theme?.textInput?.darkShadowColor}
                  lightShadowColor={theme?.textInput?.lightShadowColor}
                  shadowOffset={theme?.textInput?.shadowOffset}
                  inputColor={theme?.textInput?.inputColor}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    gap: 30,
    height: 450,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    // borderWidth: 2,
    // borderColor: 'white'
  },
  bgImage: {
    flex: 1,
    // justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 30,
  },
  container: {
    flex: 1,
    paddingTop: 40,
    // backgroundColor: globalStyle.statusBarColor,
  },
  categoryListContainer: {
    paddingHorizontal: 20,
  },
  item: {
    marginStart: 24,
    marginTop: 16,
    marginBottom: 16,
    fontSize: 15,
    fontWeight: '500',
    // color: '#2E476E',
  },
  line: {
    // borderBottomColor: '#c0c0c0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  flexIt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowCss: {
    marginRight: 10,
    // marginTop: 16,
    // paddingRight: 50,
  },
  planDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 7,
  },
  planInfoText: {
    fontSize: 15,
    // color: '#2E476E',
  },
  logoutInfo: {
    flexDirection: 'row',
  },
  logoutIcon: {
    // marginStart: 24,
    marginTop: 16,
  },
});
