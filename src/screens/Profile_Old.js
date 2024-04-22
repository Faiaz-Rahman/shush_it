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
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
//Image Resource
//Assets
//Variables

//Class
import Url from '../Api.js';
import Token from '../class/TokenManager.js';
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
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [uploadedImageInfo, setUploadedImageInfo] = useState({});
  const [isRightBtn, setIsRightBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [btnLoad, setBtnLoad] = useState(false);
  const [formData, setData] = useState({});
  const [stateList, setStateList] = useState([]);
  const [token, setToken] = useState('');

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

  const getProfileInfo = async token => {
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
            // console.log("profileInfo==>", profileInfo)
            setData(profileInfo);
            getStateList(token);
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
              const newItem = { label: item.name, value: item.id };
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

  const handleOnSave = () => {
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
      formDataN.append('signature', formData?.signature);
    }

    formDataN.append('full_name', formData.full_name);
    formDataN.append('email', formData.email);
    formDataN.append('phone_number', formData.phone_number);
    formDataN.append('company_name', formData.company_name);
    formDataN.append('address', formData.address);
    formDataN.append('city', formData.city);
    formDataN.append('postal_code', formData.postal_code);
    formDataN.append('state_id', formData.state_id);
    // formDataN.append('country_id', formData.country_id);

    // console.log("formDataN==>", formDataN)

    try {
      var stateApi = Url.PROFILE_UPDATE;
      fetch(stateApi, {
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
            } else {
              console.log('Error==>', JSON.stringify(json));
              setIsSuccess(false);
              setMsg(json?.message);
              setVisible(true);
              setBtnLoad(false);
            }
          } catch (error) {
            console.error(error);
            console.log(error);
            setBtnLoad(false);
          }
        })
        .catch(error => {
          console.error(error);
          setBtnLoad(false);
        });
    } catch (error) {
      console.error(error);
      console.log(error);
      setBtnLoad(false);
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
    };

    await launchCamera(options, response => {
      if (response && response.assets) {
        console.log('Response==>', response?.assets[0]);
        let asset = response?.assets[0];
        setUploadedImageInfo(asset);
        setData({ ...formData, avatar: asset?.uri });
        setIsImageUploaded(true);
        onClose();
      }
    });
  };

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
    };

    await launchImageLibrary(options, response => {
      if (response && response.assets) {
        console.log('Response>', response?.assets[0]);
        let asset = response?.assets[0];
        setUploadedImageInfo(asset);
        setData({ ...formData, avatar: asset?.uri });
        setIsImageUploaded(true);
        onClose();
      }
    });
  };

  const getSignature = signature => {
    // console.log('signature==>', signature);
    setData({ ...formData, signature: signature });
    setIsSignatureLoaded(true);
    setIsTakeSig(false);
  };

  const onBackClick = () => {
    setIsTakeSig(false);
    console.log('On back press');
  };

  return (
    <View style={{flex:1,backgroundColor:'transparent'}}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: width }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView
          style={[
            styles.container,
            {
              paddingBottom: tabBarHeight + 100,
            },
          ]}>
          <View>
            <DocumentListHeader
              onPress={handlePress}
              title={isTakeSig ? 'Add Signature' : 'Profile'}
              dark={theme?.name == 'Light'}
              isRightBtn={isRightBtn}
              onPressRight={handleOnSave}
              rightBtnLoad={btnLoad}

              rightIcon={theme?.header?.checkIcon}

              backIcon={theme?.header?.backIcon}
              statusBarColor={theme?.colors?.statusBarColor}
              color={theme?.colors?.text}
            />
            <SignatureComponent
              visible={isTakeSig}
              getSignature={getSignature}
              onBackClick={onBackClick}
              theme={theme}
              rightIcon={theme?.header?.checkIcon}
            />
            <View>
              {isLoading ? (
                <ActivityIndicator
                  color={theme?.name != 'Light' ? theme?.colors?.text : globalStyle.colorAccent}
                  style={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    height: 540,
                  }}
                />
              ) : (
                <ScrollView
                  horizontal={false}
                  style={{ height: '100%' }}
                  // style={styles.categoryListContainer}
                  showsHorizontalScrollIndicator={true}>
                  {!isTakeSig && (
                    <>
                      <TouchableOpacity
                        onPress={() => onOpen()}
                        style={{ zIndex: 1 }}>
                        <View style={styles.editDiv}>
                          {formData?.avatar ? (
                            <Image
                              source={{
                                uri: isImageUploaded
                                  ? formData?.avatar
                                  : Url.IMAGE_URL + formData?.avatar,
                              }}
                              fallbackSource={{
                                uri: 'https://www.w3schools.com/css/img_lights.jpg',
                              }}
                              style={{ ...styles.profilePic, borderColor: theme?.name == 'Light' ? '#2E476E' : 'white' }}
                              aspectRatio={1}
                              alt=""
                              // size="2xl"
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={{
                              ...styles.iconDiv,
                              backgroundColor: theme?.name == 'Light' ? '#3D50DF' : 'black', borderWidth: theme?.name == 'Light' ? 0 : 1,
                              borderColor: theme?.colors?.text
                            }}
                            >
                              {/* <UserEdit /> */}
                              {theme?.profileIcon?.profile}
                            </View>
                          )}
                          <Text style={{ ...styles.item, color: theme?.name == 'Light' ? '#2E476E' : theme?.colors?.text }}>Change Profile Photo</Text>
                        </View>
                      </TouchableOpacity>

                      <View style={{ alignItems: 'center' }}>
                        <View style={{ paddingBottom: 20 }}>
                          <TextInput
                            placeholderTitle={'Name'}
                            // icon={<ProfileName />}
                            icon={theme?.profileIcon?.profile}
                            borderColor={theme?.textInput?.borderColor}
                            backgroundColor={theme?.textInput?.backgroundColor}
                            borderWidth={theme?.textInput?.borderWidth}
                            darkShadowColor={theme?.textInput?.darkShadowColor}
                            lightShadowColor={theme?.textInput?.lightShadowColor}
                            shadowOffset={theme?.textInput?.shadowOffset}
                            placeholderColor={theme?.textInput?.placeholderColor}
                            inputColor={theme?.textInput?.inputColor}

                            value={formData?.full_name}
                            onChangeText={value => {
                              console.log('Name==: ' + value);
                              setData({ ...formData, full_name: value });
                            }}
                          />
                        </View>
                        <View style={{ paddingBottom: 20 }}>
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

                            value={formData?.email}
                            disabled={true}
                            onChangeText={value => {
                              console.log('Email==: ' + value);
                              setData({ ...formData, email: value });
                            }}
                          />
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                          <TextInput
                            placeholderTitle={'Phone no'}
                            // icon={<Phone />}
                            icon={theme?.profileIcon?.phone}
                            borderColor={theme?.textInput?.borderColor}
                            backgroundColor={theme?.textInput?.backgroundColor}
                            borderWidth={theme?.textInput?.borderWidth}
                            darkShadowColor={theme?.textInput?.darkShadowColor}
                            lightShadowColor={theme?.textInput?.lightShadowColor}
                            shadowOffset={theme?.textInput?.shadowOffset}
                            placeholderColor={theme?.textInput?.placeholderColor}
                            inputColor={theme?.textInput?.inputColor}

                            value={formData?.phone_number}
                            onChangeText={value => {
                              console.log('Phone==: ' + value);
                              setData({ ...formData, phone_number: value });
                            }}
                          />
                        </View>
                        <View style={{ paddingBottom: 20 }}>
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
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                          <TextInput
                            placeholderTitle={'Address'}
                            // icon={<Location />}
                            icon={theme?.profileIcon?.location}
                            borderColor={theme?.textInput?.borderColor}
                            backgroundColor={theme?.textInput?.backgroundColor}
                            borderWidth={theme?.textInput?.borderWidth}
                            darkShadowColor={theme?.textInput?.darkShadowColor}
                            lightShadowColor={theme?.textInput?.lightShadowColor}
                            shadowOffset={theme?.textInput?.shadowOffset}
                            placeholderColor={theme?.textInput?.placeholderColor}
                            inputColor={theme?.textInput?.inputColor}

                            value={formData?.address}
                            onChangeText={value => {
                              console.log('Address==: ' + value);
                              setData({ ...formData, address: value });
                            }}
                          />
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            paddingBottom: 20,
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
                              backgroundColor={theme?.textInput?.backgroundColor}
                              borderWidth={theme?.textInput?.borderWidth}
                              darkShadowColor={theme?.textInput?.darkShadowColor}
                              lightShadowColor={theme?.textInput?.lightShadowColor}
                              shadowOffset={theme?.textInput?.shadowOffset}
                              placeholderColor={theme?.textInput?.placeholderColor}
                              inputColor={theme?.textInput?.inputColor}

                              value={formData?.city}
                              divideWidthBy={2.6}
                              onChangeText={value => {
                                console.log('City==: ' + value);
                                setData({ ...formData, city: value });
                              }}
                            />
                          </View>

                          <View>
                            <DropDown
                              data={stateList}
                              placeholderTitle={'Select State'}
                              divideWidthBy={2.6}
                              selectedValue={+formData?.state_id}

                              borderColor={theme?.textInput?.borderColor}
                              backgroundColor={theme?.textInput?.backgroundColor}
                              borderWidth={theme?.textInput?.borderWidth}
                              darkShadowColor={theme?.textInput?.darkShadowColor}
                              lightShadowColor={theme?.textInput?.lightShadowColor}
                              shadowOffset={theme?.textInput?.shadowOffset}
                              placeholderColor={theme?.textInput?.placeholderColor}
                              inputColor={theme?.textInput?.inputColor}

                              onSelectItem={id => {
                                console.log('Selected state id: ' + id);
                                setData({ ...formData, state_id: id });
                              }}
                            />
                          </View>
                        </View>

                        <View style={{ paddingBottom: 10 }}>
                          <TextInput
                            placeholderTitle={'Postal Code'}
                            // icon={<EmailSVG />}
                            borderColor={theme?.textInput?.borderColor}
                            backgroundColor={theme?.textInput?.backgroundColor}
                            borderWidth={theme?.textInput?.borderWidth}
                            darkShadowColor={theme?.textInput?.darkShadowColor}
                            lightShadowColor={theme?.textInput?.lightShadowColor}
                            shadowOffset={theme?.textInput?.shadowOffset}
                            placeholderColor={theme?.textInput?.placeholderColor}
                            inputColor={theme?.textInput?.inputColor}

                            value={formData?.postal_code}
                            onChangeText={value => {
                              console.log('Postal==: ' + value);
                              setData({ ...formData, postal_code: value });
                            }}
                          />
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => setIsTakeSig(true)}
                        style={{ zIndex: 1 }}>
                        <View style={styles.editDiv}>
                          {formData?.signature ? (
                            <Image
                              source={{
                                uri: isSignatureLoaded
                                  ? formData?.signature
                                  : Url.IMAGE_URL + formData?.signature,
                                // uri: Url.IMAGE_URL + '/' + formData?.signature
                              }}
                              fallbackSource={{
                                uri: 'https://www.w3schools.com/css/img_lights.jpg',
                              }}
                              style={{ ...styles.profilePic, borderColor: theme?.name == 'Light' ? '#2E476E' : 'white', backgroundColor: 'white' }}
                              aspectRatio={1}
                              alt=""
                              // size="2xl"
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={{
                              ...styles.iconDiv,
                              backgroundColor: theme?.name == 'Light' ? '#3D50DF' : 'black', borderWidth: theme?.name == 'Light' ? 0 : 1,
                              borderColor: theme?.colors?.text
                            }}
                            >
                              {/* <Edit style={styles.icon} /> */}
                              {theme?.profileIcon?.edit}
                            </View>
                          )}
                          <Text
                            style={{ ...styles.item, color: theme?.name == 'Light' ? '#2E476E' : theme?.colors?.text }}
                          >
                            Add Signature
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* <ThemeSelectorForTest /> */}

                </ScrollView>
              )}
            </View>

            <Actionsheet isOpen={isOpen} onClose={onClose}>
              <Actionsheet.Content
                style={{
                  padding: 50,
                  backgroundColor: theme?.name == 'Light' ? 'white' : '#000000',
                  borderWidth: .01,
                  borderTopWidth: 3,
                  borderColor: theme?.nav?.borderColor,
                }}
              >
                <Text style={{ fontSize: 20, marginVertical: 25, color: theme?.colors?.text }}>
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

                    // color={theme?.colors?.btnText}
                    // colors={theme?.colors?.colors}
                    color={theme?.name == 'Light' ? "blue" : 'black'}
                    colors={['white', 'white', 'white']}
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
        </SafeAreaView>
      </KeyboardAvoidingView>
      </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 7,
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
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
  profilePic: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginEnd: 5,
    borderWidth: 1,
    // borderColor: '#2E476E',
  },
  iconDiv: {
    // backgroundColor: '#3D50DF',
    height: 40,
    width: 40,
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
