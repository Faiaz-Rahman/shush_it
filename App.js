import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NativeBaseProvider } from 'native-base';
import { React, memo, useEffect, useState } from 'react';
import { Alert, Platform, Text, View, useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';

//Class

//Assets
import AccountSvg from './assets/bottom_tab_account.svg';
import AccountGraySvg from './assets/bottom_tab_account_gray.svg';

import SettingsSvg from './assets/bottom_tab_settings.svg';
import SettingsGraySvg from './assets/bottom_tab_settings_gray.svg';

import HomeSvg from './assets/bottom_tab_home.svg';
import HomeGraySvg from './assets/bottom_tab_home_gray.svg';

import ListSvg from './assets/bottom_tab_inbox.svg';
import ListGraySvg from './assets/bottom_tab_inbox_gray.svg';
//Screens
//import CreateEvent from './src/screens/CreateEvent.js';
import HomeScreen from './src/screens/Home.js';
import MyAccount from './src/screens/MyAccount.js';
import MyProfile from './src/screens/Profile.js';
import MyProfileOld from './src/screens/Profile_Old.js';
import Inbox from './src/screens/Inbox.js';
import Settings from './src/screens/Settings.js';

import DocumentList from './src/screens/DocumentList.js';
import DocumentSign from './src/screens/DocumentSign';
import SignIn from './src/screens/SignIn.js';
import SignUp from './src/screens/SignUp.js';
import SplashScreen from './src/screens/SplashScreen.js';
import Draggable from './src/screens/DraggableScreen';
//Components
import TabBarIcon from './src/components/global/TabBarIconComp.js';
//Screens files
import ChooseAgreement from './src/screens/ChooseAgreement';
import ChooseTemplates from './src/screens/ChooseTemplates';
import CreateNdaAcceptance from './src/screens/CreateNdaAcceptance';
import CreateNdaPartyList from './src/screens/CreateNdaPartyList';
import CreateNdaReceiverInfo from './src/screens/CreateNdaReceiverInfo';
import CreateNdaReceiverInfoOld from './src/screens/CreateNdaReceiverInfo_old';
import DocumentStatus from './src/screens/DocumentStatus';
import PricingPlan from './src/screens/PricingPlan';
import styles from './styles/MainStyle.js';
import CreateNdaPartyCustomize from './src/screens/CreateNdaPartyCustomize';
import CreateNdaSigning from './src/screens/CreateNdaSigning';
import ArchiveList from './src/screens/ArchiveList';
import NdaPdfPreView from './src/screens/NdaPdfPreview';

//Styles
import { ThemeProvider, useTheme } from './styles/ThemeProvider';
import GlobalStyle from './styles/MainStyle.js';
import CreateNdaSuccess from './src/screens/CreateNdaSuccess';
import ThemeComponent from './src/screens/ThemeComponent';
import { StatusBar } from 'react-native';
import BackgroundProvider from './src/components/global/BackgroundProvider';
// import Utils from './src/class/Utils';
//import { useNetInfo } from '@react-native-community/netinfo';

import toastConfig from './src/components/global/NotificationConfig';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTab() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
        animation: 'none',
      }}>
      <Stack.Screen name="home" component={HomeScreen} />
      {/* <Stack.Screen
        name="add_address"
        screenOptions={{ headerShown: true }}
        component={CreateEvent}
      /> */}
      <Stack.Screen
        name="document_list"
        screenOptions={{ headerShown: true }}
        component={DocumentList}
      />
      <Stack.Screen
        name="document_status"
        screenOptions={{ headerShown: true }}
        component={DocumentStatus}
      />
      <Stack.Screen
        name="document_sign"
        screenOptions={{ headerShown: true }}
        component={DocumentSign}
      />
      {/* Duplicate fix in account */}
      <Stack.Screen
        name="pricing-plan-home"
        screenOptions={{ headerShown: true }}
        //listeners={resetTabStacksOnBlur}
        component={PricingPlan}
      />
      <Stack.Screen
        name="my_profile_home"
        screenOptions={{ headerShown: true }}
        component={MyProfile}
      />
      <Stack.Screen
        name="draggable"
        screenOptions={{ headerShown: true }}
        component={Draggable}
      />

      {/* <Stack.Screen
        name="create_event"
        screenOptions={{ headerShown: true }}
        component={CreateEvent}
      /> */}
    </Stack.Navigator>
  );
}

function SettingsTab() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
        animation: 'none',
        //animation: 'slide_from_right',

      }}>
      <Stack.Screen name="settings" component={Settings} />
      {/* <Stack.Screen
        name="archive_list"
        screenOptions={{ headerShown: true }}
        component={ArchiveList}
      /> */}
      <Stack.Screen
        name="select_theme"
        screenOptions={{ headerShown: true }}
        component={ThemeComponent}
      />
    </Stack.Navigator>
  );
}

function AccountTab() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
        animation: 'none',
        //animation: 'slide_from_right',

      }}>
      <Stack.Screen name="profile" component={MyAccount} />
      <Stack.Screen
        name="archive_list"
        screenOptions={{ headerShown: true }}
        component={ArchiveList}
      />
      <Stack.Screen
        name="pricing-plan"
        screenOptions={{ headerShown: true }}
        //listeners={resetTabStacksOnBlur}
        component={PricingPlan}
      />
      <Stack.Screen
        name="my_profile"
        screenOptions={{ headerShown: true }}
        component={MyProfile}
      />
      <Stack.Screen
        name="profile_old"
        screenOptions={{ headerShown: true }}
        component={MyProfileOld}
      />
      <Stack.Screen
        name="document_status_account"
        screenOptions={{ headerShown: true }}
        component={DocumentStatus}
      />
    </Stack.Navigator>
  );
}

const LogoTitle = ({ title, icon }) => {
  return (
    <View>
      <View style={styles.logoTitle}>
        {icon}
        <Text style={styles.logoTitleTxt}>{title}</Text>
      </View>
    </View>
  );
};
const HomeHeaderTitle = memo(props => (
  <LogoTitle title={'Home'} icon={HomeGraySvg} {...props} />
));

const HomeTabBarIcon = ({ focused, tabBarLabel }) => {
  const { theme } = useTheme();
  return (
    <TabBarIcon
      isFocused={focused}
      icon={theme?.nav?.home}
      // icon={<HomeSvg />}
      level={'Home'}
    />
  );
};

const InboxHeaderTitle = memo(props => (
  <LogoTitle title={'Inbox'} icon={<ListGraySvg />} {...props} />
));

const InboxTabBarIcon = ({ focused, tabBarLabel }) => {
  const { theme } = useTheme();

  return (
    <TabBarIcon isFocused={focused} icon={theme?.nav?.inbox} level={'Inbox'} />
  );
};


const SettingsHeaderTitle = memo(props => (
  <LogoTitle title={'Settings'} icon={<SettingsGraySvg />} {...props} />
));
const SettingsTabBar = ({ focused, tabBarLabel }) => {
  const { theme } = useTheme();
  return (
    <TabBarIcon
      isFocused={focused}
      icon={theme?.nav?.settings}
      level={'Settings'}
    />
  );
};

const MyAccountHeaderTitle = memo(props => (
  <LogoTitle title={'Account'} icon={<AccountGraySvg />} {...props} />
));
const MyAccountTabBar = ({ focused, tabBarLabel }) => {
  const { theme } = useTheme();
  return (
    <TabBarIcon
      isFocused={focused}
      icon={theme?.nav?.account}
      level={'Account'}
    />
  );
};

function MyTabs() {
  const { dark, theme, unread } = useTheme();

  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: 'transparent',
      }}
      screenOptions={
        Platform.OS === 'ios'
          ? {
            ...GlobalStyle.navigationOptionIos,
            tabBarStyle: {
              ...GlobalStyle.navigationOptionIos.tabBarStyle,
              backgroundColor: theme?.nav?.bg,
              // borderColor: theme?.nav?.borderColor,
              // borderWidth: 0.01,
              // borderTopWidth: 4,
              borderTopEndRadius: 25,
              borderTopStartRadius: 25,
              borderStartColor: theme?.nav?.borderColor,
              borderEndColor: theme?.nav?.borderColor,
              borderTopWidth: 4,
              borderLeftWidth: 4,
              borderRightWidth: 4,
              borderTopColor: theme?.nav.borderColor,
              // borderBottomWidth: .01,
            },
            unmountOnBlur: true,
          }
          : {
            ...GlobalStyle.navigationOptionAndroid,
            tabBarStyle: {
              ...GlobalStyle.navigationOptionAndroid.tabBarStyle,
              backgroundColor: theme?.nav?.bg,
              borderColor: theme?.nav?.borderColor,
              borderWidth: 0.01,
              borderTopWidth: 4,
              // borderBottomWidth: .01,
            },
            unmountOnBlur: true,
          }
      }
      initialRouteName="Feed">
      <Tab.Screen
        name="tab_home" //Heading
        options={{
          headerTitle: HomeHeaderTitle,
          //props => <LogoTitle {...props}/>,
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          tabBarLabel: 'Home',
          tabBarIcon: HomeTabBarIcon,
        }}
        component={HomeTab}
      />
      <Tab.Screen
        name="tab_inbox"
        component={Inbox}
        options={{
          headerTitle: InboxHeaderTitle,
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarLabel: 'Inbox', //'Updates',
          tabBarBadge: unread,
          tabBarIcon: InboxTabBarIcon,
        }}
      />
      <Tab.Screen
        name="tab_settings"
        component={SettingsTab}
        options={{
          headerTitle: SettingsHeaderTitle,
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          tabBarLabel: 'Settings', //'Updates',
          tabBarIcon: SettingsTabBar,
        }}
      />
      <Tab.Screen
        name="tab_account"
        options={{
          headerTitle: MyAccountHeaderTitle,
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          tabBarLabel: 'Account', // 'Profile',
          tabBarIcon: MyAccountTabBar,
        }}
        component={AccountTab}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    // <NativeBaseProvider>
    <ThemeProvider>
      <StatusBar
        translucent
        animated={true}
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />

      <BackgroundProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: 'transparent',
              },
              animation: 'none', //'slide_from_right',
            }}>
            <Stack.Screen name="splash" component={SplashScreen} />
            <Stack.Screen name="sign_in" component={SignIn} />
            <Stack.Screen name="sign_up" component={SignUp} />
            {/* If want to move out side of home tab */}
            <Stack.Screen name="tab" component={MyTabs} />

            <Stack.Screen
              name="choose-agreement"
              screenOptions={{ headerShown: true }}
              component={ChooseAgreement}
            />
            <Stack.Screen
              name="choose_templates"
              screenOptions={{ headerShown: true }}
              component={ChooseTemplates}
            />
            <Stack.Screen
              name="create_nda_acceptance"
              screenOptions={{ headerShown: true }}
              component={CreateNdaAcceptance}
            />
            <Stack.Screen
              name="create_nda_receiver_info"
              screenOptions={{ headerShown: true }}
              component={CreateNdaReceiverInfo}
            />
            <Stack.Screen
              name="create_nda_receiver_info_old"
              screenOptions={{ headerShown: true }}
              component={CreateNdaReceiverInfoOld}
            />
            <Stack.Screen
              name="create_nda_party_list"
              screenOptions={{ headerShown: true }}
              component={CreateNdaPartyList}
            />
            <Stack.Screen
              name="create_nda_party_customize"
              screenOptions={{ headerShown: true }}
              component={CreateNdaPartyCustomize}
            />
            <Stack.Screen
              name="create_nda_signing"
              screenOptions={{ headerShown: true }}
              component={CreateNdaSigning}
            />
            <Stack.Screen
              name="create_nda_signing_success"
              screenOptions={{ headerShown: true }}
              component={CreateNdaSuccess}
            />
            <Stack.Screen
              name="nda_pdf_preview"
              screenOptions={{ headerShown: true }}
              component={NdaPdfPreView}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BackgroundProvider>
      {/* <Toast 
        // position="top"
        // topOffset={80}
        // config={toastConfig}
      // />*/}
    </ThemeProvider>
    // </NativeBaseProvider>
  );
}
