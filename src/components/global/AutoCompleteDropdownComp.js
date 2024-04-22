import React, { memo, useCallback, useRef, useState } from 'react';
import { Button, StyleSheet, Dimensions, Text, View } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Neomorph } from 'react-native-neomorph-shadows';
import Toast from 'react-native-toast-message';
const { width } = Dimensions.get('window');
import API_URLS from '../../Api.js';
import { get, post } from '../../class/ApiManager.js'
import Token from '../../class/TokenManager.js';

export const AutoCompleteDropDown = ({
  url,
  onSelectItemL,
  onClear,
  icon,
  onChangeSelect,
  placeholderTextColor = null,
  options = [],
  showSearch = true,
  divideWidthBy = 1.09,
  height = 55,
  selectedValue = null,
  placeholderColor,
  borderColor = '#B1C5D5',
  backgroundColor = 'white',
  borderWidth = 0.5,
  darkShadowColor = '#9eb5c7',
  lightShadowColor = null,
  shadowOffset = { width: 0, height: 0 },
  initialValue = null,
  onChangeInput,
  inputColor = 'black',
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(initialValue ?
    [{
      id: initialValue,
      title: initialValue,
    }]
    : null
  );
  const [selectedItem, setSelectedItem] = useState({ title: null });
  const [selectedItemHouse, setSelectedHouse] = useState('');
  const [searchText, setSearchText] = useState('');
  const dropdownController = useRef(null);

  const searchRef = useRef(null);

  const getSuggestions = useCallback(async q => {
    onChangeInput(q)

    setSearchText(q)
    // console.log('getSuggestions', q);
    const filterToken = q.toLowerCase();
    if (typeof q !== 'string' || q.length < 0) {
      setSuggestionsList(null);
      return;
    }

    //Find address api start
    setLoading(true);
    let addressSearchApi = url;
    let body = {
      address: filterToken,
    }

    post(addressSearchApi, body).then(response => {
      try {

        var a = JSON.stringify(response);
        var json = JSON.parse(a);

        console.log('auto complete resp', JSON.stringify(json));
        const items = json.data;
        const suggestions = items
          .filter(item => item.address.address.toLowerCase().includes(filterToken))
          .map(item => ({
            title: item.address.address,
            id: item.address.address + ', ' + item.address.city + ', ' +
              item.address.prov + ', ' + item.address.pc + ', ' + item.address.country,
            house_road: item.address.address,
            address: item.address.city + ', ' +
              item.address.prov + ', ' + item.address.pc + ', ' + item.address.country,
            obj: item.address,
          }));
        setSuggestionsList(suggestions);
        setLoading(false);

      } catch (error) {
        console.log("Auto complete json parse error: " + error);
        setLoading(false);
      }
    }).catch(error => {
      console.log("Auto complete api error got: " + error)
      // console.log('auto complete resp error ==>', JSON.stringify(json));
      setSuggestionsList([]);
      //const title = "Please update address"
      //const msg = json.message;
      setLoading(false);
    })

    // return;
    // setLoading(true);
    // // console.log('URL:', url);
    // // console.log('Token:', token);
    // //const response = await fetch(url)
    // const response = await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({
    //     address: filterToken,
    //   }),
    // });
    // console.log('auto query', filterToken);
    // const json = await response.json();
    // if (response.status === 200) {

    //   console.log('auto complete resp', JSON.stringify(json));
    //   const items = json.data;
    //   const suggestions = items
    //     .filter(item => item.address.address.toLowerCase().includes(filterToken))
    //     .map(item => ({
    //       title: item.address.address,
    //       id: item.address.address + ', ' + item.address.city + ', ' +
    //         item.address.prov + ', ' + item.address.pc + ', ' + item.address.country,
    //       house_road: item.address.address,
    //       address: item.address.city + ', ' +
    //         item.address.prov + ', ' + item.address.pc + ', ' + item.address.country,
    //       obj: item.address,
    //     }));
    //   setSuggestionsList(suggestions);
    // } else {

    //   console.log('auto complete resp error ==>', json.data);
    //   // console.log('auto complete resp error ==>', JSON.stringify(json));
    //   setSuggestionsList([]);

    //   const title = "Please update address"
    //   const msg = json.message;
    //   //showToast(title, msg);
    // }
    // setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const onOpenSuggestionsList = useCallback(isOpened => { }, []);

  const showToast = (title, msg) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: msg
    });
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
        ...styles.containerBg,
        width: width / divideWidthBy,
        height: height,

        borderColor: borderColor,
        backgroundColor: backgroundColor,
        borderWidth: borderWidth,
        shadowOffset: shadowOffset,
      }}>
      <View
        style={[
          { flex: 1, flexDirection: 'row', alignItems: 'center' },
          Platform.select({ ios: { zIndex: 1 } }),
        ]}>
        <AutocompleteDropdown
          initialValue={{ id: initialValue }}
          ref={searchRef}
          clearOnFocus={false}
          closeOnBlur={(suggestionsList && suggestionsList.length > 0) ? false : true}
          //direction="down"
          //direction={Platform.select({ios: 'down'})}
          controller={controller => {
            dropdownController.current = controller;
          }}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={item => {
            item && setSelectedItem(item);
            item && onSelectItemL(item);
          }}
          //onSelectItem={onSelectItemL}
          debounce={800}
          direction={'down'}//Platform.select({ ios: 'down' })}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.3}
          onClear={() => {
            setSearchText('')
            onClearPress
            onClear();
          }}
          onSubmit={e => console.log('Submit' + e.nativeEvent.text)} //Submit
          onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          useFilter={false} // prevent rerender twice
          textInputProps={{
            placeholder: 'Address', //'Search address',
            placeholderTextColor: placeholderColor,
            autoCorrect: true,
            height: 50,
            autoCapitalize: 'none',
            style: {
              borderRadius: 25,
              color: inputColor,
              paddingLeft: 18,
              textAlign: 'center',
              fontSize: 14,
            },
          }}
          rightButtonsContainerStyle={{ height: 10, alignSelf: 'center' }}
          inputContainerStyle={{
            alignSelf: 'center',
            //borderRadius: 50,
            backgroundColor: 'transparent',
            height: 50,
            //borderWidth: 0.5,
            //borderColor: '#fff',
          }}
          suggestionsListContainerStyle={{
            borderRadius: 20,
            backgroundColor: 'gray',
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item, text) => {
            // console.log(item);
            // {address: "CORCORAN, CA, 93212, US",
            //  house_road: "777 BROKAW AVE",
            // id: "777 BROKAW AVE, CORCORAN, CA, 93212, US",
            //    obj: {
            //     address: "777 BROKAW AVE",
            //     city: "CORCORAN", 
            //     country: "US",
            //      pc: "93212",
            //       prov: "CA"
            //     }, 
            //      title: "777 BROKAW AVE"
            //     }
            return (
              <Text style={{ color: inputColor, backgroundColor: darkShadowColor, padding: 15 }}>
                {item.id}  {/*({text}) - {item.title} */}
              </Text>
            );
          }}
          inputHeight={50}
          showChevron={false}
          showClear={((searchText && searchText.length > 0) || initialValue?.length > 0) ? true : false}
        />
      </View>
    </Neomorph>
  );
};

const styles = StyleSheet.create({
  //TODO need to fix rotation screen also
  container: {
    //backgroundColor: 'white',
    padding: 0,
  },
  containerBg: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowColor: 'white',
    shadowRadius: 5,
    borderRadius: 50, //20,
    backgroundColor: 'white',
    borderColor: '#B1C5D5',
    alignContent: 'center',
    paddingRight: 1,
    justifyContent: 'center',
    // width: width / divideWidthBy,
    // height: 55,
  },
  itemTextStyle: { color: 'black', fontSize: 12 }, //Need to add theme color
  dropdown: {
    // height: 55,
    marginTop: 0,
    marginBottom: 0,
    borderColor: '#d7d7d7',
    borderWidth: 0,
    borderRadius: 50, //20,
    paddingHorizontal: 10,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
    color: 'gray',
  },
  placeholderStyle: {
    fontSize: 12,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 12,
    //color: 'gray',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 12, //16,
    borderRadius: 32,
    color: 'gray',
  },
});

