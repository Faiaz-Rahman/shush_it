import { React, useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
//import {MaterialCommunityIcons} from '@expo/vector-icons';
import { StackActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BasicHeader from '../components/global/BasicHeaderComponent.js';

export default function MyAccount() {
  const navi = useNavigation();

  const more = [
    // {id: 1, title: 'Settings'},
    { id: 2, title: 'Logout' },
  ];

  const handlePress = () => {
    navi.goBack();
    console.log('Button pressed!');
  };

  const clearToken = async () => {
    try {
      await AsyncStorage.removeItem('TokenKey');
      console.log('Token removed successfully.');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  return (
    <View>
      {/* <BasicHeader
        title="Settings"
        isBackBtnDisable={true}
        onPress={handlePress}
      /> */}

      <ScrollView // Category List
        horizontal={false}
        style={styles.categoryListContainer}
        showsHorizontalScrollIndicator={true}>
        <View>
          <TouchableOpacity
            onPress={() => {
              console.log('My Profile Pressed');
              navi.navigate('my_profile');
            }}>
            <Text style={styles.item}>Profile</Text>
            <View style={styles.line} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              console.log('My created event pressed');
              navi.navigate('my_created_event');
            }}>
            <Text style={styles.item}>My created events</Text>
            <View style={styles.line} />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              console.log('Joined events Pressed');
              navi.navigate('my_joined_event');
            }}>
            <Text style={styles.item}>My joined events</Text>
            <View style={styles.line} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>More</Text>
        <View style={styles.line} />
        <ScrollView // Category List
          horizontal={false}
          style={styles.categoryListContainer}
          showsHorizontalScrollIndicator={true}>
          {more.map(item => (
            <View key={item.id}>
              <TouchableOpacity
                onPress={() => {
                  if (item.title === 'Logout') {
                    navi.dispatch(StackActions.replace('sign_in'));
                    clearToken();
                  }
                }}>
                <Text style={styles.item}>{item.title}</Text>
                <View style={styles.line} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginStart: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  item: {
    marginStart: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  line: {
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    paddingLeft: 20, // add left padding here
  },
});
