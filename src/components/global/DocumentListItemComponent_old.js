import { useNavigation } from '@react-navigation/native';
import { React } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ButtonComponentSmall from '../../components/global/ButtonComponentSmall.js';


//Style

export default function DocumentListItemComponent({ item, userId, theme }) {
  // const [searchKeyword, setSearchKeyWord] = useState('');
  // const handleSearchPress = () => {
  //   // Pass the parameter to the callback function
  //   onSearchPress(searchKeyword);
  // };
  const navi = useNavigation();

  return (
    <View style={styles.mainContainer}>
      {/* <View
      // style={styles.shadowAndroid}
      // style={Platform.OS === 'ios' ? styles.shadowIos : styles.shadowAndroid}
      > */}
      <TouchableOpacity
        style={Platform.OS === 'ios' ? styles.shadowIos : { ...styles.shadowAndroid, elevation: theme?.name == 'Light' ? 16 : 0 }}
        onPress={() => {
          // navi.dispatch(StackActions.push('document_status'));
          navi.navigate('document_status', {
            id: item.id,
            name: item.nda_name,
          });
        }}>
        <View style={{
          ...styles.container,
          shadowOpacity: theme?.name == 'Light' ? 1 : 0,
          shadowRadius: theme?.name == 'Light' ? 6 : 0,
          backgroundColor: theme?.name == 'Light' ? "white" : "rgba(255, 255, 255, 0.15)"
        }}>
          <View style={styles.view}>
            <View style={styles.titleContainer}>
              <Text style={{ ...styles.title, color: theme?.name == 'Light' ? '#2e476e' : 'white' }}>{item?.nda_name}</Text>
            </View>
            <View style={styles.buttonContainer}>
              {/* <TouchableOpacity> */}
              {/* <View
                style={
                  theme?.name == 'Light' ?
                    userId == item?.sender_id && item?.status == 'pending'
                      ? styles.cancelButton
                      : styles.button
                    : null
                }> */}
              <View style={styles.buttonContainer}>
                <ButtonComponentSmall
                  title={item?.status == 'pending' && userId != item?.sender_id
                    ? 'Sign & Send'
                    : item?.status == 'completed'
                      ? 'Archive'
                      : item?.status == 'canceled'
                        ? 'Archive'
                        : userId == item?.sender_id && item?.status == 'pending'
                          ? 'Cancel'
                          : userId == item?.sender_id && item?.status == 'invited'
                            ? 'Invited'
                            : item?.status == 'draft'
                              ? 'Edit'
                              : 'Invited'}
                  color={theme?.colors?.btnText}
                  colors={theme?.colors?.colors}
                  bordered={true}
                  borderWidth={theme?.name == 'Light' ? 0 : 3}
                  borderColor={theme?.colors?.borderColor}
                  borderColors={theme?.colors?.borderColors}
                  shadow={theme?.name == 'Light'}

                  onPress={() => {
                    navi.navigate('document_status', {
                      id: item.id,
                      name: item.nda_name,
                    });
                  }}
                />
              </View>
              {/* <Text style={styles.buttonText}>
                  {item?.status == 'pending' && userId != item?.sender_id
                    ? 'Sign & Send'
                    : item?.status == 'completed'
                    ? 'Archive'
                    : item?.status == 'canceled'
                    ? 'Archive'
                    : userId == item?.sender_id && item?.status == 'pending'
                    ? 'Cancel'
                    : userId == item?.sender_id && item?.status == 'invited'
                    ? 'Invited'
                    : item?.status == 'draft'
                    ? 'Edit'
                    : 'Invited'}
                </Text> */}
              {/* </View> */}
              {/* </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/* </View> */}
    </View>
  );
}

var styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  //Shadow For Android
  // shadowAndroid: {
  //   elevation: 16,
  //   borderRadius: 20,
  //   backgroundColor: 'white',
  // },
  shadowAndroid: {
    // elevation: 16,
    borderRadius: 20,
    //Shadow For Android
  },
  shadowIos: {
    //Shadow for ios
    // shadowOpacity: 1,
    // shadowRadius: 6,
    // shadowColor: 'gray',
    // shadowColor: '#9eb5c7',

    shadowOffset: {
      width: 10,
      height: 10,
    },
    borderRadius: 20,
  },
  container: {
    margin: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: 20,
    // backgroundColor: 'white',
    height: 75,
    //Shadow for ios
    // shadowOpacity: 1,
    // shadowRadius: 6,
    shadowColor: '#9eb5c7',
    // elevation: 20,
    shadowOffset: {
      width: 10,
      height: 10,
    },
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingLeft: 0,
    paddingRight: 10,
  },
  shadow: {
    shadowColor: '#9eb5c7',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 50,
  },
  titleContainer: {
    flex: 4,
    justifyContent: 'center',
    paddingLeft: 0,
    paddingRight: 10,
  },
  title: {
    fontSize: 15,
    //fontWeight: '700',
    fontFamily: 'Poppins-Regular',
    justifyContent: 'center',
    // color: '#2e476e',
    paddingLeft: 30,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  buttonContainer: {
    // flex: 2,
    justifyContent: 'center',
    alignContent: 'stretch',
  },
  button: {
    backgroundColor: '#3d50df',
    borderRadius: 20,
    padding: 8,
  },
  cancelButton: {
    backgroundColor: '#EB5757',
    alignContent: 'center',
    borderRadius: 20,
    padding: 8,
  },

  buttonText: {
    color: 'white',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
});
