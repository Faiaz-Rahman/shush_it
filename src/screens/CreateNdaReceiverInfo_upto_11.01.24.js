import { useNavigation } from '@react-navigation/native';
import { React, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
//import { ScrollView } from 'react-native-virtualized-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
//Image Resource
//Assets
import Company from '../../assets/company.svg';
import EmailSVG from '../../assets/email.svg';
import Location from '../../assets/location2.svg';
import Phone from '../../assets/phone.svg';
import ProfileName from '../../assets/profileName.svg';

//Variables
//Class
import Url from '../Api.js';
import Token from '../class/TokenManager.js';
//Component
import DocumentListHeader from '../components/global/DocumentListHeaderComponent';
import TextInput from '../components/global/InputTextComponent.js';
import SelectComponent from '../components/global/SelectComponent';
import StepsComponent from '../components/global/StepsComponent';
import CustomButton from '../components/global/ButtonComponent.js';
import DropDown from '../components/global/StateDropDownComponent.js';
//Style
import globalStyle from '../../styles/MainStyle.js';
import { useTheme } from '../../styles/ThemeProvider';
import ThemeSelectorForTest from '../components/global/ThemeSelectorForTest';
import Validator from '../class/Validator';
import ModalPoup from '../components/global/ModalPoupComponent';
import AsyncStorageManager from '../class/AsyncStorageManager';
import CONSTANTS from '../Constants';

export default function CreateNdaReceiverInfo(navigation) {
  const { theme } = useTheme();

  const { width, height } = Dimensions.get('window');

  const navi = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [stateList, setStateList] = useState([]);
  // const [errMsg, setErrMsg] = useState('');
  const [screen, setScreen] = useState('name');
  const [formData, setData] = useState({});

  const [visible, setVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userEmail, setUserEmail] = useState(null);

  const { sample_id, sample_name, document_name, filePath, data} =
    navigation.route.params;

  console.log("receiver_Info:",navigation.route?.params)

  var receiver_name = navigation.route?.params?.receiver_name || '';
  var receiver_email = navigation.route?.params?.receiver_email || '';
  var receiver_phone_number =
    navigation.route?.params?.receiver_phone_number || '';
  var receiver_company_name =
    navigation.route?.params?.receiver_company_name || '';
  var receiver_address = navigation.route?.params?.receiver_address || '';
  var receiver_city = navigation.route?.params?.receiver_city || '';
  var receiver_state_id = navigation.route?.params?.receiver_state_id || '';
  var receiver_postal_code =
    navigation.route?.params?.receiver_postal_code || '';

  var errMsg = '';

  const handleInput = (key, value) => {
    switch (key) {
      case 'name':
        receiver_name = value;
        break;
      case 'email':
        receiver_email = value;
        break;
      case 'phone':
        receiver_phone_number = value;
        break;
      case 'company':
        receiver_company_name = value;
        break;
      case 'address':
        receiver_address = value;
        break;
      case 'city':
        receiver_city = value;
        break;
      case 'state':
        receiver_state_id = value;
        break;
      case 'postalCode':
        receiver_postal_code = value;
        break;
      default:
        console.log('Invalid key');
    }
  };

  const handlePress = () => {
    navi.goBack();
  };

  useEffect(() => {
    console.log('Sample ID:', sample_id);
    console.log('Sample Name:', sample_name);
    console.log('Document Name:', document_name);
    console.log('File Path:', filePath);

    setData(navigation.route?.params);

    const asyncFunc = async () => {
      let userToken = await Token.getToken();
      let userEmail = await AsyncStorageManager.getData(CONSTANTS.USER_EMAIL /*'user_email'*/);
      setUserEmail(userEmail)
      if (userToken) {
        getStateList(userToken);
      } else {
        console.log('Token not found');
        return false;
      }
    };

    asyncFunc();
  }, []);

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
            setIsLoading(false);
            // console.log('State list ' + JSON.stringify(json));
            setStateList(newData);
            //setIsRightBtn(true)
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

  const validate = () => {
    var valid = true;

    if (formData?.receiver_name == '') {
      errMsg = 'Name is required';
      return false;
    } else if (formData?.receiver_email == '') {
      errMsg = 'Email is required';
      return false;
    } else if (formData?.receiver_address == '') {
      errMsg = 'Address is required';
      return false;
    }
    // else if (formData?.receiver_company_name == '') {
    //   errMsg = 'Company is required';
    //   return false;
    // }
    else if (formData?.receiver_city == '') {
      errMsg = 'City is required';
      return false;
    } else if (formData?.receiver_state_id == '') {
      errMsg = 'State is required';
      return false;
    } else if (formData?.receiver_postal_code == '') {
      errMsg = 'Postal code is required';
      return false;
    }

    // if (receiver_name == '') {
    //   errMsg = 'Name is required';
    //   return false;
    // } else if (receiver_email == '') {
    //   errMsg = 'Email is required';
    //   return false;
    // } else if (receiver_address == '') {
    //   errMsg = 'Address is required';
    //   return false;
    // } else if (receiver_company_name == '') {
    //   errMsg = 'Company is required';
    //   return false;
    // } else if (receiver_city == '') {
    //   errMsg = 'City is required';
    //   return false;
    // } else if (receiver_state_id == '') {
    //   errMsg = 'State is required';
    //   return false;
    // } else if (receiver_postal_code == '') {
    //   errMsg = 'Postal code is required';
    //   return false;
    // }

    return valid;
  };

  const onPressNext = () => {
    console.log('infos===>', formData);

    if (validate()) {
      navi.navigate('create_nda_party_customize', {
        // navi.navigate('create_nda_party_list', {
        sample_id: sample_id,
        sample_name: sample_name,
        document_name: document_name,

        filePath: filePath,
        data: data,

        receiver_name: formData?.receiver_name,
        receiver_email: formData?.receiver_email,
        receiver_phone_number: formData?.receiver_phone_number,
        // receiver_company_name: formData?.receiver_company_name,
        receiver_address: formData?.receiver_address,
        receiver_city: formData?.receiver_city,
        receiver_state_id: formData?.receiver_state_id,
        receiver_country_code: formData?.country_code,
        receiver_postal_code: formData?.receiver_postal_code,

        // receiver_name: receiver_name,
        // receiver_email: receiver_email,
        // receiver_phone_number: receiver_phone_number,
        // receiver_company_name: receiver_company_name,
        // receiver_address: receiver_address,
        // receiver_city: receiver_city,
        // receiver_state_id: receiver_state_id,
        // receiver_postal_code: receiver_postal_code,
      });
    } else {
      // Alert.alert('Error', `${errMsg}`, [{ text: 'OK', onPress: () => { } }]);
      setErrorMsg(errMsg);
      setVisible(true);
    }
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
    console.log('clicked', screen);
    if (screen == 'full') {
      setScreen('name');
    }
    if (screen == 'name') {
      if (formData?.receiver_name == '') {
        setErrorMsg('Name is required');
        setVisible(true);
        return false;
      }
      else {
        setScreen('email');
      }
    }
    if (screen == 'email') {
      if (formData?.receiver_email === undefined || formData?.receiver_email === null || formData?.receiver_email == '') {
        setErrorMsg("Email is required");
        setVisible(true);
        return;
      }

      if (formData?.receiver_email?.trim() == userEmail) {
        setErrorMsg("You can't send NDA to yourself");
        setVisible(true);
        return;
      }

      if (Validator.Validate('email', formData?.receiver_email)) {
        setScreen('phone');
      } else {
        setErrorMsg('Invalid Email');
        setVisible(true);
      }
    }
    if (screen == 'phone') {
      if (formData?.receiver_phone_number?.trim().length > 0) {
        if (Validator.Validate('phone', formData?.receiver_phone_number)) {
          setScreen('others');
        } else {
          setErrorMsg('Invalid phone number');
          setVisible(true);
        }
      } else {
        setScreen('others');
      }
    }
    if (screen == 'others') {
      onPressNext();
    }
  };

  return (
    <ImageBackground
      source={theme?.bg?.bgImg}
      resizeMode="cover"
      style={styles.bgImage}>
      <SafeAreaView style={styles.container}>
        {/* <KeyboardAvoidingView
          style={{ flex: 1, width: width }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
        <DocumentListHeader
          onPress={handlePress}
          title={'Create NDA'}
          backIcon={theme?.header?.backIcon}
          statusBarColor={theme?.colors?.statusBarColor}
          dark={theme?.name === 'Light'}
          color={theme?.colors?.text}
        />
        {/* <ThemeSelectorForTest /> */}
        {/* Steps */}
        <View style={{ marginTop: 15, zIndex: 1, }}>
          <StepsComponent active={2} theme={theme} />
        </View>

        <ScrollView
          horizontal={false}
          // style={styles.categoryListContainer}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            height: Dimensions.get('window').height * 0.75,
          }}
          showsHorizontalScrollIndicator={false}>
          <View style={{ marginTop: 15, paddingBottom: 50 }}>
            {/* <ScrollView
            horizontal={false
            // style={styles.categoryListContainer}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              height: Dimensions.get('window').height * 0.75,
            }}
            showsHorizontalScrollIndicator={false}> */}
            {isLoading ? (
              <ActivityIndicator
                color={
                  theme?.name == 'Light'
                    ? globalStyle.colorAccent
                    : theme?.colors?.text
                }
              />
            ) : (
              <View
                style={{
                  height: Dimensions.get('window').height * 0.75,
                }}>
                <View style={styles.middleDive}>
                  <Text
                    style={{
                      fontSize: 22,
                      marginBottom: 50,
                      textAlign: 'center',
                      color: theme?.colors?.text,
                    }}>
                    Receiver Information
                  </Text>

                  {screen == 'name' && (
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
                      // defaultValue={receiver_name}
                      value={formData?.receiver_name}
                      onChangeText={value => {
                        console.log('Name==: ' + value);
                        // receiver_name = value;
                        setData({ ...formData, receiver_name: value });
                        // handleInput('name', value);
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
                      lightShadowColor={theme?.textInput?.lightShadowColor}
                      shadowOffset={theme?.textInput?.shadowOffset}
                      placeholderColor={theme?.textInput?.placeholderColor}
                      inputColor={theme?.textInput?.inputColor}
                      value={formData?.receiver_email}
                      type='email'
                      // defaultValue={receiver_email}
                      onChangeText={value => {
                        console.log('Email==: ' + value);
                        setData({ ...formData, receiver_email: value });
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
                      lightShadowColor={theme?.textInput?.lightShadowColor}
                      shadowOffset={theme?.textInput?.shadowOffset}
                      placeholderColor={theme?.textInput?.placeholderColor}
                      inputColor={theme?.textInput?.inputColor}
                      value={formData?.receiver_phone_number}
                      type='numeric'
                      // defaultValue={receiver_phone_number}
                      onChangeText={value => {
                        console.log('Phone==: ' + value);
                        setData({ ...formData, receiver_phone_number: value });
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

                          value={formData?.receiver_company_name}
                          // defaultValue={receiver_company_name}
                          onChangeText={value => {
                            console.log('Company==: ' + value);
                            setData({ ...formData, receiver_company_name: value });
                          }}
                        />
                      </View> */}

                      <DropDown
                        data={stateList}
                        placeholderTitle={'Select State'}
                        divideWidthBy={1.2}
                        selectedValue={receiver_state_id}
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
                        onSelectItem={(id, item) => {
                          console.log('Selected state id: ' + id + ' Item: ' + JSON.stringify(item));
                          setData({ ...formData, receiver_state_id: id, country_code: item.country_code});
                        }}
                      />

                      <View
                        style={{
                          flexDirection: 'row',
                          paddingVertical: 20,
                          // alignItems: 'center',
                          //justifyContent: 'space-between',
                          gap: 10,
                          // width: 400,
                        }}>
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
                          value={formData?.receiver_address}
                          // defaultValue={receiver_address}
                          onChangeText={value => {
                            console.log('Address==: ' + value);
                            setData({ ...formData, receiver_address: value });
                          }}
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          paddingTop: 0,
                          // alignItems: 'center',
                          //justifyContent: 'space-between',
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
                            value={formData?.receiver_city}
                            // defaultValue={receiver_city}
                            divideWidthBy={2.6}
                            onChangeText={value => {
                              console.log('City==: ' + value);
                              setData({ ...formData, receiver_city: value });
                            }}
                          />
                        </View>

                        <TextInput
                          placeholderTitle={'Postal Code'}
                          // icon={<EmailSVG />}
                          divideWidthBy={2.6}
                          borderColor={theme?.textInput?.borderColor}
                          backgroundColor={theme?.textInput?.backgroundColor}
                          borderWidth={theme?.textInput?.borderWidth}
                          darkShadowColor={theme?.textInput?.darkShadowColor}
                          lightShadowColor={theme?.textInput?.lightShadowColor}
                          shadowOffset={theme?.textInput?.shadowOffset}
                          placeholderColor={theme?.textInput?.placeholderColor}
                          inputColor={theme?.textInput?.inputColor}
                          value={formData?.receiver_postal_code}
                          type='numeric'
                          // defaultValue={receiver_postal_code}
                          onChangeText={value => {
                            console.log('Postal==: ' + value);
                            setData({ ...formData, receiver_postal_code: value });
                          }}
                        />
                      </View>

                    </>
                  )}

                  {screen != 'full' && (
                    <View
                      style={{
                        ...styles.direction,
                        justifyContent:
                          screen != 'name' ? 'space-between' : 'flex-end',
                        marginTop: screen == 'others' ? 50 : 100,
                        marginBottom: screen == 'others' ? 50 : 0,
                      }}>
                      {screen != 'name' && (
                        <TouchableOpacity
                          onPress={() => onPreviousClick()}
                          style={{ zIndex: 1 }}>
                          {theme?.profileIcon?.backward}
                        </TouchableOpacity>
                      )}

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
            {/* </ScrollView> */}
          </View>
        </ScrollView>


        <ModalPoup
          theme={theme}
          visible={visible}
          title={errorMsg}
          source={require('../../assets/sign_in_animation.json')}
          btnTxt={'Ok'}
          onPressOk={() => setVisible(false)}
          onPressClose={() => setVisible(false)}
        />

        {/* <View style={styles.btnDiv}>
            <CustomButton
              title={'Next'}

              color={theme?.colors?.btnText}
              colors={theme?.colors?.colors}
              bordered={true}
              borderWidth={theme?.name == 'Light' ? 0 : 3}
              borderColors={theme?.colors?.borderColors}
              borderColor={theme?.colors?.borderColor}
              shadow={theme?.name == 'Light'}

              onPress={() => {
                onPressNext();
              }}
            />
          </View> */}
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  title: {
    // color: '#2E476E',
    fontSize: 15,
    fontWeight: 300,
    lineHeight: 25,
    textTransform: 'uppercase',
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  btnDiv: {
    marginTop: 5,
    paddingHorizontal: 35,
    paddingBottom: globalStyle.bottomPadding,
  },
  btnText: {
    color: 'white',
    fontSize: 18,
  },
});
