import {
  React,
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
  createRef,
  useCallback,
} from 'react'
import {
  Center,
  HStack,
  NativeBaseProvider,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
//SVG
import {
  useIsFocused,
  StackActions,
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native'
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  View,
  Switch,
  Image,
  //ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  AppState,
  TouchableWithoutFeedback,
} from 'react-native'
import LottieView from 'lottie-react-native'
import { Neomorph } from 'react-native-neomorph-shadows'
import messaging from '@react-native-firebase/messaging'
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin'
import {
  AppleButton,
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication'

//import { ScrollView } from 'react-native-virtualized-view';
//Assets
import EmailSVG from '../../assets/email_id_icon.svg'
import PasswordSVG from '../../assets/sign_in_password_icon.svg'
import FacebbokLogoSVG from '../../assets/facebook_logo.svg'
import AppleLogoSVG from '../../assets/apple_logo.svg'
import GoogleLogoSVG from '../../assets/google_logo.svg'
import Otp from '../../assets/otp.svg'
import FingerPrintSVG from '../../assets/fingerprint_btn.svg'

//File
import API_URLS from '../Api.js'
//Constant
import CONSTANTS from '../Constants.js'
import global from '../Constants.js'
import Token from '../class/TokenManager.js'
//Class
import AsyncStorageManager from '../class/AsyncStorageManager.js'
import AuthManager from '../class/AuthManager.js'
//Component
import InputTextComponent from '../components/global/InputTextComponent.js'
import PasswordInput from '../components/global/InputPasswordComponent.js'
import CustomButton from '../components/global/ButtonComponent.js'
import FullScreenModalComponent from '../components/global/FullScreenModalComponent'
import ModalPoup from '../components/global/ModalPoupComponent'
import { useTheme } from '../../styles/ThemeProvider'
import ThemeSelectorForTest from '../components/global/ThemeSelectorForTest'
import Utils from '../class/Utils.js'
import Validator from '../class/Validator'
import { DIM } from '../../styles/Dimensions'
import CustomSwitch from '../components/global/CustomSwitch'

import Clipboard from '@react-native-clipboard/clipboard'
import Timer from '../components/global/Timer'
import OtpInputTextComponent from '../components/global/OtpInputTextComponent'
import { SafeAreaView } from 'react-native-safe-area-context'
import LogoHeader from '../components/global/LogoHeader'

const AuthContext = createContext(' ')
const { width, height } = Dimensions.get('window')

const SignInForm = navigation => {
  const { theme, setScheme, setBg, bg } = useTheme()
  const emailRef = useRef()

  const navi = useNavigation()
  // console.log('login is focused? =>',navi.isFocused())
  const route = useRoute()
  const routeName = route.name
  // console.log(routeName);

  const [forgetPassStatus, setForgetPassStatus] = useState('sign_in')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const isFocused = useIsFocused()
  const [disableResendOtp, setdisableResendOtp] = useState(true)
  const [timer, setTimer] = useState(40)

  const [deviceToken, setDeviceToken] = useState()
  const [isBioLoginEnabled, setBioLoginEnabled] = useState(false)

  const [isAnimOn, setIsAnimOn] = useState(false) //False is to hide lottie in top of page

  const [formData, setData] = useState({
    email: '',
    password: '',
    otpEmail: '',
    new_password: '',
    new_password_confirm: '',
  })
  const animation = useRef(null)

  const [isSignInProgress, setSignInProgress] = useState(false)

  const [visible, setVisible] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Facebook login start
  const [state, setUserInfo] = useState({ userInfo: {} })
  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled(previousState => !previousState)

  //Biometric
  const [isBiometricSupported, setBiometricSupport] = useState(false)

  //Apple sign in status
  const [credentialStateForUser, updateCredentialStateForUser] = useState(-1)

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  })

  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verifyButtonEnable, setVerifyButtonEnable] = useState(false)

  const [otpPin, setOtpPin] = useState(['', '', '', '', '', ''])

  const [editable, setEditable] = useState(
    Array.from({ length: 6 }, (v, i) => {
      if (i === 0) {
        return false
      } else {
        return true
      }
    }),
  )
  const [systemTime, setSystemTime] = useState(null)

  const pinRefArray = useRef([...Array(6)].map(() => createRef()))
  const [copiedText, setCopiedText] = useState('')
  const [firstIndex, setFirstIndex] = useState(false)

  const [appState, setAppState] = useState(AppState.currentState)
  const [isMounted, setIsMounted] = useState(true)
  const [backgroundSystemTime, setBackgroundSystemTime] = useState(null)
  const [screenLeavingTime, setScreenLeavingTime] = useState(null)

  //New code on branch fix-otp-timer-issue ...
  const [timerActive, setTimerActive] = useState(true)
  // const backKeyPressed = useRef(false)
  const [backKeyPressed, setBackKeyPressed] = useState(false)

  // const handleAppStateChange = nextAppState => {
  //   // console.log('App is now =>', nextAppState)
  //   setAppState(nextAppState)

  //   if (appState === 'active' && nextAppState.match(/inactive|background/)) {
  //     console.log('leaving ...')
  //     setIsMounted(false)
  //     setScreenLeavingTime(new Date().getTime())
  //   } else if (
  //     appState.match(/background|inactive/) &&
  //     nextAppState === 'active'
  //   ) {
  //     console.log('entering ...')
  //     setBackgroundSystemTime(new Date().getTime())
  //     setIsMounted(true)
  //   }
  // }

  // useEffect(() => {
  //   const elapsed_time = Math.floor(
  //     (backgroundSystemTime - screenLeavingTime) / 1000,
  //   )
  //   if (backgroundSystemTime && isMounted) {
  //     // console.log(screenLeavingTime, backgroundSystemTime)
  //     const adjustTimer = timer - elapsed_time
  //     console.log('elapsed time ===>', elapsed_time, 'seconds')
  //     if (adjustTimer < 0) {
  //       setTimer(0)
  //     } else {
  //       setTimer(adjustTimer)
  //     }
  //   }
  // }, [isMounted])

  // useEffect(() => {
  //   const subscription = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   )

  //   return () => {
  //     subscription.remove()
  //   }
  // }, [appState])

  const getCopiedText = async () => {
    const copyText = await Clipboard.getString()
    // console.log('copyText =>', copyText)
    setCopiedText(copyText)
  }

  useEffect(() => {
    Clipboard.addListener(() => {
      // console.log('getting copied text ...')
      getCopiedText()
    })
  }, [])

  useEffect(() => {
    console.log('The text I copied was ================>', copiedText)
  }, [copiedText])

  const handleChangingText = (text, ind) => {
    // console.log('onChangeText Event of => TextInput')

    if (copiedText?.length === 6) {
      let tmp = copiedText.match(/[0-9]{6}/)
      // console.log('matched_length =>',tmp[0].length);
      // console.log(tmp[0][0]);
      // 100200
      let tmp_arr = []

      if (tmp[0]?.length === 6) {
        for (let i = 0; i < 6; ++i) {
          tmp_arr.push(tmp[0][i])
        }

        setEditable(Array.from({ length: 6 }, (v, i) => {
          if (i === 0) {
            return false
          } else {
            return true
          }
        }))
        setOtpPin(tmp_arr)
      }
    } else {
      if (backKeyPressed) {
        // console.log('Back Key Pressed')
      } else {
        // enabling the next textinput field ...
        const current_otp_array = [...otpPin]
        current_otp_array[ind] = text
        setOtpPin(current_otp_array)

        // console.log('the current index is ===>', ind)

        if (ind < 5) {
          console.log('inside if ladder ====>')

          const editableArrMutable = [...editable]
          editableArrMutable[ind + 1] = false
          setEditable(editableArrMutable)

          setTimeout(() => {
            if (otpPin[ind - 1] === '' || firstIndex) {
              pinRefArray.current[0].current.focus()
              setFirstIndex(false)
            } else {
              pinRefArray.current[ind + 1].current.focus()
            }
          }, 0)
        }
      }
    }
  }

  useEffect(() => {
    // console.log(timer);
    if (
      otpPin[0] != '' &&
      otpPin[1] != '' &&
      otpPin[2] != '' &&
      otpPin[3] != '' &&
      otpPin[4] != '' &&
      otpPin[5] !== ''
    ) {
      setVerifyButtonEnable(true)
      // pinRefArray.current[0].current.focus()
    }
    console.log(otpPin)
  }, [otpPin])

  const backKeyPress = (nativeEvent, ind) => {
    if (nativeEvent.key === 'Backspace') {
      // console.log('Back Key Press Event of => TextInput')
      console.log('backspace => ind =>', ind)

      if (ind === 0) {
        setFirstIndex(true)
      }
      setBackKeyPressed(true)
    }
  }

  useEffect(() => {
    if (backKeyPressed) {
      setOtpPin(['', '', '', '', '', ''])
      setBackKeyPressed(false)

      setCopiedText('')

      setEditable(
        Array.from({ length: 6 }, (v, i) => {
          if (i === 0) {
            return false
          } else {
            return true
          }
        }),
      )

      pinRefArray.current[0].current.focus()

    }
  }, [backKeyPressed])

  useEffect(() => {
    console.log(editable)
  }, [editable])


  const onVerify = async () => {
    setVerificationLoading(true)
    console.log(otpPin)

    let bodyData = {
      otp: `${otpPin[0]}${otpPin[1]}${otpPin[2]}${otpPin[3]}${otpPin[4]}${otpPin[5]}`,
      email: formData.otpEmail,
    }
    // console.log(API_URLS.FORGOT_PASS_VERIFY_OTP);

    try {
      const response = await fetch(API_URLS.FORGOT_PASS_VERIFY_OTP, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(bodyData),
      })

      const response_json = await response.json()

      if (response.status === 200) {
        setVerificationLoading(false)
        setForgetPassStatus('otp_verified')
      } else {
        setVerificationLoading(false)
        setVisible(true)
        setErrorMsg(response_json?.message)
      }

      console.log('from_onVerify_Method =>', response_json)
    } catch (e) {
      console.log('onVerify_SignIn =>', e)
    }
  }

  useEffect(() => {
    const bootstrapAsync = async () => {
      const email = await AsyncStorageManager.getData(CONSTANTS.LOGIN_METHOD)
      const pass = await AsyncStorageManager.getData(CONSTANTS.LOGIN_PASS)

      setData({ ...formData, email: email, password: pass })

      //GoogleSignin.configure();
      GoogleSignin.configure({
        scopes: ['profile', 'email'],
        // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: CONSTANTS.WEB_CLIENT_ID, // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
        offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        //hostedDomain: '', // specifies a hosted domain restriction
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        //accountName: '', // [Android] specifies an account name on the device that should be used
        androidClientId: CONSTANTS.ANDROID_ID, //WEB_CLIENT_ID, //
        iosClientId: CONSTANTS.IOS_ID, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        //googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
        //openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
        profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
      })
    }

    getIsBiometricLocked()
    requestUserPermission()
    bootstrapAsync()
    getBiometric()

    if (Platform.OS === 'ios') {
      return appleAuth.onCredentialRevoked(async () => {
        console.warn(
          'If this function executes, User Credentials have been Revoked',
        )
      })
    }

    // console.log('Is ShowOnce: ' + Utils.getProfileUpdateShowOnce());
    // Utils.setProfileUpdateShowOnce(true);
    // console.log('After set showOnce: ' + Utils.getProfileUpdateShowOnce());
    // Utils.setProfileUpdateShowOnce(false);
    // console.log('After set false showOnce: ' + Utils.getProfileUpdateShowOnce());
  }, [])

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

  const getBiometricData = async () => {
    // var userEmailFromStore = await AsyncStorageManager.getData('user_email');
    // var userPasswordFromStore = await AsyncStorageManager.getData(
    //   'user_password',
    // );

    var userToken = await AsyncStorageManager.getData(
      CONSTANTS.USER_TOKEN /*'user_token'*/,
    )
    console.log('User token: ' + userToken)
    getVerifyBiometric(userToken)
  }

  const getVerifyBiometric = async userToken => {
    if (isBiometricSupported) {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirmation',
      })
      if (success) {
        if (
          deviceToken === undefined ||
          deviceToken === '' ||
          deviceToken === null
        ) {
          goToHome(userToken)
        } else {
          updateDeviceToken(userToken, deviceToken)
        }
      }
    } else {
      console.log('Biometric is not supported on this device')
      Utils.showAlertDialog('Biometric is not supported on this device')
    }
  }

  async function getIsBiometricLocked() {
    var isBioLoginEnabledStr = await AsyncStorageManager.getData(
      CONSTANTS.IS_BIO_EANBLED /*'is_bio_login_enabled',*/,
    )

    console.log('Previous settings bioLogin: ' + isBioLoginEnabledStr)
    var isBioLoginEnabledBool = isBioLoginEnabledStr === 'YES' ? true : false
    console.log('Previous settings bioLogin: ' + isBioLoginEnabledBool)
    setBioLoginEnabled(isBioLoginEnabledBool)
  }

  //TODO need to add progress bar here
  //Get Device token
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
  //FB sign in
  const onFacebookSignInPress = async () => {
    AuthManager.handleFacebookSignIn(
      (providerId, providerName, email, username, token) => {
        socialLoginApi(providerId, providerName, email, username, token)
      },
    )
  }

  //Google sign in
  async function onGoogleSignInPress() {
    AuthManager.handleGoogleSignIn(
      (providerId, providerName, email, username, token) => {
        socialLoginApi(providerId, providerName, email, username, token)
      },
    )
  }

  //Apple sign in
  async function onAppleSignInPress() {
    await AuthManager.handleAppleLogin(
      (providerId, providerName, finalEmail, username, token) => {
        console.log('Apple login Return call back')
        socialLoginApi(providerId, providerName, finalEmail, username, token)
      },
    )
  }

  async function fetchAndUpdateCredentialState(updateCredentialStateForUser) {
    if (user === null) {
      updateCredentialStateForUser('N/A')
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(user)
      if (credentialState === appleAuth.State.AUTHORIZED) {
        updateCredentialStateForUser('AUTHORIZED')
      } else {
        updateCredentialStateForUser(credentialState)
      }
    }
  }

  const socialLoginApi = async (
    providerId,
    providerName,
    email,
    username,
    token,
  ) => {
    //navi.dispatch(StackActions.replace('tab', {screen: 'home'}));
    setIsLoading(true)
    console.log(
      `providerId: ${providerId}, providerName: ${providerName}, email: ${email}, username: ${username}, token: ${token}`,
    )
    console.log('social login api: ' + API_URLS.SOCIAL_LOGIN)
    try {
      const response = await fetch(API_URLS.SOCIAL_LOGIN, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider_id: providerId,
          provider_name: providerName,
          full_name: username,
          email: email,
          token: token,
        }),
      })
      const json = await response.json()
      if (response.status === 200) {
        console.log('Login Response: ' + JSON.stringify(json))
        const token = json.data.token
        const user = json.data.user
        const id = user.id

        const setting = user?.setting
        const currentThemeName = user?.setting?.current_theme
        const currentBgName = user?.setting?.background_value
        const currentBgType = user?.setting?.background_type
        const date_format = user?.setting?.date_format

        AsyncStorageManager.storeData(
          CONSTANTS.SETTING,
          JSON.stringify(setting),
        )
        AsyncStorageManager.storeData(CONSTANTS.DATE_FORMAT, date_format)

        console.log("Current theme name: " + currentThemeName);
        currentThemeName ? setScheme(currentThemeName) : setScheme(CONSTANTS.UI.ELEGENT)

        if (!CONSTANTS.IS_BACKGROUND_HIDE) {
          console.log("current Bg Name from api ==>", currentBgName);
          if (currentBgName && currentBgType) {
            setBg(currentBgName)
          } else {
            setBg(CONSTANTS.BG_IMG.ELEGENT /*'ElegantBg'*/);
          }
        }

        AsyncStorageManager.storeData(CONSTANTS.USER_ID, id + '')
        AsyncStorageManager.storeData(CONSTANTS.USER_EMAIL, email + '')

        AsyncStorageManager.storeData(
          CONSTANTS.SIGN_IN_METHOD,
          providerName + '',
        )

        // const profileStatus = user.profile_status
        // AsyncStorageManager.storeData(
        //   CONSTANTS.PROFILE_STATUS,
        //   profileStatus + '',
        // )

        console.log('ok==>')
        if (token != null) {
          goToHome(token)
        }

        // console.log(json);
        setIsLoading(false)
      } else {
        console.log('Status: ' + response.status)
        console.log(json)
        // const msg = json.message;
        // setVisible(true);
        // setErrorMsg(msg);
        setIsLoading(false)

        setErrorMsg(json.message)
        setVisible(true)
      }
    } catch (error) {
      // console.error(error);
      // console.log(error);
      setIsLoading(false)
    }
  }

  const loginApi = async (email, pass, deviceToken_) => {
    if (email === undefined || email === null || formData?.email == '') {
      setErrorMsg('Email is required')
      setVisible(true)
      return
    }
    if (pass === undefined || pass === null || formData?.pass == '') {
      setErrorMsg('Password is required')
      setVisible(true)
      return
    }

    if (Validator.Validate('email', email)) {
      //navi.dispatch(StackActions.replace('tab', {screen: 'home'}));
      setIsLoading(true)

      console.log('Email-: ' + email + ' Pass: ' + pass)

      var bodyData
      if (deviceToken_ !== null && deviceToken_ !== '') {
        bodyData = JSON.stringify({
          email: email, //'nazmul.prolific@gmail.com', //
          password: pass, //'12345678',
          device_token: deviceToken_, //Device token
        })
      } else {
        bodyData = JSON.stringify({
          email: email, //'nazmul.prolific@gmail.com', //
          password: pass, //'12345678',
        })
      }
      console.log('login api: ' + API_URLS.LOGIN)
      try {
        const response = await fetch(API_URLS.LOGIN, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: bodyData,
        })
        const json = await response.json()
        if (response.status === 200) {
          // console.log('Login Response: ' + JSON.stringify(json));
          const token = json.data.token
          const user = json.data.user
          const id = user.id

          const setting = user?.setting
          const currentThemeName = user?.setting?.current_theme
          const currentBgName = user?.setting?.background_value
          const currentBgType = user?.setting?.background_type
          const date_format = user?.setting?.date_format

          AsyncStorageManager.storeData(
            CONSTANTS.SETTING,
            JSON.stringify(setting),
          )
          AsyncStorageManager.storeData(CONSTANTS.DATE_FORMAT, date_format)

          // if (currentThemeName) {
          //   if (currentThemeName == 'Silver') {
          //     setScheme(CONSTANTS.UI.HONEYCOMB /*'honeycomb'*/);
          //   } else if (currentThemeName == 'Light') {
          //     setScheme(CONSTANTS.UI.LIGHT /*'light'*/);
          //   } else if (currentThemeName == 'RoseGold') {
          //     setScheme(CONSTANTS.UI.ROSEGOLD /*'roseGold'*/);
          //   } else if (currentThemeName == 'Gold') {
          //     setScheme(CONSTANTS.UI.GOLD /*'gold'*/);
          //   } else if (currentThemeName == 'Elegant') {
          //     setScheme(CONSTANTS.UI.ELEGENT /*'elegant'*/);
          //   } else {
          //     setScheme(CONSTANTS.UI.HONEYCOMB /*'honeycomb'*/);
          //   }
          // } else {
          //   setScheme(CONSTANTS.UI.HONEYCOMB /*'honeycomb'*/);
          // }

          console.log("Current theme name: " + currentThemeName);
          currentThemeName ? setScheme(currentThemeName) : setScheme(CONSTANTS.UI.ELEGENT)
          console.log("current Bg Name from api ==>", currentBgName);

          if (!CONSTANTS.IS_BACKGROUND_HIDE) {
            if (currentBgName && currentBgType) {
              setBg(currentBgName)
            } else {
              setBg(CONSTANTS.BG_IMG.ELEGENT /*'ElegantBg'*/);
            }
          }
          // console.log('currentBgName && currentBgType', currentBgName, currentBgType);
          // return
          AsyncStorageManager.storeData(CONSTANTS.USER_ID, id + '')
          AsyncStorageManager.storeData(CONSTANTS.USER_EMAIL, email + '')

          AsyncStorageManager.storeData(CONSTANTS.SIGN_IN_METHOD, 'password')

          // const profileStatus = user.profile_status
          // AsyncStorageManager.storeData(
          //   CONSTANTS.PROFILE_STATUS,
          //   profileStatus + '',
          // )

          if (isEnabled) {
            AsyncStorageManager.storeData(CONSTANTS.LOGIN_METHOD, email)
            AsyncStorageManager.storeData(CONSTANTS.LOGIN_PASS, pass)
          } else {
            AsyncStorageManager.storeData(CONSTANTS.LOGIN_METHOD, '')
            AsyncStorageManager.storeData(CONSTANTS.LOGIN_PASS, '')
          }

          console.log('ok==>')
          // console.log('token' + token);
          if (token != null) {
            goToHome(token)
          }
          //navi.replace(StackActions.replace('tab', {screen: 'home'}));
          // console.log(json);
          setIsLoading(false)
        } else {
          console.log(json)
          const msg = json.message
          setVisible(true)
          setErrorMsg(msg)
          setIsLoading(false)
        }
      } catch (error) {
        console.error(error)
        console.log(error)
        setIsLoading(false)
      }
    } else {
      const msg = 'Invalid email address'
      setErrorMsg(msg)
      setVisible(true)
    }
  }

  const getOtp = async () => {
    if (
      formData?.otpEmail === undefined ||
      formData?.otpEmail === null ||
      formData?.otpEmail == ''
    ) {
      setErrorMsg('Email is required')
      setVisible(true)
      return
    }

    if (Validator.Validate('email', formData?.otpEmail)) {
      setIsLoading(true)

      try {
        var api = API_URLS.GET_OTP
        fetch(api, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
          },
          body: JSON.stringify({ email: formData?.otpEmail }),
        })
          .then(response => response.json())
          .then(responseJson => {
            try {
              var a = JSON.stringify(responseJson)
              var json = JSON.parse(a)
              if (responseJson.status === 200) {
                setIsLoading(false)
                console.log('Status==> ok', json)
                // setSystemTime(new Date())
                // setMsg(json?.message)
                setForgetPassStatus('get_otp')
              } else {
                console.log('Error==>', json?.message)
                // console.log('Error==>', JSON.stringify(json).message);
                setErrorMsg(json?.message)
                setVisible(true)
                setIsLoading(false)
              }
            } catch (error) {
              // console.error(error);
              console.log(error)
              setIsLoading(false)
            }
          })
          .catch(error => {
            console.error(error)
            setIsLoading(false)
          })
      } catch (error) {
        console.error(error)
        console.log(error)
        setIsLoading(false)
      }
    } else {
      const msg = 'Invalid email address'
      setErrorMsg(msg)
      setVisible(true)
    }
  }

  const setNewPass = async () => {
    // if (formData?.otp === undefined || formData?.otp === null || formData?.otp == '') {
    //   setErrorMsg("OTP is required");
    //   setVisible(true);
    //   return;
    // }
    if (
      formData?.new_password === undefined ||
      formData?.new_password === null ||
      formData?.new_password == ''
    ) {
      setErrorMsg('Password is required')
      setVisible(true)
      return
    }
    // if (formData?.new_password_confirm === undefined || formData?.new_password_confirm === null || formData?.new_password_confirm == '') {
    //   setErrorMsg("Confirm Password is required");
    //   setVisible(true);
    //   return;
    // }
    // if (formData?.new_password != formData?.new_password_confirm) {
    //   setErrorMsg("Password not matched");
    //   setVisible(true);
    //   return;
    // }

    if (Validator.Validate('email', formData?.otpEmail)) {
      setIsLoading(true)

      const payload = {
        email: formData?.otpEmail,
        // otp: formData?.otp,
        otp: `${otpPin[0]}${otpPin[1]}${otpPin[2]}${otpPin[3]}${otpPin[4]}${otpPin[5]}`,
        password: formData?.new_password,
        // password_confirmation: formData?.new_password_confirm,
      }
      // console.log('payload', payload);

      try {
        var api = API_URLS.FORGOT_PASS
        fetch(api, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
          },
          body: JSON.stringify(payload),
        })
          .then(response => response.json())
          .then(responseJson => {
            try {
              var a = JSON.stringify(responseJson)
              var json = JSON.parse(a)
              if (responseJson.status === 200) {
                setIsLoading(false)
                console.log('Status==> ok', json)
                setErrorMsg(json?.message)
                setIsSuccess(true)
                setVisible(true)
                setForgetPassStatus('sign_in')
              } else {
                console.log('Error==>', json?.message)
                // console.log('Error==>', JSON.stringify(json).message);
                setErrorMsg(json?.message)
                setVisible(true)
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
      } catch (error) {
        console.error(error)
        console.log(error)
        setIsLoading(false)
      }
    } else {
      const msg = 'Invalid email address'
      setErrorMsg(msg)
      setVisible(true)
    }
  }

  const updateDeviceToken = async (userToken, deviceToken_) => {
    //navi.dispatch(StackActions.replace('tab', {screen: 'home'}));
    setIsLoading(true)

    const api = API_URLS.UPDATE_DEVICE_TOKEN
    console.log('Update device token api: ' + api)

    console.log('Device Token: ' + deviceToken_)
    var bodyData = JSON.stringify({
      device_token: deviceToken_, //Device token
    })

    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: bodyData,
      })
      const json = await response.json()
      if (response.status === 200) {
        // console.log('Login Response: ' + JSON.stringify(json));

        console.log('Touch id success: ')
        console.log('ok==>')
        // console.log('token' + token);
        if (userToken != null) {
          goToHome(userToken)
        }
        setIsLoading(false)
      } else {
        console.log(json)
        const msg = json.message
        setVisible(true)
        setErrorMsg(msg)
        setIsLoading(false)
        console.log('Cannot Login with previous biometric data')
        //TODO need to show a dialog
      }
    } catch (error) {
      console.error(error)
      console.log(error)
      setIsLoading(false)
      console.log('Cannot Login with previous biometric data')
      //TODO need to show a dialog
    }
  }

  const goToHome = userToken => {
    //navi.navigate('tab', {screen: 'home'});
    Token.storeToken(userToken)

    if (false) {
      //Animation turn off
      setSignInProgress(true)
      setTimeout(() => {
        navi.navigate('tab', { screen: 'tab_home' })
        setSignInProgress(false)
        // navi.dispatch(StackActions.replace('tab', { screen: 'tab_home' }));
      }, 1800)
    } else {
      navi.navigate('tab', { screen: 'tab_home' })
    }
  }

  return (
    <SafeAreaView
      style={{
        // flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        height:DIM.height, 
      }}>
     
      <KeyboardAvoidingView
        style={styles.top}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow:1,
            justifyContent: 'center',
            paddingBottom:DIM.height*.1,
          }}
        // contentContainerStyle={styles.contentContainerStyle
        >
          <LogoHeader />
          <View style={styles.page}>
            {/*Modal Start */}
            <FullScreenModalComponent
              visible={isSignInProgress}
              title={'Sign in'}
              onPress={() => setSignInProgress(false)}
              source={require('../../assets/sign_in_progress_anim.json')}
              theme={theme}
              bg={bg}
            />

            <ModalPoup
              theme={theme}
              visible={visible}
              title={errorMsg}
              source={
                isSuccess
                  ? require('../../assets/done.json')
                  : require('../../assets/sign_in_animation.json')
              }
              btnTxt={'Ok'}
              onPressOk={() => {
                if (isSuccess) {
                  setForgetPassStatus('sign_in')
                }
                setVisible(false)
              }}
              onPressClose={() => {
                if (isSuccess) {
                  setForgetPassStatus('sign_in')
                }
                setVisible(false)
              }}
            />

            {/*Modal End */}
            <View style={styles.header}>
              {isAnimOn && (
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    ...styles.animation,
                    position: theme?.name == 'Light' ? 'absolute' : 'static',
                  }}
                  source={
                    forgetPassStatus == 'get_email'
                      ? require('../../assets/forgetPass.json')
                      : require('../../assets/sign_in_transparent.json')
                  }
                  loop
                />
              )}
            </View>

            {/* <ThemeSelectorForTest /> */}

            <View style={{
              // backgroundColor:'red',
              width:DIM.width,
              alignItems:'center',  
            }}>
              <View
                style={{
                  marginTop: 20,
                }}>
                {forgetPassStatus == 'sign_in' && (
                  <>
                    <View style={{ paddingBottom: 32, position: 'relative' }}>
                      <InputTextComponent
                        refInput={emailRef}
                        // placeholderTitle={(emailRef?.current?.isFocused()||formData.email!=='')?undefined:'Email'}
                        placeholderTitle={'Email'}
                        // placeholderTitle={''}
                        // icon={<EmailSVG />}
                        icon={theme?.profileIcon?.email}
                        borderColor={theme?.textInput?.borderColor}
                        backgroundColor={theme?.textInput?.backgroundColor}
                        borderWidth={theme?.textInput?.borderWidth}
                        darkShadowColor={theme?.textInput?.darkShadowColor}
                        lightShadowColor={theme?.textInput?.lightShadowColor}
                        shadowOffset={theme?.textInput?.shadowOffset}
                        placeholderColor={theme?.textInput?.placeholderColor}
                        inputColor={theme?.textInput?.inputColor}
                        value={formData.email}
                        type="email"
                        onChangeText={value => {
                          // console.log('Email==: ' + value);
                          setData({ ...formData, email: value })
                        }}
                        cursorColor={theme.colors.borderColor}
                      />
                      {/* {!formData.email &&
                        <TouchableWithoutFeedback                           // TODO ... Efficiency check ...
                          style={{ backgroundColor: 'red' }}
                          onPress={() => {
                            emailRef.current.focus()
                          }}
                        >
                          <Text style={{
                            color: 'gray', position: 'absolute', top: 17,
                            alignSelf: 'center',
                          }}>Email</Text>
                        </TouchableWithoutFeedback>
                      } */}
                    </View>

                    <View style={{ paddingBottom: 32 }}>
                      <PasswordInput
                        placeholderTitle={'Password'}
                        value={formData.password}
                        // icon={<PasswordSVG />}
                        icon={theme?.profileIcon?.password}
                        eyeOn={theme?.profileIcon?.eyeOn}
                        eyeOff={theme?.profileIcon?.eyeOff}
                        borderColor={theme?.textInput?.borderColor}
                        backgroundColor={theme?.textInput?.backgroundColor}
                        borderWidth={theme?.textInput?.borderWidth}
                        darkShadowColor={theme?.textInput?.darkShadowColor}
                        lightShadowColor={theme?.textInput?.lightShadowColor}
                        shadowOffset={theme?.textInput?.shadowOffset}
                        placeholderColor={theme?.textInput?.placeholderColor}
                        inputColor={theme?.textInput?.inputColor}
                        onChangeText={value => {
                          // console.log('password==: ' + value);
                          setData({ ...formData, password: value })
                        }}
                        cursorColor={theme.colors.borderColor}
                      />
                    </View>
                  </>
                )}

                {forgetPassStatus == 'get_email' && (
                  <View style={{ paddingBottom: 32 }}>
                    <TouchableOpacity
                      style={{ marginBottom: 20 }}
                      // style={{ position: 'absolute', left: 5, zIndex: 100,top:-20, }}
                      onPress={() => setForgetPassStatus('sign_in')}>
                      {theme?.header?.backIcon}
                    </TouchableOpacity>
                    <InputTextComponent
                      // refInput={}
                      placeholderTitle={'Email'}
                      // icon={<EmailSVG />}
                      icon={theme?.profileIcon?.email}
                      borderColor={theme?.textInput?.borderColor}
                      backgroundColor={theme?.textInput?.backgroundColor}
                      borderWidth={theme?.textInput?.borderWidth}
                      darkShadowColor={theme?.textInput?.darkShadowColor}
                      lightShadowColor={theme?.textInput?.lightShadowColor}
                      shadowOffset={theme?.textInput?.shadowOffset}
                      placeholderColor={theme?.textInput?.placeholderColor}
                      inputColor={theme?.textInput?.inputColor}
                      type="email"
                      onChangeText={value => {
                        // console.log('Email==: ' + value);
                        setData({ ...formData, otpEmail: value })
                      }}
                      cursorColor={theme.colors.borderColor}
                    />
                  </View>
                )}

                {forgetPassStatus == 'get_otp' && (
                  <>
                    <View style={{ paddingBottom: 32 }}>
                      <TouchableOpacity
                        style={{ marginBottom: 20, marginLeft: 40 }}
                        // style={{ position: 'absolute', left: 5, zIndex: 100,top:-20, }}
                        onPress={() => {
                          setForgetPassStatus('get_email')
                          setOtpPin(Array.from({ length: 6 }, () => ''))
                        }}>
                        {theme?.header?.backIcon}
                      </TouchableOpacity>

                      <View style={styles.textInputContainer}>
                        {editable.map((item, ind) => {
                          return (
                            <OtpInputTextComponent
                              key={`item${ind}`}
                              value={otpPin[ind]}
                              refInput={pinRefArray.current[ind]}
                              placeholderTitle={''}
                              // icon={<Otp />}
                              cursorCentered={true}
                              cursorColor={'#000'}
                              maxLength={1}
                              disabled={item}
                              icon={theme?.settingsIcon?.otp}
                              borderColor={theme?.textInput?.borderColor}
                              backgroundColor={
                                theme?.textInput?.backgroundColor
                              }
                              borderWidth={theme?.textInput?.borderWidth}
                              darkShadowColor={
                                theme?.textInput?.darkShadowColor
                              }
                              lightShadowColor={
                                theme?.textInput?.lightShadowColor
                              }
                              shadowOffset={theme?.textInput?.shadowOffset}
                              placeholderColor={
                                theme?.textInput?.placeholderColor
                              }
                              inputColor={theme?.textInput?.inputColor}
                              type="numeric"
                              divideWidthBy={9}
                              onChangeText={text => {
                                handleChangingText(text, ind)
                              }}
                              onKeyPress={({ nativeEvent }) => {
                                backKeyPress(nativeEvent, ind)
                              }}
                            // pointerEvents={ind === 0 || otpPin[ind - 1] !== '' ? 'auto' : 'none'}
                            />
                          )
                        })}
                      </View>
                    </View>

                    <View style={{ paddingBottom: 32 }}>
                      <View style={{ paddingLeft: 35, paddingRight: 35 }}>
                        <CustomButton
                          title={'Verify'}
                          isLoading={verificationLoading}
                          onPress={() => {
                            onVerify()
                            // setForgetPassStatus('otp_verified');
                          }}
                          color={theme?.colors?.btnText}
                          colors={theme?.colors?.colors}
                          bordered={true}
                          borderWidth={theme?.name == 'Light' ? 0 : 3}
                          borderColors={theme?.colors?.borderColors}
                          borderColor={theme?.colors?.borderColor}
                          shadow={theme?.name == 'Light'}
                          disabled={!verifyButtonEnable}
                        />
                      </View>
                    </View>
                    <View style={styles.resendOtpContainer}>
                      <TouchableOpacity
                        disabled={disableResendOtp}
                        onPress={() => {
                          setdisableResendOtp(true)
                          setTimerActive(true)
                        }}>
                        <Text
                          style={[
                            styles.resendOtpText,
                            {
                              color: !disableResendOtp ? '#ffffff' : '#3D3D3D',
                            },
                          ]}>
                          Resend OTP
                        </Text>
                      </TouchableOpacity>
                      <Timer
                        time={300}
                        timerActive={timerActive}
                        onTimeout={() => {
                          console.log('onTimeout listener ===>')
                          setdisableResendOtp(false)
                          setTimerActive(false)
                        }}
                      />
                    </View>
                  </>
                )}

                {/* Is Rendered after the OTP is verified  */}
                {forgetPassStatus === 'otp_verified' ? (
                  <View>
                    <View style={{ paddingBottom: 20, alignItems: 'center' }}>
                      <PasswordInput
                        placeholderTitle={'Enter New Password'}
                        // icon={<PasswordSVG />}
                        icon={theme?.profileIcon?.password}
                        eyeOn={theme?.profileIcon?.eyeOn}
                        eyeOff={theme?.profileIcon?.eyeOff}
                        borderColor={theme?.textInput?.borderColor}
                        backgroundColor={theme?.textInput?.backgroundColor}
                        borderWidth={theme?.textInput?.borderWidth}
                        darkShadowColor={theme?.textInput?.darkShadowColor}
                        lightShadowColor={theme?.textInput?.lightShadowColor}
                        shadowOffset={theme?.textInput?.shadowOffset}
                        placeholderColor={theme?.textInput?.placeholderColor}
                        inputColor={theme?.textInput?.inputColor}
                        onChangeText={value => {
                          // console.log('password==: ' + value);
                          setData({ ...formData, new_password: value })
                        }}
                      />
                    </View>
                    <View style={{}}>
                      <View style={{ marginTop: 15 }}>
                        <CustomButton
                          title={'Reset Password'}
                          isLoading={isLoading}
                          onPress={() => {
                            // setForgetPassStatus('sign_in')
                            setNewPass()
                          }}
                          color={theme?.colors?.btnText}
                          colors={theme?.colors?.colors}
                          bordered={true}
                          borderWidth={theme?.name == 'Light' ? 0 : 3}
                          borderColors={theme?.colors?.borderColors}
                          borderColor={theme?.colors?.borderColor}
                          shadow={theme?.name == 'Light'}
                        />
                      </View>
                    </View>
                  </View>
                ) : null}

                <View style={styles.forgatePassContaner}>
                  {forgetPassStatus == 'sign_in' ? (
                    <View style={styles.rememberPass}>
                      {/* <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        //thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        thumbColor={theme?.colors?.switch}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                      /> */}
                      <CustomSwitch
                        value={isEnabled}
                        onValueChange={toggleSwitch}
                      />
                      <Text
                        style={{
                          paddingLeft: 8,
                          color: theme?.name == 'Light' ? '#000000' : 'white',
                        }}>
                        Remember me
                      </Text>
                    </View>
                  ) : null}

                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          forgetPassStatus == 'get_email' ||
                          forgetPassStatus == 'get_otp'
                        ) {
                          setForgetPassStatus('sign_in')
                        } else {
                          setForgetPassStatus('get_email')
                        }
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: theme?.name == 'Light' ? '#000000' : 'white',
                        }}>
                        {
                          forgetPassStatus == 'sign_in'
                            ? 'Forget Password?'
                            : null // 'Sign in'
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ paddingBottom: 15 }}>
                  {isBioLoginEnabled && forgetPassStatus == 'sign_in' && (
                    <Center>
                      <TouchableOpacity
                        onPress={() => {
                          getBiometricData()
                        }}>
                        <Neomorph
                          darkShadowColor="#9eb5c7"
                          //darkShadowColor="gray" // <- set this
                          //lightShadowColor="#3344FF" // <- this
                          style={
                            theme?.name == 'Light'
                              ? styles.input
                              : {
                                ...styles.inputDark,
                                borderColor: theme?.colors?.text,
                              }
                          }>
                          <View style={styles.centeredContent}>
                            {/* <FingerPrintSVG /> */}
                            {theme?.settingsIcon?.fingerprint}
                          </View>
                        </Neomorph>
                      </TouchableOpacity>
                    </Center>
                  )}
                </View>

                {(forgetPassStatus === 'get_email' ||
                  forgetPassStatus === 'sign_in') && (
                    <View style={{ paddingBottom: 15 }}>
                      <CustomButton
                        title={
                          forgetPassStatus == 'get_email'
                            ? 'Send OTP'
                            : forgetPassStatus == 'get_otp'
                              ? 'Save'
                              : 'Sign In'
                        }
                        isLoading={isLoading}
                        onPress={() => {
                          if (forgetPassStatus == 'get_email') {
                            getOtp()
                            // setForgetPassStatus('get_otp')
                            setTimerActive(true)
                            setdisableResendOtp(true)
                          } else {
                            // TODO need to move in a function
                            global.isSignedIn = true
                            console.log('Press Sign In Button')
                            console.log('Email: ' + formData.email)
                            console.log('Password: ' + formData.password)

                            loginApi(
                              formData.email,
                              formData.password,
                              deviceToken,
                            )
                          }
                        }}
                        color={theme?.colors?.btnText}
                        colors={theme?.colors?.colors}
                        bordered={true}
                        borderWidth={theme?.name == 'Light' ? 0 : 3}
                        borderColors={theme?.colors?.borderColors}
                        borderColor={theme?.colors?.borderColor}
                        shadow={theme?.name == 'Light'}
                      />
                    </View>
                  )}

                {forgetPassStatus == 'sign_in' ? (
                  <>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginVertical: 10,
                        color: theme?.name == 'Light' ? '#000000' : 'white',
                      }}>
                      {' '}
                      Or Continue with
                    </Text>

                    <View
                      style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <TouchableOpacity onPress={() => onGoogleSignInPress()}>
                        <Neomorph
                          darkShadowColor="#9eb5c7"
                          //darkShadowColor="gray" // <- set this
                          //lightShadowColor="#3344FF" // <- this
                          // style={styles.input}
                          style={
                            theme?.name == 'Light'
                              ? styles.input
                              : {
                                ...styles.inputDark,
                                borderColor: theme?.colors?.text,
                              }
                          }>
                          <GoogleLogoSVG />
                        </Neomorph>
                      </TouchableOpacity>

                      <View>
                        {/* appleAuthAndroid.isSupported */}
                        {Platform.OS == 'ios' && (
                          <TouchableOpacity
                            onPress={() => {
                              onAppleSignInPress()
                            }}>
                            <Neomorph
                              darkShadowColor="#9eb5c7"
                              //darkShadowColor="gray" // <- set this
                              //lightShadowColor="#3344FF" // <- this
                              // style={styles.input}
                              style={
                                theme?.name == 'Light'
                                  ? styles.input
                                  : {
                                    ...styles.inputDark,
                                    borderColor: theme?.colors?.text,
                                  }
                              }>
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  marginLeft: -5,
                                }}>
                                <AppleLogoSVG />
                                {/* <FacebbokLogoSVG /> */}
                              </View>
                            </Neomorph>
                          </TouchableOpacity>
                        )}
                      </View>

                      <View>
                        {/* appleAuthAndroid.isSupported */}
                        {false && (
                          <TouchableOpacity
                            onPress={() => {
                              onFacebookSignInPress()
                            }}>
                            <Neomorph
                              darkShadowColor="#9eb5c7"
                              //darkShadowColor="gray" // <- set this
                              //lightShadowColor="#3344FF" // <- this
                              // style={styles.input}
                              style={
                                theme?.name == 'Light'
                                  ? styles.input
                                  : {
                                    ...styles.inputDark,
                                    borderColor: theme?.colors?.text,
                                  }
                              }>
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignContent: 'center',
                                  //marginLeft: -5,
                                }}>
                                <FacebbokLogoSVG />
                              </View>
                            </Neomorph>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    <HStack
                      mt="5"
                      // mb="10"
                      justifyContent="center">
                      <Text
                        fontSize="sm"
                        // color="coolGray.600"
                        color={theme?.name == 'Light' ? '#000000' : 'white'}
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        Don't have an account?{' '}
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          navi.navigate('sign_up')
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: theme?.name == 'Light' ? '#000000' : 'white',
                          }}>
                          Sign Up{' '}
                        </Text>
                      </TouchableOpacity>
                    </HStack>
                  </>
                ) : (
                  <View style={{ marginBottom: 0 }} />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* </ImageBackground> */}
    </SafeAreaView>
  )
}

export default ({ navigation }) => {
  const isFocused = useIsFocused()
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  )

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken
      //const navi = useNavigation();
      userToken = await Token.getToken()
      if (userToken) {
        // Use the token in your application
        //navi.dispatch(StackActions.replace('tab', {screen: 'home'}));
        navigation.navigate('tab', { screen: 'home' })
      } else {
        // Handle the case where the token doesn't exist
      }
      // After restoring token, we may need to validate it in production apps
      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }
    bootstrapAsync()
  }, [isFocused])

  return (
    <NativeBaseProvider>
      <SignInForm />
    </NativeBaseProvider>
  )
}
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  top: {
    width: width,
    padding:0, 
    // height: DIM.height * 0.8,
  },
  page: {
    alignItems: 'center',
    // backgroundColor:'red',
  },
  rectangle1: {
    borderRadius: 20,
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    height: 56,
  },
  header: { alignItems: 'center' },
  headerDialog: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  forgatePassContaner: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop: 10,
    paddingBottom: 20,
  },
  rememberPass: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    shadowOpacity: 1, // <- and this or yours opacity
    shadowRadius: 10,
    borderRadius: 20,
    backgroundColor: '#ECF0F3',
    margin: 10,
    width: 65,
    height: 65,
  },
  inputDark: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: 'black',
    borderWidth: 2,
    margin: 10,
    width: 65,
    height: 65,
  },
  animation: {
    width: 200,
    height: 200,
    backgroundColor: '#ffffff00',
    // position: 'absolute',
  },
  bg1: {
    borderRadius: 20,
    backgroundColor: '#3d50df',
    shadowColor: 'rgba(255, 255, 255, 0.27)',
    shadowOffset: {
      width: -11,
      height: -11,
    },
    shadowRadius: 20,
    elevation: 20,
    shadowOpacity: 1,
    justifyContent: 'center',
    width: '100%',
    height: 60,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  contentContainerStyle: {
    flex: 1,
    paddingTop: 30,
    justifyContent: 'center',
  },
  textInputContainer: {
    flexDirection: 'row',
    gap: 10,
    width: DIM.width,
    height: DIM.height * 0.15,
    justifyContent: 'center',
    // backgroundColor:'red',
  },
  resendOtpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 40,
    paddingRight: 50,
  },
  resendOtpText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
})
