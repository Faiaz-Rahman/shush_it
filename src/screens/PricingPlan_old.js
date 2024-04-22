import { useNavigation } from '@react-navigation/native';
import { React, useEffect, useState, } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
//Image Resource
//Assets
import UniversalAccess from '../../assets/universalAccess.svg';

//Variables
//Class
import Url from '../Api.js';

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

export default function PricingPlan(navigation) {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navi = useNavigation();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { isGoChooseNda } = navigation.route.params;

  const handlePress = () => {
    navi.goBack();
    console.log('Button pressed!');
  };

  useEffect(() => {
    const asyncFunc = async () => {
      let userToken = await Token.getToken();
      if (userToken) {
        getPricing(userToken);
      } else {
        console.log('Token not found');
        return false;
      }
    };

    asyncFunc();
  }, []);

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
            var priceInfo = json.data[0];
            setIsLoading(false);
            setData(priceInfo);
            // console.log("first", priceInfo);
            console.log('Status ==> ok');
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

  return (
    <ImageBackground
      source={theme?.bg?.bgImg}
      resizeMode="cover"
      style={styles.bgImage}
    >
      <SafeAreaView style={[styles.container, { paddingBottom: tabBarHeight }]}>

        <DocumentListHeader
          onPress={handlePress}
          title={'Pricing'}

          backIcon={theme?.header?.backIcon}
          statusBarColor={theme?.colors?.statusBarColor}
          dark={theme?.name == 'Light'}
          color={theme?.colors?.text}
        />

        {isLoading ? (
          <ActivityIndicator
            color={theme?.name != 'Light' ? theme?.colors?.text : globalStyle.colorAccent}
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              height: 540,
            }}
          />
        ) : data && data?.features?.length < 1 ? (
          <NoData />
        ) : (
          <ScrollView // Category List
            horizontal={false}
            // style={styles.categoryListContainer}
            showsHorizontalScrollIndicator={true}>
            <Text style={{ ...styles.title, color: theme?.name != 'Light' ? theme?.colors?.text : '#2E476E' }}>Level up with SHUSH pro</Text>

            <View style={styles.listDiv}>
              {data &&
                data?.features?.length > 0 &&
                data?.features.map((item, index) => {
                  return (
                    <View style={styles.listItem} key={item?.id + index}>
                      {item?.icon ? (
                        <Image
                          source={{
                            uri: Url.IMAGE_URL + item?.icon,
                          }}
                          fallbackSource={{
                            uri: 'https://www.w3schools.com/css/img_lights.jpg', //Todo need demo icon
                          }}
                          style={styles.profilePic}
                          aspectRatio={1}
                          alt=""
                          // size="2xl"
                          resizeMode="cover"
                        />
                      ) : (
                        <UniversalAccess />
                      )}
                      <Text style={{ ...styles.listText, color: theme?.name != 'Light' ? 'white' : '#2E476E' }}>{item?.feature}</Text>
                    </View>
                  );
                })}
            </View>

            <Text style={{ ...styles.title, color: theme?.name != 'Light' ? 'white' : '#2E476E' }}>{data?.title}</Text>

            <View style={styles.buttonContainer}>
              <CustomButton
                title={'Upgrade Now'}
                onPress={() => {
                  // console.log('Press Upgrade Button');
                  //navi.navigate('choose-agreement');
                  if (isGoChooseNda !== undefined && isGoChooseNda === true) {
                    navi.navigate('choose-agreement');
                  }
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

            {/* <ThemeSelectorForTest /> */}

          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
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
    paddingVertical: 7,
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
    marginVertical: 30,
    fontSize: 20,
    fontWeight: 500,
    // color: '#2E476E',
    textAlign: 'center',
  },
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
    marginBottom: 40,
    bottom: 0,
  },
  btnDiv: {
    marginBottom: 50,
    paddingHorizontal: 35,
  },
});
