import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, TextInput, ActivityIndicator, Pressable, Platform } from 'react-native';
import { Neomorph } from 'react-native-neomorph-shadows';
import { DIM } from '../../../styles/Dimensions';

//Importing SVGs ...
import EyeOnSVG from '../../../assets/eye-off-outline.svg';
import CheckGold from '../../../assets/gold/addressVerifiedCheck.svg';
import CheckElegant from '../../../assets/honey/addressVerifiedCheck.svg';
import CheckRose from '../../../assets/roseGold/addressVerifiedCheck.svg';

import FailedGold from '../../../assets/gold/failedGold.svg';
import FailedRoseGold from '../../../assets/roseGold/failedRoseGold.svg';
import FailedElegant from '../../../assets/honey/failedElegant.svg';

import { useTheme } from '../../../styles/ThemeProvider';

const { width } = Dimensions.get('window');
const InputTextComponent = ({
  refInput,
  placeholderTitle,
  placeholderColor,
  icon,
  onChangeText,
  divideWidthBy = 1.2,
  defaultValue,
  type = 'url',
  value,
  disabled = false,
  borderColor = '#B1C5D5',
  backgroundColor = 'white',
  borderWidth = 0.5,
  darkShadowColor = "#9eb5c7",
  lightShadowColor = null,
  shadowOffset = { width: 0, height: 0 },
  inputColor = 'black',
  isVerified = null,
  autoFocus = false,
  onKeyPress,
  cursorCentered,
  cursorColor,
  maxLength = 1000,
}) => {
  const { theme } = useTheme();
  // console.log('My theme ==>', theme.name);
  const [isFocus, setIsFocus] = useState(false);

  const checkIconSvg = () => {
    if (theme.name === 'Gold') {
      return <CheckGold />;
    } else if (theme.name === 'RoseGold') {
      return <CheckRose />;
    } else {
      return <CheckElegant />;
    }
  }

  const failedIconSvg = () => {
    if (theme.name === 'Gold') {
      return <FailedGold />;
    } else if (theme.name === 'RoseGold') {
      return <FailedRoseGold />;
    } else {
      return <FailedElegant />;
    }
  }

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
      <View style={styles.viewHoolder}>
        {/* {icon && <View style={styles.icon}>{icon}</View>} */}
        <TextInput
          // ref={refInput}
          secureTextEntry={Platform.OS === 'android' ? true : false}
          // autoFocus={autoFocus}
          style={{ ...styles.input, color: inputColor }} // {color: inputColor, width: width / divideWidthBy, }
          placeholder={placeholderTitle}
          placeholderTextColor={placeholderColor || 'gray'}
          onChangeText={onChangeText}
          defaultValue={defaultValue}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          value={value}
          editable={!disabled}
          inputMode={type}
          // inputMode=''
          onKeyPress={onKeyPress}

          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}

          cursorColor={theme.colors.borderColor}
          // maxLength={maxLength}
          caretHidden={false}
        />
        {/* <View style={styles.iconHolder}>
          <Pressable>
            <View style={styles.icon}>
              <EyeOnSVG />
            </View>
          </Pressable>
        </View> */}
        {isVerified && <View style={{
          position: 'absolute',
          top: '33%',
          right: 13,
          // backgroundColor: 'green',
        }}>
          {/* {isVerified === 'verified' &&
            (
              <Image
                style={{ margin: 20, height: 15, width: 15 }}
                source={require('../../../assets/success_icon.png')}
              />
            )} */}
          {isVerified === 'verified' && checkIconSvg()}
          {/* {isVerified === 'failed' && (<Image
            // style={{ margin: 20, height: 15, width: 15, }}
            source={require('../../../assets/tick_icon_1.png')} />)} */}

          {isVerified === 'failed' && failedIconSvg()}
          {isVerified === 'processing' && (<ActivityIndicator
            color={inputColor}
          // style={{ margin: 20, height: 15, width: 15, color: inputColor }}
          />)}

        </View>}
      </View>
    </Neomorph>
  );
};
const styles = StyleSheet.create({
  container: {
    //shadowOffset: { width: 0, height: 0 },
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
    alignItems: 'center',
    textAlign: 'center',
    height: 55,
    overflow: 'hidden',
  },
  viewHoolder: { flex: 1, flexDirection: 'row' },
  iconHolder: {
    justifyContent: 'center',
    paddingRight: 10,

    position: 'absolute',
    right: 0,
    top: 14,
  },
  view: {
    flex: 1,
    flexDirection: 'row',

    // justifyContent: 'center',
    // alignItems: 'center',
    // textAlign: 'center',
    // width: '100%',
    // backgroundColor: 'red',
  },
  icon: {
    justifyContent: 'center',
    paddingLeft: 12,
    // marginRight: 10,
  },
  input: {
    height: 50, //40,
    // shadowColor: '#C8D4E2',
    // margin: 8,
    // marginRight: 1,
    borderRadius: 20,
    // paddingLeft: 12,
    // flex: 1,
    // width:width / divideWidthBy,
    flex: 1,
    textAlign: 'center',
    // backgroundColor: 'white',
    // color: 'black',
  },
});
export default InputTextComponent;
