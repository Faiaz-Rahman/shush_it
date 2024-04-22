import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Appearance,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Elegant from '../../assets/elegant/elegant.svg';
import Gold from '../../assets/gold.svg';
import Honey from '../../assets/honey.svg';
import Light from '../../assets/light.svg';
import Rose from '../../assets/rose.svg';
import globalStyle from '../../styles/MainStyle.js';
import Url from '../Api.js';
import AsyncStorageManager from '../class/AsyncStorageManager';
import Token from '../class/TokenManager';
import TextInput from '../components/global/InputTextComponent.js';
import SelectComponent from '../components/global/SelectComponent';
import DropDown from '../components/global/StateDropDownComponent.js';

//Styles
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CONSTANTS from '../Constants';

export default function UserSettings({ bioSw, onBioSwChange, bioSingSw, onBioSignSwChange, theme, setScheme }) {
  const navi = useNavigation();
  const insets = useSafeAreaInsets();

  const [options, setOptions] = useState([
    {
      label: 'mm/dd/yyyy',
      value: 'mm/dd/yyyy',
    },
    {
      label: 'dd/mm/yyyy',
      value: 'dd/mm/yyyy',
    },
  ]);
  const [timeOptions, setTimeOptions] = useState([
    {
      label: '12-hour',
      value: '12-hour',
    },
    {
      label: '24-hour',
      value: '24-hour',
    },
  ]);

  const [active, setActive] = useState(null);
  const [isAuto, setIsAuto] = useState(false);
  const [sendReminder, setSendReminder] = useState(false);

  const toggleSwitchAuto = () => {
    setIsAuto(previousState => !previousState);
    saveSettings(sendReminder, itemValue, isOtpRequired);
  };
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const toggleSwitchOtp = () =>
    setIsOtpRequired(previousState => !previousState);
  const toggleSwitchBio = () => {
    onBioSwChange(!bioSw);
    //setIsBioRequired(previousState => !previousState);
  };

  const toggleSwitchBioLogin = () => {
    onBioSignSwChange(!bioSingSw);
    //setIsBioRequired(previousState => !previousState);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [themeChanging, setThemeChanging] = useState(false);
  const [dateFormat, setDateFormat] = useState(null);
  const [timeFormat, setTimeFormat] = useState(null);
  const [token, setToken] = useState('');

  //const { colors, font } = useTheme();

  useEffect(() => {
    if (theme?.name == 'Light') {
      setActive(0)
    } else if (theme?.name == 'Honeycomb') {
      setActive(1)
    } else if (theme?.name == 'RoseGold') {
      setActive(2)
    } else if (theme?.name == 'Gold') {
      setActive(3)
    } else if (theme?.name == 'Elegant') {
      setActive(4)
    }

    // getColorScheme();
    // setIsAuto(true);
    // setIsLoading(false) // Hidden for theme check

    const asyncFunc = async () => {
      let userToken = await Token.getToken();
      if (userToken) {
        setToken(userToken);
        getSettings(userToken); // Hidden for theme check
      } else {
        console.log('Token not found');
        return false;
      }
    };

    asyncFunc(); // Hidden for theme check
  }, []);

  // const getColorScheme = () => {
  //   const colorScheme = Appearance.getColorScheme();
  //   // console.log("colorScheme", colorScheme)
  //   if (colorScheme === 'light') {
  //     setScheme('light')
  //     setActive(0);
  //   } else {
  //     setScheme('honeycomb')
  //     setActive(1);
  //   }
  // };

  const getSettings = async token => {
    setIsLoading(true);
    var api = Url.GET_SETTING;
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
            var settings = json.data;
            setIsLoading(false);

            setSendReminder(settings?.auto_remainder == 0 ? false : true);
            setIsOtpRequired(settings?.otp_verification == 0 ? false : true);
            setDateFormat(settings?.date_format);
            setTimeFormat(settings?.time_format);

            console.log("date_format==>", settings?.date_format);
            console.log("time_format==>", settings?.time_format);
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

  const saveSettings = (
    auto_remainder = sendReminder,
    date_format = dateFormat,
    otp_verification = isOtpRequired,
    current_theme = active,
    time_format = timeFormat,
  ) => {
    // setBtnLoad(true);

    const payload = {
      auto_remainder: auto_remainder ? 1 : 0,
      date_format: date_format,
      otp_verification: otp_verification ? 1 : 0,
      current_theme: current_theme == 0 ? 'Light' : current_theme == 1 ? 'Silver' : current_theme == 2 ? 'RoseGold' : current_theme == 3 ? 'Gold' : current_theme == 4 ? 'Elegant' : 'Silver',
      time_format: time_format,
    };
    // console.log("payload", payload)

    try {
      var stateApi = Url.SAVE_SETTING;
      fetch(stateApi, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(responseJson => {
          try {
            var a = JSON.stringify(responseJson);
            var json = JSON.parse(a);
            if (responseJson.status === 200) {

              if (current_theme == 0) {
                setScheme('light')
              } else if (current_theme == 1) {
                setScheme('honeycomb')
              } else if (current_theme == 2) {
                setScheme('roseGold')
              } else if (current_theme == 3) {
                setScheme('gold')
              } else if (current_theme == 4) {
                setScheme('elegant')
              } else {
                setScheme('light')
              }

              // setBtnLoad(false)
              AsyncStorageManager.storeData(CONSTANTS.DATE_FORMAT, date_format);
              AsyncStorageManager.storeData(CONSTANTS.TIME_FORMAT, time_format);
              setThemeChanging(false);

              console.log('Status==> ok');
            } else {
              console.log('Error==>', JSON.stringify(json));
              // setBtnLoad(false);
            }
          } catch (error) {
            console.error(error);
            console.log(error);
            // setBtnLoad(false)
          }
        })
        .catch(error => {
          console.error(error);
          // setBtnLoad(false)
        });
    } catch (error) {
      console.error(error);
      console.log(error);
      // setBtnLoad(false)
    }
  };

  const modes = ['Light', 'Honeycomb chrome', 'Rose Gold', 'Gold', 'Elegant Chrome'];
  // const modes = ['Light', 'Dark', 'Custom'];


  // const changeTheme = (index) => {
  //   saveSettings(sendReminder, dateFormat, isOtpRequired, index)
  // }


  return (
    <View style={styles.container}>
      {isLoading ? (
        // <ActivityIndicator color={globalStyle.colorAccent} />
        <ActivityIndicator
          color={theme?.name != 'Light' ? theme?.colors?.text : globalStyle.colorAccent}
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
            height: 540,
          }}
        />
      ) : (
        // <View style={styles.content}>
        <SafeAreaView
          style={[
            // styles.content,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              // paddingLeft: insets.left,
              // paddingRight: insets.right,
            },
          ]}>
          <ScrollView
            horizontal={false}
            style={styles.content}
            showsHorizontalScrollIndicator={true}>
            <View style={styles.row}>
              <View style={styles.rowContent}>
                {theme?.settingsIcon?.bell}
                <Text style={{ ...styles.item, color: theme?.colors?.text }}>Send Auto Reminder</Text>
              </View>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={theme?.colors?.switch}
                ios_backgroundColor="#3e3e3e"
                onValueChange={value => {
                  setSendReminder(value);
                  saveSettings(value, dateFormat, isOtpRequired);
                }}
                // onValueChange={toggleSwitch}
                value={sendReminder}
              />
            </View>
            <View style={{ ...styles.line, borderBottomColor: theme?.colors?.text || '#c0c0c0' }} />

            <View style={styles.row}>
              <View style={styles.rowContent}>
                {theme?.settingsIcon?.date}
                <Text style={{ ...styles.item, color: theme?.colors?.text }}>Date Format</Text>
              </View>

              <View style={styles.selectComponent}>
                <DropDown
                  data={options}
                  placeholderTitle={'Select'}
                  divideWidthBy={2.6}
                  selectedValue={dateFormat}

                  showSearch={false}
                  height={30}

                  // icon={theme?.profileIcon?.location}
                  borderColor={theme?.textInput?.borderColor}
                  backgroundColor={theme?.textInput?.backgroundColor}
                  borderWidth={theme?.textInput?.borderWidth}
                  darkShadowColor={theme?.textInput?.darkShadowColor}
                  lightShadowColor={theme?.textInput?.lightShadowColor}
                  shadowOffset={theme?.textInput?.shadowOffset}
                  placeholderColor={theme?.textInput?.placeholderColor}
                  inputColor={theme?.textInput?.inputColor}

                  onSelectItem={itemValue => {
                    // console.log('Selected ' + itemValue);
                    // setData({ ...formData, state_id: id });
                    setDateFormat(itemValue);
                    saveSettings(sendReminder, itemValue, isOtpRequired);
                  }}
                />

                {/* <SelectComponent
                  placeholderTitle={'Select'}
                  options={options}
                  divideWidthBy={2.6}
                  value={dateFormat}
                  height={30}
                  onChangeSelect={itemValue => {
                    // console.log('date==: ' + itemValue);
                    setDateFormat(itemValue);
                    saveSettings(sendReminder, itemValue, isOtpRequired);
                  }}
                /> */}
              </View>

            </View>
            <View style={{ ...styles.line, borderBottomColor: theme?.colors?.text || '#c0c0c0' }} />


            <View style={styles.row}>
              <View style={styles.rowContent}>
                {theme?.settingsIcon?.time}
                <Text style={{ ...styles.item, color: theme?.colors?.text }}>Time Format</Text>
              </View>

              <View style={styles.selectComponent}>
                <DropDown
                  data={timeOptions}
                  placeholderTitle={'Select'}
                  divideWidthBy={2.6}
                  selectedValue={timeFormat}

                  showSearch={false}
                  height={30}

                  // icon={theme?.profileIcon?.location}
                  borderColor={theme?.textInput?.borderColor}
                  backgroundColor={theme?.textInput?.backgroundColor}
                  borderWidth={theme?.textInput?.borderWidth}
                  darkShadowColor={theme?.textInput?.darkShadowColor}
                  lightShadowColor={theme?.textInput?.lightShadowColor}
                  shadowOffset={theme?.textInput?.shadowOffset}
                  placeholderColor={theme?.textInput?.placeholderColor}
                  inputColor={theme?.textInput?.inputColor}

                  onSelectItem={itemValue => {
                    // console.log('Selected ' + itemValue);
                    // setData({ ...formData, state_id: id });
                    setTimeFormat(itemValue);
                    saveSettings(sendReminder, dateFormat, isOtpRequired, active, itemValue)
                  }}
                />
              </View>

            </View>
            <View style={{ ...styles.line, borderBottomColor: theme?.colors?.text || '#c0c0c0' }} />

            <View style={styles.row}>
              <View style={styles.rowContent}>
                {theme?.settingsIcon?.otp}
                <Text style={{ ...styles.item, color: theme?.colors?.text }}>Required OTP Verification</Text>
              </View>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={theme?.colors?.switch}
                ios_backgroundColor="#3e3e3e"
                // onValueChange={toggleSwitchOtp}
                onValueChange={value => {
                  setIsOtpRequired(value);
                  saveSettings(sendReminder, dateFormat, value);
                }}
                value={isOtpRequired}
              />
            </View>
            <View style={{ ...styles.line, borderBottomColor: theme?.colors?.text || '#c0c0c0' }} />

            <View style={styles.row}>
              <View style={styles.rowContent}>
                {theme?.settingsIcon?.fingerprint}
                <Text style={{ ...styles.item, color: theme?.colors?.text }}>Lock Document with Biometric</Text>
              </View>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={theme?.colors?.switch}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchBio}
                value={bioSw} //isBioRequired}
              //onChange={onBioSwChange(isBioRequired)}
              />
            </View>

            <View style={{ ...styles.line, borderBottomColor: theme?.colors?.text || '#c0c0c0' }} />

            <View style={styles.row}>
              <View style={styles.rowContent}>
                {theme?.settingsIcon?.fingerprint}
                <Text style={{ ...styles.item, color: theme?.colors?.text }}>Biometric Sign In</Text>
              </View>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={theme?.colors?.switch}
                ios_backgroundColor="#3e3e3e"
                //bioSingSw, onBioSignSwChange,
                onValueChange={toggleSwitchBioLogin}
                value={bioSingSw} //isBioRequired}
              //onChange={onBioSignSwChange(isBioRequired)}
              />
            </View>

            <View style={{ ...styles.line, borderBottomColor: theme?.colors?.text || '#c0c0c0' }} />

            {/* <View style={styles.row}>
              <Text style={{ ...styles.item, color: theme?.colors?.text }}>Auto Theme</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={theme?.colors?.switch}
                ios_backgroundColor="#3e3e3e"
                // onValueChange={onAutoSwitchChange}
                onValueChange={value => {
                  setIsAuto(value);
                  getColorScheme();
                }}
                value={isAuto}
              />
            </View>
            <View style={{ ...styles.line, borderBottomColor: theme?.colors?.text || '#c0c0c0' }} /> */}

            {/* Theme */}
            {themeChanging ?
              <ActivityIndicator
                color={theme?.name != 'Light' ? theme?.colors?.text : globalStyle.colorAccent}
                style={{
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  height: 540,
                }}
              />
              :
              <View style={styles.modeTheme}>
                {modes?.map((item, index) => {
                  return (
                    <View key={item + index}>
                      {index == 0 ? null :
                        <View key={item + index}>
                          <TouchableOpacity
                            onPress={() => {
                              setActive(index);
                              setIsAuto(false);
                              // changeTheme(index)
                              // saveSettings(sendReminder, dateFormat, isOtpRequired, index)
                              // setThemeChanging(true);
                              if (active != index) {
                                saveSettings(sendReminder, dateFormat, isOtpRequired, index)
                                setThemeChanging(true);
                              }
                            }}>
                            {index == 0 ? (
                              <Light style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'gray' }} />
                            ) : index == 1 ? (
                              <Honey style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'gray' }} />
                            ) : index == 2 ? (
                              <Rose style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'gray' }} />
                            ) : index == 3 ? (
                              <Gold style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'gray' }} />
                            ) : index == 4 ? (
                              <Elegant style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'gray' }} />
                            ) : (
                              <Light style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'gray' }} />
                            )
                            }
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              setActive(index);
                              setIsAuto(false);
                              if (active != index) {
                                saveSettings(sendReminder, dateFormat, isOtpRequired, index)
                                setThemeChanging(true);
                              }
                            }}
                          >
                            <Text
                              style={{
                                ...styles.modeText,
                                color: theme?.name == 'Light' ? index == active ? '#3D50DF' : 'black'
                                  : index == active ? theme?.colors?.switch : 'white',
                              }}>
                              {item}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              setActive(index);
                              setIsAuto(false);
                              // changeTheme(index)
                              // saveSettings(sendReminder, dateFormat, isOtpRequired, index);
                              // setThemeChanging(true);
                              if (active != index) {
                                saveSettings(sendReminder, dateFormat, isOtpRequired, index)
                                setThemeChanging(true);
                              }
                            }}
                          >
                            <View
                              style={{
                                ...styles.circleOutside,
                                borderColor: theme?.name == 'Light' ? index == active ? '#3D50DF' : 'black' : index == active ? theme?.colors?.switch : 'white',
                              }}>
                              <View
                                style={{
                                  ...styles.circleInside,
                                  backgroundColor: index == active ? theme?.name == 'Light' ? '#3D50DF' : theme?.colors?.switch : 'transparent',
                                }}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      }
                    </View>
                  );
                })}
              </View>
            }

            {/* <View style={styles.autoDiv}>
            <Text style={{ ...styles.item, color: theme?.colors?.text }}>Auto</Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              ios_backgroundColor="#3e3e3e"
              // onValueChange={onAutoSwitchChange}
              onValueChange={value => {
                setIsAuto(value);
                getColorScheme();
              }}
              value={isAuto}
            />
          </View> */}
          </ScrollView>
        </SafeAreaView>
        // </View>
      )
      }
    </View >
  );
}

const styles = StyleSheet.create({
  autoDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTheme: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 50,
    columnGap: 15,
    // gap: 25,
    rowGap: 35,
  },
  modeText: {
    alignSelf: 'center',
    fontWeight: 500,
    marginVertical: 10,
    width: 85,
    height: 35,
    textAlign: 'center',
  },
  circleOutside: {
    alignSelf: 'center',
    borderRadius: 50,
    borderWidth: 1,
    height: 25,
    width: 25,
    padding: 1.5,
  },
  circleInside: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
  container: {
    paddingBottom: 70,
  },
  content: {
    paddingHorizontal: 27,
    marginBottom: 60,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    marginStart: 5,
    marginTop: 16,
    marginBottom: 16,
    fontSize: 15,
    color: '#2E476E',
  },
  line: {
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selectComponent: {
    // height: 20,
    // marginTop: 12,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});
