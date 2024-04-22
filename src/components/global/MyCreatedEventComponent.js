import React from 'react';
import {
  Button,
  Stack,
  HStack,
  Box,
  Text,
  Badge,
  Center,
  Heading,
} from 'native-base';
import {Image} from 'react-native';
import DeleteSvg from '../../../assets/delete_icon.svg';
import EditSvg from '../../../assets/edit_icon.svg';
import GlobalStyle from '../../../styles/MainStyle.js';
import Url from '../../Api.js';

export default function MyCreatedEventComponent({
  onPressDelete,
  onPressEdit,
  data,
}) {
  const handleDeletePress = () => {
    // Pass the parameter to the callback function
    onPressDelete(data.id);
  };
  return (
    <Box>
      <Box
        rounded="3xl"
        mb={0}
        overflow="hidden"
        borderColor="coolGray.200"
        _dark={{
          borderColor: 'coolGray.600',
          backgroundColor: 'gray.700',
        }}
        _web={{
          shadow: 4,
          borderWidth: 1,
        }}
        _light={{
          backgroundColor: 'gray.50',
        }}>
        <Stack p="4" space={3}>
          <Stack space={2}>
            <HStack space={2} justifyContent={'space-between'}>
              <Heading size="xs" ml="-1" color={'gray.700'}>
                Event: {data.name}
              </Heading>
              <Badge
                colorScheme="blue"
                _text={{
                  color: 'white',
                }}
                variant="solid"
                rounded="4">
                Published
              </Badge>
            </HStack>

            <Heading size="xs" ml="-1" color={'gray.700'}>
              Organizer: {data.organiser}
            </Heading>
          </Stack>
          {data.banner_image && (
            <Image
              source={{
                uri: data.banner_image && Url.IMAGE_URL + data.banner_image,
              }}
              fallbackSource={{
                uri: 'https://www.w3schools.com/css/img_lights.jpg',
              }}
              aspectRatio={1.5 / 1}
              alt=""
              size="2xl"
              resizeMode="cover"
            />
          )}
          <HStack>
            <Text color={'gray.600'}>
              Departure: {data.departure_street_address}
            </Text>
          </HStack>
          <Text fontWeight="400" color={'gray.600'}>
            Arrival: {data.arival_street_address}
          </Text>
          <Text>Activity: {data.activities}</Text>
          <Text fontWeight="400" color={'gray.600'}>
            User join: {data.user_join_count}
          </Text>
          <Text>Cost: {data.unit_price}</Text>
          <HStack>
            <Box alignItems="flex-start">
              <Button
                mt="2"
                mb="2"
                pt="1"
                pb="1"
                variant="outline"
                borderRadius={'3xl'}
                borderColor={GlobalStyle.colorAccent} //"pink.500"
                colorScheme="blue"
                endIcon={<EditSvg color="#CE0078" />}
                onPress={onPressEdit}>
                Edit
              </Button>
            </Box>
            <Box alignItems="flex-start">
              <Button
                mt="2"
                ml="2"
                mb="2"
                pt="1"
                pb="1"
                variant="outline"
                borderRadius={'3xl'}
                borderColor="#2463eb" //"pink.500"
                colorScheme="blue"
                endIcon={<DeleteSvg color="#CE0078" />}
                onPress={handleDeletePress}>
                Delete
              </Button>
            </Box>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
}

// const styles = StyleSheet.create({
// });
