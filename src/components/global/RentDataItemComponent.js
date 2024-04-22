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
  VStack,
} from 'native-base';

export default function RentDataItemComponent({onPress, data}) {
  return (
    <Box>
      <Box
        rounded="lg"
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
          <HStack space={2}>
            <Heading size="xs" ml="-1" color={'black.700'}>
              1
            </Heading>
            <VStack space={2}>
              <Heading size="xs" ml="0" color={'gray.700'}>
                #6622
              </Heading>
              <Heading size="xs" ml="0" color={'gray.700'}>
                Jhon Doe
              </Heading>
              <Text fontWeight="400" color={'gray.600'}>
                01 Oct 2023 12:50 am - 02 Oct 2023 12:50 AM
              </Text>
              <Badge
                alignSelf={'flex-start'}
                colorScheme="yellow"
                _text={{
                  color: 'white',
                }}
                variant="solid"
                rounded="4">
                Pending
              </Badge>
              <Heading size="xs" ml="0" color="black">
                $156
              </Heading>
            </VStack>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
}
