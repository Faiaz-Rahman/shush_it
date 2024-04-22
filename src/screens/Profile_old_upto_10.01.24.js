import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Actionsheet, useDisclose } from 'native-base';
import { React, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  BackHandler,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
//Image Resource
//Assets
//Variables

//Class
import Url from '../Api.js';
import Token from '../class/TokenManager.js';
import AsyncStorageManager from '../class/AsyncStorageManager.js';
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

export default function Profile(navigation) {
  const navi = useNavigation();
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');

  const { isOpen, onOpen, onClose } = useDisclose();

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
  const [screen, setScreen] = useState('full');

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    const asyncFunc = async () => {
      let userToken = await Token.getToken();
      if (userToken) {
        setToken(userToken);
        getProfileInfo(userToken);
      } else {
        console.log('Token not found');
        return false;
      }
    };
    asyncFunc();

    console.log('Bottom height: ' + tabBarHeight + 'inset: ' + insets.top);
  }, []);

  const handlePress = () => {
    navi.goBack();
  };

  const getProfileInfo = async (token, isProfileStatus = false) => {
    setIsLoading(true);
    var stateApi = Url.PROFILE;
    await fetch(stateApi, {
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
            var profileInfo = json.data;
            if (!isProfileStatus) {
              console.log('profileInfo==>', profileInfo);
              setData(profileInfo);
              setOldPic(profileInfo?.avatar);
              getStateList(token);
            } else {
              const profileStatus = profileInfo.profile_status;
              console.log('profile status==>' + profileStatus);
              AsyncStorageManager.storeData(
                CONSTANTS.PROFILE_STATUS,
                profileStatus + '',
              );
              setIsLoading(false);
            }
          } else {
            console.log('Status: ' + JSON.stringify(responseJson) + 'State list error: ' + JSON.stringify(json));
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

  const getStateList = async token => {
    setIsLoading(true);
    var stateApi = Url.STATE_LIST;
    await fetch(stateApi, {
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
            var list = json.data;
            var newData = [];
            for (let i = 0; i < list.length; i++) {
              const item = list[i];
              const newItem = { label: item.name, value: item.id, country_id: item.country_id, country_code: item.country_code };
              newData.push(newItem);
            }
            setStateList(newData);
            setIsRightBtn(true);
          } else {
            console.log('State list error: ' + JSON.stringify(json));
          }
          setIsLoading(false);
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

  //Signature upload
  const handleOnSave = (isSignatureLoaded = isSignatureLoaded, signature = formData?.signature) => {
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

    formDataN.append('full_name', formData.full_name || '');
    formDataN.append('email', formData.email || '');
    formDataN.append('phone_number', formData.phone_number || '');
    formDataN.append('company_name', formData.company_name || '');
    formDataN.append('address', formData.address || '');
    formDataN.append('city', formData.city || '');
    formDataN.append('postal_code', formData.postal_code || '');
    formDataN.append('state_id', formData.state_id || '');
    formDataN.append('country_code', formData.country_code);
    //formDataN.append('country_id', formData.country_id);

    console.log("formDataN==>", formDataN)

    try {
      var api = Url.PROFILE_UPDATE;
      console.log("update profile api", api)
      fetch(api, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
          //'Content-Type': 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
        },
        body: formDataN,
      })
        .then(response => response.json())
        .then(responseJson => {
          try {
            var a = JSON.stringify(responseJson);
            var json = JSON.parse(a);
            if (responseJson.status === 200) {
              setBtnLoad(false);
              console.log('Status==> ok');
              setIsSuccess(true);
              setMsg(json?.message);
              setVisible(true);
              setScreen('full');
              setIsLoading(false);
              setConfirmForProfile(false);

              //For get profile
              getProfileInfo(token, true);
            } else {
              console.log('Error==>', JSON.stringify(json));
              setIsSuccess(false);
              setMsg(json?.message);
              setVisible(true);
              setBtnLoad(false);
              setIsLoading(false);
              setConfirmForProfile(false);
            }
          } catch (error) {
            console.error(error);
            console.log(error);
            setBtnLoad(false);
            setIsLoading(false);
            setConfirmForProfile(false);
          }
        })
        .catch(error => {
          console.error(error);
          setBtnLoad(false);
          setIsLoading(false);
          setConfirmForProfile(false);
        });
    } catch (error) {
      console.error(error);
      console.log(error);
      setBtnLoad(false);
      setIsLoading(false);
    }
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

  const getSignature = async signature => {
    // console.log('signature==>', signature);
    setData({ ...formData, signature: signature });
    setIsSignatureLoaded(true);
    setIsTakeSig(false);

    setIsLoading(true);
    handleOnSave(true, signature);
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
  };

  const onNextClick = () => {
    if (screen == 'full') {
      setScreen('name');
    }
    if (screen == 'name') {
      setScreen('email');
    }
    if (screen == 'email') {
      setScreen('phone');
    }
    if (screen == 'phone') {
      if (Validator.Validate('phone', formData?.phone_number)) {
        setScreen('others');
      } else {
        setMsg('Invalid phone number');
        setVisible(true);
      }
    }
    if (screen == 'others') {
      setIsTakeSig(true);
    }
  };

  return (
    <ImageBackground
      source={theme?.bg?.bgImg}
      resizeMode="cover"
      style={styles.bgImage}>
      <SafeAreaView
        style={[
          styles.container,
          {
            paddingBottom: tabBarHeight + 100,
          },
        ]}>
        {/* <KeyboardAvoidingView
          style={{ flex: 1, width: width }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
        <View>
          <DocumentListHeader
            onPress={handlePress}
            title={isTakeSig ? 'Add Signature' : 'Profile'}
            isRightBtn={
              !isLoading
                ? screen === 'full' || screen === 'others'
                  ? true
                  : false
                : false
            }
            // isRightBtn={isRightBtn}
            onPressRight={() =>
              screen === 'others' ? handleOnSave() : setScreen('name')
            }
            // onPressRight={handleOnSave}
            rightBtnLoad={btnLoad}
            rightIcon={
              screen === 'others'
                ? theme?.header?.checkIcon
                : theme?.profileIcon?.proEdit
            }
            // rightIcon={theme?.header?.checkIcon}

            backIcon={theme?.header?.backIcon}
            statusBarColor={theme?.colors?.statusBarColor}
            dark={theme?.name === 'Light'}
            color={theme?.colors?.text}
          />
          <SignatureComponent
            visible={isTakeSig}
            //getSignature={getSignature}
            getSignature={async value => {
              setIsTakeSig(false);
              await getSignature(value);
            }}
            onBackClick={value => {
              onBackClick();
            }}
            theme={theme}
            rightIcon={theme?.header?.checkIcon}
          />

          <ScrollView
            horizontal={false}
            // style={styles.categoryListContainer}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              height: Dimensions.get('window').height * 0.75,
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
                      style={{
                        height: Dimensions.get('window').height * 0.87,
                      }}>
                      <View style={styles.middleDive}>
                        {screen != 'full' && (
                          <Text
                            style={{
                              fontSize: 22,
                              marginBottom: 50,
                              textAlign: 'center',
                              color: theme?.colors?.text,
                            }}>
                            Personal Information
                          </Text>
                        )}

                        {/* Full profile view */}
                        {screen == 'full' && (
                          <View style={styles?.profileInfo}>
                            {/* Avatar */}
                            <TouchableOpacity
                              onPress={() => onOpen()}
                              style={styles.avatar}>
                              {formData?.avatar ? (
                                <Image
                                  source={{
                                    uri: isImageUploaded
                                      ? formData?.avatar_local
                                      : Url.IMAGE_URL + formData?.avatar,
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
                                    borderWidth: theme?.name == 'Light' ? 0 : 1,
                                    borderColor: theme?.colors?.text,
                                  }}>
                                  {theme?.profileIcon?.profile}
                                </View>
                              )}
                              {/* <Text style={{ ...styles.item, color: theme?.name == 'Light' ? '#2E476E' : theme?.colors?.text }}>Change Profile Photo</Text> */}
                            </TouchableOpacity>

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
                            <View style={{ ...styles.infoDiv, marginTop: 10 }}>
                              {theme?.profileIcon?.profile}
                              <View style={styles.valueDiv}>
                                <Text
                                  style={{
                                    ...styles.type,
                                    color:
                                      theme?.name == 'Honeycomb'
                                        ? 'gray'
                                        : theme?.colors?.text,
                                  }}>
                                  Name
                                </Text>
                                <Text style={{ ...styles.type, color: 'white' }}>
                                  {formData?.full_name}
                                </Text>
                              </View>
                            </View>

                            {/* Email */}
                            <View style={{ ...styles.infoDiv, marginTop: 20 }}>
                              {theme?.profileIcon?.email}
                              <View style={styles.valueDiv}>
                                <Text
                                  style={{
                                    ...styles.type,
                                    color:
                                      theme?.name == 'Honeycomb'
                                        ? 'gray'
                                        : theme?.colors?.text,
                                  }}>
                                  Email
                                </Text>
                                <Text style={{ ...styles.type, color: 'white' }}>
                                  {formData?.email}
                                </Text>
                              </View>
                            </View>

                            {/*  Phone */}
                            <View style={{ ...styles.infoDiv, marginTop: 20 }}>
                              {theme?.profileIcon?.phone}
                              <View style={styles.valueDiv}>
                                <Text
                                  style={{
                                    ...styles.type,
                                    color:
                                      theme?.name == 'Honeycomb'
                                        ? 'gray'
                                        : theme?.colors?.text,
                                  }}>
                                  Phone
                                </Text>
                                <Text style={{ ...styles.type, color: 'white' }}>
                                  {formData?.phone_number}
                                </Text>
                              </View>
                            </View>

                            {/*  Company */}
                            {/* <View style={{ ...styles.infoDiv, marginTop: 20 }}>
                              {theme?.profileIcon?.company}
                              <View style={styles.valueDiv}>
                                <Text
                                  style={{ ...styles.type, color: theme?.name == 'Honeycomb' ? 'gray' : theme?.colors?.text }}
                                >
                                  Company Name
                                </Text>
                                <Text style={{ ...styles.type, color: 'white' }}>{formData?.company_name}</Text>
                              </View>
                            </View> */}

                            {/*  Address */}
                            <View style={{ ...styles.infoDiv, marginTop: 20 }}>
                              {theme?.profileIcon?.location}
                              <View style={styles.valueDiv}>
                                <Text
                                  style={{
                                    ...styles.type,
                                    color:
                                      theme?.name == 'Honeycomb'
                                        ? 'gray'
                                        : theme?.colors?.text,
                                  }}>
                                  Address
                                </Text>
                                <Text style={{ ...styles.type, color: 'white' }}>
                                  {formData?.address}
                                </Text>
                              </View>
                            </View>

                            {/*  Signature */}
                            <View style={{ ...styles.infoDiv, marginTop: 20 }}>
                              {theme?.profileIcon?.edit}
                              <View style={styles.valueDiv}>
                                <Text
                                  style={{
                                    ...styles.type,
                                    color:
                                      theme?.name == 'Honeycomb'
                                        ? 'gray'
                                        : theme?.colors?.text,
                                    marginBottom: 5,
                                  }}>
                                  Signature
                                </Text>

                                {/* <===== Don't Delete this ====> */}
                                {/* <View style={styles?.signaturePic}>
                                  <Image
                                    source={{
                                      uri: isSignatureLoaded
                                        ? formData?.signature
                                        : Url.IMAGE_URL + formData?.signature,
                                    }}
                                    fallbackSource={{
                                      uri: 'https://www.w3schools.com/css/img_lights.jpg',
                                    }}
                                    style={{
                                      height: 30,
                                      width: 60,
                                      alignSelf: 'center',
                                    }}
                                    // style={styles.profilePic}
                                    aspectRatio={1}
                                    alt=""
                                    // size="2xl"
                                    resizeMode="cover"
                                  />
                                </View> */}

                                <TouchableOpacity
                                  onPress={() => setIsTakeSig(true)}
                                  style={formData?.signature ? styles.signaturePic : null}
                                >
                                  {formData?.signature ? (
                                    <Image
                                      source={{
                                        uri: isSignatureLoaded
                                          ? formData?.signature
                                          : Url.IMAGE_URL + formData?.signature,
                                        // uri: Url.IMAGE_URL +
                                        //   '/' +
                                        //   formData?.signature,
                                      }}
                                      fallbackSource={{
                                        uri: 'https://www.w3schools.com/css/img_lights.jpg',
                                      }}
                                      style={{
                                        height: 30,
                                        width: 60,
                                        alignSelf: 'center',
                                      }}
                                      // style={styles.profilePic}
                                      aspectRatio={1}
                                      alt=""
                                      // size="2xl"
                                      resizeMode="cover"
                                    />
                                  ) : (
                                    <View style={styles.buttonContainer2}>
                                      <ButtonComponentSmall
                                        title={'Create'}
                                        color={theme?.colors?.btnText}
                                        colors={theme?.colors?.colors}
                                        bordered={true}
                                        borderWidth={theme?.name == 'Light' ? 0 : 1}
                                        borderColor={theme?.colors?.borderColor}
                                        borderColors={theme?.colors?.borderColors}
                                        shadow={theme?.name == 'Light'}
                                        onPress={() => {
                                          setIsTakeSig(true)
                                        }}
                                      />
                                    </View>

                                    // <Text
                                    //   style={{
                                    //     alignSelf: 'center',
                                    //     alignItems: 'center',
                                    //     color: 'black',
                                    //   }}>
                                    //   Create
                                    // </Text>

                                    // <View style={{
                                    //   ...styles.iconDiv,
                                    //   backgroundColor: theme?.name == 'Light' ? '#3D50DF' : 'black', borderWidth: theme?.name == 'Light' ? 0 : 1,
                                    //   borderColor: theme?.colors?.text
                                    // }}
                                    // >
                                    //   {theme?.profileIcon?.edit}
                                    // </View>
                                  )}
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        )}

                        {screen == 'name' && (
                          <TextInput
                            placeholderTitle={'Name'}
                            // icon={<ProfileName />}
                            icon={theme?.profileIcon?.profile}
                            borderColor={theme?.textInput?.borderColor}
                            backgroundColor={theme?.textInput?.backgroundColor}
                            borderWidth={theme?.textInput?.borderWidth}
                            darkShadowColor={theme?.textInput?.darkShadowColor}
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
                          <TextInput
                            placeholderTitle={'Email'}
                            // icon={<EmailSVG />}
                            icon={theme?.profileIcon?.email}
                            borderColor={theme?.textInput?.borderColor}
                            backgroundColor={theme?.textInput?.backgroundColor}
                            borderWidth={theme?.textInput?.borderWidth}
                            darkShadowColor={theme?.textInput?.darkShadowColor}
                            lightShadowColor={
                              theme?.textInput?.lightShadowColor
                            }
                            shadowOffset={theme?.textInput?.shadowOffset}
                            placeholderColor={
                              theme?.textInput?.placeholderColor
                            }
                            inputColor={theme?.textInput?.inputColor}
                            value={formData?.email}
                            type='email'
                            disabled={true}
                            onChangeText={value => {
                              console.log('Email==: ' + value);
                              setData({ ...formData, email: value });
                            }}
                          />
                        )}

                        {screen == 'phone' && (
                          <TextInput
                            placeholderTitle={'Phone no'}
                            // icon={<Phone />}
                            icon={theme?.profileIcon?.phone}
                            borderColor={theme?.textInput?.borderColor}
                            backgroundColor={theme?.textInput?.backgroundColor}
                            borderWidth={theme?.textInput?.borderWidth}
                            darkShadowColor={theme?.textInput?.darkShadowColor}
                            lightShadowColor={
                              theme?.textInput?.lightShadowColor
                            }
                            shadowOffset={theme?.textInput?.shadowOffset}
                            placeholderColor={
                              theme?.textInput?.placeholderColor
                            }
                            inputColor={theme?.textInput?.inputColor}
                            value={formData?.phone_number}
                            type='numeric'
                            onChangeText={value => {
                              console.log('Phone==: ' + value);
                              setData({ ...formData, phone_number: value });
                            }}
                          />
                        )}

                        {screen == 'others' && (
                          <>
                            {/* <View style={{ marginBottom: 20 }}>
                              <TextInput
                                placeholderTitle={'Company Name'}
                                // icon={<Company />}
                                icon={theme?.profileIcon?.company}
                                borderColor={theme?.textInput?.borderColor}
                                backgroundColor={theme?.textInput?.backgroundColor}
                                borderWidth={theme?.textInput?.borderWidth}
                                darkShadowColor={theme?.textInput?.darkShadowColor}
                                lightShadowColor={theme?.textInput?.lightShadowColor}
                                shadowOffset={theme?.textInput?.shadowOffset}
                                placeholderColor={theme?.textInput?.placeholderColor}
                                inputColor={theme?.textInput?.inputColor}

                                value={formData?.company_name}
                                onChangeText={value => {
                                  console.log('Company==: ' + value);
                                  setData({ ...formData, company_name: value });
                                }}
                              />
                            </View> */}

                            <View
                              style={{
                                flexDirection: 'row',
                                paddingVertical: 20,
                                // alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 10,
                                // width: 400,
                              }}>
                              <DropDown
                                data={stateList}
                                placeholderTitle={'Select State'}
                                divideWidthBy={1.2}
                                selectedValue={+formData?.state_id}
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
                                onSelectItem={async (id, item) => {
                                  //console.log('Selected state id: ' + id + ' item: ' + JSON.stringify(item));
                                  setData({ ...formData, state_id: item.value, country_code: item.country_code });
                                  //setData({ ...formData, country_code: item.country_code });
                                }}
                              />
                            </View>
                            <TextInput
                              placeholderTitle={'Address'}
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
                              value={formData?.address}
                              onChangeText={value => {
                                console.log('Address==: ' + value);
                                setData({ ...formData, address: value });
                              }}
                            />

                            <View
                              style={{
                                flexDirection: 'row',
                                paddingVertical: 20,
                                // alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 10,
                                // width: 400,
                              }}>
                              <View style={{ paddingRight: 10 }}>
                                <TextInput
                                  placeholderTitle={'City'}
                                  // icon={<EmailSVG />}
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
                                  value={formData?.city}
                                  divideWidthBy={2.6}
                                  onChangeText={value => {
                                    console.log('City==: ' + value);
                                    setData({ ...formData, city: value });
                                  }}
                                />
                              </View>
                              <TextInput
                                placeholderTitle={'Postal Code'}
                                // icon={<EmailSVG />}
                                borderColor={theme?.textInput?.borderColor}
                                divideWidthBy={2.6}
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
                                value={formData?.postal_code}
                                type='numeric'
                                onChangeText={value => {
                                  console.log('Postal==: ' + value);
                                  setData({ ...formData, postal_code: value });
                                }}
                              />
                            </View>
                          </>
                        )}

                        {screen != 'full' && (
                          <View
                            style={{
                              ...styles.direction,
                              // justifyContent: screen == 'full' ? 'space-between' : 'flex-end'
                            }}>
                            <TouchableOpacity
                              onPress={() => onPreviousClick()}
                              style={{ zIndex: 1 }}>
                              {theme?.profileIcon?.backward}
                            </TouchableOpacity>

                            {screen != 'others' && (
                              <TouchableOpacity
                                onPress={() => onNextClick()}
                                style={{ zIndex: 1 }}>
                                {theme?.profileIcon?.forward}
                              </TouchableOpacity>
                            )}
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

          <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content
              style={{
                padding: 50,
                backgroundColor: theme?.name == 'Light' ? 'white' : '#000000',
                borderWidth: 0.01,
                borderTopWidth: 3,
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

              {/* <Button
                  // flex={1}
                  mt="2"
                  mb="2"
                  size="lg"
                  width="full"
                  shadow={'5'}
                  colorScheme="blue"
                  borderRadius={'xl'}
                  onPress={captureImage}>
                  Camera
                </Button> */}

              {/* <Button
                  // flex={1}
                  mt="2"
                  mb="2"
                  size="lg"
                  width="full"
                  shadow={'5'}
                  colorScheme="blue"
                  borderRadius={'xl'}
                  onPress={uploadImage}>
                  Upload
                </Button> */}

              {/* <Button
                  // flex={1}
                  mt="2"
                  mb="2"
                  size="lg"
                  width="full"
                  colorScheme="blue"
                  variant="outline"
                  borderRadius={'xl'}
                  onPress={onClose}>
                  Cancel
                </Button> */}
            </Actionsheet.Content>
          </Actionsheet>

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
            onPressOk={() => setVisible(false)}
            onPressClose={() => setVisible(false)}
          />
        </View>
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: 'center',
    zIndex: 1,
  },
  profileInfo: {
    borderWidth: 4,
    padding: 30,
    borderRadius: 8,
    borderColor: 'gray',
    width: Dimensions.get('window').width * 0.85,
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
    marginTop: 100,
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
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginStart: 24,
    marginTop: 16,
    marginBottom: 16,
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
