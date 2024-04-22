import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {Box, VStack, Text, Center, AspectRatio, View} from 'native-base';
import Url from '../../Api';

// <View key={data.id} style={styles.card}>
// </View>

export default function CategoryItem({onPress, data}) {
  const handleJoinPress = () => {
    // Pass the parameter to the callback function
    onPress(data);
  };
  return (
    <TouchableOpacity onPress={handleJoinPress}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 30,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
        }}>
        <Image
          source={{
            uri: Url.IMAGE_URL + data.image,
          }}
        />
        <Text noOfLines={2}>{data.name}</Text>
      </View>
    </TouchableOpacity>
  );
}
