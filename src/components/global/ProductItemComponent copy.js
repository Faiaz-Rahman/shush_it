import React from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';
import {Text, Box, VStack, HStack, Image, Avatar, Stack} from 'native-base';
import RatingSvg from '../../../assets/rating.svg';
import LocationSvg from '../../../assets/location.svg';
import ForwordSvg from '../../../assets/forword_icon_.svg';
import LoveSvg from '../../../assets/love_icon.svg';
const {width, height} = Dimensions.get('window');

export default function ProductItem({onPress, data}) {
  return (
    <Box
      key={data.id}
      w={width / 2 - 8}
      maxW={width / 2 - 8}
      m="0.5"
      p="1"
      pb="2"
      overflow="hidden"
      rounded="xl"
      borderWidth="1"
      borderColor="coolGray.200"
      _dark={{
        borderColor: 'coolGray.600',
        backgroundColor: 'gray.700',
      }}
      _light={{
        backgroundColor: 'gray.50',
      }}>
      <TouchableOpacity onPress={onPress}>
        <VStack m="1">
          <HStack w="100%">
            <HStack w="80%" justifyContent={'flex-start'}>
              <Box alignSelf={'center'}>
                <Avatar
                  bg="gray.500"
                  size={'sm'}
                  source={require('../../../assets/demo_store_image.png')}
                />
              </Box>
              <VStack ml="0" pr="6">
                <HStack ml="1" pr="1">
                  <Text overflow="hidden" fontSize="sm" noOfLines={1}>
                    {data.author}
                  </Text>
                </HStack>
                <HStack>
                  <LocationSvg alignSelf="center" />
                  <Text overflow="hidden" ml="1" fontSize="xs" noOfLines={1}>
                    Near Niketon
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <HStack w="20%" pl="1" justifyContent={'flex-start'}>
              <HStack alignSelf={'flex-start'}>
                <Box justifyContent={'center'}>
                  <Text>4.0</Text>
                </Box>
                <Box justifyContent={'center'}>
                  <RatingSvg />
                </Box>
              </HStack>
            </HStack>
          </HStack>

          <Image
            source={{
              uri: data.download_url,
            }}
            alt="ProductImage"
            size="xl"
            w="100%"
            mt="2"
            resizeMode="cover"
          />

          <HStack w="100%" ml="0" mr="0" justifyContent={'space-around'}>
            <VStack w="80%">
              <Stack mr="0">
                <Text overflow="hidden" noOfLines={1}>
                  {data.author}
                </Text>
              </Stack>
              <HStack>
                <Text fontSize="xs" color={'gray.600'}>
                  BDT 500/day
                </Text>
              </HStack>
              <HStack pt="1">
                <LoveSvg />
                <Box pl="1">
                  <ForwordSvg />
                </Box>
              </HStack>
            </VStack>

            <HStack pr="1" w="10%" justifyContent={'flex-end'}>
              <HStack alignSelf={'flex-start'}>
                <Box justifyContent={'center'}>
                  <Text>4.0</Text>
                </Box>
                <Box justifyContent={'center'}>
                  <RatingSvg />
                </Box>
              </HStack>
            </HStack>
          </HStack>
        </VStack>
      </TouchableOpacity>
    </Box>
  );
}
