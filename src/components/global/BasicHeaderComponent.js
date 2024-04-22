import React from 'react';
import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {Box, HStack} from 'native-base';
import BackSvg from '../../../assets/back_icon.svg';
//Styles
import globalStyles from '../../../styles/MainStyle.js';
//import Icon from '@expo/vector-icons/Ionicons';
const {width, height} = Dimensions.get('window');

export default function BasicHeader(props) {
  //const insets = useSafeAreaInsets();
  return (
    <View style={{paddingTop: 0, paddingBottom: 0}}>
      {/* <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle={'dark-content'}
      /> */}
      <View style={styles.header}>
        <View style={styles.container}>
          <View style={styles.backBtn}>
            {props.isBackBtnDisable ? (
              <Box pl="5" pt="2" pb="2">
                <Text style={styles.title}>{props.title}</Text>
              </Box>
            ) : (
              <Box>
                <HStack>
                  <TouchableOpacity onPress={props.onPress}>
                    <BackSvg style={styles.backIcon} />
                  </TouchableOpacity>
                  <Text style={styles.title}>{props.title}</Text>
                </HStack>
              </Box>
            )}
          </View>
        </View>
      </View>
      <View style={globalStyles.line} />
    </View>
  );
}

var styles = StyleSheet.create({
  top: {paddingTop: 0, paddingBottom: 0},
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    // remove width and height to override fixed static size
    height: null,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  backBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    width,
  },
  backIcon: {
    height: 40,
    width: 40,
    color: 'gray',
  },
});
