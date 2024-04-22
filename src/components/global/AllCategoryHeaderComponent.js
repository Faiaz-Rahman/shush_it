import React from 'react';
import {
  Image,
  Dimensions,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
//import Icon from '@expo/vector-icons/Ionicons';
import SearchSvg from '../../../assets/search.svg';
import BackSvg from '../../../assets/back_icon.svg';

const {width, height} = Dimensions.get('window');

export default function Header(props) {
  return (
    <View style={styles.containerInput}>
      <TouchableOpacity onPress={props.onPress}>
        <BackSvg style={{height: 40, width: 40, color: 'white'}} />
      </TouchableOpacity>
      <TextInput style={styles.inputLocation} placeholder="Location" />
      <TextInput
        style={[styles.input, {marginRight: 10}]}
        placeholder="Search Items"
      />
      <View style={styles.search}>
        <SearchSvg />
      </View>
    </View>
  );
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: 150,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    // remove width and height to override fixed static size
    width: 140,
    height: 50,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    paddingLeft: 20, // add left padding here
    paddingBottom: 10,
  },
  search: {
    marginLeft: -10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CE0078',
    borderColor: '#d4d4d4',
    borderWidth: 1,
  },
  containerInput: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#CE0078',
  },
  inputLocation: {
    marginLeft: 10,
    paddingHorizontal: 10,
    width: width / 4,

    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 5,
    height: 40,
  },
  input: {
    marginLeft: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#d4d4d4',
    height: 40,
  },
});
