import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
class Token {
  constructor() {
    // Initialize the utility with any necessary configuration or state
    this.someValue = 42;
    this.tokenCache = null;
  }

  static storeToken = async token => {
    try {
      this.tokenCache = token;
      await AsyncStorage.setItem('TokenKey', token);
      console.log('Token saved successfully.');
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  //Token get
  static getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('TokenKey');
      if(this.tokenCache === null || this.tokenCache === undefined){
      if (token !== null) {
        // Token is retrieved successfully
        // console.log('Token retrieved:', token);
        this.tokenCache = token;
        return token;
      } else {
        // Token does not exist in storage
        console.log('Token does not exist in storage.');
        return null;
      }} else {
        return this.tokenCache;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  static clearToken = async () => {
    try {
     
      await AsyncStorage.removeItem('TokenKey');
      this.tokenCache = null;
      console.log('Token removed successfully.');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };
}

export default Token;
