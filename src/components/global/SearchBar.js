import {React, useState} from 'react';
import {
  Button,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Text,
} from 'react-native';
import {Box, Input, HStack} from 'native-base';
//Components
import SearchSvg from '../../../assets/search.svg';
import globalStyle from '../../../styles/MainStyle.js';
const {width, height} = Dimensions.get('window');

export default function SearchBar({onPress}) {
  const [searchKeyword, setSearchKeyWord] = useState('');
  const handleSearchPress = () => {
    // Pass the parameter to the callback function
    onPress(searchKeyword);
  };
  return (
    <View style={styles.input}>
      <TextInput
        placeholder="Search event"
        style={{color: 'gray'}}
        onChangeText={value => {
          console.log('Search' + value);
          setSearchKeyWord(value);
        }}
      />
      <TouchableOpacity onPress={handleSearchPress} style={styles.searchIcon}>
        <SearchSvg />
      </TouchableOpacity>
    </View>
    //  onPress={handleSearchPress}
    // <Input
    //   placeholder={props.text}
    //   borderWidth={0.5}
    //   variant="rounded"
    //   backgroundColor={globalStyle.backgroundColor}
    //   //selectionColor={'#2463eb'}
    //   //borderColor={'#2463eb'}
    //   ml="3"
    //   mr="3"
    //   size="sm"
    //   fontSize="14"
    //   InputRightElement={
    //     <View style={styles.searchIcon}>
    //       <SearchSvg />
    //     </View>
    //   }
    // />
  );
}

var styles = StyleSheet.create({
  searchIcon: {
    paddingRight: 4,
    backgroundColor: globalStyle.backgroundColor, //'#000080', //'#CE0078',
    borderWidth: 0,
    borderColor: globalStyle.backgroundColor,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    marginLeft: 8,
    marginRight: 8,
    padding: 6,
    marginBottom: 0,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: globalStyle.backgroundColor,
    borderColor: '#d7d7d7',
  },
});
