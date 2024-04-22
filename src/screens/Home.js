import messaging from '@react-native-firebase/messaging';
import { useNavigation, useRoute } from '@react-navigation/native'; //useTheme,
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Appearance,
  BackHandler,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import NetInfo from "@react-native-community/netinfo";

//Class
import API_URL from '../Api.js';
import AsyncStorageManager from '../class/AsyncStorageManager';
import Utils from '../class/Utils.js';
import { get, post } from '../class/ApiManager.js';
import Token from '../class/TokenManager';

// Component imports
import CustomButton from '../components/global/ButtonComponent.js';
import ModalPopupConfirmation from '../components/global/ModalPopupConfirmation';
import ModalPoup from '../components/global/ModalPoupDoubleButtonComponent.js';
import HomeHeaderComponent from '../components/global/HomeHeaderComponent.js';

// SVG import

// Styles
import globalStyle from '../../styles/MainStyle.js';
import { useTheme } from '../../styles/ThemeProvider';

import LottieBackground from '../components/global/LottieBackground.js';
import CONSTANTS from '../Constants.js';
import LogoHeader from '../components/global/LogoHeader.js';

const Home = (navigation) => {
  const [pageLoad, setPageLoad] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isExitVisible, setExitVisible] = useState(false);
  const [visibleUpgradeModal, setUpgradeModal] = useState(false);
  const [btnLoad, setBtnLoad] = useState(false);
  const [themeName, setThemeName] = useState('Empty');
  const [subscriptionInfo, setSubscriptionInfo] = useState({});
  const [userId, setUserId] = useState(null);

  const { theme, bg, unread, setUnread } = useTheme();
  // console.log('theme_name',theme);
  const route = useRoute();
  const navi = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Your useEffect code
    const colorScheme = Appearance.getColorScheme();
    console.log('System Theme mode: ' + colorScheme);
    if (colorScheme === 'dark') {
      // Use dark color scheme
      setThemeName(colorScheme);
      console.log('System Theme mode: ' + colorScheme);
    } else {
      console.log('System Theme mode: ' + colorScheme);
      setThemeName(colorScheme);
    }

    profileUpdateCheck();

    //setUpgradeModal(true);
    //setVisible(true);
    requestUserPermission();
    onNotificationOpenedAppFromQuit();
    listenToBackgroundNotifications();
    listenToForegroundNotifications();
    onNotificationOpenedAppFromBackground();

    //Back button listen
    const backAction = () => {
      console.log(' ----Back pressed');
      const isFocused = navi.isFocused();
      console.log(' --> ' + route.name + ' l:' + isFocused);

      if (isFocused) {
        // Alert.alert('Hold on!', 'Are you sure you want to close this app?', [
        //   {
        //     text: 'Cancel',
        //     onPress: () => null,
        //     style: 'cancel',
        //   },
        //   { text: 'YES', onPress: () => BackHandler.exitApp() },
        // ]);
        setExitVisible(true);
      } else {
        navi.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    //updateUnreadCount(1);
    const gastureListen = () => {
      console.log(' Gesture listen');
    }

    //const gestureHandler = navi.addListener('beforeRemove', gastureListen);

    // Subscribe
    // const subscribe = NetInfo.addEventListener(state => {
    //   console.log("Connection type", state.type);
    //   console.log("Is connected?", state.isConnected);
    // });

    // Unsubscribe
    // subscribe();
    // return () => {
      // backHandler.remove();
      //gestureHandler.remove();
    // }

  }, []);

  //Profile Update modal
  const profileUpdateCheck = async () => {
    let user_id = await AsyncStorageManager.getData(CONSTANTS.USER_ID /*'user_id'*/);
    setUserId(user_id);
    var profileStatus = await AsyncStorageManager.getData(CONSTANTS.PROFILE_STATUS /*'profile_status'*/);
    console.log('Profile Status from async:  ' + profileStatus);

    var isDialogShowOnce = await Utils.getProfileUpdateShowOnce();
    console.log('Dialog show onece: ' + isDialogShowOnce);
    if ((profileStatus === null || profileStatus === undefined || profileStatus === '' || profileStatus === 'not_completed') && !isDialogShowOnce) {
      Utils.setProfileUpdateShowOnce(true);
      //setVisible(true);
      getProfileInfo();
      console.log('Profile not completed');
    } else if (profileStatus === 'not_completed') {

      setVisible(false);
      setPageLoad(false);
      console.log('Profile completed');
    } else {
      setPageLoad(false);
    }
  };

  const getProfileInfo = async () => {
    var profileApi_ = API_URL.PROFILE_;
    get(profileApi_)
      .then(data => {

        try {
          console.log("-Profile-" + JSON.stringify(data))
          var a = JSON.stringify(data);
          var json = JSON.parse(a);

          var profileInfo = json.data;

          const profileStatus = profileInfo.profile_status;
          const unreadCount = profileInfo.unread_notifications_count

          console.log('profile status==>' + profileStatus + ' unread: ' + unreadCount);

          AsyncStorageManager.storeData(
            CONSTANTS.PROFILE_STATUS,
            profileStatus + '',
          );

          if (profileStatus === 'not_completed') {
            Utils.setProfileUpdateShowOnce(true);
            setVisible(true);
            return;
          } else {
            Utils.setProfileUpdateShowOnce(true);
            setVisible(false);
          }

          if (unreadCount < 1) {
            setUnread(null);
          } else {
            setUnread(unreadCount);
          }
        } catch (error) {
          console.log("Error got: " + error);
        }
      })
      .catch(error => {
        console.error("Error got: " + error)
      }
      );
  };


  //Working
  const requestUserPermission = async () => {
    try {
      await messaging().requestPermission();
      const token = await messaging().getToken();
      console.log('Device Token:', token);
    } catch (error) {
      console.log('Permission or Token retrieval error:', error);
    }
  };

  const listenToForegroundNotifications = async () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new message arrived! (FOREGROUND)',
        JSON.stringify(remoteMessage),
      );
      try {
        const data = remoteMessage.data.data;
        const notification = remoteMessage.notification;
        const title = notification.title;
        const body = notification.body;

        console.log('Data: ' + JSON.parse(data));
        const receivedData = JSON.parse(data);

        showToast('success', title, body, receivedData);
        updateUnreadCount(unread + 1);
      } catch (e) {
        console.log('Error: ' + e);
      }
    });
    return unsubscribe;
  };

  const listenToBackgroundNotifications = async () => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log(
          'A new message arrived! (BACKGROUND)',
          JSON.stringify(remoteMessage),
        );
      },
    );
    return unsubscribe;
  };

  const onNotificationOpenedAppFromBackground = async () => {
    const unsubscribe = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        console.log(
          'App opened from BACKGROUND by tapping notification:',
          JSON.stringify(remoteMessage),
        );
      },
    );
    return unsubscribe;
  };

  const onNotificationOpenedAppFromQuit = async () => {
    const remoteMessage = await messaging().getInitialNotification();

    //Can handle push from background
    if (remoteMessage) {
      console.log(
        'App opened from QUIT by tapping notification:',
        JSON.stringify(remoteMessage),
      );
      updateUnreadCount(unread + 1);
      try {
        const data = remoteMessage.data.data;
        const notification = remoteMessage.notification;
        const title = notification.title;
        const body = notification.body;

        console.log('Data: ' + JSON.parse(data));
        const receivedData = JSON.parse(data);

        console.log('Received data: ' + receivedData);

        const nda = receivedData.nda;

        const ndaId = receivedData.n_d_a_id;

        const ndaName = nda.receiver_name;
        const status = nda.status;
        const fileUrl = nda.file_url;
        console.log('Nda Name: ' + ndaName + 'NDA Id: ' + ndaId);
        const senderId = nda.sender_id;
        openNdaPage(ndaId, ndaName, senderId, fileUrl, status);

        // openNdaPage(ndaId, name);
      } catch (e) {
        console.log('Quite to open app by notification error: ' + e);
      }
    }
  };

  const onInitialNotificaation = async () => {
    const message = await messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Initial Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        //setLoading(false);
      });
  };

  const updateUnreadCount = (count) => {
    if (count < 1) {
      count = null;
    }
    setUnread(count);
  }

  const openNdaPage = (ndaId, ndaName, senderId, fileUrl, status) => {
    // navi.navigate('document_status', {
    //   initial: false,
    //   id: ndaId,
    //   name: ndaName,
    // },);
    const userIdNum = Number(userId);
    const senderIdNum = Number(senderId + '');
    var displayAs = 'sender'; // me as
    if (senderIdNum == userIdNum) {
      displayAs = 'sender';
    } else {
      displayAs = 'receiver';
    }

    navi.navigate('create_nda_signing', {
      id: ndaId,
      name: ndaName,
      receiver_name: ndaName,
      displayAs: displayAs,
      status: status,
      fileUrl: fileUrl,
      isEdit: false,
      ///data: item,
    });

    // navi.navigate('tab_home', {
    //   screen: 'document_status',
    //   initial: false,
    //   params: {
    //     id: ndaId,
    //     name: ndaName,
    //   },
    // });
  };

  const showToast = (type, title, body, receivedData) => {
    Toast.show({
      type: type,
      text1: title,
      text2: body,
      onPress: () => {
        console.log('Press notification');
        closeToast();
        try {
          const data = receivedData;
          //const senderId = data.sender_id;

          //const ndaId = data.n_d_a_id;
          //const ndaName = data.receiver_name;
          //const status = data.status;
          ///const fileUrl = data.file_url;
          //const senderId = data.sender_id;

          console.log('Nda Name: ' + ndaName + 'NDA Id: ' + ndaId);
          // openNdaPage(ndaId, ndaName, displayAs, senderId, fileUrl, status);

          const nda = data.nda;

          const ndaId = data.n_d_a_id;

          const ndaName = nda.receiver_name;
          const status = nda.status;
          const fileUrl = nda.file_url;
          console.log('Nda Name: ' + ndaName + 'NDA Id: ' + ndaId);
          const senderId = nda.sender_id;
          openNdaPage(ndaId, ndaName, senderId, fileUrl, status);
        } catch (e) {
          console.log('Quite to open app by notification error: ' + e);
        }
      },
    });
  };

  const closeToast = () => {
    Toast.hide();
  };

  //API Calls
  const getSubscriptionInfo = async () => {
    setBtnLoad(true);

    let token = await Token.getToken();
    var profileStatus = await AsyncStorageManager.getData(CONSTANTS.PROFILE_STATUS);
    if (profileStatus === 'not_completed') {
      Utils.setProfileUpdateShowOnce(true);
      setVisible(true);
      setBtnLoad(false);
      return;
    }

    var api = API_URL.MY_SUBSCRIPTION;
    await fetch(api, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          var a = JSON.stringify(responseJson);
          var json = JSON.parse(a);
          if (responseJson.status === 200) {
            var info = json.data;
            setBtnLoad(false);
            setSubscriptionInfo(info);
            console.log('Status ==> ok ==> getSubscriptionInfo');
            if (info?.nda_limit > 0) {
              navi.navigate('create_nda_receiver_info', {
                data: null,
                isEdit: true,
              });
            } else {
              navi.navigate('pricing-plan-home', {
                isGoChooseNda: true,
              });
            }
          } else {
            console.log('Error: ' + JSON.stringify(json));
            setBtnLoad(false);
            if (json.message == 'You never subscribed here.') {
              navi.navigate('pricing-plan-home', {
                isGoChooseNda: true,
              });
            }
          }
        } catch (error) {
          console.error(error);
          console.log(error);
          setBtnLoad(false);
        }
      })
      .catch(error => {
        console.error(error);
        setBtnLoad(false);
      });
  };

  return (
    // <View
    //   style={{
    //     flex: 1,
    //     backgroundColor: 'transparent',
    //   }}>
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      {/* <View style={{ alignSelf: 'center', marginStart: -30 }}> */}
      {/* <HomeHeaderComponent
          title={'Home'}
          icon={theme?.homeIcon?.homeHoney}
          statusBarColor={theme?.colors?.statusBarColor}
          dark={theme?.name == 'Light'}
          color={theme?.colors?.text}
        /> */}
      {/* </View> */}
      <LogoHeader />
      {pageLoad ? (
        <ActivityIndicator
          color={
            theme?.name != 'Light'
              ? theme?.colors?.text
              : globalStyle.colorAccent
          }
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
            height: 540,
          }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingBottom: 70,
          }}>
          <View style={styles.page}>
            {/* === Plan Upgrade Modal === */}
            {/* <ModalPoupSingle
                theme={theme}
                visible={visibleUpgradeModal}
                title={
                  'You have exceeded the limit of Free NDAs. For creating more, you need to upgrade your Plan'
                }
                source={require('../../assets/coin_anim.json')}
                btnTxt={'Upgrade now'}
                onPressOk={() => {
                  setUpgradeModal(false);

                  navi.navigate('pricing-plan-home', {
                    isGoChooseNda: true,
                  });
                }}
                onPressClose={() => setUpgradeModal(false)}
              /> */}

            <ModalPoup
              visible={visible}
              theme={theme}
              title={'Setup your profile.'}
              // msg={'Save your details Information & Signature for using later.'}
              source={require('../../assets/profile_anim.json')}
              onPressOk={() => {
                setVisible(false);
                navi.navigate('my_profile_home', {
                  from: 'home',
                });
              }}
              onPressClose={() => setVisible(false)}
            />

            <ModalPopupConfirmation
              visible={isExitVisible}
              title={'Confirm Exit'}
              msg={'Are you sure you want to close the app?'}
              okText={'Exit'}
              cancelText={'Cancel'}
              //isLoading={btnLoad}
              onPressOk={() => {
                setExitVisible(false);
                BackHandler.exitApp();
              }}
              theme={theme}
              onPressClose={() => {
                setExitVisible(false);
              }}
            />

            <View style={styles.content}>
              {/* <Text style={{ ...styles.title, color: theme?.colors?.text }}>Home</Text> */}

              <View style={styles.buttonContainer}>
                <CustomButton
                  title={'SHUSH IT'} //btnLoad ? <ActivityIndicator color={theme?.colors?.text} /> :
                  isLoading={btnLoad}
                  color={theme?.colors?.btnText}
                  colors={theme?.colors?.colors}
                  bordered={true}
                  borderWidth={theme?.name == 'Light' ? 0 : 3}
                  borderColor={theme?.colors?.borderColor}
                  borderColors={theme?.colors?.borderColors}
                  shadow={theme?.name == 'Light'}
                  disabled={btnLoad}
                  onPress={() => {
                    getSubscriptionInfo();
                    //   Toast.show({
                    //     type: 'warning',
                    //     text1: 'You\'re currently offline!',
                    //     text2: 'offline',
                    //     visibilityTime: 120000,
                    //   })
                  }}
                />
              </View>

              <View style={{ ...styles.buttonContainer }}>
                <CustomButton
                  title={'SHUSHING'}
                  color={theme?.colors?.btnText}
                  colors={theme?.colors?.colors}
                  bordered={true}
                  borderWidth={theme?.name == 'Light' ? 0 : 3}
                  borderColors={theme?.colors?.borderColors}
                  borderColor={theme?.colors?.borderColor}
                  shadow={theme?.name == 'Light'}
                  disabled={btnLoad}
                  onPress={() => {
                    navi.navigate('document_list', {
                      header: 'Shushing',
                    });
                  }}
                />
              </View>

              <View style={styles.buttonContainer}>
                <CustomButton
                  title={'SHUSHED'}
                  color={theme?.colors?.btnText}
                  colors={theme?.colors?.colors}
                  bordered={true}
                  borderWidth={theme?.name == 'Light' ? 0 : 3}
                  borderColor={theme?.colors?.borderColor}
                  borderColors={theme?.colors?.borderColors}
                  shadow={theme?.name == 'Light'}
                  disabled={btnLoad}
                  onPress={() => {
                    navi.navigate('document_list', {
                      tabSelected: 1,
                      header: 'Shushed',
                    });
                    // navi.navigate('document_list', {
                    //   tabSelected: 1,
                    // });
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: globalStyle.topPadding,
    // backgroundColor: globalStyle.statusBarColor,
  },
  page: {
    flex: 1,
    paddingBottom: 0,
    justifyContent: 'center',
    alignContent: 'center',
    // backgroundColor: globalStyle.backgroundColor,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 50,
  },
  bgImage: {
    flex: 1,
    // justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingBottom: 32,
    width: '100%',
  },
  plusButtonContainer: {
    alignSelf: 'center',
    paddingTop: 50,
    // paddingTop: 100,
  },
});

export default Home;
