import { useNavigation } from '@react-navigation/native';
import { Actionsheet, Button, useDisclose } from 'native-base';
import { React, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Platform,
  ScrollView,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const RNFS = require('react-native-fs');
//import {ScrollView} from 'react-native-virtualized-view';
// import Pdf from 'react-native-pdf';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import Moment, { updateLocale } from 'moment';

//Image Resource
//Assets
// import DateSvg from '../../assets/date.svg';
// import Signature from '../../assets/signature.svg';
// //import Signing from '../../assets/signing.svg';
// import Draggable from '../components/global/DragableComponent.js';

//Variables
//Class
import Token from '../class/TokenManager.js';
import PdfEditor from '../class/PdfEditor';
import Utils from '../class/Utils.js';
import CustomButton from '../components/global/ButtonComponent.js';
import ModalPoupSingle from '../components/global/ModalPoupComponent';
import API_URLS from '../Api.js';

//Style
import globalStyle from '../../styles/MainStyle.js';
//API
import Url from '../Api.js';
import { get, post } from '../class/ApiManager.js';
//import { create } from 'react-test-renderer';
import { useTheme } from '../../styles/ThemeProvider';
//import ThemeSelectorForTest from '../components/global/ThemeSelectorForTest';
import ModalPoup from '../components/global/ModalPoupComponent';
import CONSTANTS from '../Constants.js';
import CreateNdaSuccess from './CreateNdaSuccess.js';

//import StepsComponent from '../components/global/StepsComponent';

export default function CreateNdaSigning(navigation) {
  const { theme } = useTheme();

  const navi = useNavigation();

  var isDraft = false;

  const [signingStatus, setSigningStatus] = useState('');
  const [isSenderSigned, setIsSenderSigned] = useState(false);
  const [isReceiverSigned, setIsReceiverSigned] = useState(false);

  // const [isSignInProgress, setSignInProgress] = useState(false);
  const [createdPdf, setCreatedPdf] = useState(null);
  const [isSuccess, setSuccess] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerKey, setDatePickerKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [btnLoad, setBtnLoad] = useState(false); //Sign and send
  const [btnLoad2, setBtnLoad2] = useState(false); //Draft 
  const [loaderForLottieInfo, setLoaderForLottieInfo] = useState({
    load: false,
    type: 'sender',
    status: 'pending',
  }); //Draft 

  const [showDraftBtn, setShowDraftBtn] = useState(true);
  const [showSignNSendBtn, setshowSignNSendBtn] = useState(true);

  const [myProfileForm, setMyProfileData] = useState({});

  //Get Signature modal from screen
  const [isTakeSig, setIsTakeSig] = useState(false);
  const [savedSignature, setSignature] = useState(null);

  //Signature on pdf
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [dateFormat, setDateFormat] = useState('dd/mm/yyyy');

  const [isVisibleSignWarning, setSignWarning] = useState(false);

  const isShowReceiverSignBtn = false;

  // var isTakeSig = false;

  // const setIsTakeSig = value => {
  //   isTakeSig = value;
  // };

  //const insets = useSafeAreaInsets();

  const [modalShow, setModalShow] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  //Sample file download
  const [filePath, setFilePath] = useState(
    `${RNFS.DocumentDirectoryPath}/react-native.pdf`,
  );

  const [signaturePath, setSignaturePath] = useState(
    `${RNFS.DocumentDirectoryPath}/signature.png`,
  );

  const [fileDownloaded, setFileDownloaded] = useState(false); //Default false

  const {
    id,
    document_name,
    type,
    data,

    isEdit,
    status,
    displayAs,
    fileUrl,

    receiver_name,
    receiver_email,
    receiver_phone_number,
    receiver_address,
    receiver_city,
    receiver_state_id,
    receiver_country_code,
    receiver_postal_code,
  } = navigation.route.params;

  console.log("navigation.route.params createNDASignin================================", navigation.route.params)

  useEffect(() => {
    console.log('Create NDA Sign UseEffect');
    const asyncFunc = async () => {
      let userToken = await Token.getToken();
      if (userToken) {
        buttonState(displayAs, status);

        setLoaderForLottieInfo({
          ...loaderForLottieInfo,
          type: displayAs,
          status: status,
        })

        getProfileInfo(userToken);
      } else {
        console.log('Token not found');
        return false;
      }
    };

    asyncFunc();
  }, [status, displayAs]);

  const buttonState = async (displayAs, status) => {
    if (displayAs === 'receiver') {

      if (status === 'completed') {
        setshowSignNSendBtn(false);
        setShowDraftBtn(false);
        //Only View button will show
      } else if (status === 'pending') {
        setShowDraftBtn(false);
        setshowSignNSendBtn(true);
        //view and sign and send btn show
      }

    } else if (displayAs === 'sender') {

      if (status === 'completed') {
        setshowSignNSendBtn(false);
        setShowDraftBtn(false);
      } else if (status === 'draft') {
        setshowSignNSendBtn(true);
        setShowDraftBtn(false);
      } else if (status == 'pending') {
        if (isEdit) {
          setShowDraftBtn(true);
          setshowSignNSendBtn(true);
        } else {
          setShowDraftBtn(false);
          setshowSignNSendBtn(false);
        }
      }
    }
  }

  //Get Profile data sender info + signature
  const getProfileInfo = async token => {

    var profileApi_ = API_URLS.PROFILE_;
    get(profileApi_)
      .then(data => {

        try {
          console.log("-Profile-" + JSON.stringify(data))
          var a = JSON.stringify(data);
          var json = JSON.parse(a);

          var profileInfo = json.data;
          console.log("profileInfo==>", profileInfo)

          RNFS.downloadFile({
            fromUrl: Url.FILE_URL + profileInfo.signature,
            toFile: signaturePath,
            //background: true, // Enable downloading in the background (iOS only)
            //discretionary: true, // Allow the OS to control the timing and speed (iOS only)
            progress: res => {
              // Handle download progress updates if needed
              const progress = (res.bytesWritten / res.contentLength) * 100;
              console.log(`Signature Progress: ${progress.toFixed(2)}%`);
            },
          }).promise.then(async res => {
            console.log('Signature Downloaded file end');

            setIsLoading(false);
          });

          setMyProfileData(profileInfo);

        } catch (error) {
          console.log(error);
          console.log("Couldnot load signature");
          setIsLoading(false);
        }
      })
      .catch(error => {
        //console.error("Error got: " + error)
        console.log(error);
        setIsLoading(false);
      }
      );
    // var profileApi = Url.PROFILE;
    // await fetch(profileApi, {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
    //   },
    // })
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     try {
    //       var a = JSON.stringify(responseJson);
    //       var json = JSON.parse(a);
    //       if (responseJson.status === 200) {
    //         var profileInfo = json.data;
    //         console.log("profileInfo==>", profileInfo)

    //         RNFS.downloadFile({
    //           fromUrl: Url.FILE_URL + profileInfo.signature,
    //           toFile: signaturePath,
    //           //background: true, // Enable downloading in the background (iOS only)
    //           //discretionary: true, // Allow the OS to control the timing and speed (iOS only)
    //           progress: res => {
    //             // Handle download progress updates if needed
    //             const progress = (res.bytesWritten / res.contentLength) * 100;
    //             // if (progress >= 100) {
    //             //   setIsLoad(false)
    //             // }
    //             console.log(`Signature Progress: ${progress.toFixed(2)}%`);
    //           },
    //         }).promise.then(async res => {
    //           console.log('Signature Downloaded file end');
    //           //setFileDownloaded(true);
    //           //Read
    //           //await readFile();
    //           // navi.navigate('create_nda_acceptance');
    //           // setIsLoad(false);

    //         });

    //         setMyProfileData(profileInfo);
    //       } else {
    //         console.log('Error:==>' + JSON.stringify(json));
    //       }
    //       setIsLoading(false);
    //       //Download file
    //       //downloadFile('/nda_formats/8f71910d-d784-40e9-8e38-6ba54e21f227.pdf');
    //     } catch (error) {
    //       console.error(error);
    //       console.log(error);
    //       setIsLoading(false);
    //     }
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     setIsLoading(false);
    //   });
  };

  const { isOpen, onOpen, onClose } = useDisclose();

  const handlePressBackBtn = () => {
    navi.goBack();
  };

  const saveNdaAsDraft = async (link, status) => {
    await downloadFile(link, status, 'sender', 'draft');
  }

  const signAndSendNda = async (link, status, asSenderOrReceiver) => {
    await downloadFile(link, status, asSenderOrReceiver, 'send');
  }

  const showLoading = (draftOrsend, isEnable) => {
    switch (draftOrsend) {
      case 'draft':
        setBtnLoad2(isEnable);
        break;
      case 'send':
        setBtnLoad(isEnable);
        break;
    }
  }
  //Download sample pdf
  //Sample or predefine file download
  const downloadFile = async (link, status, asSenderOrReceiver, draftOrsend) => {
    showLoading(draftOrsend, true);

    if (!fileDownloaded) {
      console.log('Downloaded file start');
      console.log('Downloaded file url end: ' + link);
      console.log('Downloaded file url: ' + Url.FILE_URL + link);

      RNFS.downloadFile({
        fromUrl: Url.FILE_URL + link,
        toFile: filePath,
        //background: true, // Enable downloading in the background (iOS only)
        //discretionary: true, // Allow the OS to control the timing and speed (iOS only)
        progress: res => {
          // Handle download progress updates if needed
          const progress = (res.bytesWritten / res.contentLength) * 100;
          // if (progress >= 100) {
          //   setIsLoad(false)
          // }
          console.log(`Progress: ${progress.toFixed(2)}%`);
        },
      }).promise.then(async res => {
        console.log('Downloaded file end');
        setFileDownloaded(true);
        //Read
        //await readFile();
        // navi.navigate('create_nda_acceptance');
        // setIsLoad(false);
        //setIsLoading(false);

        showLoading(draftOrsend, false);
        //setBtnLoad2(false);

        getPdf(filePath, status, draftOrsend);
      });
    }
  };

  //Combined pdf
  const getPdf = async (filePath_, status, draftOrsend) => {
    var signature;
    await RNFS.readFile(signaturePath, 'base64')
      .then(res => {
        //console.log('Signature_', res);
        signature = res;
      });

    CONSTANTS.NDA_STATUS.COMPLETED
    if (status == 'receiver') {
      //setIsLoading(true);
      showLoading(draftOrsend, true);
      //var x_val = x; //400; //x
      //var y_val = y; //660; //y
      //var page_ = page;
      await PdfEditor.signOnPdf(
        filePath_, //createdPdf,
        'receiver',
        signature,
        (isSuccess, signedPdf) => {
          if (isSuccess) {
            setCreatedPdf(signedPdf);
            console.log('Signed Nda path ' + signedPdf);

            signedNda(signedPdf, draftOrsend);
          } else {
            console.log('Signed pdf failed ');
          }
          //setIsLoading(false);
          showLoading(draftOrsend, false);
        },
      ).then(value => {
        console.log('Pdf Signed done');
        //Visible Right side button
        setSigningStatus('your_signature');
        //setIsLoading(false);
        showLoading(draftOrsend, false);
      });

    } else {
      //setIsLoading(true);
      showLoading(draftOrsend, true);
      await PdfEditor.getCombinedPdf(
        filePath_,

        myProfileForm.full_name,
        myProfileForm.email,
        myProfileForm.address,
        myProfileForm.city + ', ' + myProfileForm.state_id + ', ' + myProfileForm.country_code + ', ' + myProfileForm.postal_code,

        receiver_name,
        receiver_email,
        receiver_address,
        receiver_city + ', ' + receiver_state_id + ', ' + receiver_country_code + ', ' + receiver_postal_code,

        type,
        signature,
        (isSuccess, signedPdf) => {
          setCreatedPdf(signedPdf);
          console.log('CreateNdaSigning source: ' + signedPdf);
          //setIsLoading(false);
          showLoading(draftOrsend, false);
          createNda(status, signedPdf, draftOrsend);
        },
      )
        .then(value => {
          console.log('Done done: ');
          //setIsLoading(false);
          showLoading(draftOrsend, false);
        })
        .catch(error => {
          console.error('Error:', error);
          //setIsLoading(false);
          showLoading(draftOrsend, false);
        });
    }
  };

  //Sender Create nda
  const createNda = async (status, createdPdf, draftOrsend) => {
    if (status === 'pending') {
      setBtnLoad(true);
    } else {
      setBtnLoad2(true);
    }

    console.log('create nda current status : ' + status);

    //Send data to draft
    if (status === 'draft') {
      isDraft = true;
      // setIsDraft(true)
    } else {
      isDraft = false;
      // setIsDraft(false)
    }

    var formDataN = new FormData();
    //Nda Name and status

    formDataN.append('nda_name', myProfileForm?.full_name + '_' + receiver_name + '_' + Date.now());
    // formDataN.append('nda_name', document_name);


    var api = Url.NDA_CREATE;

    if (id && status === 'draft') {
      formDataN.append('_method', 'PUT');
      api = Url.NDA_CREATE + '/' + id;
    } else if (id && status === 'pending') {
      formDataN.append('_method', 'PUT');
      api = Url.NDA_CREATE + '/' + id;
    }
    //If already drafted
    if (draftOrsend === 'draft') {
      //formDataN.append('_method', 'PUT');
      formDataN.append('status', status);
    } else {
      //formDataN.append('_method', 'PUT');
      formDataN.append('status', 'pending');
    }

    //Sender
    const sender_name = myProfileForm.full_name
    const sender_email = myProfileForm.email
    const sender_phone_number = myProfileForm.phone_number
    //const sender_company_name= myProfileForm.company_name
    const sender_address = myProfileForm.address
    const sender_city = myProfileForm.city
    const sender_state_id = myProfileForm.state_id
    const sender_country_code = myProfileForm.country_code
    const sender_postal_code = myProfileForm.postal_code

    //Nda sender
    formDataN.append('sender_name', sender_name ?? '');
    formDataN.append('sender_email', sender_email ?? '');
    formDataN.append('sender_phone_number', sender_phone_number ?? '');
    // formDataN.append('sender_company_name', sender_company_name);
    formDataN.append('sender_address', sender_address ?? '');
    formDataN.append('sender_city', sender_city ?? '');
    formDataN.append('sender_state', sender_state_id ?? '');
    formDataN.append('sender_country', sender_country_code ?? '');
    formDataN.append('sender_postal_code', sender_postal_code ?? '');
    //formDataN.append('sender_country', sender_country ?? '');

    //Nda Receiver
    formDataN.append('receiver_name', receiver_name ?? '');
    formDataN.append('receiver_email', receiver_email ?? '');
    formDataN.append('receiver_phone_number', receiver_phone_number ?? '');
    // formDataN.append('receiver_company_name', receiver_company_name);
    formDataN.append('receiver_address', receiver_address ?? '');
    formDataN.append('receiver_city', receiver_city ?? '');
    formDataN.append('receiver_state', receiver_state_id ?? '');
    formDataN.append('receiver_country', receiver_country_code ?? '');
    formDataN.append('receiver_postal_code', receiver_postal_code ?? '');

    // console.log("formDataN==>", formDataN)
    // return
    //File
    //formDataN.append('file_url', createdPdf);

    // Append the PDF file
    const pdfFile = {
      uri: Platform.OS === 'android' ? 'file://' + createdPdf : createdPdf, // Replace with the actual path of the PDF file
      name: 'file.pdf', // Replace with the desired file name
      type: 'application/pdf',
    };
    formDataN.append('file_url', pdfFile);

    console.log("API: " + JSON.stringify(formDataN));

    let userToken = await Token.getToken();
    if (userToken) {
      postNda(userToken, api, formDataN, draftOrsend);
    } else {
      console.log('Token not found in Create Nda SignIn ');
    }
  };

  //Receiver
  const signedNda = async (createdPdf, draftOrsend) => {
    //setBtnLoad(true);
    showLoading(draftOrsend, true);

    var formDataN = new FormData();
    //Nda Name and status
    formDataN.append('id', id);
    formDataN.append('nda_name', document_name);

    // Append the PDF file
    const pdfFile = {
      uri: Platform.OS === 'android' ? 'file://' + createdPdf : createdPdf, // Replace with the actual path of the PDF file
      name: 'file.pdf', // Replace with the desired file name
      type: 'application/pdf',
    };
    formDataN.append('file_url', pdfFile);
    var api = Url.NDA_SIGNED; //Receiver
    let userToken = await Token.getToken();
    if (userToken) {
      postNda(userToken, api, formDataN, draftOrsend);
    } else {
      console.log('Token not found in Create Nda SignIn ');
    }
  };

  //Post to API
  const postNda = async (userToken, api, formData, draftOrsend) => {
    console.log('called ==> ====>', formData);
    // setBtnLoad(false);
    // setBtnLoad2(false);
    // return
    // console.log('post nda created token ' + userToken);
    //Service to get the data from the server to render

    //howLoading(draftOrsend, false);

    if (!btnLoad && !btnLoad2) {
      console.log('Post NDA: ' + api);
      await fetch(api, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          //'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
          //'Content-Type': 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`, // notice the Bearer before your token
        },
        body: formData,
      })
        //Sending the currect offset with get request
        .then(async response => await response.json())
        .then(async responseJson => {
          //Increasing the offset for the next API call
          try {
            var a = JSON.stringify(responseJson);
            var json = JSON.parse(a);
            console.log(
              'NDA Create post api response:  ' + JSON.stringify(json),
            );

            if (responseJson !== null && responseJson.status === 200) {
              //console.log('NDA List:  ' + JSON.stringify(json));
              // onSendNdaBtnPress();
              console.log('isDraft==>', isDraft);
              // navi.navigate('create_nda_signing_success', {
              //   type: type,
              //   isDraft: isDraft,
              // });
              onClose();
              // Alert.alert('Success', `${json.message}`, [
              //   { text: 'Cancel', onPress: () => { console.log("Cancel click") } },
              //   { text: 'Ok', onPress: () => { navi.navigate('tab_home', { screen: 'home' }) } },
              // ]);
            } else {
              console.log('NDA Create post status: ' + json);
              setModalShow(true)
              setModalMsg(json.message)
              setLoaderForLottieInfo({
                ...loaderForLottieInfo,
                load: false,
              })
              // Alert.alert('Error', `${json?.message}`, [
              //   { text: 'OK', onPress: () => { } },
              // ]);
            }
            setBtnLoad(false);
            setBtnLoad2(false);
          } catch (error) {
            console.error(error);
            console.log(error);
            setBtnLoad(false);
            setBtnLoad2(false);
            // setLoaderForLottieInfo({
            //   ...loaderForLottieInfo,
            //   load: false,
            // })
          }
          setBtnLoad(false);
          setBtnLoad2(false);
          // setLoaderForLottieInfo({
          //   ...loaderForLottieInfo,
          //   load: false,
          // })
        })
        .catch(error => {
          console.error(error);
          setBtnLoad(false);
          setBtnLoad2(false);
          // setLoaderForLottieInfo({
          //   ...loaderForLottieInfo,
          //   load: false,
          // })
        })
        .finally(() => { });
    }
  };


  //############ unused functions##########################

  // const onSendNdaBtnPress = () => {
  //   setSignInProgress(true);
  //   setTimeout(() => {
  //     setSuccess(true);
  //     setSignInProgress(false);
  //   }, 2000);
  // };

  //Sign on pdf
  const handleSingleTap = async (signatureBase64, pdfDataUri) => {
    console.log(' handle Signle Tap: ' + type + ' ' + createdPdf);
    setIsLoading(true);
    //var x_val = x; //400; //x
    //var y_val = y; //660; //y
    //var page_ = page;
    await PdfEditor.signOnPdf(
      pdfDataUri, //createdPdf,
      type,
      signatureBase64,
      (isSuccess, signedPdf) => {
        if (isSuccess) {
          setCreatedPdf(signedPdf);
          console.log('Signed Nda path ' + signedPdf);
          if (type === 'sender') {
            setIsSenderSigned(true);
          } else {
            setIsReceiverSigned(true);
          }
        } else {
          console.log('Signed pdf failed ');
        }
        setIsLoading(false);
      },
    ).then(value => {
      console.log('Pdf Signed done');
      //Visible Right side button
      setSigningStatus('your_signature');
      setIsLoading(false);
    });
  };

  // //Get Signature
  // const getSignature = async (pdfDataUri) => {

  //   var signature;
  //   await RNFS.readFile(signaturePath, 'base64')
  //     .then(res => {
  //       //console.log('Signature_', res);
  //       signature = res;
  //     });

  //   //console.log('signature==>', signature);
  //   //setSignatureBase64(signature.replace('data:image/png;base64,', ''));

  //   //setSignature(signature);

  //   // var sign = await signature.replace('data:image/png;base64,', '');
  //   // await handleSingleTap(sign);

  //   //var sign = await signature.replace('data:image/png;base64,', '');


  //   await handleSingleTap(signature, pdfDataUri);

  //   setIsTakeSig(false);
  //   //await handleSingleTap(signature);
  //   //handleSingleTap(isSignatureLoaded, sign);
  // };

  // const delayIt = () => {
  //   setSuccess(true);
  //   setSignInProgress(false);
  // };

  // const onBtnPress = () => {
  //   navi.navigate('tab_home', { screen: 'home' });
  // };
  // const showStartDatePicker = () => {
  //   setDatePickerKey('start_time');
  //   setDatePickerVisibility(true);
  // };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setDatePickerKey('');
  };

  // const handleConfirm = async date => {
  //   var dateFormat = await AsyncStorageManager.getData('date_format');
  //   setDateFormat(dateFormat);

  //   var formattedDate = Utils.getDateFormat(date, dateFormat);
  //   Moment.locale('en');
  //   //2023-09-07 12:06:43
  //   //var formattedDate = Moment(date).format('YYYY-MM-DD H:mm:ss');

  //   console.log('A date has been picked: ', formattedDate);
  //   if (datePickerKey === 'start_time') {
  //     //setData({...formData, start_time: formattedDate}); //start_time // end_time
  //   } else if (datePickerKey === 'end_time') {
  //     //setData({...formData, end_time: formattedDate});
  //   }
  //   hideDatePicker();

  //   setIsLoading(true);
  //   //var x_val = x; //400; //x
  //   //var y_val = y; //660; //y
  //   //var page_ = page;
  //   await PdfEditor.putDateOnPdf(
  //     createdPdf,
  //     type,
  //     formattedDate,
  //     (isSuccess, signedPdf) => {
  //       if (isSuccess) {
  //         setCreatedPdf(signedPdf);
  //         console.log('Date added Nda path ' + signedPdf);
  //         // if (type === 'sender') {
  //         //   setIsSenderSigned(true);
  //         // } else {
  //         //   setIsReceiverSigned(true);
  //         // }
  //       } else {
  //         console.log('Date add on pdf failed ');
  //       }
  //       setIsLoading(false);
  //     },
  //   ).then(value => {
  //     console.log('Pdf date add done');
  //     //Visible Right side button
  //     setSigningStatus('your_signature');
  //     setIsLoading(false);
  //   });
  // };

  // const handlePressRightNextBtn = () => {
  //   // signingStatus === 'your_signature' ||
  //   // signingStatus === 'receiver_signature' ||
  //   // signingStatus === 'show_bottom_sheet'
  //   // if (
  //   //   signingStatus === 'receiver_signature' ||
  //   //   signingStatus === 'show_bottom_sheet'
  //   // ) {
  //   //   setSigningStatus('show_bottom_sheet');
  //   //   onOpen();
  //   // } else {
  //   //   setSigningStatus('next_receiver_signature');
  //   // }
  //   var isSendNDA = false;
  //   if (type === 'sender') {
  //     isSendNDA = isSenderSigned;
  //   } else {
  //     isSendNDA = isReceiverSigned;
  //   }
  //   setSigningStatus('show_bottom_sheet');
  //   if (isSendNDA) {
  //     onOpen();
  //   } else {
  //     console.log('Please put your signature');
  //     setSignWarning(true);
  //   }
  // };
  const onBackClick = () => {
    setIsTakeSig(false);
    console.log('On back press');
  };


  return (
    <>
      {
        loaderForLottieInfo?.load ?
          <CreateNdaSuccess
            type={loaderForLottieInfo?.type}
            isDraft={loaderForLottieInfo?.status == 'draft'}
          />
          :
          // <ImageBackground
          //   source={theme?.bg?.bgImg}
          //   resizeMode="cover"
          //   style={styles.bgImage}
          // >
          <View style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}>
            <SafeAreaView style={styles.container}>
              {/* <DocumentListHeader
          onPress={handlePressBackBtn}
          title={'Shush It'}
          isRightBtn={true}
          // isRightBtn={isLoading ? false : true}
          // onPressRight={handlePressRightNextBtn}
          // rightIcon={theme?.header?.checkIcon}

          backIcon={theme?.header?.backIcon}
          statusBarColor={theme?.colors?.statusBarColor}
          dark={theme?.name == 'Light'}
          color={theme?.colors?.text}
        /> */}

              {/* <View style={{ marginTop: 15, zIndex: 1, }}>
          <StepsComponent active={3} theme={theme} />
        </View> */}

              {/* <ThemeSelectorForTest /> */}

              <ModalPoupSingle
                theme={theme}
                visible={isVisibleSignWarning}
                title={
                  'Please place your signature'
                }
                source={require('../../assets/warning.json')}
                btnTxt={'Ok'}
                onPressOk={() => {
                  setSignWarning(false);
                }}
                onPressClose={() => setSignWarning(false)}
              />

              {isLoading ? (
                <ActivityIndicator
                  color={theme?.name == 'Light' ? globalStyle.colorAccent : theme?.colors?.text}
                  style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    height: Dimensions.get('window').height * 0.88,
                  }}
                />
              ) :
                (
                  <View style={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 70 }}>

                    <View style={{ marginBottom: 30 }}>
                      <TouchableOpacity
                        style={{ marginStart: 40 }}
                        // style={{ position: 'absolute', left: 30, zIndex: 100 }}
                        onPress={handlePressBackBtn}
                      >
                        {theme?.header?.backIcon}
                      </TouchableOpacity>
                      {/* <Text style={{ ...styles.title, color: theme?.colors?.text }}>Shush It</Text> */}
                    </View>

                    <View style={styles.buttonContainer}>
                      <CustomButton
                        title={'VIEW'}
                        color={theme?.colors?.btnText}
                        colors={theme?.colors?.colors}
                        bordered={true}
                        borderWidth={theme?.name === 'Light' ? 0 : 3}
                        borderColor={theme?.colors?.borderColor}
                        borderColors={theme?.colors?.borderColors}
                        shadow={theme?.name === 'Light'}
                        disabled={btnLoad || btnLoad2}

                        onPress={() => {
                          navi.navigate('nda_pdf_preview', {
                            id: 1,
                            name: receiver_name,
                            link: fileUrl === null || fileUrl === undefined ? '/nda_formats/8f71910d-d784-40e9-8e38-6ba54e21f227.pdf' : fileUrl,
                          });
                        }}
                      />
                    </View>

                    {showDraftBtn ? (
                      <View style={styles.buttonContainer}>
                        <CustomButton
                          title={'SAVE AS DRAFT'}
                          isLoading={btnLoad2}
                          color={theme?.colors?.btnText}
                          colors={theme?.colors?.colors}
                          bordered={true}
                          borderWidth={theme?.name == 'Light' ? 0 : 3}
                          borderColor={theme?.colors?.borderColor}
                          borderColors={theme?.colors?.borderColors}
                          shadow={theme?.name == 'Light'}
                          disabled={btnLoad || btnLoad2}

                          onPress={() => {
                            saveNdaAsDraft('/nda_formats/8f71910d-d784-40e9-8e38-6ba54e21f227.pdf', 'draft');
                            setLoaderForLottieInfo({
                              ...loaderForLottieInfo,
                              load: true,
                              status: 'draft',
                              type: 'sender',
                            })
                          }}
                        />
                      </View>
                    ) : null}

                    {showSignNSendBtn ? (
                      <View style={styles.buttonContainer}>
                        <CustomButton
                          title={status !== "pending" ? 'EDIT' : 'SIGN & SEND'}
                          color={theme?.colors?.btnText}
                          colors={theme?.colors?.colors}
                          isLoading={btnLoad}
                          bordered={true}
                          borderWidth={theme?.name === 'Light' ? 0 : 3}
                          borderColor={theme?.colors?.borderColor}
                          borderColors={theme?.colors?.borderColors}
                          shadow={theme?.name === 'Light'}
                          disabled={btnLoad || btnLoad2}

                          onPress={() => {

                            if (status == 'draft') {
                              navi.navigate('create_nda_receiver_info', {
                                receiver_name: data?.receiver_name,
                                receiver_email: data?.receiver_email,
                                receiver_phone_number: data?.receiver_phone_number,
                                receiver_company_name: data?.receiver_company_name,
                                receiver_address: data?.receiver_address,
                                receiver_city: data?.receiver_city,
                                receiver_state_id: data?.receiver_state,
                                receiver_postal_code: data?.receiver_postal_code,
                                data: data,
                                isEdit: true,
                              },)
                            } else {
                              console.log("Display as: " + displayAs);
                              if (displayAs === 'receiver') {
                                //downloadFile(fileUrl, 'receiver');
                                signAndSendNda(fileUrl, 'receiver', 'receiver')
                                setLoaderForLottieInfo({
                                  ...loaderForLottieInfo,
                                  load: true,
                                  status: 'pending',
                                  type: 'receiver',
                                })
                              } else { // as sender

                                if ((receiver_name === '' || receiver_name === undefined) ||
                                  (receiver_email === '' || receiver_email === undefined) ||
                                  (receiver_phone_number === '' || receiver_phone_number === undefined) ||
                                  (receiver_address === '' || receiver_address === undefined) ||
                                  (receiver_city === '' || receiver_city === undefined) ||
                                  (receiver_state_id === '' || receiver_state_id === undefined) ||
                                  (receiver_country_code === '' || receiver_country_code === undefined) ||
                                  (receiver_postal_code === '' || receiver_postal_code === undefined)
                                ) {
                                  console.log("Receiver info: undefined ");

                                  setModalShow(true)
                                  setModalMsg("Receiver information missing");

                                } else {
                                  console.log("Receiver info: found ");
                                  signAndSendNda('/nda_formats/8f71910d-d784-40e9-8e38-6ba54e21f227.pdf', 'pending', 'receiver')
                                  setLoaderForLottieInfo({
                                    ...loaderForLottieInfo,
                                    load: true,
                                    status: 'pending',
                                    type: 'sender',
                                  })
                                }


                              }
                            }
                          }}
                        />
                      </View>) : null}
                  </View>
                )}


              <ModalPoup
                theme={theme}
                visible={modalShow}
                title={modalMsg}
                source={require('../../assets/sign_in_animation.json')}
                btnTxt={'Ok'}
                onPressOk={() => setModalShow(false)}
                onPressClose={() => setModalShow(false)}
              />

              {/* <Pdf
          // minScale={1.0}
          // maxScale={1.0}
          scale={1.0}
          // spacing={-50}
          fitPolicy={0}
          enablePaging={true}
          source={{uri: createdPdf}}
          // source={{ uri: Url.FILE_URL + link }}
          usePDFKit={false}
          // onLoadComplete={(
          //   numberOfPages,
          //   filePath,
          //   { width, height },
          // ) => {
          //   setPageWidth(width);
          //   setPageHeight(height);
          // }}
          // onPageSingleTap={(page, x, y) => {
          //   handleSingleTap(page, x, y);
          // }}
          style={styles.pdf}
        /> */}

            </SafeAreaView>
            {/* </ImageBackground > */}
          </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    //paddingTop: globalStyle.topPadding,
    //paddingBottom: globalStyle.bottomPadding,
    // backgroundColor: globalStyle.statusBarColor,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  btnDiv: {
    marginTop: 5,
    paddingBottom: globalStyle.bottomPadding,
    //paddingHorizontal: 35,
  },
  btnText: {
    color: 'white',
    fontSize: 18,
  },
  template: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
  },
  row: {
    flex: 1,
    zIndex: 1,
    flexDirection: 'row',
    position: 'absolute',
    //height: Dimensions.get('window').height / 2,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // alignSelf: 'center',
    // alignContent: 'center',
  },
  icon: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bottomControlBtnContainer: {
    //flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
    //gap: 15,
    //bottom: 0,
    //zIndex: 1,
    width: '100%',
    position: 'absolute',
    alignSelf: 'center',
    // paddingHorizontal: 5,
    backgroundColor: 'white',
  },
  bottomBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 60,
  },
  bottomTxt: {
    fontSize: 10,
    lineHeight: 24,
    // color: '#334669',
    justifyContent: 'center',
    opacity: 0.6,
  },
  pdf: {
    width: Dimensions.get('window').width * 0.95,
    height: Dimensions.get('window').height * 0.87, //0.87,
    alignSelf: 'center',
    //paddingBottom: 50,
    //height: '90%',
    //height: 'auto',
    //height: 580,
  },
});
