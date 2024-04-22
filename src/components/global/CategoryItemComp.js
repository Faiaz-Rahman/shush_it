import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {Box, VStack, Text, Center, AspectRatio, View} from 'native-base';
import Url from '../../Api';

// <View key={data.id} style={styles.card}>
// </View>

export default function CategoryItem({onPress, data}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Box
          key={data.id}
          w="100"
          h="100"
          shadow="0"
          rounded="3xl"
          overflow="hidden"
          pt="0"
          pb="0"
          pl="0"
          pr="0"
          mr="0"
          _web={{
            shadow: 0,
            borderWidth: 0,
          }}
          _dark={{
            borderColor: 'coolGray.600',
            backgroundColor: 'gray.700',
          }}
          _light={{
            borderColor: 'coolGray.300',
            backgroundColor: 'gray.50',
          }}>
          <VStack>
            <Image
              source={{
                uri: Url.IMAGE_URL + data.image,
              }}
              style={{width: 100,  height: 100}}
            />
          </VStack>
        </Box>
        <Center>
          <Text noOfLines={1}>{data.name}</Text>
        </Center>
      </View>
    </TouchableOpacity>
  );
}
