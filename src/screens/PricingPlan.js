import { useNavigation } from '@react-navigation/native';
import { React, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import {
  getProducts,
  initConnection,
  requestPurchase,
  getAvailablePurchases,
  purchaseEventListener,
  purchaseErrorListener,
  inAppPurchaseUpdatedEvent,
  clearProductsIOS,
  validateReceiptIos,
  validateReceiptAndroid,
  acknowledgePurchaseAndroid,
  finishTransaction,
  purchaseUpdatedListener,
  setup,
  PurchaseStateAndroid
} from 'react-native-iap';

//Variables
//Class
import Url from '../Api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Component
import CustomButton from '../components/global/ButtonComponent.js';
import DocumentListHeader from '../components/global/DocumentListHeaderComponent';
// import Button from '../components/global/ButtonComponent.js';

// Styles
import globalStyle from '../../styles/MainStyle.js';
import Token from '../class/TokenManager';
import NoData from '../components/global/NoData';
import { useTheme } from '../../styles/ThemeProvider';
import ThemeSelectorForTest from '../components/global/ThemeSelectorForTest';
import AvailableNDACount from '../components/global/AvailableNDACount';
import ModalPoup from '../components/global/ModalPoupComponent.js';
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';
import AsyncStorageManager from '../class/AsyncStorageManager.js';
import CONSTANTS from '../Constants.js';
import { copyStringIntoBuffer } from 'pdf-lib';
import LogoHeader from '../components/global/LogoHeader.js';

export default function PricingPlan(navigation) {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navi = useNavigation();
  const [data, setData] = useState({});
  const [subscriptionInfo, setSubscriptionInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const [btnLoad, setBtnLoad] = useState(false);

  const { isGoChooseNda, from } = navigation.route.params;


  const handlePress = () => {
    navi.goBack();
    console.log('Button pressed!');
  };

  useEffect(() => {

    console.log('Pricing Plan UseEffect');
    const asyncFunc = async () => {
      let userToken = await Token.getToken();
      if (userToken) {
        setUserToken(userToken);
        getPricing(userToken);
        getSubscriptionInfo(userToken);
      } else {
        console.log('Token not found');
        return false;
      }
    };

    asyncFunc();

    // In up purchase Code
    setInappPurchase()

    const startPurchaseListener = purchaseUpdatedListener(async (purchase) => {
      // Handle purchase updates here
      console.log("Purchased: " + JSON.stringify(purchase))
      processPurchase(purchase)
    });

    const startPurchaseErrorListener = purchaseErrorListener((error) => {
      console.log("Purchase Error Listener: " + JSON.stringify(error));

      //{"message":"Payment is Cancelled.","debugMessage":"","code":"E_USER_CANCELLED","responseCode":1}
      switch (error.code) {
        case 'E_USER_CANCELLED':
          console.log("Purchase Cancled");
          break;
        case 'E_ALREADY_OWNED':
          console.log("Already purchased");
          getPurchasedPlan();
          break
        default:
          console.log("Purchase error listener: " + error.code);
      }
    });

    return () => {
      startPurchaseListener.remove()
      startPurchaseErrorListener.remove();
    };

  }, []);

  const processPurchase = async (purchase) => {
    if (Platform.OS === 'android') {
      if (purchase.purchaseStateAndroid === PurchaseStateAndroid.PURCHASED) {
        // Grant access, unlock features, etc. based on productID
        const productID = purchase.productId;
        console.log('Purchased ProductId: ' + productID);

        let planId = await AsyncStorageManager.getData(CONSTANTS.SELECTED_PLAN_ID);
        let planPrice = await AsyncStorageManager.getData(CONSTANTS.SELECTED_PLAN_PRICE);
        console.log('PlanId: ' + planId + " PlanPrice: " + planPrice);
        if (planId & planPrice) {
          updatePurchasedProductToServer(planId, planPrice, purchase);
        }

      } else if (purchase.purchaseStateAndroid === PurchaseStateAndroid.PENDING) {
        // Handle acknowledged purchases (e.g., subscriptions)
        const productID = purchase.productId;
        console.log("Purchased: status PENDING")
        // ...your app logic here...
      } else if (purchase.purchaseStateAndroid === PurchaseStateAndroid.UNSPECIFIED_STATE) {
        // Handle other purchase states (e.g., restored, refunded)
        // ...logging or debugging...
        console.log("Purchased: status UNSPECIFIED")
      } else {

      }
    } else if (Platform.OS === "ios") {
      console.log("Ios Purchase: " + JSON.stringify(purchase));
      // console.log("Plan Item: " + JSON.stringify(data));

      let planId = await AsyncStorageManager.getData(CONSTANTS.SELECTED_PLAN_ID);
      let planPrice = await AsyncStorageManager.getData(CONSTANTS.SELECTED_PLAN_PRICE);
      console.log('PlanId: ' + planId + " PlanPrice: " + planPrice);
      if (planId & planPrice) {
        updatePurchasedProductToServer(planId, planPrice, purchase);
      }
    }
  }


  const validateAndroidReceipt = async (purchase) => {
    console.log("Android Transaction Validate: ");
    await finishTransaction({ purchase: purchase, isConsumable: true }).then(result => {
      console.log('Finish transaction: ' + JSON.stringify(result));
    }).catch(result => {
      console.log('Finish transaction: error: ' + result);
    })
  }

  const validateIOSReceiptData = async (receiptBody, test, purchase) => {
    await validateReceiptIos({
      receiptBody,
      test
    }).then(async result => {
      console.log("Transaction Validate: " + JSON.stringify(result));

      await finishTransaction({ purchase: purchase, isConsumable: true })

    }).catch(error => {
      console.log("Transaction Validate: " + error);
    });
  }

  const setInappPurchase = async () => {
    //storekit2Mode();
    setup({ storekitMode: 'STOREKIT1_MODE' })// See above for available options
    await initConnection()
  }

  const getPricing = async token => {
    setIsLoading(true);
    var api = Url.PRICING_PLAN;
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
            var priceInfo = json.data;
            setIsLoading(false);
            setData(priceInfo);
            // console.log("first", priceInfo);
            console.log('Status ==> ok ==> getPricing: ' + JSON.stringify(priceInfo));
          } else {
            console.log('State list error: ' + JSON.stringify(json));
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

  const getSubscriptionInfo = async token => {
    setBtnLoad(true);
    var api = Url.MY_SUBSCRIPTION;
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
          } else {
            console.log('Error: ' + JSON.stringify(json));
            setBtnLoad(false);
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

  const getProducDetails = async (sku) => {
    console.log('get Product: ' + sku);
    setIsLoading(true);

    try {
      getProducts({
        skus: [sku],
        andDangerouslyFinishTransactionAutomaticallyIOS: true,
      }).then(() => {
        console.log('Get Products ');
        purchase(sku);
      }).catch(() => {
        console.log('Get Products error ');
        setIsLoading(false);
      })

    } catch (err) {
      console.log("Get Product err: " + err.code + " ---", err.message);
      //setPlanItem(null);
      //console.warn(err.code + " ---", err.message);
    }
  }

  const getPurchasedPlan = async () => {
    try {
      getAvailablePurchases().then(async (purchases) => {
        console.log("Available: " + JSON.stringify(purchases));

        purchases.forEach(async (purchase, index) => {
          processPurchase(purchase);
        });

      })
    } catch (err) {
      console.warn(err.code, err.message);
    }
  }

  const purchase = async (sku) => {
    console.log('purchase sku: ' + sku);

    if (Platform.OS === 'android') {
      try {
        requestPurchase({
          skus: [sku],
          andDangerouslyFinishTransactionAutomaticallyIOS: true,
        }).then(() => {
          console.log('Perchase in store successfully');
          setIsLoading(false);
        }).catch(error => {
          console.log('Purchase in store Error' + error);
          setIsLoading(false);
        })
      } catch (err) {
        console.warn(err.code + "---", err.message);
        setIsLoading(false);
      }
    } else if (Platform.OS === 'ios') {

      try {
        requestPurchase({
          sku: sku,
          andDangerouslyFinishTransactionAutomaticallyIOS: false,
        }).then(() => {
          console.log('Perchase in store successfully');
          setIsLoading(false);
        }).catch(error => {
          console.log('Purchase in store Error' + error);
          setIsLoading(false);
        })

      } catch (err) {
        console.warn(err.code + "---", err.message);
        setIsLoading(false);
      }
    }
  };

  const purchaseRequestToStore = async item => {

    const id = item.id;
    const androidProductIdSku = item.sku_android;
    const iosProductIdSku = item.sku_ios;

    AsyncStorageManager.storeData(CONSTANTS.SELECTED_PLAN_ID, item.id + '');
    AsyncStorageManager.storeData(CONSTANTS.SELECTED_PLAN_PRICE, item.price + '');

    try {

      if (Platform.OS === 'android') {
        getProducDetails(androidProductIdSku);

      } else if (Platform.OS === 'ios') {
        getProducDetails(iosProductIdSku);//'iosProductIdSku'
      } else {
        console.log('Platform not either android or ios');
      }
    } catch (err) {
      console.log("purchaseRequestToStore()" + err);
    }
  }

  const updatePurchasedProductToServer = async (planId, planPrice, purchase) => {
    setIsLoading(true);

    var formDataN = new FormData();
    if (Platform.OS === 'android') {

      formDataN.append('pricing_id', planId);
      formDataN.append('payment_method', 'google_pay');
      formDataN.append('amount', planPrice);
      formDataN.append('product_id', purchase?.productId);
      formDataN.append('txn_id', purchase?.transactionId);
      formDataN.append('trx_receipt', purchase?.transactionReceipt);
      formDataN.append('trx_date', purchase?.transactionDate);
      formDataN.append('payment_details', "Purchase");
      formDataN.append('purchase_token', purchase?.purchaseToken);
      formDataN.append('signature_android', purchase?.signatureAndroid);
      formDataN.append('validate', 0);
      formDataN.append('acknowledge', 0);
      formDataN.append('response', JSON.stringify(purchase));
      console.log("formDataN", formDataN);
    } else if (Platform.OS === 'ios') {

      formDataN.append('pricing_id', planId);
      formDataN.append('payment_method', 'apple_pay');
      formDataN.append('amount', planPrice);
      formDataN.append('product_id', purchase?.productId);
      formDataN.append('txn_id', purchase?.transactionId);
      formDataN.append('trx_receipt', purchase?.transactionReceipt);
      formDataN.append('trx_date', purchase?.transactionDate);
      formDataN.append('payment_details', "Purchase");
      formDataN.append('purchase_token', '');
      formDataN.append('signature_android', '');
      formDataN.append('validate', 0);
      formDataN.append('acknowledge', 0);
      formDataN.append('response', JSON.stringify(purchase));
      console.log("formDataN", formDataN);
    }

    // Fetch product information from the app store
    let userToken = await Token.getToken();

    var api = Url.SUBSCRIPTION;
    await fetch(api, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userToken}`,
      },
      body: formDataN,
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          var a = JSON.stringify(responseJson);
          var json = JSON.parse(a);
          if (responseJson.status === 200) {
            setIsLoading(false);
            getSubscriptionInfo(userToken);

            console.log('Status ==> ok ==> buySubscription');

            if (Platform.OS === 'android') {
              validateAndroidReceipt(purchase);
            } else if (Platform.OS === 'ios') {
              const receiptBody = {
                'receipt-data': purchase.transactionReceipt,
                password: 'add', // app shared secret, can be found in App Store Connect
              };
              //validateIOSReceiptData(receiptBody, true, purchase);
              validateIOSReceiptData(receiptBody, CONSTANTS.IS_IOS_IN_APP_PURCHASE_TEST, purchase)
            }

          } else {
            console.log('Error: ' + JSON.stringify(json));
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
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <SafeAreaView style={[styles.container, { paddingBottom: tabBarHeight }]}>
        <LogoHeader />
        {/* <DocumentListHeader
          onPress={handlePress}
          title={!isGoChooseNda ? 'Shushable' : 'Choose Your Plan'}
          backIcon={theme?.header?.backIcon}
          statusBarColor={theme?.colors?.statusBarColor}
          dark={theme?.name == 'Light'}
          color={theme?.colors?.text}
        /> */}

        {isLoading ? (
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
        ) : data && data?.length < 1 ? (
          <NoData />
        ) : (
          <ScrollView // Category List
            horizontal={false}
            // style={styles.categoryListContainer}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingBottom: 70,
            }}
            showsHorizontalScrollIndicator={true}>
            <View style={{ marginTop: 30 }}>
              <TouchableOpacity
                style={{ position: 'absolute', left: 30, zIndex: 100 }}
                onPress={handlePress}>
                {theme?.header?.backIcon}
              </TouchableOpacity>
              {/* <Text style={{ ...styles.title, color: theme?.colors?.text }}>
                {!isGoChooseNda ? 'Shushable' : 'Choose Your Plan'}
              </Text> */}
            </View>

            {/* {!isGoChooseNda ? */}
            <View style={{ alignSelf: 'center', marginVertical: 20 }}>
              {/* <Text
                style={{
                  color:
                    theme?.name != 'Light' ? theme?.colors?.text : '#2E476E',
                  marginVertical: 20,
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                Available
              </Text> */}

              <AvailableNDACount
                text={subscriptionInfo?.nda_limit || 0}
                isLoading={btnLoad}
                borderColor={theme?.textInput?.borderColor}
                backgroundColor={theme?.textInput?.backgroundColor}
                borderWidth={theme?.textInput?.borderWidth}
                darkShadowColor={theme?.textInput?.darkShadowColor}
                lightShadowColor={theme?.textInput?.lightShadowColor}
                shadowOffset={theme?.textInput?.shadowOffset}
                inputColor={theme?.textInput?.inputColor}
              />
            </View>
            {/* :
              <Text style={{ ...styles.title, color: theme?.name != 'Light' ? theme?.colors?.text : '#2E476E' }}>Choose Your Plan</Text>
            } */}

            <View style={styles.listDiv}>
              {data &&
                data?.length > 0 &&
                data.map((item, index) => {
                  return (
                    <View style={styles.buttonContainer} key={index}>
                      <CustomButton
                        title={item?.title}
                        onPress={() => {
                          purchaseRequestToStore(item);
                        }}
                        color={theme?.colors?.btnText}
                        colors={theme?.colors?.colors}
                        bordered={true}
                        borderWidth={theme?.name == 'Light' ? 0 : 3}
                        borderColors={theme?.colors?.borderColors}
                        borderColor={theme?.colors?.borderColor}
                        shadow={theme?.name == 'Light'}
                      />
                    </View>
                  );
                })}

              {isGoChooseNda &&
                !isLoading &&
                subscriptionInfo?.nda_limit > 0 && (
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      title={'CONTINUE'}
                      onPress={() => {
                        navi.navigate('create_nda_receiver_info', {
                          data: null,
                          isEdit: false,
                        });
                      }}
                      color={theme?.colors?.btnText}
                      colors={theme?.colors?.colors}
                      bordered={true}
                      borderWidth={theme?.name == 'Light' ? 0 : 3}
                      borderColors={theme?.colors?.borderColors}
                      borderColor={theme?.colors?.borderColor}
                      shadow={theme?.name == 'Light'}
                    />
                  </View>
                )}
            </View>

            {/* <ThemeSelectorForTest /> */}
          </ScrollView>
        )}

        {/* <ModalPoup
          theme={theme}
          visible={modalShow}
          title={modalMsg}
          source={
            isSuccess
              ? require('../../assets/done.json')
              : require('../../assets/sign_in_animation.json')
          }
          btnTxt={'Ok'}
          onPressOk={() => setModalShow(false)}
          onPressClose={() => setModalShow(false)}
        /> */}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    //paddingTop: globalStyle.topPadding,
    // backgroundColor: globalStyle.statusBarColor,
  },
  top: { zIndex: 1, backgroundColor: '#2E476E', marginTop: 0 },
  icon: {
    height: 30,
    width: 30,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 6,
    height: 117,
    width: 97,
    margin: 10,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    textAlign: 'center',
  },
  // title: {
  //   marginVertical: 30,
  //   fontSize: 20,
  //   fontWeight: 500,
  //   // color: '#2E476E',
  //   textAlign: 'center',
  // },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  listText: {
    fontSize: 14,
    // color: '#2E476E',
    fontWeight: 400,
    marginStart: 15,
    width: 210,
    lineHeight: 23,
  },
  listDiv: {
    // marginBottom: 40,
    bottom: 0,
  },
  btnDiv: {
    marginBottom: 50,
    paddingHorizontal: 35,
  },
});
