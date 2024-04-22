import { Box, Center, NativeBaseProvider } from 'native-base';
import { React, useState } from 'react';
import { Dimensions, Pressable, StatusBar, Text } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';

//Component
import DocDetailsHistory from './DocDetailsHistory.js';
import DocDetailsSignerStatus from './DocDetailsSignerStatus.js';

const initialLayout = {
  width: Dimensions.get('window').width,
};
// const renderScene = SceneMap({
//   first: DocDetailsSignerStatus,
//   second: DocDetailsHistory,
// });

function Example({ navigation, data }) {

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      index: 1,
      key: 'first',
      title: 'Signer Status',
    },
    {
      index: 2,
      key: 'second',
      title: 'History',
    },
  ]);

  const renderScene = SceneMap({
    // first: DocDetailsSignerStatus,
    // second: DocDetailsHistory,
    first: () => <DocDetailsSignerStatus data={data} />,
    second: () => <DocDetailsHistory data={data} />,
  });

  const renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <Box flexDirection="row" w="100%">
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(inputIndex =>
              inputIndex === i ? 1 : 0.5,
            ),
          });

          const borderBottomWidth = index === i ? 5 : 0; //'#e5e5e5';
          const color = index === i ? '#3D50DF' : '#a1a1aa'; //'#e5e5e5' , #EBEBEB;
          const borderColor = index === i ? '#EBEBEB' : '#EBEBEB'; //'coolGray.200';

          return (
            <Box
              key={route.title + i}
              borderBottomWidth="1"
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              cursor="pointer">
              <Pressable
                onPress={() => {
                  console.log(i);
                  setIndex(i);
                }}>
                <Text
                  style={{
                    color,
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderColor: color,
                    borderBottomWidth,
                  }}>
                  {route.title}
                </Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={{
        marginTop: StatusBar.currentHeight,
      }}
    />
  );
}

export default function DocumentDetailsTab({ data }) {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Example data={data} />
      </Center>
    </NativeBaseProvider>
  );
}
