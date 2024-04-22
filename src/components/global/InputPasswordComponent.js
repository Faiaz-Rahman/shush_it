import React, { useState } from 'react';
import { StyleSheet, Dimensions, TextInput, View, Pressable } from 'react-native';
import { Neomorph } from 'react-native-neomorph-shadows';

import EyeOffSVG from '../../../assets/eye-off-outline.svg';
import EyeOnSVG from '../../../assets/eye-outline.svg';
import { useTheme } from '../../../styles/ThemeProvider';

const { width, height } = Dimensions.get('window');

const InputPasswordComponent = ({ placeholderTitle, icon, onChangeText, customWidthRatio = 1.2, value,
  placeholderColor,
  disabled = false,
  borderColor = '#B1C5D5',
  backgroundColor = 'white',
  borderWidth = 0.5,
  darkShadowColor = "#9eb5c7",
  lightShadowColor = null,
  shadowOffset = { width: 0, height: 0 },
  inputColor = 'black',
  eyeOn = null,
  eyeOff = null,
  cursorColor,
  onFocus,
  onBlur
}) => {
  // const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [show, setShow] = useState(false);

  const { theme } = useTheme()

  return (
    <Neomorph
      inner // <- enable inner shadow
      useArt // <- set this prop to use non-native shadow on ios
      //swapShadows
      darkShadowColor={darkShadowColor} //"#B1C5D5" //"#FF3333" // <- set this
      // darkShadowColor="#9eb5c7" //"#B1C5D5" //"#FF3333" // <- set this
      lightShadowColor={lightShadowColor} // <- this
      // lightShadowColor="#B1C5D5" // <- this

      // inner // <- enable inner shadow
      // useArt // <- set this prop to use non-native shadow on ios
      // //swapShadows
      // darkShadowColor="#9eb5c7" //"#B1C5D5" //"#FF3333" // <- set this
      // //lightShadowColor="#B1C5D5" // <- this
      style={{
        ...styles.container,
        width: width / customWidthRatio,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        borderWidth: borderWidth,
        shadowOffset: shadowOffset,
      }}
    >
      <View style={styles.viewHoolder}>
        {/* <View style={styles.view}>{icon}</View> */}
        <TextInput
          secureTextEntry={!show}
          // placeholderTextColor={'gray'}
          // placeholder={placeholderTitle}
          onChangeText={onChangeText}
          value={value}

          style={{ ...styles.input, color: inputColor }}
          placeholder={placeholderTitle}
          placeholderTextColor={placeholderColor || 'gray'}
          editable={!disabled}

          onFocus={() => {
            setIsFocus(true)
            onFocus()
          }}
          onBlur={() => {
            setIsFocus(false)
            // onBlur()
          }}
          cursorColor={theme.nav.borderColor}
        />
        <View style={styles.iconHolder}>
          <Pressable onPress={() => setShow(!show)}>
            <View style={styles.icon}>
              {show === false ? eyeOff : eyeOn}
            </View>
          </Pressable>
        </View>
      </View>
    </Neomorph>
  );
};
const styles = StyleSheet.create({
  container: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowColor: 'white',
    shadowRadius: 5,
    borderRadius: 50, //20,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#dde5ed',
    // width: width / 1.2,
    height: 55,
  },
  viewHoolder: { flex: 1, flexDirection: 'row' },
  view: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  input: {
    height: 40,
    shadowColor: '#C8D4E2',
    margin: 8,
    // marginRight: 1,
    borderRadius: 20,
    // paddingLeft: 10,
    textAlign: 'center',

    flex: 1,
    //backgroundColor: 'white',
    color: 'black',
  },
  iconHolder: {
    justifyContent: 'center',
    paddingRight: 10,

    position: 'absolute',
    right: 0,
    top: 14,
  },
  icon: { paddingRight: 8 },
});
export default InputPasswordComponent;
