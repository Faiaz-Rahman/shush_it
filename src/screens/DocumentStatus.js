import { useNavigation } from '@react-navigation/native';
import { React, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../styles/MainStyle.js';
import DocumentListHeader from '../components/global/DocumentListHeaderComponent.js';
import { useTheme } from '../../styles/ThemeProvider.js';
import Url from '../Api.js';
import AsyncStorageManager from '../class/AsyncStorageManager.js';
import Token from '../class/TokenManager.js';
import CustomButton from '../components/global/ButtonComponent.js';
import CONSTANTS from '../Constants.js';


export default function DocumentStatus(navigation) {
  const navi = useNavigation();

  const { theme } = useTheme();
  const { id } = navigation?.route?.params;

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isBioRequired, setBioRequired] = useState(false);
  const [isBiometricSupported, setBiometricSupport] = useState(false);

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  const handlePress = () => {
    navi.goBack();
  };

  useEffect(() => {
    async function getAsyncData() {
      var isBioReq = await AsyncStorageManager.getData(CONSTANTS.IS_BIO_REQUIRED /*'is_bio_required'*/);
      console.log('Previous settings: ' + isBioReq);
      var isBioBool = isBioReq === 'YES' ? true : false;
      console.log('Previous settings: ' + isBioBool);
      setBioRequired(isBioBool);
      getBiometricIsSupported();

      console.log('Current settings: ' + isBioRequired);
    }
    getAsyncData();

    const asyncFunc = async () => {
      let user_id = await AsyncStorageManager.getData(CONSTANTS.USER_ID /*'user_id'*/);
      setUserId(user_id);

      let userToken = await Token.getToken();
      if (userToken) {
        setToken(userToken);
        getData(userToken);
      } else {
        console.log('Token not found');
        return false;
      }
    };
    asyncFunc();
  }, [id, refetch]);

  const getBiometricIsSupported = async () => {
    //const rnBiometrics = new ReactNativeBiometrics();
    if (rnBiometrics === null) {
      return;
    }

    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    console.log('Biometric type: ' + biometryType);
    if (available && biometryType === BiometryTypes.TouchID) {
      //ios only
      console.log('TouchID is supported');
      // rnBiometrics.createKeys().then(resultObject => {
      //   const {publicKey} = resultObject;
      //   console.log('Public key: ' + publicKey);
      //   //sendPublicKeyToServer(publicKey);
      // });
      setBiometricSupport(true);
    } else if (available && biometryType === BiometryTypes.FaceID) {
      //ios only
      console.log('FaceID is supported');
      setBiometricSupport(true);
    } else if (available && biometryType === BiometryTypes.Biometrics) {
      //Android only
      console.log('Biometrics is supported');
      setBiometricSupport(true);
    } else {
      console.log('Biometrics not supported');
      setBiometricSupport(false);
    }
  };

  const getData = async token => {
    setIsLoading(true);
    var api = Url.NDA_LIST + '/' + id;
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
          var a = JSON.stringify(responseJson);
          var json = JSON.parse(a);
          if (responseJson.status === 200) {
            var data = json.data;
            setIsLoading(false);
            setData(data);
            console.log('status==>', data?.status);
            console.log('Status ==> ok');
          } else {
            console.log('State list error: ' + JSON.stringify(json));
            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
          console.log(error);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };


  const getVerifyBiometric = async () => {
    if (isBiometricSupported) {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirmation',
      });
      if (success) {
        navi.navigate('nda_pdf_preview', {
          id: data.id,
          name: data.nda_name,
          link: data.file_url,
        });
      }
    }
  };

  return (
    <ImageBackground
      source={theme?.bg?.bgImg}
      resizeMode="cover"
      style={styles.bgImage}
    >
      {/* <View style={{ flex: 1, backgroundColor: 'red', }}> */}
      <SafeAreaView style={styles.container}>
        <DocumentListHeader
          onPress={handlePress}
          title={'Shush It'}

          backIcon={theme?.header?.backIcon}
          statusBarColor={theme?.colors?.statusBarColor}
          dark={theme?.name == 'Light'}
          color={theme?.colors?.text}
        />

        {/* <ThemeSelectorForTest /> */}
        {isLoading ? (
          <ActivityIndicator
            color={
              theme?.name != 'Light'
                ? theme?.colors?.text
                : globalStyle.colorAccent
            }
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              height: 540,
            }}
          />
        ) : (
          <ScrollView // Category List
            horizontal={false}
            // style={styles.categoryListContainer}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 70 }}
            showsHorizontalScrollIndicator={true}
          >
            <View style={styles.btnDivContainer}>
              <View style={styles.buttonContainer}>
                <CustomButton
                  title={'VIEW'}
                  onPress={() => {

                    // console.log('document url: ' + data.file_url);
                    if (!isBioRequired) {
                      navi.navigate('nda_pdf_preview', {
                        id: data.id,
                        name: data.nda_name,
                        link: data.file_url,
                      });
                    } else {
                      console.log('Biometric is required');
                      getVerifyBiometric();
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

              {((data?.status == "pending" && userId != data?.sender_id) || data?.status == "draft") &&
                <View style={styles.buttonContainer}>
                  <CustomButton
                    title={data?.status == "pending" ? 'SIGN & SEND' : 'EDIT'}
                    onPress={() => {
                      data?.status == 'draft' ?
                        // navi.navigate('create_nda_receiver_info', {
                        //   receiver_name: data?.receiver_name,
                        //   receiver_email: data?.receiver_email,
                        //   receiver_phone_number: data?.receiver_phone_number,
                        //   receiver_company_name: data?.receiver_company_name,
                        //   receiver_address: data?.receiver_address,
                        //   receiver_city: data?.receiver_city,
                        //   receiver_state_id: data?.receiver_state,
                        //   receiver_postal_code: data?.receiver_postal_code,


                        // },)
                        console.log("create_nda_receiver_info")
                        :
                        // console.log("SIGN & SEND functionality");
                        navi.navigate('create_nda_signing_success', {
                          type: 'receiver',
                          isDraft: false,
                        });
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
              }
            </View>

            {/* <ThemeSelectorForTest /> */}

          </ScrollView>
        )}
        {/* </ScrollView> */}
      </SafeAreaView>
    </ImageBackground>
    // </View>
  );
}
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
  btnDivContainer: {
    paddingHorizontal: 25,
  },
  buttonContainer: {
    width: '100%',
    paddingVertical: 15,
  },
  container: {
    flex: 1,
    // backgroundColor: globalStyle.statusBarColor,
  },
  title: {
    // color: '#2E476E',
    fontSize: 15,
    fontWeight: 600,
  },
  date: {
    // color: '#2E476E',
    fontSize: 10,
    fontWeight: 300,
    marginTop: 7,
  },
  topSec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconSec: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 50,
  },
  iconDiv: {
    backgroundColor: '#3D50DF',
    height: 40,
    width: 40,
    borderRadius: 50,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 'auto',
    // marginBottom: 'auto',
    // marginLeft: 'auto',
    // marginRight: 'auto',
  },
  icon: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
