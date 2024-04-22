import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Box} from 'native-base';
import ProductItem from './EventItemPostComponent.js';

export default function ProductList({data}) {
  const renderItem = ({item}) => (
    <Box shadow={2}>
      <ProductItem data={item} />
    </Box>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.item}
      numColumns={2}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 0,
    margin: 0,
    flex: 1,
  },
});
