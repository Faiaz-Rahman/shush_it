import React from 'react';
import { View, StyleSheet, Dimensions, TextInput, Text } from 'react-native';
import { Neomorph } from 'react-native-neomorph-shadows';

const { width } = Dimensions.get('window');
const InputButtonComponent = ({
  placeholderTitle,
  placeholderColor,
  icon= null,
  rightIcon = null,
  onChangeText,
  divideWidthBy = 1.2,
  defaultValue,
  type = 'text',
  value,
  text,
  disabled = false,
  borderColor = '#B1C5D5',
  backgroundColor = 'white',
  borderWidth = 0.5,
  darkShadowColor = "#9eb5c7",
  lightShadowColor = null,
  shadowOffset = { width: 0, height: 0 },
  inputColor = 'black',
}) => {
  return (
    <Neomorph
      inner // <- enable inner shadow
      useArt // <- set this prop to use non-native shadow on ios
      //swapShadows
      darkShadowColor={darkShadowColor} //"#B1C5D5" //"#FF3333" // <- set this
      // darkShadowColor="#9eb5c7" //"#B1C5D5" //"#FF3333" // <- set this
      lightShadowColor={lightShadowColor} // <- this
      // lightShadowColor="#B1C5D5" // <- this
      style={{
        ...styles.container,
        width: width / divideWidthBy,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        borderWidth: borderWidth,
        shadowOffset: shadowOffset,
      }}
    >
      <View style={styles.view}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={{ ...styles.input, color: inputColor }}>{text}</Text>
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>
    </Neomorph>
  );
};
const styles = StyleSheet.create({
  container: {
    // shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    // shadowColor: '#060606',
    // shadowColor: 'white',
    shadowRadius: 3.5,//5,
    borderRadius: 50, //20,
    // backgroundColor: '#272727',
    // backgroundColor: 'white',
    // borderWidth: 2,
    // borderWidth: 0.5,
    // borderColor: 'silver',
    // borderColor: '#B1C5D5',
    // width: width / divideWidthBy,
    height: 55,
  },
  view: { 
    // flex: 1, 
    flexDirection: 'row',
    marginTop: 'auto',
    marginBottom: 'auto',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
 },
  icon: {
    justifyContent: 'center',
    paddingLeft: 12,
    // marginRight: 10,
  },
  input: {
    // height: 50, //40,
    // shadowColor: '#C8D4E2',
    // margin: 8,
    marginRight: 1,
    borderRadius: 20,
    // paddingLeft: 12,
    // flex: 1,
    // textAlign: 'center',
  },
});
export default InputButtonComponent;
