import { React } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ButtonComponent = ({ title, onPress, isLoading = false, colors = null, borderColors = null, color = '#ffffff', bordered = false, borderWidth = 0, shadow = true, borderColor = '#3D43DF', backgroundColor = 'white', shadowColor = 'gray', disabled = false }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        shadow ? Platform.OS === 'ios' ? { ...styles.shadowIos, backgroundColor: backgroundColor, shadowColor: shadowColor }
          : { ...styles.shadowAndroid, backgroundColor: backgroundColor, shadowColor: shadowColor }
          : null,
      ]}
    >
      <LinearGradient
        // colors={['#3D43DF', '#3D43DF']}
        colors={borderColors ? borderColors : ['#3D43DF', '#3D43DF']}
        // colors={['#bb52aa', '#63ff85']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.borderLinearGradient}
      >
        <LinearGradient
          // colors={colors ? colors : ['#FD371F', '#FD371F', '#FD371F']}
          colors={colors ? colors : ['#3D43DF', '#3D50DF', '#3D6eDF']}
          style={{
            ...styles.linearGradient,
            // borderWidth: bordered ? borderWidth : 0, borderColor: borderColor 
          }}>
          {isLoading ? (
            <ActivityIndicator color={color} />
          ) : (
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              style={{ ...styles.buttonText, color: color }}>
              {title}
            </Text>
          )}
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
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
});
export default ButtonComponent;
