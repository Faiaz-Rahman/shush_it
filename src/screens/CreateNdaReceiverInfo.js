import { useNavigation } from '@react-navigation/native';
import { React, useState, useEffect } from 'react';
import { Image } from 'react-native';
import Toast from 'react-native-toast-message';
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
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { AutoCompleteDropDown } from '../components/global/AutoCompleteDropdownComp';
//import { ScrollView } from 'react-native-virtualized-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

//Image Resource

//Variables
//Class
import Url from '../Api.js';
import Token from '../class/TokenManager.js';
//Component
import DocumentListHeader from '../components/global/DocumentListHeaderComponent';
import TextInput from '../components/global/InputTextComponent.js';
import StepsComponent from '../components/global/StepsComponent';

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

  const [isLoading, setIsLoading] = useState(false);

  // const [errMsg, setErrMsg] = useState('');
  const [screen, setScreen] = useState('name');
  const [formData, setData] = useState({});

  const [visible, setVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userEmail, setUserEmail] = useState(null);

  const [token, setToken] = useState(null);
  const [address, setAddress] = useState(null);

  const [isAddVerify, setAddVerify] = useState(false);

  const [addVeriStat, setAddVeriStat] = useState(null);

  const { data, isEdit } = navigation.route.params;
  console.log("receiver_Info:", navigation.route?.params);

  var errMsg = 'Error';

  const handlePress = () => {
    navi.goBack();
  };

  useEffect(() => {
    // console.log('Sample ID:', sample_id);
    // console.log('Sample Name:', sample_name);
    // console.log('Document Name:', document_name);
    console.log('navigation:', navigation?.route?.params?.data);

    const ndaData = navigation?.route?.params?.data;
    const formattedAddress = ndaData && ndaData?.receiver_country ?
      ndaData?.receiver_city + ', ' + ndaData?.receiver_state + ', ' + ndaData?.receiver_postal_code + ', ' + ndaData?.receiver_country
      :
      '';

    setData({
      ...navigation.route?.params,
      searchAddress: navigation?.route?.params?.receiver_address || null,
      receiver_address: formattedAddress,
    });

    setAddress({
      ...address,
      address: ndaData?.receiver_address,
      city: ndaData?.receiver_city,
      prov: ndaData?.receiver_state,
      country: ndaData?.receiver_country,
      pc: ndaData?.receiver_postal_code,
    })

    setAddVerify(null)

    const asyncFunc = async () => {
      let userToken = await Token.getToken();
      let userEmail = await AsyncStorageManager.getData(CONSTANTS.USER_EMAIL /*'user_email'*/);
      setUserEmail(userEmail)
      if (userToken) {
        //getStateList(userToken);
        setToken(userToken);
      } else {
        console.log('Token not found');
        return false;
      }
    };

    asyncFunc();
  }, []);

  useEffect(() => {
    token && address && addressVerify(token, address);
  }, [formData?.receiver_address])


  const addressVerify = async (token, address) => {
    //setIsLoading(true);
    setAddVeriStat('processing');
    var stateApi = Url.VERIFY_ADDRESS;
    await fetch(stateApi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
      },
      body: JSON.stringify({
        address_line1: address.address,
        city: address.city,
        state: address.prov,
        country: address.country,
        postal_code: address.pc,

      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          var a = JSON.stringify(responseJson);
          var json = JSON.parse(a);
          if (responseJson.status === 200) {

            console.log('Address verified => : ' + JSON.stringify(json));
            // var list = json.data;
            // var newData = [];
            // for (let i = 0; i < list.length; i++) {
            //   const item = list[i];
            //   const newItem = { label: item.name, value: item.id, country_id: item.country_id, country_code: item.country_code };
            //   newData.push(newItem);
            // }

            // // console.log('State list ' + JSON.stringify(json));
            // setStateList(newData);
            // //setIsRightBtn(true)
            const status = responseJson.data.status;
            console.log('Address verify status: ' + status);

            setAddVeriStat(status)
            //setIsLoading(false);
          } else {
            console.log('Address verifiy error: ' + JSON.stringify(json));
          }

          setAddVerify(true);

          //setIsLoading(false);
        } catch (error) {
          console.error(error);
          console.log(error);


          //setIsLoading(false);
        }
      })
      .catch(error => {
        console.error(error);


        //setIsLoading(false);
      });
  };

  const validate = () => {
    var valid = true;

    // if (formData?.receiver_name == '') {
    //   errMsg = 'Name is required';
    //   return false;
    // } else if (formData?.receiver_email == '') {
    //   errMsg = 'Email is required';
    //   return false;
    // } else if (formData?.receiver_address == '') {
    //   errMsg = 'Address is required';
    //   return false;
    // }
    // else if (formData?.receiver_company_name == '') {
    //   errMsg = 'Company is required';
    //   return false;
    // }
    // else if (formData?.receiver_city == '') {
    //   errMsg = 'City is required';
    //   return false;
    // } else if (formData?.receiver_state_id == '') {
    //   errMsg = 'State is required';
    //   return false;
    // } else if (formData?.receiver_postal_code == '') {
    //   errMsg = 'Postal code is required';
    //   return false;
    // }



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
    // console.log('infos===>', formData);

    if (formData?.searchAddress && formData?.searchAddress != '') {
      if (formData?.receiver_address && formData?.receiver_address != '') {
        goNextPage()
      } else {
        setErrorMsg('Enter a valid address');
        setVisible(true);
      }
    } else {
      goNextPage();
    }

    // if (isAddVerify) {
    //   //Go Next Page
    //   goNextPage();
    // } else {
    //   //Verify Address
    //   if (address === null) {
    //     //showToast('Please enter the addess', 'To go next enter a valid address');
    //     goNextPage();

    //   } else {
    //     console.log('Verifiy address')
    //     addressVerify(token, address);
    //   }
    // }
  };

  const goNextPage = () => {

    if (validate()) {
      navi.navigate('create_nda_signing', {

        type: 'sender',
        id: data?.id,
        data: data,
        receiver_name: formData?.receiver_name,
        receiver_email: formData?.receiver_email,
        receiver_phone_number: formData?.receiver_phone_number,
        // receiver_company_name: formData?.receiver_company_name,
        receiver_address: address?.address,
        receiver_city: address?.city,
        receiver_state_id: address?.prov,
        receiver_country_code: address?.country,
        receiver_postal_code: address?.pc,

        displayAs: 'sender',

        isEdit: isEdit,
        status: 'pending' ///draft formData?.status,// 
      });
    } else {
      // Alert.alert('Error', `${errMsg}`, [{ text: 'OK', onPress: () => { } }]);
      setErrorMsg(errMsg);
      setVisible(true);
    }
  }

  const onPreviousClick = () => {
    if (screen == 'full') {
      navi.goBack();
    }
    if (screen == 'name') {
      // setScreen('full');
      navi.goBack();
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
      setScreen('email');

      // if (formData?.receiver_name == '') {
      //   setErrorMsg('Name is required');
      //   setVisible(true);
      //   return false;
      // }
      // else {
      //   setScreen('email');
      // }
    }
    if (screen == 'email') {

      // if (formData?.receiver_email === undefined || formData?.receiver_email === null || formData?.receiver_email == '') {
      //   setErrorMsg("Email is required");
      //   setVisible(true);
      //   return;
      // }

      // if (!Validator.Validate('email', formData?.receiver_email)) {
      //   setErrorMsg('Invalid email');
      //   setVisible2(true);
      //   return
      // }

      if (formData?.receiver_email?.trim() == userEmail) {
        setErrorMsg("You can't send NDA to yourself");
        setVisible(true);
        return;
      }
      //setScreen('phone');

      console.log('Receiver Email: ' + formData?.receiver_email);

      if (formData?.receiver_email === '' || formData?.receiver_email === undefined || Validator.Validate('email', formData?.receiver_email)) {
        setScreen('phone');
      } else {
        setErrorMsg('Invalid Email');
        setVisible(true);
      }
    }
    if (screen == 'phone') {
      setScreen('others');

      // if (formData?.receiver_phone_number?.trim().length > 0) {
      //   if (Validator.Validate('phone', formData?.receiver_phone_number)) {
      //     setScreen('others');
      //   } else {
      //     setErrorMsg('Invalid phone number');
      //     setVisible(true);
      //   }
      // } else {
      //   setScreen('others');
      // }
    }
    if (screen == 'others') {
      onPressNext();
    }
  };

  const showToast = (title, msg) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: msg
    });
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: 'transparent',
    }}>
      <SafeAreaView style={styles.container}>
        <AutocompleteDropdownContextProvider>
          {/* <KeyboardAvoidingView
          style={{ flex: 1, width: width }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}

          {/* <DocumentListHeader
            onPress={handlePress}
            title={'Shush It'}
            isRightBtn={true}
            // backIcon={theme?.header?.backIcon }
            backIcon={screen == 'name' ? theme?.header?.backIcon : null}
            statusBarColor={theme?.colors?.statusBarColor}
            dark={theme?.name === 'Light'}
            color={theme?.colors?.text}
          /> */}

          {/* <ThemeSelectorForTest /> */}
          {/* Steps */}
          {/* <View style={{ marginTop: 15, zIndex: 1, }}>
            <StepsComponent active={screen == 'name' ? 1 : 2} theme={theme} />
          </View> */}

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
                    {/* <Text style={{ ...styles.title, color: theme?.colors?.text, marginBottom: 50 }}>Shush It</Text> */}

                    <Text
                      style={{
                        fontSize: 22,
                        marginBottom: 40,
                        textAlign: 'center',
                        color: theme?.colors?.text,
                        textTransform: 'capitalize',
                      }}>
                      {screen == 'name' ? 'Recipient Name' : screen == 'others' ? 'Address' : screen}

                      {/* Receiver Information */}
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
                        placeholderTitle={'Phone no.'}
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
                        type='tel'
                        // defaultValue={receiver_phone_number}
                        onChangeText={value => {
                          console.log('Phone==: ' + value);
                          setData({ ...formData, receiver_phone_number: value });
                        }}
                      />
                    )}

                    {screen == 'others' && (
                      <>
                        <AutoCompleteDropDown
                          initialValue={formData?.searchAddress}
                          url={Url.ADDRESS_AUTO_SUGG_}
                          onChangeInput={(text) => {
                            console.log("onChangeInput ==>", text);
                            setData({
                              ...formData,
                              searchAddress: text,
                              receiver_address: '',
                            })
                          }}

                          onSelectItemL={item => {
                            console.log('Selected' + JSON.stringify(item));
                            setAddVeriStat(null);
                            setAddVerify(false);
                            if (item != null && item?.obj) {
                              setData({ ...formData, receiver_address: item?.address, searchAddress: item?.obj?.address });
                              //value={formData?.receiver_address}

                              console.log('Selected address: ' + JSON.stringify(item.obj));
                              setAddress(item.obj)

                              // console.log('Verifiy address')
                              // addressVerify(token, address);
                            }
                          }}

                          onClear={() => {
                            setAddress(null);
                            setData({ ...formData, searchAddress: '', receiver_address: '' });
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
                          shadowOffset={theme?.textInput?.shadowOffset}
                          placeholderColor={
                            theme?.textInput?.placeholderColor
                          }
                          inputColor={theme?.textInput?.inputColor}
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
                            placeholderTitle={'City, State Postal code'}
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
                            disabled={true}
                            // defaultValue={receiver_address}
                            onChangeText={value => {
                              console.log('Address==: ' + value);
                              setData({ ...formData, receiver_address: value });
                            }}
                            isVerified={addVeriStat}
                          />

                        </View>

                      </>
                    )}

                    {screen != 'full' && (
                      <View
                        style={{
                          ...styles.direction,
                          // justifyContent: screen != 'name' ? 'space-between' : 'center',
                          marginTop: screen == 'others' ? 50 : 100,
                          marginBottom: screen == 'others' ? 50 : 0,
                        }}>
                        {/* {screen != 'name' && ( */}
                        <TouchableOpacity
                          onPress={() => onPreviousClick()}
                          style={{ zIndex: 1 }}>
                          {theme?.profileIcon?.backward}
                        </TouchableOpacity>
                        {/* )} */}

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
        </AutocompleteDropdownContextProvider>
      </SafeAreaView>
    </View>
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
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',

    // color: '#2E476E',
    // fontSize: 15,
    // fontWeight: 300,
    // lineHeight: 25,
    // textTransform: 'uppercase',
    // paddingVertical: 30,
    // paddingHorizontal: 40,
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
