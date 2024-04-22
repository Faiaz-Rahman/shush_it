import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const InputTextComponent = ({ icon, onPress, color = '#ffffff', colors = null, borderColors = null, bordered = false, borderWidth = 0, borderColor = '#3D43DF' }) => {
  return (
    <TouchableOpacity onPress={onPress} style={Platform.OS === 'ios' ? styles.shadowIos : styles.shadowAndroid}>
      <LinearGradient
        // colors={['#3D43DF', '#3D43DF']}
        colors={borderColors ? borderColors : ['#3D43DF', '#3D43DF']}
        // colors={['#bb52aa', '#63ff85']}
        // start={{ x: 0, y: 0 }}
        // end={{ x: 1, y: 0 }}
        style={styles.borderLinearGradient}
      >
        <LinearGradient
          colors={colors ? colors : ['#3D43DF', '#3D50DF', '#3D6eDF']}
          style={{
            ...styles.linearGradient,
            // borderWidth: bordered ? borderWidth : 0, borderColor: borderColor
          }}
        >
          {/* colors={['#3D43DF', '#3D50DF', '#3D6eDF']}
          style={styles.linearGradient}> */}
          <View styles={styles.shadowAndroid}>
            <View style={styles.iconContainer}>{icon}</View>
          </View>
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  shadowAndroid: {
    //For Android
    elevation: 9,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  shadowIos: {
    //Shadow for ios
    //shadowOpacity: 0.5,
    //shadowRadius: 3,
    shadowColor: '#9eb5c7',
    // shadowOffset: {
    //   width: 5,
    //   height: 5,
    // },
    //shadowColor: 'gray', //'#9eb5c7',
    // shadowOffset: {
    //   width: 4,
    //   height: 2,
    // },
    // shadowOpacity: 0.8,
    // shadowRadius: 10,
    // elevation: 8,
  },
  borderLinearGradient: {
    // paddingLeft: 15,
    // paddingRight: 15,
    height: 63,
    width: 63,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 55,
    width: 55,
    justifyContent: 'center',
    borderRadius: 50,
  },
  iconContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    padding: 0,
    width: 30,
    height: 30,
  },
  buttonText: {
    position: 'absolute',
    fontSize: 40,
    //fontFamily: 'Gill Sans',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'red',
    fontWeight: 'normal',
  },
  buttonText1: {
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
});
export default InputTextComponent;
