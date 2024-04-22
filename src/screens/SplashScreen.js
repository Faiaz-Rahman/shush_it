// SplashScreen.js

import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View, ImageBackground, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Token from '../class/TokenManager.js';
import FastImage from 'react-native-fast-image';
import { useTheme } from '../../styles/ThemeProvider.js';

import AsyncStorageManager from '../class/AsyncStorageManager.js';
import CONSTANTS, { CURRENT_BG_NAME } from '../Constants.js';


const SplashScreen = ({ navigation }) => {

  const navi = useNavigation();
  const { theme, setScheme, setBg, unread, setUnread } = useTheme();


  useEffect(() => {
    // Check for authentication token in AsyncStorage or wherever you store it
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await Token.getToken();

      var currentThemeName = await AsyncStorageManager.getData(CONSTANTS.CURRENT_THEME_NAME /*'currentThemeName'*/);
      
      var currentBgName = await AsyncStorageManager.getData(CONSTANTS.CURRENT_BG_NAME /*'currentBgName'*/);
      var currentBgType = await AsyncStorageManager.getData(CONSTANTS.CURRENT_BG_TYPE /*'currentBgType'*/);
      var unreadCountFromStorage = await AsyncStorageManager.getData(CONSTANTS.UNREAD_COUNT);

      console.log('currentThemeName splash ==>', currentThemeName);

      if (token) {
        // User is authenticated, navigate to the main app screen
        //navigation.navigate('MainAppScreen'); // Replace 'MainAppScreen' with your actual main screen name

        if(currentThemeName !== undefined || currentThemeName !== null || currentThemeName !=""){

          if(currentThemeName === 'Elegent'){
            setScheme(CONSTANTS.UI.DEFAULT);
          } else {
            setScheme(currentThemeName); /*'honeycomb'*/ /*'honeycomb'*/
          }

        } else {
          setScheme(CONSTANTS.UI.DEFAULT); /*'honeycomb'*/
        }

        if (!CONSTANTS.IS_BACKGROUND_HIDE) {
          if (currentBgName && currentBgType) {
            setBg(currentBgName)
          } else {
            setBg(CONSTANTS.BG_IMG.ELEGENT /*'ElegantBg'*/);
          }
        } 

        if (unreadCountFromStorage) {
          if (unreadCountFromStorage == null || unreadCountFromStorage == undefined || unreadCountFromStorage == "null") {
            setUnread(null);
          } else {
            setUnread(unreadCountFromStorage);
          }
        }

        navi.dispatch(StackActions.replace('tab', { screen: 'tab_home' }));
        //navi.dispatch(StackActions.replace('tab', {screen: 'home'}));
      } else {
        // User is not authenticated, navigate to the login screen
        //navi.dispatch('sign_in'); // Replace 'LoginScreen' with your actual login screen name

        setScheme(CONSTANTS.UI.DEFAULT /*'elegant'*/) // honeycomb
        if (!CONSTANTS.IS_BACKGROUND_HIDE) {
          setBg(CONSTANTS.BG_IMG.ELEGENT /*'ElegantBg'*/);
        }
        navi.dispatch(StackActions.replace('sign_in'));
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  return (
    <>
      {
        theme?.name == 'Light' ?
          <LinearGradient
            colors={['#c7d8fc', '#4f85ff', '#b9cdfd']}
            style={styles.linearGradient}>
            <View style={styles.container}>
              <Image
                // source={require(abc + '')}
                source={require('../../assets/splash_screen.png')}
                fallbackSource={{
                  uri: 'https://www.w3schools.com/css/img_lights.jpg',
                }}
              // style={styles.image}
              />
              {/* <ActivityIndicator size="large" /> */}
            </View>
          </LinearGradient>
          :
          // <ImageBackground
          //   source={theme?.bg?.bgImg}
          //   resizeMode="cover"
          //   style={styles.bgImage}
          // >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}>
            <View style={styles.container}>
              <Image
                source={
                  theme?.name == 'Honeycomb' ? require(`../../assets/honey/splash_screen.png`)
                    : theme?.name == 'Elegant' ? require(`../../assets/honey/splash_screen.png`)
                      : theme?.name == 'RoseGold' ? require(`../../assets/roseGold/splash_screen.png`)
                        : require(`../../assets/gold/splash_screen.png`)
                }
                fallbackSource={{
                  uri: 'https://www.w3schools.com/css/img_lights.jpg',
                }}
              />
            </View>
            {/* </ImageBackground> */}
          </View>
      }
    </>
  );
};
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // You can set the background color as needed
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
  },
  image: {
    width: 200, // Set the width of your image
    height: 100, // Set the height of your image
  },
});

export default SplashScreen;
