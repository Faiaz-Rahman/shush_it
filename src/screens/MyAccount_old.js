import AsyncStorage from '@react-native-async-storage/async-storage';
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
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorageManager from '../class/AsyncStorageManager.js';

import Logout from '../../assets/logout.svg';
import { useTheme } from '../../styles/ThemeProvider';
import Url from '../Api.js';
import Token from '../class/TokenManager';
import ButtonComponentSmall from '../components/global/ButtonComponentSmall.js';
import HeaderComponent from '../components/global/HomeHeaderComponent';
import ModalPopupForPassReset from '../components/global/ModalPopupForPassReset.js';
import ModalPoup from '../components/global/ModalPoupComponent';
import CONSTANTS from '../Constants.js';

export default function MyAccount() {
  const { width, height } = Dimensions.get('window');
  const navi = useNavigation();
  const { theme } = useTheme();

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

    var isBioLoginEnabledStr = await AsyncStorageManager.getData(CONSTANTS.IS_BIO_EANBLED /*'is_bio_login_enabled'*/);

    console.log('Previous settings bioLogin: ' + isBioLoginEnabledStr);
    var isBioLoginEnabledNumber = isBioLoginEnabledStr === 'YES' ? '1' : '0';
    console.log('Previous settings bioLogin in 0 n 1: ' + isBioLoginEnabledNumber);

    try {
      var stateApi = Url.LOGOUT;
      fetch(stateApi, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
        },
        body: JSON.stringify({ device_token: deviceToken, bio_log: isBioLoginEnabledNumber }),
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
    <ImageBackground
      source={theme?.bg?.bgImg}
      resizeMode="cover"
      style={styles.bgImage}>
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
          <HeaderComponent
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
          />

          {/* <ThemeSelectorForTest /> */}

          <ScrollView
            horizontal={false}
            style={styles.categoryListContainer}
            showsHorizontalScrollIndicator={true}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  console.log('My Profile Pressed');

                  if (theme?.name == 'Light') {
                    navi.navigate('profile_old');
                  } else {
                    navi.navigate('my_profile');
                  }
                }}>
                <View style={styles.flexIt}>
                  <Text style={{ ...styles.item, color: theme?.colors?.text }}>
                    Profile
                  </Text>
                  {theme?.accountIcon?.rightIcon}
                </View>
                <View
                  style={{
                    ...styles.line,
                    borderBottomColor: theme?.colors?.text || '#c0c0c0',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  console.log('My created event pressed');
                  navi.navigate('archive_list');
                }}>
                <View style={styles.flexIt}>
                  <Text style={{ ...styles.item, color: theme?.colors?.text }}>
                    Archive
                  </Text>
                  {theme?.accountIcon?.rightIcon}
                </View>
                <View
                  style={{
                    ...styles.line,
                    borderBottomColor: theme?.colors?.text || '#c0c0c0',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                onPress={() => {
                  // console.log('Joined events Pressed');
                  //navi.navigate('pricing-plan');
                  navi.navigate('pricing-plan', {
                    isGoChooseNda: false,
                  });
                }}>
                <View style={styles.planDiv}>
                  <Text style={{ ...styles.item, color: theme?.colors?.text }}>
                    Plan
                  </Text>
                  <View style={styles.planInfo}>
                    {theme?.accountIcon?.analytics}
                    {/* <Analytics /> */}
                    <View style={{ marginStart: 10 }}>
                      <Text
                        style={{
                          ...styles.planInfoText,
                          color: theme?.name == 'Light' ? '#2E476E' : 'white',
                        }}>
                        Free Plan
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme?.name == 'Light' ? '#2E476E' : 'white',
                        }}>
                        7 days left
                      </Text>
                    </View>
                  </View>

                  <View style={styles.buttonContainer}>
                    <ButtonComponentSmall
                      title={'Upgrade'}
                      color={theme?.colors?.btnText}
                      colors={theme?.colors?.colors}
                      bordered={true}
                      borderWidth={theme?.name == 'Light' ? 0 : 1}
                      borderColor={theme?.colors?.borderColor}
                      borderColors={theme?.colors?.borderColors}
                      shadow={theme?.name == 'Light'}
                      onPress={() => {
                        navi.navigate('pricing-plan', {
                          isGoChooseNda: false,
                        });
                      }}
                    />
                  </View>

                  {/* <Button
                    mt="2"
                    mb="2"
                    mr="2"
                    pl="7"
                    pr="7"
                    colorScheme="blue"
                    borderRadius={'3xl'}
                    onPress={() => {
                      navi.navigate('pricing-plan');
                    }}>
                    Upgrade
                  </Button> */}
                </View>
                <View
                  style={{
                    ...styles.line,
                    borderBottomColor: theme?.colors?.text || '#c0c0c0',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View>{isPassResetVisible ? (
              <TouchableOpacity
                onPress={() => {
                  console.log('Password Reset pressed');
                  // navi.navigate('my_created_event');
                  setVisible(true);
                }}>
                <View style={styles.flexIt}>
                  <Text style={{ ...styles.item, color: theme?.colors?.text }}>
                    Password Reset
                  </Text>
                  {theme?.accountIcon?.rightIcon}
                </View>
                <View
                  style={{
                    ...styles.line,
                    borderBottomColor: theme?.colors?.text || '#c0c0c0',
                  }}
                />
              </TouchableOpacity>
            ) : null}
            </View>

            <ModalPopupForPassReset
              theme={theme}
              visible={visible}
              title={'Password Reset'}
              // msg={'Save your details Information & Signature for using later.'}
              source={require('../../assets/resetPass.json')}
              onPressClose={() => {
                setVisible(false);
                setIsSaveBtnDisable(false);
              }}
              onSave={formData => onSave(formData)}
              saveBtnDisable={isSaveBtnDisable}
            />

            {/* Success / Error modal*/}
            <ModalPoup
              theme={theme}
              visible={statusModalVisible}
              title={msg}
              source={require('../../assets/sign_in_animation.json')}
              btnTxt={'Ok'}
              onPressOk={() => {
                if (isPassReset) {
                  Token.clearToken();
                  navi.dispatch(StackActions.replace('sign_in'));
                }
                setStatusModalVisible(false);
              }}
              onPressClose={() => {
                if (isPassReset) {
                  Token.clearToken();
                  navi.dispatch(StackActions.replace('sign_in'));
                }
                setStatusModalVisible(false);
              }}
            />

            <ScrollView
              horizontal={false}
              style={styles.categoryListContainer}
              showsHorizontalScrollIndicator={true}>
              {more.map(item => (
                <View key={item.id}>
                  <TouchableOpacity
                    onPress={async () => {
                      if (item.title === 'Logout') {
                        await Token.clearToken();
                        await AsyncStorageManager.removeAllItemValue();

                        navi.dispatch(StackActions.replace('sign_in'));
                        if (deviceToken === undefined || deviceToken === null || deviceToken === '') {
                          console.log('Device token is empty');
                        } else {
                          logout(deviceToken);
                        }
                      }
                    }}>
                    <View style={styles.logoutInfo}>
                      <Logout style={styles.logoutIcon} />
                      <Text
                        style={{ ...styles.item, color: theme?.colors?.text }}>
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 'auto',
    // height: 50,
    // paddingBottom: 32,
    // width: '100%',
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
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
