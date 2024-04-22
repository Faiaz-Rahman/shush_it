import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import {  Actionsheet, useDisclose, NativeBaseProvider } from 'native-base';
import { React, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ActionSheetIOS,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
//Image Resource
//Assets
//Variables

//Class

import API_URLS from '../Api.js';
import { get, post } from '../class/ApiManager.js';
import Token from '../class/TokenManager.js';
import AsyncStorageManager from '../class/AsyncStorageManager.js';
import Utils from '../class/Utils.js';
//Component
import globalStyle from '../../styles/MainStyle.js';
import { useTheme } from '../../styles/ThemeProvider';
import CustomButton from '../components/global/ButtonComponent.js';
import DocumentListHeader from '../components/global/DocumentListHeaderComponent';
import TextInput from '../components/global/InputTextComponent.js';
import ModalPoup from '../components/global/ModalPoupComponent';
import SignatureComponent from '../components/global/SignatureComponentNew.js';
import DropDown from '../components/global/StateDropDownComponent.js';
import ThemeSelectorForTest from '../components/global/ThemeSelectorForTest';
import ButtonComponentSmall from '../components/global/ButtonComponentSmall.js';
import ModalPopupConfirmation from '../components/global/ModalPopupConfirmation.js';
import Validator from '../class/Validator.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignatureComponentNew from '../components/global/SignatureComponentNew.js';
import TermsCondition from './TermsCondition.js';
import { AutoCompleteDropDown } from '../components/global/AutoCompleteDropdownComp.js';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import CONSTANTS from '../Constants.js';
import FastImage from 'react-native-fast-image';
import { BlurView } from '@react-native-community/blur';
import InputTextComponent from '../components/global/InputTextComponent.js';

export default function Profile(navigation) {
  // console.log("navigation ==>", navigation.route?.params?.from);
  const navi = useNavigation();
  const { theme, bg } = useTheme();
  const { width, height } = Dimensions.get('window');

  const { isOpen, onOpen, onClose } = useDisclose();

  const [saveBtnLoad, setSaveBtnLoad] = useState(false);
  const [isSignatureLoaded, setIsSignatureLoaded] = useState(false);
  const [isTakeSig, setIsTakeSig] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [msg, setMsg] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirmForProfile, setConfirmForProfile] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [proPicLoading, setProPicLoading] = useState(false);
  const [uploadedImageInfo, setUploadedImageInfo] = useState({});
  const [isRightBtn, setIsRightBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [btnLoad, setBtnLoad] = useState(false);
  const [formData, setData] = useState({});
  const [oldPic, setOldPic] = useState(null);
  const [stateList, setStateList] = useState([]);
  const [token, setToken] = useState('');
  const [screen, setScreen] = useState('name'); //'full'

  const [address, setAddress] = useState(null);
  const [inputtedAddress, setInputtedAddress] = useState(null);
  const [isAddVerify, setAddVerify] = useState(false);
  const [addVeriStat, setAddVeriStat] = useState(null);

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    if (
      navigation.route?.params?.from &&
      navigation.route?.params?.from == 'home'
    ) {
      setScreen('name');
    } else {
      setScreen('full'); //'full
    }


    const asyncFunc = async () => {
      let token = await Token.getToken();
      setToken(token);
    };
    asyncFunc();


    getProfileInfo();
    console.log('Bottom height: ' + tabBarHeight + 'inset: ' + insets.top);
  }, []);

  useEffect(() => {
    address && addressVerify(address);
  }, [formData.formattedAddress]);

  const handlePress = () => {
    if (screen == 'name') {
      setScreen('full');
    } else {
      navi.goBack();
    }
  };

  const getProfileInfo = async (isProfileStatus = false) => {
    //Utils.showToast('error', "Hello", "Message")
    setIsLoading(true);

    var profileApi_ = API_URLS.PROFILE_;
    get(profileApi_)
      .then(data => {
        try {
          // console.log("Profile.js -Profile-" + JSON.stringify(data))
          var a = JSON.stringify(data);
          var json = JSON.parse(a);

          var profileInfo = json.data;
          if (!isProfileStatus) {
            // console.log('Profile.js profileInfo==>', profileInfo);

            const formattedAddress =
              profileInfo?.address && profileInfo?.country_code
                ? profileInfo?.city +
                ', ' +
                profileInfo?.state_id +
                ', ' +
                profileInfo?.postal_code +
                ', ' +
                profileInfo?.country_code
                : '';

            setData({
              ...profileInfo,
              formattedAddress: formattedAddress,
              searchAddress: profileInfo.address || null,
            });
            setAddVeriStat(
              profileInfo?.address ? profileInfo?.address_verification : null,
            );
            setOldPic(profileInfo?.avatar);
            // getStateList(token);
            setIsLoading(false);
          } else {
            const profileStatus = profileInfo.profile_status;
            console.log('profile status==>' + profileStatus);
            AsyncStorageManager.storeData(
              CONSTANTS.PROFILE_STATUS,
              profileStatus + '',
            );
            setIsLoading(false);
          }
        } catch (error) {
          console.log("Error: ", error);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error("Error got: " + error)

        console.log(
          'Status: ' +
          JSON.stringify(a) +
          'State list error: ' +
          JSON.stringify(json),
        );
        setIsLoading(false);
      }
      );

    // return;
    // var profileApi = API_URLS.PROFILE;
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
    //         if (!isProfileStatus) {
    //           console.log('profileInfo==>', profileInfo);

    //           const formattedAddress =
    //             profileInfo?.address && profileInfo?.country_code
    //               ? profileInfo?.city +
    //               ', ' +
    //               profileInfo?.state_id +
    //               ', ' +
    //               profileInfo?.postal_code +
    //               ', ' +
    //               profileInfo?.country_code
    //               : '';

    //           setData({
    //             ...profileInfo,
    //             formattedAddress: formattedAddress,
    //             searchAddress: profileInfo.address || null,
    //           });
    //           setAddVeriStat(
    //             profileInfo?.address ? profileInfo?.address_verification : null,
    //           );
    //           setOldPic(profileInfo?.avatar);
    //           // getStateList(token);
    //           setIsLoading(false);
    //         } else {
    //           const profileStatus = profileInfo.profile_status;
    //           console.log('profile status==>' + profileStatus);
    //           AsyncStorageManager.storeData(
    //             CONSTANTS.PROFILE_STATUS,
    //             profileStatus + '',
    //           );
    //           setIsLoading(false);
    //         }
    //       } else {
    //         console.log(
    //           'Status: ' +
    //           JSON.stringify(responseJson) +
    //           'State list error: ' +
    //           JSON.stringify(json),
    //         );
    //         setIsLoading(false);
    //       }
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

  //Signature upload
  const handleOnSave = (signature = formData?.signature) => {
    setSaveBtnLoad(true);
    setBtnLoad(true);

    var formDataN = new FormData();

    if (isImageUploaded) {
      formDataN.append('avatar', {
        name: uploadedImageInfo.fileName,
        type: uploadedImageInfo.type,
        uri: uploadedImageInfo.uri,
      });
    }

    console.log('Photo uri: ' + JSON.stringify(uploadedImageInfo));

    if (isSignatureLoaded) {
      // var Base64Code = formData?.signature.replace('data:image/png;base64,', '');
      formDataN.append('signature', signature);
      // formDataN.append('signature', formData?.signature);
    }
    console.log('signature ==> in ==>', signature);

    formDataN.append('full_name', formData.full_name || '');
    formDataN.append('email', formData.email || '');
    formDataN.append('phone_number', formData.phone_number || '');
    formDataN.append('company_name', formData.company_name || '');
    formDataN.append('address', formData.searchAddress || '');
    // formDataN.append('address', formData.address || '');
    formDataN.append('city', formData.city || '');
    formDataN.append('postal_code', formData.postal_code || '');
    formDataN.append('state_id', formData.state_id || '');
    formDataN.append('country_code', formData.country_code);
    formDataN.append('address_verification', addVeriStat);
    //formDataN.append('country_id', formData.country_id);

    console.log('formDataN==>', formDataN);


    let updateProfileApi = API_URLS.PROFILE_UPDATE_;
    let headers = {
      Accept: 'application/json',
      'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
      //'Content-Type': 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
    }

    post(updateProfileApi, formDataN, headers).then(responseJson => {
      try {
        console.log('Address verifiy :', JSON.stringify(responseJson));
        var a = JSON.stringify(responseJson);
        var json = JSON.parse(a);

        console.log('Status==> ok');
        setIsSuccess(true);
        setMsg(json?.message);
        setVisible(true);
        setBtnLoad(false);
        setSaveBtnLoad(false);
        setIsLoading(false);
        setConfirmForProfile(false);

        //For get profile
        getProfileInfo(true);

      } catch (error) {
        console.log("Profile update Error: " + error);
        console.log('Error==>', JSON.stringify(json));
        setIsSuccess(false);
        setMsg(json?.message);
        setVisible(true);
        setBtnLoad(false);
        setSaveBtnLoad(false);
        setIsLoading(false);
        setConfirmForProfile(false);
      }
    }).catch(error => {
      console.log("Profile update Error got: " + error)
      setIsSuccess(false);
      setBtnLoad(false);
      setSaveBtnLoad(false);
      setIsLoading(false);
      setConfirmForProfile(false);
    })

    // return;
    // try {
    //   var api = API_URLS.PROFILE_UPDATE;
    //   console.log('update profile api', api);
    //   fetch(api, {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
    //       //'Content-Type': 'application/json',
    //       'Content-Type': 'multipart/form-data',
    //       Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
    //     },
    //     body: formDataN,
    //   })
    //     .then(response => response.json())
    //     .then(responseJson => {
    //       try {
    //         var a = JSON.stringify(responseJson);
    //         var json = JSON.parse(a);
    //         if (responseJson.status === 200) {
    //           setBtnLoad(false);
    //           setSaveBtnLoad(false);
    //           console.log('Status==> ok');
    //           setIsSuccess(true);
    //           setMsg(json?.message);
    //           setVisible(true);
    //           setIsLoading(false);
    //           setConfirmForProfile(false);

    //           //For get profile
    //           getProfileInfo(true);
    //         } else {
    //           console.log('Error==>', JSON.stringify(json));
    //           setIsSuccess(false);
    //           setMsg(json?.message);
    //           setVisible(true);
    //           setBtnLoad(false);
    //           setSaveBtnLoad(false);
    //           setIsLoading(false);
    //           setConfirmForProfile(false);
    //         }
    //       } catch (error) {
    //         console.error(error);
    //         console.log(error);
    //         setIsSuccess(false);
    //         setBtnLoad(false);
    //         setSaveBtnLoad(false);
    //         setIsLoading(false);
    //         setConfirmForProfile(false);
    //       }
    //     })
    //     .catch(error => {
    //       console.error(error);
    //       setIsSuccess(false);
    //       setBtnLoad(false);
    //       setSaveBtnLoad(false);
    //       setIsLoading(false);
    //       setConfirmForProfile(false);
    //     });
    // } catch (error) {
    //   console.error(error);
    //   console.log(error);
    //   setIsSuccess(false);
    //   setBtnLoad(false);
    //   setSaveBtnLoad(false);
    //   setIsLoading(false);
    // }
  };

  const getSignature = async signature => {
    console.log('profile signature==>', signature);
    console.log('formData signature==>', formData?.signature);
    if (signature) {
      setData({ ...formData, signature: signature });
      setIsSignatureLoaded(true);
      setIsTakeSig(false);
      setScreen('tc');

      // setIsLoading(true);
      // handleOnSave(true, signature);
    } else {
      setIsSignatureLoaded(false);
      setIsTakeSig(false);
      setScreen('tc');
    }
  };

  const onBackClick = () => {
    setIsTakeSig(false);
    console.log('On back press');
  };

  const onPreviousClick = () => {
    if (screen == 'full') {
      navi.goBack();
    }
    if (screen == 'name') {
      setScreen('full');
    }
    if (screen == 'email') {
      setScreen('name');
    }
    if (screen == 'phone') {
      setScreen('email');
    }
    if (screen == 'others') {
      setScreen('phone');
    }
    if (screen == 'tc') {
      setScreen('others');
      setIsTakeSig(true);
    }
  };

  const onNextClick = () => {
    if (screen == 'full') {
      setScreen('name');
    }

    if (screen == 'name') {
      if (formData?.full_name != '') {
        setScreen('email');
      } else {
        setMsg('Name is required');
        setVisible(true);
      }
    }

    if (screen == 'email') {
      setScreen('phone');
    }

    if (screen == 'phone') {
      if (formData?.phone_number != '') {
        if (Validator.Validate('phone', formData?.phone_number)) {
          setScreen('others');
        } else {
          setMsg('Invalid phone number');
          setVisible(true);
        }
      } else {
        setMsg('Phone number is required');
        setVisible(true);
      }
    }

    if (screen == 'others') {
      if (addVeriStat == 'processing') {
        return;
      }

      console.log('formData?.searchAddress', formData?.searchAddress);
      if (formData?.searchAddress && formData?.searchAddress != '') {
        if (formData?.formattedAddress && formData?.formattedAddress != '') {
          setIsTakeSig(true);
        } else {
          setMsg('Enter a valid address');
          setVisible(true);
        }

        // if (formData?.address && formData?.address != '') {
        // setIsTakeSig(true)
        // if (isAddVerify) {
        //   //Go Next Page
        //   setIsTakeSig(true)
        // } else {
        //   //Verify Address
        //   if (address === null) {
        //     //showToast('Please enter the addess', 'To go next enter a valid address');
        //     // goNextPage();
        //     setIsTakeSig(true)
        //   } else {
        //     // console.log('Verify address ==>', address)
        //     if (address) {
        //       // addressVerify(token, address);
        //     } else {
        //       setIsTakeSig(true)
        //     }
        //   }
        // }
      } else {
        setMsg('Address is required');
        setVisible(true);
      }
    }
  };

  const addressVerify = async (address) => {
    //setIsLoading(true);
    setAddVeriStat('processing');


    let addressVerifyApi = API_URLS.VERIFY_ADDRESS_;

    let body = {
      address_line1: address.address,
      city: address.city,
      state: address.prov,
      country: address.country,
      postal_code: address.pc,
    }

    post(addressVerifyApi, body).then(responseJson => {
      try {
        console.log('Address verifiy :', JSON.stringify(responseJson));

        var a = JSON.stringify(responseJson);
        var json = JSON.parse(a);

        if (responseJson.status === 200) {
          console.log('Address verifiy : ' + JSON.stringify(json));
          const status = responseJson.data.status;
          // console.log('Address verifiy status: ' + status);
          console.log('Address json status: ' + responseJson.data.status);

          setAddVeriStat(status);
          //setIsLoading(false);
        } else {
          console.log('Address verifiy error: ' + JSON.stringify(json));
          setAddVeriStat(responseJson.data.status);
        }

        setAddVerify(true);
      } catch (error) {
        console.log("Error: " + error);
        console.log(error);
        setAddVeriStat('failed');
      }
    }).catch(error => {
      console.error("Error got: " + error)
      console.log(error);
      setAddVeriStat('failed');
    })

    // return
    // var stateApi = API_URLS.VERIFY_ADDRESS;
    // await fetch(stateApi, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
    //   },
    //   body: JSON.stringify({
    //     address_line1: address.address,
    //     city: address.city,
    //     state: address.prov,
    //     country: address.country,
    //     postal_code: address.pc,
    //   }),
    // })
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     try {
    //       var a = JSON.stringify(responseJson);
    //       var json = JSON.parse(a);

    //       if (responseJson.status === 200) {
    //         console.log('Address verifiy : ' + JSON.stringify(json));
    //         const status = responseJson.data.status;
    //         // console.log('Address verifiy status: ' + status);
    //         console.log('Address json status: ' + responseJson.data.status);

    //         setAddVeriStat(status);
    //         //setIsLoading(false);
    //       } else {
    //         console.log('Address verifiy error: ' + JSON.stringify(json));
    //         setAddVeriStat(responseJson.data.status);
    //       }

    //       setAddVerify(true);

    //       //setIsLoading(false);
    //     } catch (error) {
    //       console.error(error);
    //       console.log(error);
    //       setAddVeriStat('failed');

    //       //setIsLoading(false);
    //     }
    //   })
    //   .catch(error => {
    //     console.error(error);

    //     //setIsLoading(false);
    //   });
  };

  const captureImage = async () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.1,
    };

    onClose();

    await launchCamera(options, response => {
      if (response && response.assets) {
        console.log('Response==>', response?.assets[0]);
        let asset = response?.assets[0];
        let fileSize = response?.assets[0].fileSize;

        console.log('Selected image file size: ', fileSize / 1000 + 'KB');

        setUploadedImageInfo(asset);
        setData({ ...formData, avatar_local: asset?.uri });
        setIsImageUploaded(true);
        setConfirmForProfile(true);
        onClose();
      }
    });
  };

  //Profile Image picker
  const uploadImage = async () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.1,
    };

    onClose();

    await launchImageLibrary(options, response => {
      if (response && response.assets) {
        // console.log('Response>', response?.assets[0]);
        let asset = response?.assets[0];

        let fileSize = response?.assets[0].fileSize;
        console.log('Selected image file size: ', fileSize / 1000 + 'KB');

        setUploadedImageInfo(asset);
        setData({ ...formData, avatar_local: asset?.uri });
        setIsImageUploaded(true);
        setConfirmForProfile(true);
        onClose();
      }
    });
  };

  const openIosBottomSheet = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Camera', 'Upload Photo'],
        //destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          captureImage()
        } else if (buttonIndex === 2) {
          uploadImage()
        }
      },
    );

  return (
    <NativeBaseProvider>
      {!isTakeSig && screen != 'tc' && (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <SafeAreaView
            style={[
              styles.container,
              // {
              //   paddingBottom: tabBarHeight + 100,
              // },
            ]}>
            <AutocompleteDropdownContextProvider>
              {/* {(screen == 'name' || screen == 'full') && */}
              {/* <DocumentListHeader
                onPress={handlePress}
                title={(screen == 'name' || screen == 'full') ? 'Profile' : ''}
                backIcon={(screen == 'name' || screen == 'full') ? theme?.header?.backIcon : null}
                statusBarColor={theme?.colors?.statusBarColor}
                dark={theme?.name === 'Light'}
                color={theme?.colors?.text}
              /> */}

              {/* // isRightBtn={
              //   !isLoading
              //     ? screen === 'full' || screen === 'others'
              //       ? true
              //       : false
              //     : false
              // }
              // onPressRight={() =>
              //   screen === 'others' ? handleOnSave() : setScreen('name')
              // }
              // rightBtnLoad={btnLoad}
              // rightIcon={
              //   screen === 'others'
              //     ? theme?.header?.checkIcon
              //     : theme?.profileIcon?.proEdit
              // }
              // /> */}

              {/* } */}

              <ScrollView
                horizontal={false}
                // style={styles.categoryListContainer}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  paddingBottom: 70,
                  // height: screen == 'full' ? null : Dimensions.get('window').height * 0.75,
                }}
                showsHorizontalScrollIndicator={false}>
                <View>
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
                    // <ScrollView
                    //   horizontal={false}
                    //   style={{ height: '100%' }}
                    //   // style={styles.categoryListContainer}
                    //   showsHorizontalScrollIndicator={true}>
                    <View>
                      {!isTakeSig && (
                        <View
                          style={
                            {
                              // height: Dimensions.get('window').height * 0.87,
                            }
                          }>
                          <View style={styles.middleDive}>
                            {screen != 'full' && (
                              <Text
                                style={{
                                  fontSize: 22,
                                  marginBottom: 50,
                                  textAlign: 'center',
                                  textTransform: 'capitalize',
                                  color: theme?.colors?.text,
                                }}>
                                {screen == 'others' ? 'Address' : screen}
                                {/* Personal Information */}
                              </Text>
                            )}

                            {/* Full profile view */}
                            {screen == 'full' && (
                              <View>
                                <View style={{ marginBottom: 30 }}>
                                  <TouchableOpacity
                                    style={{ marginStart: 20 }}
                                    // style={{ position: 'absolute', left: 30, zIndex: 100 }}
                                    onPress={handlePress}>
                                    {theme?.header?.backIcon}
                                  </TouchableOpacity>
                                  {/* <Text style={{ ...styles.title, color: theme?.colors?.text }}>Profile</Text> */}
                                </View>

                                <View style={[styles.profileInfo, {
                                  borderColor: theme.nav.borderColor,
                                }]}>
                                  <BlurView
                                    style={styles.absolute}
                                    blurType="thinMaterialDark"
                                    blurAmount={Platform.OS === 'ios' ? 15 : 5}
                                    reducedTransparencyFallbackColor="white"
                                  />
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                    }}>
                                    {/* Avatar */}
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (Platform.OS === 'android') {
                                          onOpen()
                                        } else if (Platform.OS === 'ios') {
                                          openIosBottomSheet()
                                        }
                                      }}
                                      style={styles.avatar}>
                                      {formData?.avatar ||
                                        formData?.avatar_local ? (
                                        <FastImage
                                          source={{
                                            uri: isImageUploaded
                                              ? formData?.avatar_local
                                              : API_URLS.IMAGE_URL +
                                              formData?.avatar,
                                          }}
                                          fallbackSource={{
                                            uri: 'https://www.w3schools.com/css/img_lights.jpg',
                                          }}
                                          style={styles.profilePic}
                                          aspectRatio={1}
                                          alt=""
                                          // size="2xl"
                                          resizeMode="cover"
                                        />
                                      ) : (
                                        <View
                                          style={{
                                            ...styles.iconDiv,
                                            backgroundColor:
                                              theme?.name == 'Light'
                                                ? '#3D50DF'
                                                : 'black',
                                            borderWidth:
                                              theme?.name == 'Light' ? 0 : 1,
                                            borderColor: theme?.colors?.text,
                                          }}>
                                          {theme?.profileIcon?.profile}
                                        </View>
                                      )}
                                      {/* <Text style={{ ...styles.item, color: theme?.name == 'Light' ? '#2E476E' : theme?.colors?.text }}>Change Profile Photo</Text> */}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                      onPress={() => setScreen('name')}
                                      style={{
                                        // zIndex: 1,
                                        // alignSelf: 'center',
                                        // marginVertical: 30,
                                        position: 'absolute',
                                        right: 20,
                                        top: -10,
                                      }}>
                                      {theme?.profileIcon?.proEdit}
                                      {/* {theme?.profileIcon?.proEdit} */}
                                    </TouchableOpacity>
                                  </View>

                                  <ModalPopupConfirmation
                                    showCustom={true}
                                    customImg={formData?.avatar_local}
                                    visible={confirmForProfile}
                                    // title={'Delete All'}
                                    msg={'Upload Profile Photo'}
                                    okText={'Upload'}
                                    cancelText={'Cancel'}
                                    isLoading={btnLoad}
                                    onPressOk={handleOnSave}
                                    theme={theme}
                                    onPressClose={() => {
                                      setData({ ...formData, avatar: oldPic });
                                      setIsImageUploaded(false);
                                      setConfirmForProfile(false);
                                    }}
                                  />

                                  {/* Name */}
                                  <View
                                    style={{ ...styles.infoDiv, marginTop: 10 }}>
                                    {theme?.profileIcon?.profile}
                                    <View style={styles.valueDiv}>
                                      {/* <Text
                                        style={{
                                          ...styles.type,
                                          color:
                                            theme?.name == 'Honeycomb'
                                              ? 'gray'
                                              : theme?.colors?.text,
                                        }}>
                                        Name
                                      </Text> */}
                                      <Text
                                        style={{
                                          ...styles.type,
                                          color: 'white',
                                        }}>
                                        {formData?.full_name}
                                      </Text>
                                    </View>
                                  </View>

                                  {/* Email */}
                                  <View
                                    style={{ ...styles.infoDiv, marginTop: 20 }}>
                                    {theme?.profileIcon?.email}
                                    <View style={styles.valueDiv}>
                                      {/* <Text
                                        style={{
                                          ...styles.type,
                                          color:
                                            theme?.name == 'Honeycomb'
                                              ? 'gray'
                                              : theme?.colors?.text,
                                        }}>
                                        Email
                                      </Text> */}
                                      <Text
                                        style={{
                                          ...styles.type,
                                          color: 'white',
                                        }}>
                                        {formData?.email}
                                      </Text>
                                    </View>
                                  </View>

                                  {/*  Phone */}
                                  <View
                                    style={{ ...styles.infoDiv, marginTop: 20 }}>
                                    {theme?.profileIcon?.phone}
                                    <View style={styles.valueDiv}>
                                      {/* <Text
                                        style={{
                                          ...styles.type,
                                          color:
                                            theme?.name == 'Honeycomb'
                                              ? 'gray'
                                              : theme?.colors?.text,
                                        }}>
                                        Phone
                                      </Text> */}
                                      <Text
                                        style={{
                                          ...styles.type,
                                          color: 'white',
                                        }}>
                                        {formData?.phone_number}
                                      </Text>
                                    </View>
                                  </View>

                                  {/*  Address */}
                                  <View
                                    style={{ ...styles.infoDiv, marginTop: 20 }}>
                                    {theme?.profileIcon?.location}
                                    <View style={styles.valueDiv}>
                                      {/* <Text
                                        style={{
                                          ...styles.type,
                                          color:
                                            theme?.name == 'Honeycomb'
                                              ? 'gray'
                                              : theme?.colors?.text,
                                        }}>
                                        Address
                                      </Text> */}

                                      <Text
                                        style={{
                                          ...styles.type,
                                          color: 'white',
                                        }}>
                                        {formData?.searchAddress || 'N/A'}
                                      </Text>

                                      {formData?.formattedAddress &&
                                        formData?.formattedAddress != '' && (
                                          <Text
                                            style={{
                                              ...styles.type,
                                              color: 'white',
                                            }}>
                                            {formData?.formattedAddress || ''}
                                          </Text>
                                        )}
                                    </View>
                                  </View>
                                </View>

                                {/* <TouchableOpacity
                                  onPress={() => setScreen('name')}
                                  style={{ zIndex: 1, alignSelf: 'center', marginVertical: 30 }}>
                                  {theme?.profileIcon?.proEdit}
                                </TouchableOpacity> */}
                              </View>
                            )}

                            {screen == 'name' && (
                              <InputTextComponent
                                placeholderTitle={'Name'}
                                // icon={<ProfileName />}
                                icon={theme?.profileIcon?.profile}
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
                                value={formData?.full_name}
                                onChangeText={value => {
                                  console.log('Name==: ' + value);
                                  setData({ ...formData, full_name: value });
                                }}
                              />
                            )}

                            {screen == 'email' && (
                              <InputTextComponent
                                placeholderTitle={'Email'}
                                // icon={<EmailSVG />}
                                icon={theme?.profileIcon?.email}
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
                                value={formData?.email}
                                type="email"
                                disabled={true}
                                onChangeText={value => {
                                  console.log('Email==: ' + value);
                                  setData({ ...formData, email: value });
                                }}
                              />
                            )}

                            {screen == 'phone' && (
                              <InputTextComponent
                                placeholderTitle={'Phone no.'}
                                // icon={<Phone />}
                                icon={theme?.profileIcon?.phone}
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
                                value={formData?.phone_number}
                                type="tel"
                                onChangeText={value => {
                                  console.log('Phone==: ' + value);
                                  setData({ ...formData, phone_number: value });
                                }}
                              />
                            )}

                            {screen == 'others' && (
                              <>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    paddingBottom: 20,
                                    // alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 10,
                                    // width: 400,
                                  }}>
                                  <AutoCompleteDropDown
                                    // initialValue={formData?.address}
                                    initialValue={formData?.searchAddress}
                                    url={API_URLS.ADDRESS_AUTO_SUGG_}
                                    onChangeInput={text => {
                                      console.log('onChangeInput ==>', text);
                                      setData({
                                        ...formData,
                                        searchAddress: text,
                                        formattedAddress: '',
                                        city: '',
                                        state_id: '',
                                        postal_code: '',
                                        country_code: '',
                                      });
                                    }}
                                    onSelectItemL={item => {
                                      console.log(
                                        'Selected' + JSON.stringify(item),
                                      );
                                      setAddVeriStat(null);
                                      setAddVerify(false);
                                      if (item != null && item?.obj) {
                                        let formattedAddress = item.obj
                                          ? item.address
                                          : formData.formattedAddress;
                                        console.log(
                                          'formattedAddress ==>',
                                          formattedAddress,
                                        );

                                        setData({
                                          ...formData,
                                          searchAddress: item?.obj?.address,
                                          formattedAddress: formattedAddress,
                                          // address: item.address ? item.address : formData.address,
                                          // address: item.address ? item.id : formData.address,

                                          city: item.obj?.city,
                                          state_id: item.obj?.prov,
                                          postal_code: item.obj?.pc,
                                          country_code: item.obj?.country,
                                        });

                                        //value={formData?.address}
                                        console.log(
                                          'Selected address: ==>',
                                          item,
                                        );
                                        if (item.address) {
                                          setAddress(item.obj);
                                        }
                                      } else {
                                        console.log(
                                          'Selected address ELSE: ==>',
                                          item,
                                        );
                                      }
                                    }}
                                    onClear={() => {
                                      setAddress(null);
                                      setData({
                                        ...formData,
                                        formattedAddress: '',
                                        searchAddress: '',
                                      });
                                      setAddVerify(false);
                                      setAddVeriStat(null);
                                    }}
                                    placeholderTitle={'Select State'}
                                    divideWidthBy={1.2}
                                    //selectedValue={receiver_state_id}
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
                                    shadowOffset={
                                      theme?.textInput?.shadowOffset
                                    }
                                    placeholderColor={
                                      theme?.textInput?.placeholderColor
                                    }
                                    inputColor={theme?.textInput?.inputColor}
                                  />
                                </View>

                                <InputTextComponent
                                  placeholderTitle={'City, State  Postal code'}
                                  // icon={<Location />}
                                  icon={theme?.profileIcon?.location}
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
                                  value={formData?.formattedAddress}
                                  // value={formData?.address}
                                  disabled={true}
                                  // onChangeText={value => {
                                  //   console.log('Address==: ' + value);
                                  //   setData({ ...formData, address: value });
                                  // }}
                                  isVerified={addVeriStat}
                                />
                              </>
                            )}

                            {screen != 'tc' && screen != 'full' && (
                              <View
                                style={{
                                  ...styles.direction,
                                  // justifyContent: screen == 'name' ? 'center' : 'space-between'
                                }}>
                                {/* {screen != 'name' && */}
                                <TouchableOpacity
                                  onPress={() => onPreviousClick()}
                                  style={{ zIndex: 1 }}>
                                  {theme?.profileIcon?.backward}
                                </TouchableOpacity>
                                {/* } */}
                                <TouchableOpacity
                                  onPress={() => onNextClick()}
                                  style={{ zIndex: 1 }}>
                                  {theme?.profileIcon?.forward}
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                    // </ScrollView>
                  )}
                </View>
              </ScrollView>
            </AutocompleteDropdownContextProvider>
          </SafeAreaView>
        </View>
      )}
      {Platform.OS === 'android' ? (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content
            style={{
              padding: 50,
              backgroundColor: theme?.name == 'Light' ? 'white' : '#000000',
              borderWidth: 0.01,
              borderTopWidth: 3,
              zIndex: 100,
              borderColor: theme?.nav?.borderColor,
            }}>
            <Text
              style={{
                fontSize: 20,
                marginVertical: 25,
                color: theme?.colors?.text,
              }}>
              Change Profile Photo
            </Text>

            <View style={styles.buttonContainer}>
              <CustomButton
                title={'Camera'}
                onPress={captureImage}
                color={theme?.colors?.btnText}
                colors={theme?.colors?.colors}
                bordered={true}
                borderWidth={theme?.name == 'Light' ? 0 : 3}
                borderColors={theme?.colors?.borderColors}
                borderColor={theme?.colors?.borderColor}
                shadow={theme?.name == 'Light'}
              />
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                title={'Upload'}
                onPress={uploadImage}
                color={theme?.colors?.btnText}
                colors={theme?.colors?.colors}
                bordered={true}
                borderWidth={theme?.name == 'Light' ? 0 : 3}
                borderColors={theme?.colors?.borderColors}
                borderColor={theme?.colors?.borderColor}
                shadow={theme?.name == 'Light'}
              />
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                title={'Cancel'}
                onPress={onClose}
                color={theme?.colors?.btnText}
                colors={theme?.colors?.colors}
                // color={theme?.name == 'Light' ? "blue" : 'black'}
                // colors={['white', 'white', 'white']}
                bordered={true}
                borderWidth={theme?.name == 'Light' ? 0 : 3}
                borderColors={theme?.colors?.borderColors}
                borderColor={theme?.colors?.borderColor}
                shadow={theme?.name == 'Light'}
              />
            </View>
          </Actionsheet.Content>
        </Actionsheet>) : (
        null
      )}

      <ModalPoup
        theme={theme}
        visible={visible}
        title={msg}
        source={
          isSuccess
            ? require('../../assets/done.json')
            : require('../../assets/sign_in_animation.json')
        }
        btnTxt={'Ok'}
        onPressOk={() => {
          setVisible(false);

          if (screen == 'tc') {
            if (isSuccess) {
              if (
                navigation.route?.params?.from &&
                navigation.route?.params?.from == 'home'
              ) {
                navi.navigate('home');
              } else {
                setScreen('full');
                // navi.navigate('profile')
              }
            } else {
              setVisible(false);
            }
          } else {
            setVisible(false);
          }
        }}
        onPressClose={() => setVisible(false)}
      />

      {isTakeSig && screen != 'tc' && (
        <SignatureComponentNew
          signatureValue={
            formData?.signature
              ? formData?.signature?.startsWith('data:image')
                ? formData?.signature
                : API_URLS.IMAGE_URL + formData?.signature
              : null
          }
          // OLD Logic ===>
          // signatureValue={
          //   formData?.signature ?
          //     isSignatureLoaded
          //       ? formData?.signature
          //       : Url.IMAGE_URL + formData?.signature
          //     : null
          // }

          getSignature={async value => {
            setIsTakeSig(false);
            await getSignature(value);
          }}
          onBackClick={value => {
            onBackClick();
          }}
          theme={theme}
        />
      )}

      {!isTakeSig && screen == 'tc' && (
        <TermsCondition
          onBackClick={() => {
            onPreviousClick();
          }}
          onSave={() => {
            handleOnSave();
          }}
          loading={saveBtnLoad}
        />
      )}
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: 'center',
    zIndex: 1,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  profileInfo: {
    borderWidth: 4,
    padding: 30,
    borderRadius: 8,
    // borderColor: 'gray',
    width: Dimensions.get('window').width * 0.85,
    // backgroundColor: 'red',
    overflow: 'hidden',
  },
  infoDiv: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueDiv: {
    marginStart: 20,
  },
  type: {
    fontSize: 14,
  },
  direction: {
    marginTop: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  middleDive: {
    // paddingVertical: 250,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 7,
  },
  buttonContainer2: {
    // width: '90%',
    // paddingRight: 10,
    // paddingVertical: 1,
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    // position: 'absolute',
    // width: '100%',
    // height: '100%',
  },
  container: {
    flex: 1,
    //paddingTop: globalStyle.topPadding,
    // backgroundColor: globalStyle.statusBarColor,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 6,
    height: 117,
    width: 97,
    margin: 10,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
    // marginStart: 24,
    // marginTop: 16,
    // marginBottom: 16,
  },
  item: {
    marginStart: 5,
    marginTop: 16,
    marginBottom: 16,
    fontSize: 15,
    // color: '#2E476E',
  },
  line: {
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    paddingLeft: 20, // add left padding here
  },
  flexIt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrowCss: {
    marginTop: 16,
    paddingRight: 50,
  },
  planDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signaturePic: {
    height: 30,
    width: 60,
    // borderRadius: 50,
    // marginBottom: 25,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: 'white',
  },
  profilePic: {
    height: 72,
    width: 72,
    borderRadius: 50,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  iconDiv: {
    // backgroundColor: '#3D50DF',
    height: 60,
    width: 60,
    borderRadius: 50,
    // padding: 5,
    marginEnd: 5,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDiv2: {
    // backgroundColor: 'gray',
    // backgroundColor: '#3D50DF',
    height: 30,
    width: 30,
    borderRadius: 50,
  },
  editDiv: {
    flexDirection: 'row',
    marginStart: 32,
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center',
  },
});
