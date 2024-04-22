import React from 'react';
import {Image, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Box, VStack, Button, HStack, Avatar, Stack, Center} from 'native-base';
import RatingSvg from '../../../assets/rating.svg';
import LocationSvg from '../../../assets/location.svg';
//Component
import Url from '../../Api.js';

export default function ProductItem({onPress, onJoin, data, userId}) {
  const handleJoinPress = () => {
    // Pass the parameter to the callback function
    onJoin(data.id);
  };
  return (
    <Box
      key={data.id}
      m="0.5"
      p="0"
      pb="1"
      overflow="hidden"
      rounded="3xl"
      borderColor="coolGray.100"
      _dark={{
        borderColor: 'coolGray.600',
        backgroundColor: 'gray.700',
      }}
      _light={{
        backgroundColor: 'gray.50',
      }}>
      <TouchableOpacity onPress={onPress}>
        <VStack>
          {data.banner_image && (
            <Center>
              <Image
                source={{
                  uri: data.banner_image
                    ? Url.IMAGE_URL + data.banner_image
                    : null,
                }}
                fallbackSource={{
                  uri: 'https://www.w3schools.com/css/img_lights.jpg',
                }}
                style={{
                  flex: 1, // Take up all available space vertically
                  width: '100%',
                }}
                aspectRatio={2 / 1}
                alt=""
                size="2xl"
                resizeMode="cover"
              />
            </Center>
          )}

          {/* User  */}
          <HStack px="4" m="2" justifyContent={'space-between'}>
            <HStack justifyContent={'flex-start'}>
              <Box alignSelf={'center'}>
                {/* <Avatar
                  bg="gray.500"
                  size={'sm'}
                  source={require('../../../assets/demo_store_image.png')}
                /> */}
              </Box>
              <VStack ml="0" pr="6">
                <HStack ml="1" pr="1">
                  <Text style={styles.title}>Event: {data.name}</Text>
                </HStack>
                <HStack>
                  <LocationSvg alignSelf="center" />
                  <Text overflow="hidden" ml="1" fontSize="xs" noOfLines={1}>
                    Departure: {data.departure_street_address}
                  </Text>
                </HStack>
                <HStack>
                  <LocationSvg alignSelf="center" />
                  <Text overflow="hidden" ml="1" fontSize="xs" noOfLines={1}>
                    Arrival: {data.arival_street_address}
                  </Text>
                </HStack>
                <VStack>
                  <Text>Start time: {data.start_time}</Text>
                  <Text>End time: {data.end_time}</Text>
                </VStack>
                <Text>Transport: {data.mode_of_trans}</Text>
                <Text>Activity: {data.activities}</Text>
              </VStack>
            </HStack>
            <HStack pl="2" justifyContent={'flex-end'}>
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

          {/* Post Details */}
          <HStack px="4" m="2" justifyContent={'space-between'}>
            <VStack>
              <Stack>
                <Text overflow="hidden" noOfLines={1}>
                  Organized by {data.organiser}
                </Text>
              </Stack>
              <HStack>
                <Text fontSize="xs" color={'gray.600'}>
                  Cost: {data.unit_price}
                </Text>
                <Text fontSize="xs" color={'gray.600'}>
                  {' '}
                  User Join: {data.user_join_count}
                </Text>
              </HStack>
              {/* <HStack pt="1">
                <LoveSvg />
                <Box pl="10">
                  <ForwordSvg />
                </Box>
              </HStack> */}
            </VStack>

            <HStack>
              <HStack>
                <Box>
                  <Button
                    mt="1"
                    px="10"
                    py="2"
                    colorScheme="blue"
                    borderRadius={'3xl'}
                    onPress={handleJoinPress}>
                    {data.current_user_join !== null &&
                    data.current_user_join.user_id + '' === userId
                      ? 'Joined'
                      : 'Join'}
                  </Button>
                </Box>
              </HStack>
            </HStack>
          </HStack>
        </VStack>
      </TouchableOpacity>
    </Box>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // You can set the background color as needed
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200, // Set the width of your image
    height: 200, // Set the height of your image
  },
});
