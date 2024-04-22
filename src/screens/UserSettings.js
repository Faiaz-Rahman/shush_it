import React, { useEffect, useState, useRef } from 'react'
import { StackActions, CommonActions, useNavigation } from '@react-navigation/native'
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import globalStyle from '../../styles/MainStyle.js'
import Url from '../Api.js'
import AsyncStorageManager from '../class/AsyncStorageManager'
import Token from '../class/TokenManager'
import ModalPopupForPassReset from '../components/global/ModalPopupForPassReset'
import ModalPoup from '../components/global/ModalPoupComponent'
import CustomSwitch from '../components/global/CustomSwitch.js'

import { BlurView } from "@react-native-community/blur";
import CONSTANTS from '../Constants.js'

export default function UserSettings({
  bioSw,
  onBioSwChange,
  bioSingSw,
  onBioSignSwChange,
  theme,
  setScheme,
}) {
  // const {theme: MyTheme, bg} = useTheme()
  const navi = useNavigation()
  const insets = useSafeAreaInsets()
  const [resetPassLoading, setResetPassLoading] = useState(false);

  // console.log(MyTheme.colors.borderColors)

  const [options, setOptions] = useState([
    {
      label: 'mm/dd/yyyy',
      value: 'mm/dd/yyyy',
    },
    {
      label: 'dd/mm/yyyy',
      value: 'dd/mm/yyyy',
    },
  ])
  const [timeOptions, setTimeOptions] = useState([
    {
      label: '12-hour',
      value: '12-hour',
    },
    {
      label: '24-hour',
      value: '24-hour',
    },
  ])

  const [active, setActive] = useState(null)
  const [isAuto, setIsAuto] = useState(false)
  const [sendReminder, setSendReminder] = useState(false)
  const [isSaveBtnDisable, setIsSaveBtnDisable] = useState(false)
  const [isPassReset, setIsPassReset] = useState(false)

  const [statusModalVisible, setStatusModalVisible] = useState(false) //false
  const [msg, setMsg] = useState('')

  //New Code for Switch ...
  const [disableCustomSwitch, setDisableCustomSwitch] = useState(true)

  const updateStatus = (isShow, msg) => {
    setStatusModalVisible(isShow)
    setMsg(msg)
    //setIsBioRequired(previousState => !previousState);
  }

  const toggleSwitchAuto = () => {
    setIsAuto(previousState => !previousState)
    saveSettings(sendReminder, itemValue, isOtpRequired)
  }
  const [isOtpRequired, setIsOtpRequired] = useState(false)
  const [showResetPassModal, setShowResetPassModal] = useState(false)


  const [showTheme, setShowTheme] = useState(false)

  //Password Reset Option
  const [isPassResetVisible, setPassResetVisible] = useState(true)
  const toggleSwitchOtp = () =>
    setIsOtpRequired(previousState => !previousState)
  const toggleSwitchBio = () => {
    onBioSwChange(!bioSw)
    //setIsBioRequired(previousState => !previousState);
  }

  const toggleSwitchBioLogin = () => {
    onBioSignSwChange(!bioSingSw)
    //setIsBioRequired(previousState => !previousState);
  }

  const [isLoading, setIsLoading] = useState(true)
  const [themeChanging, setThemeChanging] = useState(false)
  const [dateFormat, setDateFormat] = useState(null)
  const [timeFormat, setTimeFormat] = useState(null)
  const [token, setToken] = useState('')

  //const { colors, font } = useTheme();

  useEffect(() => {
    if (theme?.name == 'Light') {
      setActive(0)
    } else if (theme?.name == 'Honeycomb') {
      setActive(1)
    } else if (theme?.name == 'RoseGold') {
      setActive(2)
    } else if (theme?.name == 'Gold') {
      setActive(3)
    } else if (theme?.name == 'Elegant') {
      setActive(4)
    }

    // getColorScheme();
    // setIsAuto(true);
    // setIsLoading(false) // Hidden for theme check

    const asyncFunc = async () => {
      let userToken = await Token.getToken()
      console.log('======> Here in the setting screen <======')
      if (userToken) {
        setToken(userToken)
        getSignInMethod()
        getSettings(userToken) // Hidden for theme check

        setIsLoading(false)
      } else {
        console.log('Token not found')
        return false
      }
    }

    asyncFunc() // Hidden for theme check
  }, [msg, statusModalVisible, isOtpRequired, bioSingSw])

  async function getSignInMethod() {
    var signInMethod = await AsyncStorageManager.getData(CONSTANTS.SIGN_IN_METHOD /*'sign_in_method'*/)

    console.log('Sign In method: ', signInMethod)

    if (
      signInMethod === CONSTANTS.SIGN_IN_WITH_FACEBOOK /*'facebook'*/ ||
      signInMethod === CONSTANTS.SING_IN_WITH_GOOGLE /*'google' */ ||
      signInMethod === CONSTANTS.SING_IN_WITH_APPLE /*'apple' */
    ) {
      setPassResetVisible(false)
    } else {
      setPassResetVisible(true)
    }
  }

  const getSettings = async token => {
    setIsLoading(true)
    let api = Url.GET_SETTING
    await fetch(api, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          let a = JSON.stringify(responseJson)
          let json = JSON.parse(a)
          if (responseJson.status === 200) {
            let settings = json.data
            // setIsLoading(false)

            setSendReminder(settings?.auto_remainder == 0 ? false : true)
            setIsOtpRequired(settings?.otp_verification == 0 ? false : true)

            // handlerToggle(settings?.otp_verification == 0 ? false : true)

            console.log("Settings Api : " + JSON.stringify(responseJson));
            // setIsOtpRequired(true)
            console.log('otp_verification ==>', settings?.otp_verification)

            setDateFormat(settings?.date_format)
            setTimeFormat(settings?.time_format)

            console.log('date_format==>', settings?.date_format)
            console.log('time_format==>', settings?.time_format)
          } else {
            console.log('State list error: ' + JSON.stringify(json))
            setIsLoading(false)
          }
        } catch (error) {
          console.error(error)
          console.log(error)
          setIsLoading(false)
        }
      })
      .catch(error => {
        console.error(error)
        setIsLoading(false)
      })
  }

  const saveSettings = (
    auto_remainder = sendReminder,
    date_format = dateFormat,
    otp_verification = isOtpRequired,
    current_theme = active,
    time_format = timeFormat,
  ) => {
    // setBtnLoad(true);

    const payload = {
      auto_remainder: auto_remainder ? 1 : 0,
      otp_verification: otp_verification ? 1 : 0,
      // date_format: date_format,
      // current_theme: current_theme == 0 ? 'Light' : current_theme == 1 ? 'Silver' : current_theme == 2 ? 'RoseGold' : current_theme == 3 ? 'Gold' : current_theme == 4 ? 'Elegant' : 'Silver',
      // time_format: time_format,
    }
    // console.log("payload", payload)

    try {
      var stateApi = Url.SAVE_SETTING
      fetch(stateApi, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(responseJson => {
          try {
            var a = JSON.stringify(responseJson)
            var json = JSON.parse(a)
            if (responseJson.status === 200) {

              // setBtnLoad(false)
              // AsyncStorageManager.storeData('date_format', date_format)
              // AsyncStorageManager.storeData('time_format', time_format)
              setThemeChanging(false)

              console.log('Status==> ok')
            } else {
              console.log('Error==>', JSON.stringify(json))
              // setBtnLoad(false);
            }
          } catch (error) {
            console.error(error)
            console.log(error)
            // setBtnLoad(false)
          }
        })
        .catch(error => {
          console.error(error)
          // setBtnLoad(false)
        })
    } catch (error) {
      console.error(error)
      console.log(error)
      // setBtnLoad(false)
    }
  }

  const onResetPass = async data => {
    // console.log("data", data)
    setIsSaveBtnDisable(true)
    setResetPassLoading(true)

    // setDisableCustomSwitch(false)

    try {
      var stateApi = Url.RESET_PASS
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
            let a = JSON.stringify(responseJson)
            let json = JSON.parse(a)
            if (responseJson.status === 200) {
              setResetPassLoading(false);
              setIsSaveBtnDisable(false)
              console.log('Status==> ok', json)
              setShowResetPassModal(false)

              updateStatus(true, json?.message)

              //Enabling the custom switch animation ...
              setDisableCustomSwitch(false)

              setIsPassReset(true)
            } else {
              setResetPassLoading(false)
              console.log('Error==>', json?.message)
              // console.log('Error==>', JSON.stringify(json).message);
              setShowResetPassModal(false)

              setIsPassReset(false)
              updateStatus(true, json?.message)
            }
            setIsSaveBtnDisable(false)
          } catch (error) {
            setResetPassLoading(false)
            console.error(error)
            console.log(error)
            setIsSaveBtnDisable(false)
          }
        })
        .catch(error => {
          setResetPassLoading(false)
          console.error(error)
          setIsSaveBtnDisable(false)
        })
    } catch (error) {
      setResetPassLoading(false)
      console.error(error)
      console.log(error)
      setIsSaveBtnDisable(false)
    }
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        // <ActivityIndicator color={globalStyle.colorAccent} />
        <ActivityIndicator
          color={
            theme?.name != 'Light'
              ? theme?.colors?.text
              : globalStyle.colorAccent
          }
        // style={{
        //   marginTop: 'auto',
        //   marginBottom: 'auto',
        //   height: 540,
        // }}
        />
      ) : (
        // <View style={styles.content}>
        <SafeAreaView
          style={[
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          ]}>
          <ScrollView
            horizontal={false}
            contentContainerStyle={styles.content}
            showsHorizontalScrollIndicator={true}>
            <View style={{ flex: 1, justifyContent: 'center', }}>
              {/* <View style={styles.row}> */}

              {/* <Text style={{ ...styles.title, color: theme?.colors?.text }}>Settings</Text> */}

              {/* <View style={{ ...styles.containerDiv, baFckgroundColor: theme?.name == 'Light' ? "white" : "rgba(255, 255, 255, 0.15)" }}>
                <View style={styles.rowContent}>
                
                  <Text style={{ ...styles.item, color: theme?.colors?.text }}>Send Auto Reminder</Text>
                </View>
                <Switch
                  // trackColor={{ false: '#767577', true: '#81b0ff' }}
                  // thumbColor={'#000000'}
                  thumbColor={theme?.colors?.switch}
                  trackColor={{ false: '#2D2D2D', true: '#767577' }}
                  ios_backgroundColor="#2D2D2D"

                  onValueChange={value => {
                    setSendReminder(value);
                    saveSettings(value, dateFormat, isOtpRequired);
                  }}
                  value={sendReminder}
                />
              </View> */}



              <View
                style={{
                  ...styles.containerDiv,
                  backgroundColor:
                    theme?.name == 'Light'
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.35)',
                  overflow: 'hidden',
                }}>
                <BlurView
                  style={styles.absolute}
                  blurType="thinMaterialDark"
                  blurAmount={Platform.OS === 'ios' ? 15 : 5}
                  reducedTransparencyFallbackColor="white"
                />

                <View style={styles.rowContent}>
                  <Text style={{ ...styles.item, color: theme?.colors?.text }}>
                    Biometric Sign In
                  </Text>
                </View>
                {/* <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={theme?.colors?.switch}
                  ios_backgroundColor="#3e3e3e"
                  //bioSingSw, onBioSignSwChange,
                  onValueChange={toggleSwitchBioLogin}
                  value={bioSingSw} //isBioRequired}
                  //onChange={onBioSignSwChange(isBioRequired)}
                /> */}
                <CustomSwitch
                  value={bioSingSw}
                  onValueChange={() => {
                    toggleSwitchBioLogin()
                  }}
                />
              </View>


              <View
                style={{
                  ...styles.containerDiv,
                  backgroundColor:
                    theme?.name == 'Light'
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.35)',
                  overflow: 'hidden',
                }}>
                <BlurView
                  style={styles.absolute}
                  blurType="thinMaterialDark"
                  blurAmount={Platform.OS === 'ios' ? 15 : 5}
                  reducedTransparencyFallbackColor="white"
                />
                <View style={styles.rowContent}>
                  <Text style={{ ...styles.item, color: theme?.colors?.text }}>
                    Required OTP Verification
                  </Text>
                </View>
                {/* <Switch
                  thumbColor={theme?.colors?.switch}
                  trackColor={{false: '#2D2D2D', true: '#767577'}}
                  ios_backgroundColor="#2D2D2D"
                  // onValueChange={toggleSwitchOtp}
                  onValueChange={value => {
                    setIsOtpRequired(value)
                    saveSettings(sendReminder, dateFormat, value)
                  }}
                  value={isOtpRequired}
                /> */}
                <CustomSwitch
                  value={isOtpRequired}
                  onValueChange={() => {
                    // setIsOtpRequired(!isOtpRequired)
                    toggleSwitchOtp()
                    saveSettings(sendReminder, dateFormat, !isOtpRequired)
                  }}
                />
              </View>

              {isPassResetVisible ? (
                <View
                  style={{
                    ...styles.containerDiv,
                    backgroundColor:
                      theme?.name == 'Light'
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.35)',
                    overflow: 'hidden',
                  }}>
                  <BlurView
                    style={styles.absolute}
                    blurType="thinMaterialDark"
                    blurAmount={Platform.OS === 'ios' ? 15 : 5}
                    reducedTransparencyFallbackColor="white"
                  />
                  <View style={styles.rowContent}>
                    <Text style={{ ...styles.item, color: theme?.colors?.text }}>
                      Password Reset
                    </Text>
                  </View>
                  {/* <Switch
                    thumbColor={theme?.colors?.switch}
                    trackColor={{false: '#2D2D2D', true: '#767577'}}
                    ios_backgroundColor="#2D2D2D"
                    value={showResetPassModal}
                    onValueChange={value => {
                      setShowResetPassModal(value)
                    }}
                  /> */}
                  <CustomSwitch
                    value={false}
                    // value={passReset}
                    onValueChange={() => {
                      setShowResetPassModal(true)
                    }}
                    disable={disableCustomSwitch}
                    toggleSW={showResetPassModal}
                  />
                </View>
              ) : null}

              <TouchableOpacity
                style={{
                  ...styles.containerDiv,
                  backgroundColor:
                    theme?.name == 'Light'
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.35)',
                  overflow: 'hidden',
                }}
                onPress={() => {
                  navi.navigate('select_theme')
                }}>
                <BlurView
                  style={styles.absolute}
                  blurType="thinMaterialDark"
                  blurAmount={Platform.OS === 'ios' ? 15 : 5}
                  reducedTransparencyFallbackColor="white"
                />
                <View style={styles.rowContent}>
                  <Text style={{ ...styles.item, color: theme?.colors?.text }}>
                    Theme
                  </Text>
                </View>
                {theme?.accountIcon?.rightIcon}
              </TouchableOpacity>
              {/* Controll background */}
              <View>
                {!CONSTANTS.IS_BACKGROUND_HIDE ? (
                  <TouchableOpacity
                    style={{
                      ...styles.containerDiv,
                      backgroundColor:
                        theme?.name == 'Light'
                          ? 'white'
                          : 'rgba(255, 255, 255, 0.35)',
                      overflow: 'hidden',
                    }}
                    onPress={() => {
                      navi.navigate('select_background')
                    }}>
                    <BlurView
                      style={styles.absolute}
                      blurType="thinMaterialDark"
                      blurAmount={Platform.OS === 'ios' ? 15 : 5}
                      reducedTransparencyFallbackColor="white"
                    />
                    <View style={styles.rowContent}>
                      <Text style={{ ...styles.item, color: theme?.colors?.text }}>
                        Background
                      </Text>
                    </View>
                    {theme?.accountIcon?.rightIcon}
                  </TouchableOpacity>
                ) : null}
              </View>
              <ModalPopupForPassReset
                isLoading={resetPassLoading}
                theme={theme}
                visible={showResetPassModal}
                title={'Password Reset'}
                source={require('../../assets/resetPass.json')}
                onPressClose={() => {
                  // console.log('pressing_cancel')
                  setShowResetPassModal(false)
                }}
                onSave={formData => onResetPass(formData)}
                saveBtnDisable={isSaveBtnDisable}
              />

              {/* Success / Error modal*/}
              <ModalPoup
                theme={theme}
                visible={statusModalVisible}
                title={msg}
                source={require('../../assets/sign_in_animation.json')}
                btnTxt={'Ok'}
                onPressOk={async () => {
                  if (isPassReset) {
                    await Token.clearToken()

                    //navi.navigate('sign_in');
                    if (Platform.OS === 'android') {
                      navi.dispatch(StackActions.replace('sign_in'));
                    } else if (Platform.OS === 'ios') {
                      //Need to fix that
                      navi.navigate('sign_in');
                    }
                  }
                  setStatusModalVisible(false)
                }}
                onPressClose={async () => {
                  if (isPassReset) {
                    await Token.clearToken()
                    //navi.navigate('sign_in');
                    if (Platform.OS === 'android') {
                      navi.dispatch(StackActions.replace('sign_in'))
                    } else {
                      //Need to fix that
                      navi.navigate('sign_in');
                    }
                    //StackActions.popToTop()
                  }
                  setStatusModalVisible(false)
                }}
              />
            </View>

            {/* <View style={styles.autoDiv}>
            <Text style={{ ...styles.item, color: theme?.colors?.text }}>Auto</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              ios_backgroundColor="#3e3e3e"
              // onValueChange={onAutoSwitchChange}
              onValueChange={value => {
                setIsAuto(value);
                getColorScheme();
              }}
              value={isAuto}
            />
          </View> */}
          </ScrollView>
        </SafeAreaView>
        // </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  absolute: {
    width: 'auto',
    height: 'auto',
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    marginBottom: 0,
  },
  autoDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTheme: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 20,
    // marginVertical: 50,
    columnGap: 15,
    // gap: 25,
    rowGap: 35,
  },
  modeText: {
    alignSelf: 'center',
    fontWeight: 500,
    marginVertical: 10,
    width: 85,
    height: 35,
    textAlign: 'center',
  },
  circleOutside: {
    alignSelf: 'center',
    borderRadius: 50,
    borderWidth: 1,
    height: 25,
    width: 25,
    padding: 1.5,
  },
  circleInside: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
  container: {
    // paddingBottom: 70,
  },
  containerDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    height: 65,
    padding: 15,
    marginVertical: 10,
  },
  content: {
    paddingHorizontal: 27,
    // marginTop: 80,
    marginBottom: 0,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    marginStart: 15,
    // marginTop: 16,
    // marginBottom: 16,
    fontSize: 15,
    color: '#2E476E',
  },
  line: {
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selectComponent: {
    // height: 20,
    // marginTop: 12,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 30,
  },
})
