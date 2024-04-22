import { StackActions, useNavigation } from '@react-navigation/native';
import { React, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
//import RNFetchBlob from 'rn-fetch-blob';
import ReactNativeBlobUtil from 'react-native-blob-util';
//ReactNativeBlobUtil

import globalStyle from '../../styles/MainStyle.js';
import DocumentListHeader from '../components/global/DocumentListHeaderComponent.js';
//SVG
import DocDetails from '../../assets/docDetails.svg';
// import Drive from '../../assets/drive.svg';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../styles/ThemeProvider.js';
import Url from '../Api.js';
import AsyncStorageManager from '../class/AsyncStorageManager.js';
import Token from '../class/TokenManager.js';
import Utils from '../class/Utils.js';
import ThemeSelectorForTest from '../components/global/ThemeSelectorForTest.js';
import DocumentDetailsTab from './DocumentDetailsTab.js';
import ModalPopupConfirmation from '../components/global/ModalPopupConfirmation.js';
import ModalPoup from '../components/global/ModalPoupComponent.js';
import CONSTANTS from '../Constants.js';
const RNFS = require('react-native-fs');

export default function DocumentStatus(navigation) {
  const { theme } = useTheme();
  const { id, name } = navigation?.route?.params;
  // console.log("navigation==>", navigation?.route?.params)

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [isDownLoading, setIsDownLoading] = useState(false);
  const [isArchiveLoading, setIsArchiveLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [dateFormat, setDateFormat] = useState('dd/mm/yyyy');
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [userId, setUserId] = useState(null);
  const [isBioRequired, setBioRequired] = useState(false);
  const [isBiometricSupported, setBiometricSupport] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  //Use ui related variable
  const navi = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  //Functions
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
      var dateFormat = await AsyncStorageManager.getData(CONSTANTS.DATE_FORMAT /*'date_format'*/);
      setDateFormat(dateFormat);
      var timeFormat = await AsyncStorageManager.getData(CONSTANTS.TIME_FORMAT /*'time_format'*/);
      setTimeFormat(timeFormat)
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

  const makeArchive = async () => {
    // console.log('id==>',id);
    setIsArchiveLoading(true);

    var formDataN = new FormData();
    formDataN.append('id', id);

    try {
      var api = Url.NDA_ARCHIVE;
      fetch(api, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          // 'Content-Type': 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
        },
        body: formDataN,
        // body: JSON.stringify({ id: id }),
      })
        .then(response => response.json())
        .then(responseJson => {
          try {
            var a = JSON.stringify(responseJson);
            var json = JSON.parse(a);
            if (responseJson.status === 200) {
              setIsArchiveLoading(false);

              setIsSuccess(true);
              setModalShow(true);
              setModalMsg('NDA archived successfully');
              setShowArchiveModal(false);

              // Alert.alert('Success', `${json.message}`, [
              //   { text: 'OK', onPress: () => { } },
              // ]);
              // navi.navigate('document_list');
              console.log('Status==> ok');
            } else {
              console.log('Error==>', JSON.stringify(json));

              setIsSuccess(false);
              setModalShow(true);
              setModalMsg('NDA archive failed');

              // Alert.alert('Error', `${json.message}`, [
              //   { text: 'OK', onPress: () => { } },
              // ]);
              setIsArchiveLoading(false);
            }
          } catch (error) {
            console.error(error);
            console.log(error);
            setIsArchiveLoading(false);
          }
        })
        .catch(error => {
          console.error(error);
          setIsArchiveLoading(false);
        });
    } catch (error) {
      console.error(error);
      console.log(error);
      setIsArchiveLoading(false);
    }
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

  const downloadPDF = async () => {
    // Alert.alert('Download', `Coming soon`, [
    //   { text: 'OK', onPress: () => { } },
    // ]);
    // return

    //setIsDownLoading(true);

    const time = new Date().getTime();
    const url = Url.FILE_URL + data?.file_url; // Replace with the actual URL of the PDF file
    console.log('Download url: ' + url);
    //DownloadDirectoryPath
    const downloadDest = `${RNFS.DocumentDirectoryPath}/pdf-${time}.pdf`; // Save the PDF file to the device's download folder
    console.log('Downlload uri: ' + downloadDest);
    // try {
    //   RNFS.downloadFile({
    //     fromUrl: url,
    //     toFile: downloadDest,
    //     progress: res => {
    //       const progress = (res.bytesWritten / res.contentLength) * 100;
    //       console.log(`Progress: ${progress.toFixed(2)}%`);
    //     },
    //   }).promise.then(res => {
    //     setIsDownLoading(false);
    //     console.log('Downloaded file end');
    //   });
    // } catch (error) {
    //   console.log('Error downloading PDF:', error);
    //   setIsDownLoading(false);
    // }
    try {
      if (Platform.OS === 'ios') {
        const fileDir = ReactNativeBlobUtil.fs.dirs.CacheDir;
        const filePath = fileDir + `/pdf-${time}.pdf`;

        // ReactNativeBlobUtil.config({
        //   ios: {
        //     fileCache: true,
        //     //path: downloadDest,
        //     type: 'application/pdf',
        //     title: `pdf-${time}.pdf`,
        //     path: fileDir + `/pdf-${time}.pdf`,
        //   },
        // })
        //   .fetch('GET', url)
        //   .then(async resp => {
        //     // the path of downloaded file
        //     console.log('PDF downloaded');
        //     //console.log('downloaded PDF file path:' + resp.path());
        //     const filePath = fileDir + `/pdf-${time}.pdf`; //downloadDest + '/' + `pdf-${time}.pdf`; //resp.path();
        //     console.log('PDF downloaded: ' + filePath);
        //     //downloadDest+ '/' + `pdf-${time}.pdf`

        //     //await ReactNativeBlobUtil.fs.writeFile(fileDir, filePath, 'base64');
        //     // Not working
        //     ReactNativeBlobUtil.ios.previewDocument(filePath);
        //   });

        setIsDownLoading(true);
        RNFS.downloadFile({
          fromUrl: url,
          toFile: downloadDest,
          progress: res => {
            const progress = (res.bytesWritten / res.contentLength) * 100;
            console.log(`Progress: ${progress.toFixed(2)}%`);
          },
        }).promise.then(res => {
          setIsDownLoading(false);
          console.log('Downloaded file end');
          ReactNativeBlobUtil.ios.previewDocument(downloadDest);
          // await RNFS.readFile(filePath, 'base64').then(async contents => {
          //   await ReactNativeBlobUtil.fs.writeFile(fileDir, contents, 'base64');
          //   ReactNativeBlobUtil.ios.previewDocument(filePath);
          // });
        });
      } else if (Platform.OS === 'android') {
        ReactNativeBlobUtil.config({
          addAndroidDownloads: {
            useDownloadManager: true, // <-- this is the only thing required
            // Optional, override notification setting (default to true)
            notification: true,
            // Optional, but recommended since android DownloadManager will fail when
            // the url does not contains a file extension, by default the mime type will be text/plain
            mime: 'file/pdf', //'text/plain',
            title: `pdf-${time}.pdf`,
            //path: RNFS.DownloadDirectoryPath,
            description: 'Shush.',
          },
        })
          .fetch('GET', url)
          .then(resp => {
            // the path of downloaded file
            console.log('PDF downloaded');
            //console.log('downloaded PDF file path:' + resp.path());
            //resp.path();
          });
      }
    } catch (error) {
      console.log('Error downloading PDF:', error);
      setIsDownLoading(false);
    }
  };

  return (
    <ImageBackground
      source={theme?.bg?.bgImg}
      resizeMode="cover"
      style={styles.bgImage}
    >
      <SafeAreaView style={styles.container}>
        <DocumentListHeader
          onPress={handlePress}
          title={name}

          backIcon={theme?.header?.backIcon}
          statusBarColor={theme?.colors?.statusBarColor}
          dark={theme?.name == 'Light'}
          color={theme?.colors?.text}
        />

        {/* <ThemeSelectorForTest /> */}

        {/* <ScrollView // Category List
        horizontal={false}
        // style={styles.container}
        style={[
          styles.container,
          {
            paddingBottom: tabBarHeight + 100,
          },
        ]}
        showsHorizontalScrollIndicator={true}
      > */}
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
          <>
            <View style={{ padding: 24 }}>
              <View style={styles.topSec}>
                <View>
                  <Text style={{ ...styles.title, color: theme?.name == 'Light' ? '#2E476E' : theme?.colors?.text }}>{data?.nda_name}</Text>
                  <Text style={{ ...styles.date, color: theme?.name == 'Light' ? '#2E476E' : 'white' }}>
                    Created at :{' '}
                    {Utils.getDateFormat(data?.created_at, dateFormat, timeFormat)}
                  </Text>
                  <Text style={{ ...styles.date, color: theme?.name == 'Light' ? '#2E476E' : 'white' }}>
                    Last Modified :{' '}
                    {Utils.getDateFormat(data?.updated_at, dateFormat, timeFormat)}
                  </Text>
                </View>

                <DocDetails />
              </View>
            </View>

            <View style={styles.iconSec}>
              <TouchableOpacity
                color={'white'}
                style={theme?.name == 'Light' && styles.iconDiv}
                onPress={() => {

                  console.log('document url: ' + data.file_url);
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
                }}>
                {/* <Eye /> */}
                {theme?.nda?.eye}
              </TouchableOpacity>

              {(data?.status == 'completed' || data?.status == 'canceled') &&
                // <>
                //   {isArchiveLoading ? (
                //     <ActivityIndicator color={'white'} style={theme?.name == 'Light' && styles.iconDiv} />
                //   ) : (
                <TouchableOpacity
                  color={'white'}
                  style={theme?.name == 'Light' && styles.iconDiv}
                  onPress={() => {
                    // console.log('archive');
                    setShowArchiveModal(true);
                    // makeArchive();
                  }}>
                  {/* <Archive /> */}
                  {theme?.nda?.archive}
                </TouchableOpacity>
                //   )}
                // </>
              }

              {isDownLoading ? (
                <ActivityIndicator color={'white'} style={theme?.name == 'Light' && styles.iconDiv} />
              ) : (
                <TouchableOpacity
                  style={theme?.name == 'Light' && { ...styles.iconDiv, paddingStart: 4 }}
                  onPress={() => {
                    downloadPDF();
                  }}>
                  {/* <Download /> */}
                  {theme?.nda?.download}
                </TouchableOpacity>
              )}
            </View>

            <ModalPopupConfirmation
              showCustom={false}
              // customImg={formData?.avatar}
              visible={showArchiveModal}
              title={'Archive NDA'}
              msg={'Are you sure you want to archive this NDA?'}
              okText={'Archive'}
              cancelText={'Cancel'}
              isLoading={isArchiveLoading}
              onPressOk={makeArchive}
              theme={theme}
              onPressClose={() => {
                setShowArchiveModal(false)
              }}
            />

            <ModalPoup
              theme={theme}
              visible={modalShow}
              title={modalMsg}
              source={
                isSuccess
                  ? require('../../assets/done.json')
                  : require('../../assets/sign_in_animation.json')
              }
              btnTxt={'Ok'}
              onPressOk={() => {
                isSuccess ? navi.dispatch(StackActions.replace('document_list')) : setModalShow(false)
                // isSuccess ? navi.navigate('document_list') : setModalShow(false)
              }}
              onPressClose={() => setModalShow(false)}
            />

            <View style={{ marginBottom: '100%' }}>
              <DocumentDetailsTab data={{ ...data, userId: userId, token: token }} theme={theme} setRefetch={setRefetch} />
            </View>
          </>
        )}
        {/* </ScrollView> */}
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
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
