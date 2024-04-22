import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../styles/ThemeProvider';

import { Elegant } from '../../../styles/Theme.js';
import { DIM } from '../../../styles/Dimensions';

import WifiOffRoseGold from '../../../assets/roseGold/wifiOffRoseGold.svg'
import WifiOffSilver from '../../../assets/honey/wifiOffSilver.svg'
import WifiOffGold from '../../../assets/gold/wifiOffGold.svg'

import WifiOnRoseGold from '../../../assets/roseGold/wifiOnRoseGold.svg'
import WifiOnGold from '../../../assets/gold/wifiOnGold.svg'
import WifiOnSilver from '../../../assets/honey/wifiOnSilver.svg'


// title, onPress, isLoading = false, colors = null, borderColors = null, 
// color = '#ffffff', bordered = false, borderWidth = 0, shadow = true, borderColor = '#3D43DF', 
// backgroundColor = 'white', shadowColor = 'gray', disabled = false 


const NotificationComponent = ({ children, text2, text1 }) => {
  const { theme } = useTheme()

  color = theme?.colors?.btnText
  colors = theme?.colors?.colors
  const bordered = true
  const borderWidth = theme?.name == 'Light' ? 0 : 3
  const borderColor = theme?.colors?.borderColor
  const borderColors = theme?.colors?.borderColors
  const backgroundColor = 'white'
  const shadow = true
  const shadowColor = 'gray'
  const disabled = false
  //console.log("Theme name: " + theme.name)

  const wifiIcon = () => {
    if (text2 === 'offline') {
      switch (theme.name) {
        case 'Gold':
          return <WifiOffGold />
          break;
        case 'RoseGold':
          return <WifiOffRoseGold />
          break;

        default:
          return <WifiOffSilver />
          break;
      }
    } else {
      switch (theme.name) {
        case 'Gold':
          return <WifiOnGold />
          break;
        case 'RoseGold':
          return <WifiOnRoseGold />
          break;

        default:
          return <WifiOnSilver />
          break;
      }
    }
  }

  return (
    // Used TouchableOpacity previously ...
    <ImageBackground
      // disabled={disabled}
      disabled={false}
      source={Elegant.bg.bgImg}
      //onPress={onPress}
      // style={[
      //   shadow ? Platform.OS === 'ios' ? { ...styles.shadowIos, backgroundColor: backgroundColor, shadowColor: shadowColor }
      //     : { ...styles.shadowAndroid, backgroundColor: backgroundColor, shadowColor: shadowColor }
      //     : null,
      // ]}
      style={styles.customToastBackground}
    >
      {/* <LinearGradient
        colors={borderColors ? borderColors : ['#3D43DF', '#3D43DF']}
        // colors={['#bb52aa', '#63ff85']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.borderLinearGradient}
      > */}
      {/* <LinearGradient
          // colors={colors ? colors : ['#FD371F', '#FD371F', '#FD371F']}
          colors={colors ? colors : ['#3D43DF', '#3D50DF', '#3D6eDF']}
          style={{
            ...styles.linearGradient,
            // borderWidth: bordered ? borderWidth : 0, borderColor: borderColor 
          }}> */}

      {/* <Text
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={{ ...styles.buttonText, color: color }}>
            {"Hello"}
          </Text> */}
      <View>
        {wifiIcon()}
      </View>
      <Text style={{ color: '#fff', marginLeft: 10, }}>{text1}</Text>

      {/* </LinearGradient>
      </LinearGradient> */}
    </ImageBackground>
  );
};



const styles = StyleSheet.create({
  borderLinearGradient: {
    // padding: 4,
    // borderColor: '#AEAEAE',
    // borderColor: '#3D43DF',
    // paddingVertical: 3,
    padding: 3,
    height: 68,
    justifyContent: 'center',
    borderRadius: 30,
  },
  linearGradient: {
    // padding: 4,
    // borderColor: '#AEAEAE',
    // borderColor: '#3D43DF',
    paddingLeft: 15,
    paddingRight: 15,
    height: 60,
    justifyContent: 'center',
    borderRadius: 30,
  },
  shadowAndroid: {
    elevation: 16,
    borderRadius: 30,
    // backgroundColor: '#3D50DF',
    //For Android
  },
  shadowIos: {
    //For ios
    // shadowColor: 'gray', //'#9eb5c7',
    // shadowOffset: {
    //   width: 5,
    //   height: 5,
    // },
    // shadowOpacity: 0.6,
    // shadowRadius: 10,
    //elevation: 100, //50,

    borderRadius: 30,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    margin: 10,
    // color: '#ffffff',
    backgroundColor: 'transparent',
    fontWeight: 'normal',
    textTransform: 'uppercase',
  },
  btnShaddow: {
    shadowOpacity: 100, // <- and this or yours opacity
    shadowRadius: 14,
    shadowColor: '#9eb5c7',
    borderRadius: 30,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'white',
    height: 60,
  },
  customToastBackground: {
    flexDirection: 'row',
    height: 68,
    width: DIM.width * .8,
    borderRadius: 12,
    overflow: 'hidden',
    // borderWidth: 2,
    // borderColor: theme.nav.borderColor,
    shadowColor: 'rgba(0,0,0,.3)',
    shadowOffset: { width: DIM.width * .8, height: 60, },
    shadowRadius: 5,
    // elevation: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default NotificationComponent;
