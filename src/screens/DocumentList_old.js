import { StackActions, useNavigation } from '@react-navigation/native';
import { React, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, ImageBackground, Animated, FlatList, RefreshControl, Text, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import globalStyle from '../../styles/MainStyle.js';
//Component
import DocumentListHeader from '../components/global/DocumentListHeaderComponent.js';
import DocumentListItem from '../components/global/DocumentListItemComponent.js';
import DocumentTabItem from '../components/global/DocumentTabItemComponent.js';
//Class
import Token from '../class/TokenManager.js';
//UTils
import Url from '../Api.js';
import NoData from '../components/global/NoData.js';
import AsyncStorageManager from '../class/AsyncStorageManager.js';
import { useTheme } from '../../styles/ThemeProvider.js';
import ThemeSelectorForTest from '../components/global/ThemeSelectorForTest.js';
import { ScrollView } from 'react-native-virtualized-view';
import CONSTANTS from '../Constants.js';


export default function DocumentList(navigation) {
  //Data variables
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState(null);
  const [isRefresh, setIsRefresh] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [tabSelected, setTabSelected] = useState(
    navigation.route?.params?.tabSelected || 0,
  );

  //Use ui related variable
  const navi = useNavigation();
  const insets = useSafeAreaInsets();

  //Functions
  const handlePress = () => {
    navi.navigate('home')
    // navi.goBack();
    // console.log('Button pressed!');
  };

  useEffect(() => {
    const asyncFunc = async () => {
      let userToken = await Token.getToken();
      let user_id = await AsyncStorageManager.getData(CONSTANTS.USER_ID /*'user_id'*/);
      setUserToken(userToken);
      setUserId(user_id);

      if (userToken) {
        getData(userToken);
      } else {
        console.log('Token not found');
        return false;
      }
    };
    asyncFunc();
  }, []);

  useEffect(() => {
    if (userToken && !isRefresh) {
      getData(userToken);
    }
  }, [tabSelected, currentPage])

  const getData = async (token, refresh = false) => {
    console.log("fetching data...");
    // setIsLoading(true);

    var api =
      Url.NDA_LIST +
      `?status=${tabSelected == 0
        ? 'pending'
        : tabSelected == 1
          ? 'completed'
          : tabSelected == 2
            ? 'canceled'
            : tabSelected == 3
              ? 'draft'
              : ''
      }
      &page=${refresh ? 1 : currentPage}&paginate=15
      `;

    console.log("api==>", api);
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
            // var data = json.data;

            var apiData = json.data;
            var apiDataArr = apiData?.data;
            setPageInfo({
              total: apiData?.total,
              current_page: apiData?.current_page,
              last_page: apiData?.last_page,
            })

            console.log("isRefresh==>", refresh);

            const newData = refresh ? apiDataArr : data.concat(apiDataArr);
            setData(newData);

            setIsLoading(false);

            if (apiData?.last_page > 1 && apiData?.current_page != apiData?.last_page) {
              setLoadMore(true);
            } else {
              setLoadMore(false);
            }

            setIsRefresh(false);
            // setData(data?.data);

            console.log('apiData?.current_page', apiData?.current_page);
            console.log('apiData?.last_page', apiData?.last_page);
            console.log('Status ==> ok');
          } else {
            console.log('State list error: ' + JSON.stringify(json));
            setIsLoading(false);
            setLoadMore(false);
            setIsRefresh(false);
          }
        } catch (error) {
          console.error(error);
          console.log(error);
          setIsLoading(false);
          setIsRefresh(false);
          setLoadMore(false);
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
        setIsRefresh(false);
        setLoadMore(false);
      });
  };


  const ItemView = ({ item }) => {
    return (
      // Flat List Item
      <DocumentListItem
        userId={userId}
        item={item}
        theme={theme}
      />
    );
  };

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <>
        {loadMore &&
          <ActivityIndicator
            color={theme?.name != 'Light' ? theme?.colors?.text : globalStyle.colorAccent}
          />
        }
      </>
    );
  };

  const renderHeader = () => {
    return (
      <>
        {!isLoading &&
          // <ScrollView
          //   horizontal={true}
          //   showsHorizontalScrollIndicator={false}
          //   contentContainerStyle={styles.tab}
          //   // contentContainerStyle={{
          //   //   // ...styles.tab,
          //   //   flexGrow: 1,
          //   //   justifyContent: 'center',
          //   //   height: Dimensions.get('window').height * 0.75,
          //   // }}
          // >
          <View style={styles.tab}>
            <DocumentTabItem
              onPress={v => {
                setIsLoading(true);
                setCurrentPage(1);
                setData([]);
                setTabSelected(0);
              }}
              title={'Pending'}
              isSelected={tabSelected == 0 ? true : false}
              theme={theme}
            />
            <DocumentTabItem
              onPress={v => {
                setIsLoading(true);
                setCurrentPage(1);
                setData([]);
                setTabSelected(1);
              }}
              title={'Completed'}
              isSelected={tabSelected == 1 ? true : false}
              theme={theme}
            />
            <DocumentTabItem
              onPress={v => {
                setIsLoading(true);
                setCurrentPage(1);
                setData([]);
                setTabSelected(2);
              }}
              title={'Canceled'}
              isSelected={tabSelected == 2 ? true : false}
              theme={theme}
            />
            <DocumentTabItem
              onPress={v => {
                setIsLoading(true);
                setCurrentPage(1);
                setData([]);
                setTabSelected(3);
              }}
              title={'Draft'}
              isSelected={tabSelected == 3 ? true : false}
              theme={theme}
            />
          </View> 
          //{/* </ScrollView> */}
        }
      </>
    );
  };

  return (
    <ImageBackground
      source={theme?.bg?.bgImg}
      resizeMode="cover"
      style={styles.bgImage}
    >
      <SafeAreaView style={[styles.container]}>
        <View>
          <DocumentListHeader
            onPress={handlePress}
            title={'Document List'}

            backIcon={theme?.header?.backIcon}
            statusBarColor={theme?.colors?.statusBarColor}
            dark={theme?.name == 'Light'}
            color={theme?.colors?.text}
          />

          {/* <Text style={{ color: 'white' }}>{data?.length}</Text> */}
          {/* <ThemeSelectorForTest /> */}

          {isLoading ? (
            <ActivityIndicator
              color={theme?.name != 'Light' ? theme?.colors?.text : globalStyle.colorAccent}
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                height: 540,
              }}
            />
          ) : (
            <View>
              {renderHeader()}

              {data && data?.length < 1 ? (
                <NoData />
              ) : (
                <View
                  style={{
                    // height: Dimensions.get('window').height * 0.75,
                    paddingBottom: '95%',
                  }}
                >

                  {/* // <ScrollView
                //   horizontal={false}
                //   showsHorizontalScrollIndicator={false}
                //   contentContainerStyle={styles.list}
                // > */}

                  <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={ItemView}
                    // ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}

                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                      console.log('end reached ...');
                      if (pageInfo?.current_page != pageInfo?.last_page) {
                        setCurrentPage(currentPage + 1)
                      } else {
                        console.log('Limit data reached ...');
                      }
                    }}

                    refreshControl={
                      <RefreshControl
                        refreshing={isRefresh}
                        onRefresh={() => {
                          console.log('onRefresh')
                          setIsRefresh(true)
                          setCurrentPage(1)
                          getData(userToken, true)
                        }}
                      />
                    }
                  />

                </View>


                //   {/* //   {data &&
                // //     data?.length > 0 &&
                // //     data?.map((item, index) => {
                // //       return (
                // //         <DocumentListItem
                // //           userId={userId}
                // //           key={index}
                // //           item={item}
                // //           theme={theme}
                // //         />
                // //       );
                // //     })} */}

                // // </ScrollView>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground >
  );
}
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    //paddingTop: globalStyle.topPadding,
    //paddingBottom: globalStyle.bottomPadding,
    // backgroundColor: globalStyle.statusBarColor,
  },
  tab: {
    // flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  list: {
    // flexDirection: 'column',
    // paddingBottom: '100%', // TODO need to remove this
  },
  button: {
    backgroundColor: '#3d50df',
    borderRadius: 20,
    padding: 8,
    margin: 8,
  },
  buttonText: {
    color: 'white',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
});
