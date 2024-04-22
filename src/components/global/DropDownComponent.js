import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import globalStyle from '../../../styles/MainStyle';
//import AntDesign from '@expo/vector-icons/AntDesign';

const DropdownComponent = ({data, placeholderTitle, onSelectItem}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const handleSelectPress = item => {
    // Pass the parameter to the callback function
    console.log('Id: ' + item);
    onSelectItem(item);
  };

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* {renderLabel()} */}
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && {borderColor: globalStyle.colorAccent},
        ]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        borderRadius={32}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholderTitle : '...'}
        placeholderStyle={styles.placeholderStyle}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          handleSelectPress(item.value);
          setIsFocus(false);
        }}
        // renderLeftIcon={() => (
        //   <AntDesign
        //     style={styles.icon}
        //     color={isFocus ? 'blue' : 'black'}
        //     name="Safety"
        //     size={20}
        //   />
        // )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 0,
  },
  dropdown: {
    height: 35,
    marginTop: 0,
    marginBottom: 0,
    borderColor: '#d7d7d7',
    borderWidth: 0.5,
    borderRadius: 32,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 32,
  },
});
