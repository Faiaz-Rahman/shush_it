import React from 'react';
import {
  Image,
  Dimensions,
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {
  Box,
  Center,
  Select,
  VStack,
  HStack,
  Divider,
  Input,
  Heading,
} from 'native-base';
//import Icon from '@expo/vector-icons/Ionicons';
import SearchSvg from '../../../assets/search.svg';
import CalenderSvg from '../../assets/calender.svg';
const {width, height} = Dimensions.get('window');

export default function SearchBar(props) {
  return (
    <Box w={width / 2} py="2" pr="1">
      <Select
        //selectedValue={service}
        accessibilityLabel="Choose Service"
        placeholder="Choose Service"
        _selectedItem={{
          bg: 'teal.600',
          endIcon: <CalenderSvg />,
        }}
        mt={1}
        p="3"
        onValueChange={itemValue => {
          //setService(itemValue);
        }}>
        <Select.Item label="UX Research" value="ux" />
        <Select.Item label="Web Development" value="web" />
        <Select.Item label="Cross Platform Development" value="cross" />
        <Select.Item label="UI Designing" value="ui" />
        <Select.Item label="Backend Development" value="backend" />
      </Select>
    </Box>
  );
}

var styles = StyleSheet.create({
  searchIcon: {
    padding: 10,
    borderTopEndRadius: 4,
    borderBottomEndRadius: 4,
    backgroundColor: '#CE0078',
    borderWidth: 0.5,
    borderColor: 'white',
  },
});
