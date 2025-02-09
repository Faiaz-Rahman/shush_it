import { useNavigation } from '@react-navigation/native';
import { React, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ButtonComponentSmall from '../../components/global/ButtonComponentSmall.js';
import ModalPopupConfirmation from './ModalPopupConfirmation.js';
import Url from '../../Api.js';
import ModalPoup from './ModalPoupComponent';

import { BlurView } from "@react-native-community/blur";

export default function DocumentListItemComponent({ item, userId, theme, userToken, setRefetchId }) {
  const navi = useNavigation();
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMsg, setModalMsg] = useState('');


  const handleDelete = async () => {
    setIsLoading(true);

    var api = Url.NDA_CREATE + '/' + item?.id;
    await fetch(api, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          var a = JSON.stringify(responseJson);
          var json = JSON.parse(a);
          if (responseJson.status === 200 || responseJson.status === 202) {
            var data = json.data;
            setRefetchId(item?.id)

            setIsLoading(false);
            setVisible(false);

            // console.log("data==>", data?.data);

            setIsSuccess(true)
            setModalShow(true)
            setModalMsg(json.message)

            console.log('Status ==> ok');
          } else {
            const data = JSON.stringify(json);
            var json = JSON.parse(data);

            setIsSuccess(false)
            setModalShow(true)
            setModalMsg(json.message)

            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
          console.log(error);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.mainContainer}>
      <ModalPopupConfirmation
        visible={visible}
        title={'Delete Confirmation'}
        msg={'Are you sure you want to delete this ?'}
        source={require('../../../assets/warning.json')}
        okText={'Delete'}
        cancelText={'Cancel'}
        isLoading={isLoading}
        onPressOk={handleDelete}
        theme={theme}
        onPressClose={() => {
          setVisible(false);
        }}
      />

      <ModalPoup
        theme={theme}
        visible={modalShow}
        title={modalMsg}
        source={
          isSuccess
            ? require('../../../assets/done.json')
            : require('../../../assets/sign_in_animation.json')
        }
        btnTxt={'Ok'}
        onPressOk={() => setModalShow(false)}
        onPressClose={() => setModalShow(false)}
      />

      <View
        style={Platform.OS === 'ios' ? styles.shadowIos : { ...styles.shadowAndroid, elevation: theme?.name == 'Light' ? 16 : 0 }}
      >
        <View style={{
          ...styles.container,
          shadowOpacity: theme?.name == 'Light' ? 1 : 0,
          shadowRadius: theme?.name == 'Light' ? 6 : 0,
          backgroundColor: theme?.name == 'Light' ? "white" : "rgba(255, 255, 255, 0.15)"
        }}>
          <BlurView
            style={styles.absolute}
            blurType="thinMaterialDark"
            blurAmount={Platform.OS === 'ios' ? 15 : 5}
            reducedTransparencyFallbackColor="white"
          />

          <View style={styles.view}>

            <TouchableOpacity
              style={styles.titleContainer}
              onPress={() => {
                const userIdNum = Number(userId);
                const senderIdNum = Number(item.sender_id + '');
                var displayAs = 'sender' // me as
                if (senderIdNum == userIdNum) {
                  displayAs = 'sender';
                } else {
                  displayAs = 'receiver';
                }
                navi.navigate('create_nda_signing', {
                  id: item.id,
                  name: item.nda_name,
                  receiver_name: item.receiver_name,
                  displayAs: displayAs,
                  status: item?.status,
                  fileUrl: item?.file_url,
                  data: item,
                  isEdit: false,
                });
              }}
            >
              <Text style={{ ...styles.title, color: theme?.name == 'Light' ? '#2e476e' : 'white' }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item?.receiver_name || 'N/A'}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <ButtonComponentSmall
                title={item?.status == 'completed' ? 'View' : 'Shush It'}
                color={theme?.colors?.btnText}
                colors={theme?.colors?.colors}
                bordered={true}
                borderWidth={theme?.name == 'Light' ? 0 : 3}
                borderColor={theme?.colors?.borderColor}
                borderColors={theme?.colors?.borderColors}
                shadow={theme?.name == 'Light'}

                onPress={() => {
                  const userIdNum = Number(userId);
                  const senderIdNum = Number(item.sender_id + '');
                  var displayAs = 'sender' // me as
                  if (senderIdNum == userIdNum) {
                    displayAs = 'sender';
                  } else {
                    displayAs = 'receiver';
                  }
                  navi.navigate('create_nda_signing', {
                    id: item.id,
                    name: item.nda_name,
                    receiver_name: item.receiver_name,
                    displayAs: displayAs,
                    status: item?.status,
                    fileUrl: item?.file_url,
                    data: item,
                    isEdit: false,

                  });
                }}
              />
            </View>


            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(true);
                }}
              >
                {theme?.header?.delete}
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>
      {/* </View> */}
    </View>
  );
}

var styles = StyleSheet.create({
  absolute: {
    width: 'auto',
    height: 'auto',
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  mainContainer: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  //Shadow For Android
  // shadowAndroid: {
  //   elevation: 16,
  //   borderRadius: 20,
  //   backgroundColor: 'white',
  // },
  actionContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    overflow: 'hidden',
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    padding: 15,
    gap: 10,
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
    // justifyContent: 'center',
    // paddingLeft: 0,
    // paddingRight: 10,
    // marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    justifyContent: 'center',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  buttonContainer: {
    // flex: 2,
    justifyContent: 'center',
    alignContent: 'stretch',
    marginEnd: 10,
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
