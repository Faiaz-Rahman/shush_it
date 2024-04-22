import { useNavigation } from '@react-navigation/native';
import {
  Center,
  FormControl,
  HStack,
  NativeBaseProvider,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import {
  React,
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { AppleButton, appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import LottieView from 'lottie-react-native';
import { Neomorph } from 'react-native-neomorph-shadows';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';

//Constant
import API_URLS from '../Api.js';
import CONSTANTS from '../Constants.js';
//Class
import Token from '../class/TokenManager.js';
import Utils from '../class/Utils.js';
import AuthManager from '../class/AuthManager.js';
//Component
import ModalPoup from '../components/global/ModalPoupComponent';
import ModalInput from '../components/global/ModalInputComponent.js';
import TextInput from '../components/global/InputTextComponent.js';
import PasswordInput from '../components/global/InputPasswordComponent.js';

import AsyncStorageManager from '../class/AsyncStorageManager.js';
//SVG
import EmailSVG from '../../assets/email_id_icon.svg';
import FacebbokLogoSVG from '../../assets/facebook_logo.svg';
import AppleLogoSVG from '../../assets/apple_logo.svg';
import GoogleLogoSVG from '../../assets/google_logo.svg';
import PasswordSVG from '../../assets/sign_in_password_icon.svg';
import CustomButton from '../components/global/ButtonComponent.js';
import { useTheme } from '../../styles/ThemeProvider.js';
import ThemeSelectorForTest from '../components/global/ThemeSelectorForTest.js';
import Validator from '../class/Validator.js';
import LogoHeader from '../components/global/LogoHeader.js';
import { DIM } from '../../styles/Dimensions.js';
//import {err} from 'react-native-svg/lib/typescript/xml.js';

const AuthContext = createContext(' ');
//Variables
const { width, height } = Dimensions.get('window');

const SignUpForm = () => {
  const [visible, setVisible] = useState(false);
  const [text, onTextChange] = useState('');
  const { theme, setScheme, setBg } = useTheme();

  const navi = useNavigation();
  const [formData, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [deviceToken, setDeviceToken] = useState();

  const [isSignInProgress, setSignInProgress] = useState(false);
  const [state, setUserInfo] = useState({ userInfo: {} });

  const [visible2, setVisible2] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [isAnimOn, setIsAnimOn] = useState(false);

  const handlePress = () => {
    navi.goBack();
    console.log('Button pressed!');
  };

  const animation = useRef(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      // const email = await AsyncStorageManager.getData('Login_Email');
      // const pass = await AsyncStorageManager.getData('Login_Pass');

      //setData({...formData, email: email, password: pass});

      //Should come from unique place
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
      });
    };
    bootstrapAsync();

    requestUserPermission();

    if (Platform.OS === 'ios') {
      return appleAuth.onCredentialRevoked(async () => {
        console.warn('If this function executes, User Credentials have been Revoked');
      });
    }
    return () => {
      setData({})
    }
  }, []);

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

  //FB sign in 
  const onFacebookSignInPress = async () => {
    AuthManager.handleFacebookSignIn((providerId, providerName, email, username, token) => {
      socialLoginApi(providerId, providerName, email, username, token);
    })
  };

  //Google sign in
  async function onGoogleSignInPress() {
    AuthManager.handleGoogleSignIn((providerId, providerName, email, username, token) => {
      socialLoginApi(providerId, providerName, email, username, token);
    })
  }

  //Apple sign in
  async function onAppleSignInPress() {
    await AuthManager.handleAppleLogin((providerId, providerName, finalEmail, username, token) => {
      console.log("Apple login Return call back");
      socialLoginApi(providerId, providerName, finalEmail, username, token);
    });
  }

  const requestForSignUp = async (
    name,
    email,
    pass,
    passConfirmation,
    deviceToken_,
  ) => {
    console.log(
      'Signup name: ' +
      name +
      ' email: ' +
      email +
      ' pass: ' +
      pass +
      'pass confirm: ' +
      passConfirmation +
      'DeviceToken: ' +
      deviceToken_,
    );
    if (!name || !email || !pass) {
      // if (!name || !email || !pass || !passConfirmation) {
      // Check if any of the fields is empty or undefined
      setErrorMsg('All fields are required');
      setVisible2(true);
      // Alert.alert('Validation Error', 'Please fill in all fields');
    }
    else if (!Validator.Validate('email', email)) {
      setErrorMsg('Invalid email');
      setVisible2(true);
    }
    // else if (pass !== passConfirmation) {
    //   // Check if passwords match
    //   setErrorMsg('Passwords do not match');
    //   setVisible2(true);
    //   // Alert.alert('Validation Error', 'Passwords do not match');
    // }
    else {
      // All fields are filled, and passwords match, you can proceed with form submission
      // Add your submission logic here
      //Alert.alert('Success', 'Form submitted successfully');
      setLoading(true);

      var bodyData;
      if (deviceToken_ !== null && deviceToken_ !== '') {
        bodyData = JSON.stringify({
          full_name: name,
          email: email,
          password: pass,
          password_confirmation: passConfirmation,
          device_token: deviceToken_,
        });
      } else {
        bodyData = JSON.stringify({
          full_name: name,
          email: email,
          password: pass,
          password_confirmation: passConfirmation,
        });
      }

      await fetch(API_URLS.REGISTER, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`, // notice the Bearer before your token
        },
        body: bodyData,
      })
        //Sending the currect offset with get request
        .then(response => response.json())
        .then(async responseJson => {
          //Successful response
          //Increasing the offset for the next API call
          try {
            //const json = await response.json();
            var a = JSON.stringify(responseJson);
            var json = JSON.parse(a);

            var status = json.status;
            console.log(' Status: ' + status);
            // console.log(' Register resp ==> ' + json?.message);

            if (status === 200) {
              // const json = response.json();
              console.log(' Register resp: ' + JSON.stringify(json));
              if (json.data.token != null) {
                var token = json.data.token;
                Token.storeToken(token);

                navi.navigate('tab', { screen: 'home' });
                console.log('store token' + token);

                const user = json.data.user;
                const id = user.id;

                //const currentTheme = user?.setting?.current_theme
                setScheme(CONSTANTS.UI.DEFAULT) /*'elegant'*/

                if (!CONSTANTS.IS_BACKGROUND_HIDE) {
                  setBg(CONSTANTS.BG_IMG.ELEGENT /*'ElegantBg'*/);
                }

                await AsyncStorageManager.storeData(CONSTANTS.USER_ID, id + '');
                await AsyncStorageManager.storeData(CONSTANTS.USER_EMAIL, email + '');
                await AsyncStorageManager.storeData(CONSTANTS.SIGN_IN_METHOD, 'password');
                Utils.setProfileUpdateShowOnce(false);
                await AsyncStorageManager.storeData(CONSTANTS.PROFILE_STATUS, 'not_completed');
              } else {
                // Utils.showAlertDialog('Registration Failed', json?.message);
                setErrorMsg(json?.message)
                setVisible2(true)
                // Utils.showAlertDialog('Registration Failed', '');
              }
            } else {
              // Utils.showAlertDialog('Registration Failed', json?.message);
              setErrorMsg(json?.message)
              setVisible2(true)
              // Utils.showAlertDialog('Registration Failed', '');
            }
            setLoading(false);

            console.log('Signup JSON ' + JSON.stringify(json));
          } catch (error) {
            console.error(error);
            console.log(error);
            Utils.showAlertDialog('Otp request Failed', error);
            setLoading(false);
          }
        });
    }
  };

  const socialLoginApi = async (
    providerId,
    providerName,
    email,
    username,
    token,
  ) => {
    //navi.dispatch(StackActions.replace('tab', {screen: 'home'}));
    setLoading(true);
    console.log(
      `providerId: ${providerId}, providerName: ${providerName}, email: ${email}, username: ${username}, token: ${token}`,
    );
    console.log('social login api: ' + API_URLS.SOCIAL_LOGIN);
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
      });
      const json = await response.json();
      if (response.status === 200) {
        console.log('Login Response: ' + JSON.stringify(json));
        const token = json.data.token;
        const user = json.data.user;
        const id = user.id;

        const setting = user?.setting;
        const currentThemeName = user?.setting?.current_theme; //UI
        const currentBgName = user?.setting?.background_value;
        const currentBgType = user?.setting?.background_type;
        const date_format = user?.setting?.date_format;

        AsyncStorageManager.storeData(CONSTANTS.SETTING, JSON.stringify(setting));
        AsyncStorageManager.storeData(CONSTANTS.DATE_FORMAT, date_format);

        // if (currentThemeName) {
        //   if (currentThemeName == 'Silver') {
        //     setScheme(CONSTANTS.THEME.HONEYCOMB /*'honeycomb'*/);
        //   } else if (currentThemeName == 'Light') {
        //     setScheme(CONSTANTS.THEME.LIGHT /*'light'*/);
        //   } else if (currentThemeName == 'RoseGold') {
        //     setScheme(CONSTANTS.THEME.ROSEGOLD /*'roseGold'*/);
        //   } else if (currentThemeName == 'Gold') {
        //     setScheme(CONSTANTS.THEME.GOLD /*'gold'*/);
        //   } else if (currentThemeName == 'Elegant') {
        //     setScheme(CONSTANTS.THEME.ELEGENT /*'elegant'*/);
        //   } else {
        //     setScheme(CONSTANTS.THEME.HONEYCOMB /*'honeycomb'*/);
        //   }
        // } else {
        //   setScheme(CONSTANTS.THEME.HONEYCOMB /*'honeycomb'*/);
        // }

        console.log("Current theme: " + currentThemeName);
        currentThemeName ? setScheme(currentThemeName) : setScheme(CONSTANTS.UI.ELEGENT)

        if (!CONSTANTS.IS_BACKGROUND_HIDE) {
          console.log("current Bg Name from api ==>", currentBgName);
          if (currentBgName && currentBgType) {
            setBg(currentBgName)
          } else {
            setBg(CONSTANTS.BG_IMG.ELEGENT /*'ElegantBg'*/);
          }
        }

        AsyncStorageManager.storeData(CONSTANTS.USER_ID, id + '');
        AsyncStorageManager.storeData(CONSTANTS.USER_EMAIL, email + '');

        AsyncStorageManager.storeData(CONSTANTS.SIGN_IN_METHOD, providerName + '');

        // const profileStatus = user.profile_status;
        // AsyncStorageManager.storeData(CONSTANTS.PROFILE_STATUS, profileStatus + '');
        console.log('ok==>');
        if (token != null) {
          gotToHome(token);
        }

        // console.log(json);
        setLoading(false);
      } else {
        console.log('Status: ' + response.status);
        console.log(json);
        const msg = json.message;

        Utils.showAlertDialog('SignIn failed ', JSON.stringify(msg));
        // const msg = json.message;
        // setVisible(true);
        // setErrorMsg(msg);
        setLoading(false);
      }
    } catch (error) {
      // console.error(error);
      // console.log(error);
      setLoading(false);
    }
  };

  const gotToHome = token => {
    Token.storeToken(token);

    setSignInProgress(true);
    setTimeout(() => {
      navi.navigate('tab', { screen: 'tab_home' });
      setSignInProgress(false);
    }, 1800);
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    }}>

      <KeyboardAvoidingView
        style={styles.top}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            // flexGrow: 1,
            justifyContent: 'center',
            paddingBottom: DIM.height * .1,
          }}
        >
          <>
            <LogoHeader
              extraStyles={{
                marginBottom: DIM.height * .02,
                // backgroundColor: 'red',
              }}
            />
            <View style={styles.page}>
              <View style={{ alignItems: 'center' }}>
                {/* {theme?.name == 'Light' && (
                <Image
                  source={require('../../assets/half_circle_p.png')}
                  resizeMode="stretch"
                  style={{ width: width }}
                />
              )} */}
                {/* <Image
              source={require('../../assets/half_circle_p.png')}
              resizeMode="stretch"
              style={{width: width}}
              /> */}
                {isAnimOn && (
                  <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                      ...styles.animation,
                      position: theme?.name == 'Light' ? 'absolute' : 'static',
                    }}
                    // style={styles.animation}
                    source={require('../../assets/sign_up_animation.json')}
                    loop
                  />
                )}
              </View>

              {/* <ThemeSelectorForTest /> */}
              <View>
                {/* Sign in */}
                {/* <Text style={{ ...styles.heading, color: theme?.colors?.text }}>
                SIGN UP
              </Text> */}

                {/* <Center p={4}>
              <Heading>Sign Up</Heading>
              </Center> */}

                <ModalPoup
                  theme={theme}
                  visible={visible2}
                  title={errorMsg}
                  source={require('../../assets/sign_in_animation.json')}
                  btnTxt={'Ok'}
                  onPressOk={() => {
                    setVisible2(false);
                  }}
                  onPressClose={() => {
                    setVisible2(false);
                  }}
                />

                <ModalInput
                  style={{ justifyContent: true, alignItems: true }}
                  visible={visible}
                  value={text}
                  onTextChange={onTextChange}
                  toggle={() => setVisible(!visible)}
                  onSubmit={() => setVisible(!visible)}
                />

                <VStack>
                  <FormControl>
                    <View style={{ paddingBottom: 32 }}>
                      <TextInput
                        placeholderTitle={'Full name'}
                        // icon={<EmailSVG />}
                        icon={theme?.profileIcon?.profile}
                        borderColor={theme?.textInput?.borderColor}
                        backgroundColor={theme?.textInput?.backgroundColor}
                        borderWidth={theme?.textInput?.borderWidth}
                        darkShadowColor={theme?.textInput?.darkShadowColor}
                        lightShadowColor={theme?.textInput?.lightShadowColor}
                        shadowOffset={theme?.textInput?.shadowOffset}
                        placeholderColor={theme?.textInput?.placeholderColor}
                        inputColor={theme?.textInput?.inputColor}
                        onChangeText={value => {
                          console.log('name==: ' + value);
                          setData({ ...formData, name: value });
                        }}
                        cursorColor={theme.colors.borderColor}
                      />
                    </View>
                    <View style={{ paddingBottom: 32 }}>
                      <TextInput
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
                        type='email'
                        onChangeText={value => {
                          console.log('email==: ' + value);
                          setData({ ...formData, email: value });
                        }}
                        cursorColor={theme.colors.borderColor}
                      />
                    </View>
                    <View style={{ paddingBottom: 32 }}>
                      <PasswordInput
                        placeholderTitle={'Password'}
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
                          console.log('password==: ' + value);
                          setData({ ...formData, pass: value });
                        }}
                        cursorColor={theme.colors.borderColor}
                      />
                    </View>
                    {/* <View style={{ paddingBottom: 20 }}>
                    <PasswordInput
                      placeholderTitle={'Confirm password'}
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
                        console.log('passwordConfirm==: ' + value);
                        setData({ ...formData, passConfirm: value });
                      }}
                    />
                  </View> */}
                  </FormControl>
                  {/* {isLoading ? (
                <ActivityIndicator style={{ backgroundColor: 'coolGray.600' }} />
              ) : null} */}
                  <CustomButton
                    title={'Sign up'}
                    isLoading={isLoading}
                    disabled={isLoading}
                    onPress={() => {
                      global.isSignedIn = true;
                      console.log('Press Sign Up Button');
                      console.log('Name: ' + formData.name);
                      console.log('Email: ' + formData.email);
                      console.log('Password: ' + formData.pass);
                      console.log('Password Confirm: ' + formData.passConfirm);

                      requestForSignUp(
                        formData.name,
                        formData.email,
                        formData.pass,
                        formData.passConfirm,
                      );
                    }}
                    color={theme?.colors?.btnText}
                    colors={theme?.colors?.colors}
                    bordered={true}
                    borderWidth={theme?.name == 'Light' ? 0 : 3}
                    borderColors={theme?.colors?.borderColors}
                    borderColor={theme?.colors?.borderColor}
                    shadow={theme?.name == 'Light'}
                  />

                  <Text
                    style={{
                      textAlign: 'center',
                      paddingTop: 32,
                      paddingBottom: 20,
                      color: theme?.name == 'Light' ? '#000000' : 'white',
                    }}>
                    {' '}
                    Or Continue With
                  </Text>

                  {/* <Center>
                <Text> Or Continue with</Text>
              </Center> */}

                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => onGoogleSignInPress()}>
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
                        <GoogleLogoSVG />
                      </Neomorph>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onAppleSignInPress()}
                    >
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
                  </View>
                  <HStack mt="6" justifyContent="center">
                    <Text
                      fontSize="sm"
                      // color="coolGray.600"
                      color={theme?.name == 'Light' ? '#000000' : 'white'}
                      _dark={{
                        color: 'warmGray.200',
                      }}>
                      {/* I'm already a user.{' '} */}
                      Already have an account?{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handlePress();
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: theme?.name == 'Light' ? '#000000' : 'white',
                        }}>
                        Sign In{' '}
                      </Text>

                    </TouchableOpacity>
                  </HStack>
                </VStack>
              </View>
            </View>
          </>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
};

export default ({ navigation }) => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);
  const authContext = useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NativeBaseProvider>
        <Center flex={1} px="3">
          <SignUpForm />
        </Center>
      </NativeBaseProvider>
    </AuthContext.Provider>
  );
};
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
    paddingBottom: 25,
  },
  top: { width: width },
  page: { alignItems: 'center', },
  animation: {
    width: 200,
    height: 200,
    backgroundColor: '#ffffff00',
    position: 'absolute',
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
});
