import { useNavigation } from '@react-navigation/native';
import { React, useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useTheme } from '../../../styles/ThemeProvider.js';
import AccountSVG from '../../../assets/account_icon.svg';
import Url from '../../Api.js';
import ModalPopupConfirmation from '../../components/global/ModalPopupConfirmation';
import Token from '../../class/TokenManager';
import ModalPoup from './ModalPoupComponent';
import AsyncStorageManager from '../../class/AsyncStorageManager';
import Utils from '../../class/Utils';

import { BlurView } from "@react-native-community/blur";

export default function NotificationListItemComponent({ item, setRefetch, theme, setRefetchId, userId, timeFormat, dateFormat }) {
  const navi = useNavigation();
  const [token, setToken] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const { bg, unread, setUnread } = useTheme();

  useEffect(() => {
    const asyncFunc = async () => {
      let userToken = await Token.getToken();
      if (userToken) {
        setToken(userToken);
      } else {
        console.log('Token not found');
        return false;
      }
    };
    asyncFunc();
  }, []);

  const handleDelete = async () => {
    setIsLoading(true);

    var api = Url.NOTIFICATION + '/' + item?.id;
    await fetch(api, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          var a = JSON.stringify(responseJson);
          var json = JSON.parse(a);
          if (responseJson.status === 200 || responseJson.status === 202) {
            var data = json.data;
            // setRefetch(Math.random());
            setRefetchId(item?.id)

            setIsLoading(false);
            // setSuccess(true);
            // visible = false;
            setVisible(false);

            // console.log("data==>", data?.data);

            setIsSuccess(true)
            setModalShow(true)
            setModalMsg(json.message)
            // Alert.alert('Success', `${json.message}`, [
            //   { text: 'OK', onPress: () => { } },
            // ]);

            console.log('Status ==> ok');
          } else {
            const data = JSON.stringify(json);
            var json = JSON.parse(data);
            // console.log('error===>>>' + json);

            setIsSuccess(false)
            setModalShow(true)
            setModalMsg(json.message)
            // Alert.alert('Error', `${json.message}`, [
            //   { text: 'OK', onPress: () => { } },
            // ]);

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


  const updateReadNotification = async (id) => {
    console.log("Unread id: ", id);
    //let token = await Token.getToken();
    var formData = new FormData();
    //Nda Name and status
    formData.append('id', id);

    // const payload = {
    //   id: formData?.otpEmail,
    //   // otp: formData?.otp,
    //   otp:otpPin,
    //   password: formData?.new_password,
    //   // password_confirmation: formData?.new_password_confirm,
    // };
    var stateApi = Url.NOTIFICATION_READ;
    await fetch(stateApi, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        //'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          var a = JSON.stringify(responseJson);
          var json = JSON.parse(a);
          if (responseJson.status === 200) {
            var resp = json.data;
            console.log('Unread send success==>' + JSON.stringify(resp));
          } else {
            console.log(
              'Status: ' +
              JSON.stringify(responseJson) +
              'State list error: ' +
              JSON.stringify(json),
            );
            //setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
          console.log(error);
          //setIsLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
        //setIsLoading(false);
      });
  };

  const updateUnreadCount = (count) => {
    if (count < 1) {
      count = null;
    }
    setUnread(count);
  }

  return (
    <View style={styles.main}>
      <ModalPopupConfirmation
        visible={visible}
        title={'Delete Confirmation'}
        msg={'Are you sure you want to remove this ?'}
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

      {/* <View
        style={Platform.OS === 'ios' ? styles.shadowIos : { ...styles.shadowAndroid, elevation: theme?.name == 'Light' ? 16 : 0 }}
        onLongPress={() => {
          console.log('longPress');
          setVisible(true);
        }}
      > */}
      <View style={{ ...styles.container, backgroundColor: theme?.name == 'Light' ? "white" : "rgba(255, 255, 255, 0.15)" }}>
        {/* <View style={{ ...styles.container, backgroundColor: theme?.name == 'Light' ? "white" : "rgba(255, 255, 255, 0.3)" }}> */}

        <BlurView
          style={styles.absolute}
          blurType="thinMaterialDark"
          blurAmount={Platform.OS === 'ios' ? 15 : 5}
          reducedTransparencyFallbackColor="white"
        />

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {

            // navi.navigate('tab_home', {
            //   screen: 'document_status',
            //   initial: false,
            //   params: {
            //     id: item?.nda?.id,
            //     name: item?.nda?.nda_name,
            //   },
            // });

            const userIdNum = Number(userId);
            const senderIdNum = Number(item?.sender_id + '');
            var displayAs = 'sender' // me as
            if (senderIdNum == userIdNum) {
              displayAs = 'sender';
            } else {
              displayAs = 'receiver';
            }
            console.log('Notification item: ' + JSON.stringify(item));

            navi.navigate('create_nda_signing', {
              id: item?.nda?.id,
              name: item?.nda?.receiver_name,
              displayAs: displayAs,
              status: item?.nda?.status,
              fileUrl: item?.nda?.file_url,
              isEdit: false,
              //data: item,
            });

            updateUnreadCount(-1)
            updateReadNotification(item?.id)

          }}
        >
          {item?.sender && item?.sender?.avatar ? (
            <Image
              source={{
                uri: Url.IMAGE_URL + item?.sender?.avatar,
              }}
              fallbackSource={{
                uri: 'https://www.w3schools.com/css/img_lights.jpg',
              }}
              style={styles.avatar}
              aspectRatio={1}
              alt=""
              // size="2xl"
              resizeMode="cover"
            />
          ) : (
            <View style={styles.iconDiv}>
              <AccountSVG style={styles.icon} />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.titleContainer}
          onPress={() => {
            // navi.navigate('tab_home', {
            //   screen: 'document_status',
            //   initial: false,
            //   params: {
            //     id: item?.nda?.id,
            //     name: item?.nda?.nda_name,
            //   },
            // });

            const userIdNum = Number(userId);
            const senderIdNum = Number(item?.sender_id + '');
            var displayAs = 'sender' // me as
            if (senderIdNum == userIdNum) {
              displayAs = 'sender';
            } else {
              displayAs = 'receiver';
            }
            console.log('Notification item: ' + JSON.stringify(item));

            navi.navigate('create_nda_signing', {
              id: item?.nda?.id,
              name: item?.nda?.nda_name,
              receiver_name: item?.nda?.receiver_name,
              displayAs: displayAs,
              status: item?.nda?.status,
              fileUrl: item?.nda?.file_url,
              isEdit: false,
              //data: item,
            });
            updateUnreadCount(-1)
            updateReadNotification(item?.id)
          }}
        >
          <Text
            style={{ ...styles.title, color: theme?.name == 'Light' ? '#2e476e' : 'white' }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item?.title}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={() => {
              setVisible(true);
            }}
          >
            {theme?.header?.delete}
          </TouchableOpacity>
          {/* <Text style={styles.dateTime}>{Utils.getOnlyDate(item?.updated_at, dateFormat)}</Text>
          <Text style={styles.dateTime}>{Utils.getOnlyTime(item?.updated_at, timeFormat)}</Text> */}
        </View>

      </View>
    </View>
    // </View>
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
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 50,
    marginEnd: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  actionContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingEnd: 15,
  },
  dateTime: {
    color: 'white',
    fontSize: 8,
    // textAlign: 'center',
  },
  main: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  shadowAndroid: {
    // elevation: 16,
    borderRadius: 20,
    // backgroundColor: 'white',
    //Shadow For Android
  },
  shadowIos: {
    //Shadow for ios
    // shadowOpacity: 1,
    // shadowRadius: 6,
    //shadowColor: 'gray',
    // shadowColor: '#9eb5c7',

    // shadowOffset: {
    //   width: 10,
    //   height: 10,
    // },
    borderRadius: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // justifyContent: 'center',

    borderRadius: 20,
    // backgroundColor: 'white',
    // opacity: 0.5,

    height: 75,
    // paddingLeft: 22,
    padding: 15,
    overflow: 'hidden',
  },
  iconContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  // icon: {
  //   position: 'absolute',
  //   justifyContent: 'center',
  //   padding: 8,
  //   height: 40,
  //   width: 40,
  //   borderRadius: 50,
  //   backgroundColor: '#F0F0F0',
  // },
  iconDiv: {
    backgroundColor: '#F0F0F0',
    height: 40,
    width: 40,
    borderRadius: 50,
    marginEnd: 5,
  },
  icon: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  titleContainer: {
    flex: 4,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // alignContent: 'flex-start',
    paddingStart: 10,
  },
  title: {
    fontSize: 15,
    // paddingEnd: 10,
    //fontWeight: '700',
    fontFamily: 'Poppins-Regular',
    // color: '#2e476e',
    textAlign: 'left',
    textAlignVertical: 'center',
    paddingEnd: 10,
  },
});
