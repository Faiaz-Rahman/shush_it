import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
//Component
//import CustomButton from '../components/global/ButtonComponent.js';
import Draggable from '../components/global/DragableComponent.js';
import DocumentListHeader from '../components/global/DocumentListHeaderComponent.js';
// Styles
import globalStyle from '../../styles/MainStyle.js';

export default function DraggableScreen({navigation}) {
  const navi = useNavigation();
  const handlePress = () => {
    navi.goBack();
    console.log('Button pressed!');
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <DocumentListHeader onPress={handlePress} title={'Pricing'} />
      <View style={styles.dropZone}>
        <Text style={styles.text}>Drop them here!</Text>
      </View>
      <View style={styles.ballContainer} />
      <View style={styles.row}>
        <Draggable />
        <Draggable />
        <Draggable />
        <Draggable />
        <Draggable />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: globalStyle.topPadding,
    backgroundColor: globalStyle.statusBarColor,
  },
  ballContainer: {
    height: 200,
  },
  row: {
    flexDirection: 'row',
  },
  dropZone: {
    height: 200,
    backgroundColor: '#00334d',
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
