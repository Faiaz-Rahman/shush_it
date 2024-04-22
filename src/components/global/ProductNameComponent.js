import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RatingSvg from '../../../assets/rating.svg';
import LocationSvg from '../../../assets/location.svg';

export default function ProductNameComponent({onPress, data}) {
  return (
    <View style={styles.productNameContent}>
      <View style={styles.storeContainer}>
        <View style={styles.storeTextVerticalContainer}>
          <Text style={styles.title}>Laptop - Hp Pavilion 1260</Text>
          <View style={styles.locationContainer}>
            <LocationSvg style={styles.storeRatingImage} />
            <Text style={styles.location}>Near Niketon</Text>
          </View>
        </View>
        <View style={styles.storeRatingContainer}>
          <Text>4.0</Text>
          <RatingSvg style={styles.storeRatingImage} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: 150,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    // remove width and height to override fixed static size
    width: 140,
    height: 50,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    paddingLeft: 20, // add left padding here
    paddingBottom: 10,
  },
  search: {
    marginLeft: -10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CE0078',
    borderColor: '#d4d4d4',
  },
  containerInput: {
    flexDirection: 'row',
  },
  input: {
    marginLeft: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#d4d4d4',
    height: 40,
  },
});
