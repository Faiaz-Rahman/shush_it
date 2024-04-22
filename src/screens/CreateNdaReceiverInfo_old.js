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
} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
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

export default function CreateNdaReceiverInfo(navigation) {
  const { theme } = useTheme();

  const { width, height } = Dimensions.get('window');

  const navi = useNavigation();

  //const [formData, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [stateList, setStateList] = useState([]);
  // const [errMsg, setErrMsg] = useState('');

  const { sample_id, sample_name, document_name, filePath } =
    navigation.route.params;

  // console.log("receiver_Info:",navigation.route?.params)

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
    const asyncFunc = async () => {
      let userToken = await Token.getToken();
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
              const newItem = { label: item.name, value: item.id };
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

    if (receiver_name == '') {
      errMsg = 'Name is required';
      // setErrMsg('Name is required');
      return false;
    } else if (receiver_email == '') {
      errMsg = 'Email is required';
      return false;
    } else if (receiver_address == '') {
      errMsg = 'Address is required';
      return false;
    }
    // else if (receiver_company_name == '') {
    //   errMsg = 'Company is required';
    //   return false;
    // }
    else if (receiver_city == '') {
      errMsg = 'City is required';
      return false;
    } else if (receiver_state_id == '') {
      errMsg = 'State is required';
      return false;
    } else if (receiver_postal_code == '') {
      errMsg = 'Postal code is required';
      return false;
    }

    return valid;
  };

  const onPressNext = () => {
    if (validate()) {
      navi.navigate('create_nda_party_customize', {
        sample_id: sample_id,
        sample_name: sample_name,
        document_name: document_name,

        filePath: filePath,

        receiver_name: receiver_name,
        receiver_email: receiver_email,
        receiver_phone_number: receiver_phone_number,
        // receiver_company_name: receiver_company_name,
        receiver_address: receiver_address,
        receiver_city: receiver_city,
        receiver_state_id: receiver_state_id,
        receiver_postal_code: receiver_postal_code,
      });
    } else {
      Alert.alert('Error', `${errMsg}`, [{ text: 'OK', onPress: () => { } }]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: width }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={theme?.bg?.bgImg}
        resizeMode="cover"
        style={styles.bgImage}
      >

        <SafeAreaView style={styles.container}>

          <DocumentListHeader
            onPress={handlePress}
            title={'Create NDA'}

            backIcon={theme?.header?.backIcon}
            statusBarColor={theme?.colors?.statusBarColor}
            dark={theme?.name == 'Light'}
            color={theme?.colors?.text}
          />

          {/* <ThemeSelectorForTest /> */}

          <ScrollView // Category List
            horizontal={false}
            // style={styles.categoryListContainer}
            showsHorizontalScrollIndicator={true}>
            <View style={{ marginTop: 15 }}>
              {/* Steps */}
              <View>
                <StepsComponent active={2} theme={theme} />
              </View>

              <Text style={{ ...styles.title, color: theme?.name == 'Light' ? '#2E476E' : theme?.colors?.text }}>Receiver Information</Text>
              {isLoading ? (
                <ActivityIndicator color={theme?.name == 'Light' ? globalStyle.colorAccent : theme?.colors?.text} />
              ) : (
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

                      defaultValue={receiver_name}
                      //value={full_name_input}
                      onChangeText={value => {
                        console.log('Name==: ' + value);
                        handleInput('name', value);
                        //setData({...formData, name: value});
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
                      defaultValue={receiver_email}
                      type='email'
                      onChangeText={value => {
                        console.log('Email==: ' + value);
                        //setData({...formData, email: value});
                        handleInput('email', value);
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
                      type='numeric'

                      defaultValue={receiver_phone_number}
                      onChangeText={value => {
                        console.log('Phone==: ' + value);
                        //setData({...formData, phone: value});
                        handleInput('phone', value);
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

                      defaultValue={receiver_company_name}
                      onChangeText={value => {
                        console.log('Company==: ' + value);
                        //setData({...formData, company: value});
                        handleInput('company', value);
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

                      defaultValue={receiver_address}
                      onChangeText={value => {
                        console.log('Address==: ' + value);
                        //setData({...formData, address: value});
                        handleInput('address', value);
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingBottom: 20,
                      // alignItems: 'center',
                      justifyContent: 'space-between',
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

                        defaultValue={receiver_city}
                        divideWidthBy={2.6}
                        onChangeText={value => {
                          console.log('City==: ' + value);
                          //setData({...formData, city: value});
                          handleInput('city', value);
                        }}
                      />
                    </View>
                    <View style={{ paddingLeft: 10 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center' }}>
                          {!isLoading ? (
                            console.log(' Activity Not loading ')
                          ) : (
                            <ActivityIndicator />
                          )}
                        </View>
                        <DropDown
                          data={stateList}
                          placeholderTitle={'Select State'}
                          divideWidthBy={2.6}
                          selectedValue={receiver_state_id}

                          borderColor={theme?.textInput?.borderColor}
                          backgroundColor={theme?.textInput?.backgroundColor}
                          borderWidth={theme?.textInput?.borderWidth}
                          darkShadowColor={theme?.textInput?.darkShadowColor}
                          lightShadowColor={theme?.textInput?.lightShadowColor}
                          shadowOffset={theme?.textInput?.shadowOffset}
                          placeholderColor={theme?.textInput?.placeholderColor}
                          inputColor={theme?.textInput?.inputColor}

                          onSelectItem={id => {
                            console.log('Press Event Type ' + id);
                            handleInput('state', id);
                            //setData({ ...formData, state_id: id });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{ paddingBottom: 20 }}>
                    <TextInput
                      placeholderTitle={'Postal Code'}

                      borderColor={theme?.textInput?.borderColor}
                      backgroundColor={theme?.textInput?.backgroundColor}
                      borderWidth={theme?.textInput?.borderWidth}
                      darkShadowColor={theme?.textInput?.darkShadowColor}
                      lightShadowColor={theme?.textInput?.lightShadowColor}
                      shadowOffset={theme?.textInput?.shadowOffset}
                      placeholderColor={theme?.textInput?.placeholderColor}
                      inputColor={theme?.textInput?.inputColor}
                      type='numeric'

                      defaultValue={receiver_postal_code}
                      // icon={<EmailSVG />}
                      onChangeText={value => {
                        console.log('Postal==: ' + value);
                        //setData({...formData, postalCode: value});
                        handleInput('postalCode', value);
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.btnDiv}>
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
                // navi.navigate('create_nda_party_list', {
                //   sample_id: sample_id,
                //   sample_name: sample_name,
                //   document_name: document_name,

                //   filePath: filePath,

                //   receiver_name: receiver_name,
                //   receiver_email: receiver_email,
                //   receiver_phone_number: receiver_phone_number,
                //   receiver_company_name: receiver_company_name,
                //   receiver_address: receiver_address,
                //   receiver_city: receiver_city,
                //   receiver_state_id: receiver_state_id,
                //   receiver_postal_code: receiver_postal_code,
                // });

                // console.log('Sample ID:', sample_id);
                // console.log('Sample Name:', sample_name);
                // console.log('Document Name:', document_name);
                // console.log('File Path:', filePath);

                // console.log('Receiver Name:', receiver_name);
                // console.log('Receiver Email:', receiver_email);
                // console.log('Receiver Phone:', receiver_phone_number);
                // console.log('Receiver Company Name:', receiver_company_name);
                // console.log('Receiver Address:', receiver_address);
                // console.log('Receiver City:', receiver_city);
                // console.log('Receiver State ID:', receiver_state_id);
                // console.log('Receiver Postal Code:', receiver_postal_code);
                // downloadFile()
              }}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </KeyboardAvoidingView>
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
