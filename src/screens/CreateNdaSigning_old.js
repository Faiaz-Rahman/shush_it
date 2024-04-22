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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
//import {ScrollView} from 'react-native-virtualized-view';
import Pdf from 'react-native-pdf';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment, { updateLocale } from 'moment';

//Image Resource
//Assets
import DateSvg from '../../assets/date.svg';
import Signature from '../../assets/signature.svg';
//import Signing from '../../assets/signing.svg';
import Draggable from '../components/global/DragableComponent.js';

//Variables
//Class
import Token from '../class/TokenManager.js';
import PdfEditor from '../class/PdfEditor';
import Utils from '../class/Utils.js';
//Component
import CircularCustomButton from '../components/global/CircularButtonComponent.js';
import DocumentListHeader from '../components/global/DocumentListHeaderComponent';
import FullScreenModalComponent from '../components/global/FullScreenModalComponent';
import SignatureComponent from '../components/global/SignatureComponentNew';
import CustomButton from '../components/global/ButtonComponent.js';
import ModalPoupSingle from '../components/global/ModalPoupComponent';

//Class
import AsyncStorageManager from '../class/AsyncStorageManager.js';

//Style
import globalStyle from '../../styles/MainStyle.js';
//API
import Url from '../Api.js';
import { create } from 'react-test-renderer';
import { useTheme } from '../../styles/ThemeProvider';
import ThemeSelectorForTest from '../components/global/ThemeSelectorForTest';
import ModalPoup from '../components/global/ModalPoupComponent';
import CONSTANTS from '../Constants';

export default function CreateNdaSigning(navigation) {
  const { theme } = useTheme();

  const navi = useNavigation();

  var isDraft = false;

  const [signingStatus, setSigningStatus] = useState('');

  const [isSenderSigned, setIsSenderSigned] = useState(false);
  const [isReceiverSigned, setIsReceiverSigned] = useState(false);

  const [isSignInProgress, setSignInProgress] = useState(false);
  const [createdPdf, setCreatedPdf] = useState(null);
  const [isSuccess, setSuccess] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerKey, setDatePickerKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [btnLoad, setBtnLoad] = useState(false);
  const [btnLoad2, setBtnLoad2] = useState(false);

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

  const insets = useSafeAreaInsets();

  const [modalShow, setModalShow] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const {
    id,
    nda_name,
    document_name,
    filePath,

    type,
    data,
    sender_name,
    sender_email,
    sender_phone_number,
    sender_company_name,
    sender_address,
    sender_city,
    sender_state_id,
    sender_country_code,
    sender_postal_code,

    receiver_name,
    receiver_email,
    receiver_phone_number,
    receiver_company_name,
    receiver_address,
    receiver_city,
    receiver_state_id,
    receiver_country_code,
    receiver_postal_code,
  } = navigation.route.params;

  // console.log("navigation.route.params================================",navigation.route.params)

  useEffect(() => {
    console.log('Bottom padding: ' + insets.bottom);
    if (type === 'sender') {
      setSignInProgress(false);
      setSuccess(false);
      getPdf(filePath);
    } else {
      setIsLoading(false);
      setSignInProgress(false);
      setCreatedPdf(filePath);
    }
    console.log('CreateNdaSigning: ' + JSON.stringify(navigation.route.params));
    //setCreatedPdf(filePath);
  }, []);

  const getPdf = async filePath_ => {
    console.log('Sender name: ' + sender_name + '');
    setIsLoading(true);
    PdfEditor.getCombinedPdf(
      filePath_,
      sender_name + '',
      sender_email + '',
      sender_address + '',
      receiver_name + '',
      receiver_email + '',
      receiver_address + '',
      pdfDataUri => {
        setCreatedPdf(pdfDataUri);
        console.log('CreateNdaSigning source: ' + pdfDataUri);
      },
    )
      .then(value => {
        console.log('Done done: ');
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  };

  const showStartDatePicker = () => {
    setDatePickerKey('start_time');
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setDatePickerKey('');
  };

  const handleConfirm = async date => {
    var dateFormat = await AsyncStorageManager.getData(CONSTANTS.DATE_FORMAT /*'date_format'*/);
    setDateFormat(dateFormat);

    var formattedDate = Utils.getDateFormat(date, dateFormat);
    Moment.locale('en');
    //2023-09-07 12:06:43
    //var formattedDate = Moment(date).format('YYYY-MM-DD H:mm:ss');

    console.log('A date has been picked: ', formattedDate);
    if (datePickerKey === 'start_time') {
      //setData({...formData, start_time: formattedDate}); //start_time // end_time
    } else if (datePickerKey === 'end_time') {
      //setData({...formData, end_time: formattedDate});
    }
    hideDatePicker();

    setIsLoading(true);
    //var x_val = x; //400; //x
    //var y_val = y; //660; //y
    //var page_ = page;
    await PdfEditor.putDateOnPdf(
      createdPdf,
      type,
      formattedDate,
      (isSuccess, signedPdf) => {
        if (isSuccess) {
          setCreatedPdf(signedPdf);
          console.log('Date added Nda path ' + signedPdf);
          // if (type === 'sender') {
          //   setIsSenderSigned(true);
          // } else {
          //   setIsReceiverSigned(true);
          // }
        } else {
          console.log('Date add on pdf failed ');
        }
        setIsLoading(false);
      },
    ).then(value => {
      console.log('Pdf date add done');
      //Visible Right side button
      setSigningStatus('your_signature');
      setIsLoading(false);
    });
  };

  const { isOpen, onOpen, onClose } = useDisclose();

  const handlePressBackBtn = () => {
    navi.goBack();
  };

  const handlePressRightNextBtn = () => {
    // signingStatus === 'your_signature' ||
    // signingStatus === 'receiver_signature' ||
    // signingStatus === 'show_bottom_sheet'
    // if (
    //   signingStatus === 'receiver_signature' ||
    //   signingStatus === 'show_bottom_sheet'
    // ) {
    //   setSigningStatus('show_bottom_sheet');
    //   onOpen();
    // } else {
    //   setSigningStatus('next_receiver_signature');
    // }
    var isSendNDA = false;
    if (type === 'sender') {
      isSendNDA = isSenderSigned;
    } else {
      isSendNDA = isReceiverSigned;
    }
    setSigningStatus('show_bottom_sheet');
    if (isSendNDA) {
      onOpen();
    } else {
      console.log('Please put your signature');
      setSignWarning(true);
    }
  };

  const onSendNdaBtnPress = () => {
    setSignInProgress(true);
    setTimeout(() => {
      setSuccess(true);
      setSignInProgress(false);
    }, 2000);
  };

  const delayIt = () => {
    setSuccess(true);
    setSignInProgress(false);
  };

  const onBtnPress = () => {
    navi.navigate('tab_home', { screen: 'home' });
  };

  const getSignature = async signature => {
    console.log('signature==>'); //, signature);
    //setSignatureBase64(signature.replace('data:image/png;base64,', ''));

    //setSignature(signature);

    var sign = await signature.replace('data:image/png;base64,', '');
    await handleSingleTap(sign);

    setIsTakeSig(false);
    //await handleSingleTap(signature);
    //handleSingleTap(isSignatureLoaded, sign);
  };

  const onBackClick = () => {
    setIsTakeSig(false);
    console.log('On back press');
  };

  //Sign on pdf
  const handleSingleTap = async signatureBase64 => {
    console.log(' Signature ');
    setIsLoading(true);
    //var x_val = x; //400; //x
    //var y_val = y; //660; //y
    //var page_ = page;
    await PdfEditor.signOnPdf(
      createdPdf,
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

  const createNda = async status => {
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

    formDataN.append('nda_name', document_name);

    //If already drafted
    if (data?.status === 'draft') {
      formDataN.append('_method', 'PUT');
      formDataN.append('status', 'pending');
    } else {
      formDataN.append('status', status);
    }

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

    var api = Url.NDA_CREATE;

    if (data?.status === 'draft') {
      api = Url.NDA_CREATE + '/' + data?.id;
    }

    console.log("API: " + JSON.stringify(formDataN));

    let userToken = await Token.getToken();
    if (userToken) {
      postNda(userToken, api, formDataN);
    } else {
      console.log('Token not found in Create Nda SignIn ');
    }
  };

  //Receiver
  const signedNda = async () => {
    setBtnLoad(true);

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
      postNda(userToken, api, formDataN);
    } else {
      console.log('Token not found in Create Nda SignIn ');
    }
  };

  //Post to API
  const postNda = async (userToken, api, formData) => {
    console.log('called ==> ====>', formData);
    // setBtnLoad(false);
    // setBtnLoad2(false);
    // return
    // console.log('post nda created token ' + userToken);
    //Service to get the data from the server to render

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
              navi.navigate('create_nda_signing_success', {
                type: type,
                isDraft: isDraft,
              });

              onClose();

              // Alert.alert('Success', `${json.message}`, [
              //   { text: 'Cancel', onPress: () => { console.log("Cancel click") } },
              //   { text: 'Ok', onPress: () => { navi.navigate('tab_home', { screen: 'home' }) } },
              // ]);
            } else {
              console.log('NDA Create post status: ' + json);

              setModalShow(true)
              setModalMsg(json.message)

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
          }
          setBtnLoad(false);
          setBtnLoad2(false);
        })
        .catch(error => {
          console.error(error);
          setBtnLoad(false);
          setBtnLoad2(false);
        })
        .finally(() => { });
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
          onPress={handlePressBackBtn}
          title={'Signing'}
          isRightBtn={
            isLoading ? false : true
            // signingStatus === 'your_signature' ||
            // signingStatus === 'receiver_signature' ||
            // signingStatus === 'show_bottom_sheet'
            //   ? true
            //   : false
          }
          onPressRight={handlePressRightNextBtn}

          rightIcon={theme?.header?.checkIcon}

          backIcon={theme?.header?.backIcon}
          statusBarColor={theme?.colors?.statusBarColor}
          dark={theme?.name == 'Light'}
          color={theme?.colors?.text}
        />

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

        <SignatureComponent
          visible={isTakeSig}
          getSignature={async value => {
            setIsTakeSig(false);
            await getSignature(value);
          }}
          onBackClick={onBackClick}
          theme={theme}
          rightIcon={theme?.header?.checkIcon}
        />
        <View>
          {isLoading ? (
            <ActivityIndicator
              color={theme?.name == 'Light' ? globalStyle.colorAccent : theme?.colors?.text}
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                height: Dimensions.get('window').height * 0.88,
              }}
            />
          ) : (
            <View>
              {/* <View style={styles.row}>
              <Draggable />
            </View> */}
              <View>
                <View style={{ marginBottom: 0, }}>
                  {createdPdf && (
                    <Pdf
                      // minScale={1.0}
                      // maxScale={1.0}
                      scale={1.0}
                      ref={pdf => {
                        this.pdf = pdf;
                      }}
                      // spacing={-50}
                      fitPolicy={0}
                      enablePaging={false}
                      nestedScrollEnabled={true}
                      source={{ uri: createdPdf }}
                      // source={{ uri: Url.FILE_URL + link }}
                      usePDFKit={false}
                      onLoadComplete={(
                        numberOfPages,
                        filePath,
                        { width, height },
                      ) => {
                        setPageWidth(width);
                        setPageHeight(height);
                      }}
                      onPageSingleTap={(page, x, y) => {
                        //handleSingleTap(page, x, y);
                      }}
                      // onLoadComplete={(numberOfPages, filePath) => {
                      //   //console.log(`Number of pages: ${numberOfPages}`);
                      // }}
                      onPageChanged={(page, numberOfPages) => {
                        console.log(`Current page: ${page}`);
                      }}
                      style={styles.pdf}
                    />
                  )}
                </View>
              </View>
            </View>
          )}
        </View>

        {!isLoading && (
          <View style={{ bottom: 0 }}>
            {createdPdf && (
              <View style={[styles.bottomControlBtnContainer, { bottom: 0 }]}>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="datetime"
                  display="inline"
                  date={new Date()}
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  style={{
                    flex: 1,
                    backgroundColor: theme?.name == 'Light' ? 'white' : 'black',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 15,
                      paddingTop: 5,
                      gap: 10,
                    }}>
                    <View style={styles.bottomBtn}>
                      <CircularCustomButton
                        colors={theme?.colors?.colors}
                        bordered={true}
                        borderWidth={theme?.name == 'Light' ? 0 : 3}
                        borderColor={theme?.colors?.borderColor}
                        borderColors={theme?.colors?.borderColors}
                        shadow={theme?.name == 'Light'}
                        icon={<View style={styles.icon}>{theme?.nda?.signature}</View>}
                        // icon={<Signature style={styles.icon}/>}

                        onPress={() => {
                          console.log('Press Plus Button1');
                          // setVisible(true);
                          //setSigningStatus('your_signature');
                          setIsTakeSig(true);
                          // navi.navigate('document_sign');
                        }}
                      />
                      <Text style={{ ...styles.bottomTxt, color: theme?.name == 'Light' ? '#334669' : 'white' }}>Your Signature</Text>
                    </View>

                    <View style={styles.bottomBtn}>
                      <CircularCustomButton
                        colors={theme?.colors?.colors}
                        bordered={true}
                        borderWidth={theme?.name == 'Light' ? 0 : 3}
                        borderColor={theme?.colors?.borderColor}
                        borderColors={theme?.colors?.borderColors}
                        shadow={theme?.name == 'Light'}
                        icon={<View style={styles.icon}>{theme?.nda?.date}</View>}
                        // icon={<DateSvg style={styles.icon} />}
                        onPress={() => {
                          console.log('Press Plus date picker btn');
                          // setVisible(true);
                          showStartDatePicker();
                        }}
                      />
                      <Text style={{ ...styles.bottomTxt, color: theme?.name == 'Light' ? '#334669' : 'white' }}>Add Date</Text>
                    </View>
                    <View>
                      {type !== 'receiver' && isShowReceiverSignBtn && (
                        <View style={styles.bottomBtn}>
                          <CircularCustomButton
                            colors={theme?.colors?.colors}
                            bordered={true}
                            borderWidth={theme?.name == 'Light' ? 0 : 3}
                            borderColor={theme?.colors?.borderColor}
                            borderColors={theme?.colors?.borderColors}
                            shadow={theme?.name == 'Light'}
                            icon={<View style={styles.icon}>{theme?.nda?.signature}</View>}
                            // icon={<Signature style={styles.icon} />}
                            onPress={() => {
                              console.log('Press Plus Button3');
                            }}
                          />
                          <Text style={{ ...styles.bottomTxt, color: theme?.name == 'Light' ? '#334669' : 'white' }}>Receiver Signature</Text>
                        </View>
                      )}
                    </View>

                    <View>
                      {type !== 'receiver' && isShowReceiverSignBtn && (
                        <View style={styles.bottomBtn}>
                          <CircularCustomButton
                            colors={theme?.colors?.colors}
                            bordered={true}
                            borderWidth={theme?.name == 'Light' ? 0 : 3}
                            borderColor={theme?.colors?.borderColor}
                            borderColors={theme?.colors?.borderColors}
                            shadow={theme?.name == 'Light'}
                            icon={<View style={styles.icon}>{theme?.nda?.date}</View>}
                            // icon={<DateSvg style={styles.icon} />}
                            onPress={() => {
                              console.log('Press Plus Button4');
                              // setVisible(true);
                              showStartDatePicker();
                            }}
                          />
                          <Text style={{ ...styles.bottomTxt, color: theme?.name == 'Light' ? '#334669' : 'white' }}>Receiver Date</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {/* Save on draft and send nda option in Bottom sheet */}
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content
            // style={{ padding: 50 }}
            style={{
              padding: 50,
              backgroundColor: theme?.name == 'Light' ? 'white' : '#000000',
              borderWidth: .01,
              borderTopWidth: 3,
              borderColor: theme?.nav?.borderColor,
            }}
          >
            <Text style={{
              color: theme?.name == 'Light' ? 'black' : 'white',
              fontSize: 20,
              paddingHorizontal: 30,
              marginVertical: type === 'sender' ? 10 : 20,
              lineHeight: 30,
              textAlign: 'center',
            }}
            >{type === 'sender' ? null : 'Are you finished signing this document?'}</Text>

            <View style={styles.buttonContainer}>
              <CustomButton
                title={
                  btnLoad ? <ActivityIndicator color={'white'} /> : type === 'sender' ? 'Send NDA' : 'Yes'
                }

                color={theme?.colors?.btnText}
                colors={theme?.colors?.colors}
                bordered={true}
                borderWidth={theme?.name === 'Light' ? 0 : 3}
                borderColor={theme?.colors?.borderColor}
                borderColors={theme?.colors?.borderColors}
                shadow={theme?.name === 'Light'}
                disabled={btnLoad || btnLoad2}

                onPress={() => {
                  // navi.navigate('create_nda_signing_success');
                  //onSendNdaBtnPress();
                  if (type === 'sender') {
                    btnLoad || btnLoad2 ? null : createNda('pending');
                  } else {
                    btnLoad || btnLoad2 ? null : signedNda(); //Reciver sign
                  }
                }}
              />
            </View>

            {(type === 'sender' && data?.status !== 'draft') && (
              <View style={styles.buttonContainer}>
                <CustomButton
                  title={
                    btnLoad2 ? (
                      <ActivityIndicator color={'white'} />
                    ) : (
                      'Save as Draft'
                    )
                  }
                  color={theme?.colors?.btnText}
                  colors={theme?.colors?.colors}
                  bordered={true}
                  borderWidth={theme?.name == 'Light' ? 0 : 3}
                  borderColor={theme?.colors?.borderColor}
                  borderColors={theme?.colors?.borderColors}
                  shadow={theme?.name == 'Light'}
                  disabled={btnLoad || btnLoad2}

                  onPress={() => {
                    btnLoad || btnLoad2 ? null : createNda('draft');
                  }}
                />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <CustomButton
                title={type === 'sender' ? 'Cancel' : 'No'}

                // color={theme?.name == 'Light' ? "blue" : 'black'}
                // colors={['white', 'white', 'white']}
                color={theme?.colors?.btnText}
                colors={theme?.colors?.colors}
                bordered={true}
                borderWidth={theme?.name == 'Light' ? 0 : 3}
                borderColors={theme?.colors?.borderColors}
                borderColor={theme?.colors?.borderColor}
                shadow={theme?.name == 'Light'}

                onPress={() => {
                  onClose();
                }}
              />
            </View>

          </Actionsheet.Content>
        </Actionsheet>

        {/* {(isSuccess || isSignInProgress) && (
          <FullScreenModalComponent
            theme={theme}
            visible={isSuccess || isSignInProgress}
            // visible={true}
            title={isSignInProgress ? null : 'NDA Sent Successfully'}
            text={
              isSignInProgress
                ? null
                : 'We will notify you once it’s signed or there is any change request'
            }
            source={
              isSignInProgress
                ? require('../../assets/creatingNda.json')
                : require('../../assets/mailSent.json')
            }
            onBtnPress={isSignInProgress ? null : onBtnPress}
            showBtn={isSignInProgress ? false : true}
          />
        )} */}

        <ModalPoup
          theme={theme}
          visible={modalShow}
          title={modalMsg}
          source={require('../../assets/sign_in_animation.json')}
          btnTxt={'Ok'}
          onPressOk={() => setModalShow(false)}
          onPressClose={() => setModalShow(false)}
        />

      </SafeAreaView>
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    //flex: 1,
    //paddingTop: globalStyle.topPadding,
    //paddingBottom: globalStyle.bottomPadding,
    // backgroundColor: globalStyle.statusBarColor,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 7,
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
