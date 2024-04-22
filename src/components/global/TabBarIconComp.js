import {React} from 'react';
import {View, Text, StyleSheet} from 'react-native';
//import styles from '../../../styles/MainStyle.js';
//{backgroundColor: isFocused ? '#dcdcdc' : null}
const TabBarIcon = ({isFocused, icon, level}) => (
  <View style={([styles.tab], {opacity: isFocused ? 100 : 0.5})}>
    <View style={styles.icon}>{icon}</View>
    <Text style={styles.level}>{level}</Text>
  </View>
);
export default TabBarIcon;
const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 0,
    borderRadius: 0,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  level: {
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
  },
});
