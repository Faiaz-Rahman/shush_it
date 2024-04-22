import messaging from '@react-native-firebase/messaging'
import { React, useEffect, useState } from 'react'
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import AsyncStorageManager from '../../src/class/AsyncStorageManager.js'

//Component
import ModalPopupForBiometricEnable from '../components/global/ModalPopupForBioLoginEnable.js'
// import HeaderComponent from '../components/global/HomeHeaderComponent.js';
//Class
import Token from '../class/TokenManager.js'
import UserSettings from './UserSettings.js'
//Constant
//SVG
//Styles
import { useTheme } from '../../styles/ThemeProvider'
import Utils from '../class/Utils.js'
import LottieBackground from '../components/global/LottieBackground.js'
import CONSTANTS from '../Constants.js'
import HomeHeaderComponent from '../components/global/HomeHeaderComponent.js'
import { DIM } from '../../styles/Dimensions.js'
import LogoHeader from '../components/global/LogoHeader.js'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export default function Settings() {
  const [isBioRequired, setBioRequired] = useState(false)
  const [isBiometricSupported, setBiometricSupport] = useState(false)

  const [isBioLoginEnabled, setBioLoginEnabled] = useState(false)
  const [isBioLoginEnabledTemp, setBioLoginEnabledTemp] = useState(false)
  const [bioEnableDialogVisible, setVisible] = useState(false)
  const [bioDialogMsg, setBioDialogMsg] = useState('')

  const [userEmail, setUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [deviceToken, setDeviceToken] = useState()

  const insets = useSafeAreaInsets()
  // const rnBiometrics = new ReactNativeBiometrics({
  //   allowDeviceCredentials: true,
  // });
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  })

  //Theme
  const { theme, setScheme, bg } = useTheme()

  useEffect(() => {
    requestUserPermission()
    getIsBiometricLocked()
  }, [])

  async function getIsBiometricLocked() {
    var isBioReq = await AsyncStorageManager.getData(CONSTANTS.IS_BIO_REQUIRED /*'is_bio_required'*/)
    var userEmailFromStore = await AsyncStorageManager.getData(CONSTANTS.USER_EMAIL /*'user_email'*/)
    var isBioLoginEnabledStr = await AsyncStorageManager.getData(CONSTANTS.IS_BIO_EANBLED /*'is_bio_login_enabled'*/)

    setUserEmail(userEmailFromStore)

    console.log('Previous settings: ' + isBioReq)
    var isBioBool = isBioReq === 'YES' ? true : false
    console.log('Previous settings: ' + isBioBool)

    setBioRequired(isBioBool)
    getBiometric()

    console.log('Previous settings bioLogin: ' + isBioLoginEnabledStr)
    var isBioLoginEnabledBool = isBioLoginEnabledStr === 'YES' ? true : false
    console.log('Previous settings bioLogin: ' + isBioLoginEnabledBool)
    setBioLoginEnabled(isBioLoginEnabledBool)

    console.log(
      'Current settings pdf lock:  ' +
      isBioRequired +
      ' bio login ' +
      isBioLoginEnabled,
    )
  }

  const getBiometric = async () => {
    //const rnBiometrics = new ReactNativeBiometrics();
    if (rnBiometrics === null) {
      return
    }

    const { available, biometryType } = await rnBiometrics.isSensorAvailable()

    console.log('Biometric type: ' + biometryType)
    if (available && biometryType === BiometryTypes.TouchID) {
      //ios only
      console.log('TouchID is supported')
      // rnBiometrics.createKeys().then(resultObject => {
      //   const {publicKey} = resultObject;
      //   console.log('Public key: ' + publicKey);
      //   //sendPublicKeyToServer(publicKey);
      // });
      setBiometricSupport(true)
    } else if (available && biometryType === BiometryTypes.FaceID) {
      //ios only
      console.log('FaceID is supported')
      setBiometricSupport(true)
    } else if (available && biometryType === BiometryTypes.Biometrics) {
      //Android only
      console.log('Biometrics is supported')
      setBiometricSupport(true)
    } else {
      console.log('Biometrics not supported')
      setBiometricSupport(false)
    }
  }

  const getVerifyBiometric = async (isBiometricEnable, type) => {
    if (isBiometricSupported) {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirmation',
      })
      if (success) {
        console.log('Touch id success: ' + isBiometricEnable)

        var isBioEnableBool = isBiometricEnable === true ? 'YES' : 'NO'

        if (type === 'pdf_lock') {
          AsyncStorageManager.storeData(IS_BIO_REQUIRED, isBioEnableBool)
          setBioRequired(isBiometricEnable)
          setVisible(true)
          const enableStr = isBiometricEnable ? 'enabled' : 'disabled'
          setBioDialogMsg('Biometric pdf lock ' + enableStr + ' successfully')
        } else {
          //setBioLoginEnabledTemp(isBiometricEnable);
          console.log('Biometric sign in enabled')

          /** Biometric Login */

          let userToken = await Token.getToken()
          if (userToken) {
            //getEventData(userToken);
          } else {
            // Handle the case where the token doesn't exist
            console.log('Token not found')
          }

          AsyncStorageManager.storeData(CONSTANTS.USER_TOKEN, userToken + '')

          const bioLoginEnable = isBiometricEnable ? 'YES' : 'NO'
          AsyncStorageManager.storeData(CONSTANTS.IS_BIO_EANBLED, bioLoginEnable)
          console.log('ok==>')
          //UI Change

          setBioLoginEnabled(isBiometricEnable)
          const msg = isBiometricEnable
            ? 'Biometric enabled'
            : 'Biometric disabled'
          //showToast('success', msg, msg + 'successfully');
          // console.log('token' + token);
          setVisible(true)
          setBioDialogMsg(msg + ' successfully')
        }
      }
    } else {
      console.log('Biometric is not supported on this device')
      Utils.showAlertDialog('Biometric is not supported on this device')
    }
  }

  const deleteBiometricKey = async () => {
    console.log('Delete')
    rnBiometrics.deleteKeys().then(resultObject => {
      const { keysDeleted } = resultObject

      if (keysDeleted) {
        console.log('Successful deletion')
      } else {
        console.log(
          'Unsuccessful deletion because there were no keys to delete',
        )
      }
    })
  }

  //For future use
  const generateViometricPublicKey = async () => {
    console.log('TouchID is supported')
    rnBiometrics.createKeys().then(resultObject => {
      const { publicKey } = resultObject
      console.log('Public key: ' + publicKey)
      //sendPublicKeyToServer(publicKey);
    })
  }

  const createSignature = async () => {
    let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString()
    let payload = epochTimeSeconds + 'some message'

    //const rnBiometrics = new ReactNativeBiometrics();

    rnBiometrics
      .createSignature({
        promptMessage: 'Sign in',
        payload: payload,
      })
      .then(resultObject => {
        const { success, signature } = resultObject

        if (success) {
          console.log(signature)
          //verifySignatureWithServer(signature, payload);
        }
      })
  }

  const requestUserPermission = async () => {
    try {
      await messaging().requestPermission()
      const token = await messaging().getToken()
      console.log('Device Token:', token)
      setDeviceToken(token)
    } catch (error) {
      console.log('Permission or Token retrieval error:', error)
    }
  }

  const showToast = (type, title, body) => {
    Toast.show({
      type: type,
      text1: title,
      text2: body,
      onPress: () => {
        console.log('Press notification')
        closeToast()
      },
    })
  }

  const closeToast = () => {
    Toast.hide()
  }

  return (
    <View>

      <SafeAreaView
        style={{
          flex: 1,
          // backgroundColor: 'red',
        }}>
        <LogoHeader extraStyles={{ marginBottom: 15, }} />
        <View
          style={{
            justifyContent: 'center',
            // position: 'absolute',
            // zIndex: 100,
            width,
            height: height * .65,
            // backgroundColor: 'red',
          }}>
          {/* <SafeAreaView
        style={[
          styles.top,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            // backgroundColor: theme.colors.background,
          },
        ]}> */}
          {/* <View style={styles.container} /> */}

          {/* <HeaderComponent
        title={'Settings'}
        icon={theme?.homeIcon?.homeHoney}
        statusBarColor={'transparent'}
        // statusBarColor={theme?.colors?.statusBarColor}
        dark={theme?.name == 'Light'}
        color={theme?.colors?.text}
        /> */}
          {/* <View style={{ alignSelf: 'center', marginStart: -40, paddingTop: 100 }}>
          <HomeHeaderComponent
            title={'Settings'}
            // icon={theme?.settingsIcon?.topIcon}
            statusBarColor={theme?.colors?.statusBarColor}
            dark={theme?.name == 'Light'}
            color={theme?.colors?.text}
          />
        </View> */}

          <ModalPopupForBiometricEnable
            theme={theme}
            visible={bioEnableDialogVisible}
            title={bioDialogMsg}
            // msg={'Save your details Information & Signature for using later.'}
            source={require('../../assets/resetPass.json')}
            onPressClose={() => {
              setVisible(false)
              // setIsSaveBtnDisable(false)
            }}
            onSave={() => {
              setVisible(false)
              console.log('onSave')
            }}
          // saveBtnDisable={isSaveBtnDisable}
          />

          {/* <TouchableOpacity
          onPress={() => {
            generateViometricPublicKey();
          }}>
          <Text>Biometric Public Key</Text>
        </TouchableOpacity> */}
          <UserSettings
            bioSw={isBioRequired}
            onBioSwChange={isRequired => {
              console.log('Switch:- ' + isRequired)
              //setBioRequired(isRequired);
              getVerifyBiometric(isRequired, 'pdf_lock')
              //deleteBiometricKey();
              //generateViometricPublicKey();
              //createSignature();
            }}

            bioSingSw={isBioLoginEnabled}
            onBioSignSwChange={isRequired => {
              console.log('Switch:- ' + isRequired)
              //setBioRequired(isRequired);
              getVerifyBiometric(isRequired, 'bio_login')
              //deleteBiometricKey();
              //generateViometricPublicKey();
              //createSignature();
            }}
            theme={theme}
            setScheme={setScheme}
          />
          {/* </SafeAreaView> */}
        </View>
      </SafeAreaView >
    </View>
  )
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
  top: {
    flex: 1,
    //paddingTop: globalStyle.topPadding,
    //backgroundColor: globalStyle.statusBarColor,
  },
  container: { paddingBottom: 0, marginBottom: 0 },
  page: {
    marginBottom: 70,
    paddingBottom: 100,
    // backgroundColor: globalStyle.backgroundColor,
  },
})
