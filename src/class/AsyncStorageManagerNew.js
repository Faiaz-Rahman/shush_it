import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../Constants';

class AsyncStorageManager {
  constructor() {
    this.queue = Promise.resolve(); // Initialize the queue with an immediately resolved promise
  }

  // Enqueue operation
  enqueue(operation) {
    // Chain the new operation onto the queue, ensuring it starts only after the previous operation completes
    this.queue = this.queue.then(() => operation());
    return this.queue; // Return the updated queue to allow for chaining or await
  }

  static async storeData(key, value) {
    const operation = async () => {
      try {
        const stringValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
        console.log(`${key} saved successfully to async storage`);
      } catch (error) {
        console.error(`Error saving value for ${key}, Error:==>`, error);
        throw error;
      }
    };
    return this.prototype.enqueue(operation);
  }

  static async getData(key) {
    const operation = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error(`Error retrieving value for ${key}:`, error);
        throw error;
      }
    };
    return this.prototype.enqueue(operation);
  }

  static async removeItemValue(key) {
    const operation = async () => {
      try {
        await AsyncStorage.removeItem(key);
        console.log(`${key} removed successfully`);
      } catch (error) {
        console.error(`Error removing ${key}:`, error);
        throw error;
      }
    };
    return this.prototype.enqueue(operation);
  }

  static async removeAllItemValue() {
    const operation = async () => {
      try {
        const keys = [
          CONSTANTS.PROFILE_STATUS,
          CONSTANTS.USER_EMAIL,
          CONSTANTS.SIGN_IN_METHOD,
          CONSTANTS.SETTING,
          CONSTANTS.DATE_FORMAT,
          CONSTANTS.TIME_FORMAT,
          CONSTANTS.CURRENT_THEME_NAME,
          CONSTANTS.CURRENT_THEME,
        ];
        await AsyncStorage.multiRemove(keys);
        console.log('All specified keys removed successfully');
      } catch (error) {
        console.error('Error removing multiple keys:', error);
        throw error;
      }
    };
    return this.prototype.enqueue(operation);
  }
}

export default AsyncStorageManager;