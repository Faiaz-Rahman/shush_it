import { React } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';

//Style
import globalStyle from '../../../styles/MainStyle.js';
import Delete from '../../../assets/delete.svg';
import { DIM } from '../../../styles/Dimensions.js';

import ShushRoseGoldLogo from '../../../assets/roseGold/ShushRoseGoldLogo.svg'
import ShushGoldLogo from '../../../assets/gold/ShushGoldLogo.svg'
import ShushSilverLogo from '../../../assets/honey/ShushSilverLogo.svg'
import { useTheme } from '../../../styles/ThemeProvider.js';

//import { SearchSource } from 'jest';

export default function HomeHeaderComponent({
  title,
  icon,
  onPress,
  isRightIcon = null,
  btnLoad = false,
  color = '#2e476e',
  statusBarColor = "white",
  dark = false,
  rightIcon = null,
  extraStyles,
}) {
  const { theme } = useTheme()

  const returnLogo = () => {
    if (theme.name === 'Gold') {
      return <ShushGoldLogo />;
    } else if (theme.name === 'RoseGold') {
      return <ShushRoseGoldLogo />;
    } else {
      return <ShushSilverLogo />;
    }
  }

  return (
    <View style={[
      { width: DIM.width },
      // backgroundColor: 'green',
      extraStyles]
    }>
      {/* <StatusBar
        translucent
        animated={true}
        backgroundColor={statusBarColor}
        barStyle={dark ? 'dark-content' : 'light-content'}
      //showHideTransition={'fade'}
      /> */}
      < View style={styles.toolBar} >
        {/* <View style={styles.icon}>{icon}</View> */}
        < View style={styles.titleContainer} >
          {/* <Text style={{ ...styles.title, color: color }}>{title}</Text> */}
          {returnLogo()}
        </View >

        {/* {isRightIcon &&
          <>
            {
              isRightIcon && btnLoad ?
                <ActivityIndicator
                  color={'red'}
                  style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 25 }}
                />
                :
                <TouchableOpacity
                  onPress={onPress}
                  style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 25 }}
                >
                  {!dark ?
                    rightIcon
                    :
                    <View style={styles.iconDiv}>
                      <Delete style={styles.icon2} />
                    </View>
                  }
                </TouchableOpacity>
            }
          </>
        } */}

      </View >
    </View >
  );
}

var styles = StyleSheet.create({
  circleOutside: {
    alignSelf: 'center',
    borderColor: 'gray',
    borderRadius: 50,
    height: 25,
    width: 25,
    padding: 1.5,
  },
  circleInside: {
    height: 20,
    width: 20,
    borderRadius: 50,
    backgroundColor: 'red',
  },

  iconDiv: {
    backgroundColor: '#FD371F',
    height: 30,
    width: 30,
    borderRadius: 50,
  },
  icon2: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  toolBar: {
    // height: 50,
    // backgroundColor: globalStyle.toolBarColor,
    // backgroundColor: 'red',
    paddingTop: DIM.height * .15,
    width: DIM.width,
    height: DIM.height * .15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingLeft: 25,
    opacity: 0.95,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    justifyContent: 'center',
    // color: '#2e476e',
    // paddingLeft: 30,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  titleContainer: {
    fontSize: 24,
    justifyContent: 'center',
    // color: '#2e476e',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignContent: 'center',
    opacity: 50,
  },
});
