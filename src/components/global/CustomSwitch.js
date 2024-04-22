import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Animated,
  Easing,
} from 'react-native'

import { DIM } from '../../../styles/Dimensions'
import { Colors } from '../../../styles/Color'
import LinearGradient from 'react-native-linear-gradient'
import { useTheme } from '../../../styles/ThemeProvider'

// UIManager.setLayoutAnimationEnabledExperimental &&
//   UIManager.setLayoutAnimationEnabledExperimental(true)

export default function CustomSwitch(props) {
  const { value, onValueChange, refVal = null, disable } = props

  const switch_anim = useRef(new Animated.Value(value ? 1 : 0)).current

  const { theme, bg } = useTheme()

  useEffect(() => {
    console.log('updating the value of a switch ==>', value)
    // console.log('toggleSw =>', props?.toggleSW)
  }, [value])

  const slide = () => {
    const toValue = value ? 0 : 1
    // const toValueRef = refVal !== null ? refVal ? 0 : 1 : null
    // if (refVal) {
    //   toValue = refVal ? 0 : 1
    // } else {
    //   toValue = value ? 1 : 0
    // }

    Animated.timing(switch_anim, {
      toValue, // refVal === null ? toValue :toValueRef,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start()

    onValueChange()
  }

  const transitionValue = switch_anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  })

  return (
    <TouchableHighlight
      style={[styles.switchC]}
      underlayColor={Colors.color.switchTrackColor}
      onPress={() => {
        slide()
      }}>
      {disable ?
        <View style={styles.thumbOuterCircle}>
          <LinearGradient
            colors={theme?.colors?.borderColors}
            style={styles.thumbOuterCircle}>
            <View style={styles.thumbInnerCircle}></View>
          </LinearGradient>
        </View>
        :
        <Animated.View
          style={[
            styles.thumbOuterCircle,
            { transform: [{ translateX: transitionValue }] },
          ]}>
          <LinearGradient
            colors={theme?.colors?.borderColors}
            style={styles.thumbOuterCircle}>
            <View style={styles.thumbInnerCircle}></View>
          </LinearGradient>
        </Animated.View>}
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  switchC: {
    flexDirection: 'row',
    width: 55,
    height: 30,
    borderRadius: 55 * 0.5,
    backgroundColor: Colors.color.switchTrackColor,
    borderColor: '#000',
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  thumbOuterCircle: {
    height: 30,
    width: 30,
    borderRadius: 30 * 0.5,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -1,
    // left:DIM.width * 0.13 - DIM.height * 0.04
  },
  thumbInnerCircle: {
    height: 26,
    width: 26,
    borderRadius: 20,
    backgroundColor: '#000',
  },
})
