import {Select} from 'native-base';
import React from 'react';
import {View, StyleSheet, Dimensions, TextInput} from 'react-native';
import {Neomorph} from 'react-native-neomorph-shadows';
import CalenderSvg from '../../../assets/calender.svg';

const {width} = Dimensions.get('window');
const SelectComponent = ({
  placeholderTitle = 'select',
  icon,
  onChangeSelect,
  placeholderTextColor = null,
  options = [],
  divideWidthBy = 1.2,
  height = 55,
  value,
}) => {
  return (
    <Neomorph
      inner // <- enable inner shadow
      useArt // <- set this prop to use non-native shadow on ios
      //swapShadows
      darkShadowColor="#9eb5c7" //"#B1C5D5" //"#FF3333" // <- set this
      //lightShadowColor="#B1C5D5" // <- this
      style={{
        ...styles.container,
        width: width / divideWidthBy,
        height: height,
      }}>
      <View style={styles.view}>
        <View style={styles.icon}>{icon}</View>
        <Select
          style={styles.input}
          s
          selectedValue={value}
          accessibilityLabel={placeholderTitle}
          placeholder={placeholderTitle}
          placeholderTextColor={placeholderTextColor}
          // mt={1}
          ml={-3.5}
          p="2.5"
          height={height}
          borderRadius={20}
          width={width / divideWidthBy}
          onValueChange={onChangeSelect}
          // onValueChange={itemValue => console.log(itemValue)}
        >
          {options &&
            options?.length > 0 &&
            options.map((item, index) => (
              <Select.Item
                key={item?.label + index}
                label={item?.label}
                value={item?.value}
              />
            ))}
          {/* <Select.Item label="Web Development" value="web" />
          <Select.Item
            label="Cross Platform Development"
            value="cross"
          />
          <Select.Item label="UI Designing" value="ui" />
          <Select.Item label="Backend Development" value="backend" /> */}
        </Select>
      </View>
    </Neomorph>
  );
};
const styles = StyleSheet.create({
  container: {
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: 'white',
    shadowRadius: 5,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: '#B1C5D5',
    // width: width / divideWidthBy,
    // height: 55,
  },
  view: {felx: 1, flexDirection: 'row'},
  icon: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  input: {
    height: 38,
    shadowColor: '#C8D4E2',
    margin: 8,
    marginRight: 1,
    borderRadius: 20,
    paddingLeft: 4,
    flex: 1,
    fontSize: 14.5,
    // backgroundColor: 'white',
    color: 'black',
  },
});
export default SelectComponent;
