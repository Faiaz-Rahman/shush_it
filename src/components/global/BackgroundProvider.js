import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import LottieView from 'lottie-react-native'
import { useTheme } from '../../../styles/ThemeProvider'

import Video from 'react-native-video'
import FastImage from 'react-native-fast-image'
import { DIM } from '../../../styles/Dimensions'

import { useNetInfo } from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message'

import toastConfig from './NotificationConfig'

// const height = Dimensions.get('window').height
// const width = Dimensions.get('window').width

export default function BackgroundProvider({ children }) {
  const { type, isConnected } = useNetInfo()
  const [noWifi,setNoWifi]=useState(false)

  // useEffect(()=>{
  //   console.log('Typeof connection =======> ',type)
  //   console.log('====> BackgroundProvider useEffect() is being called <====')
  //   Toast.show({
  //     text1:`${isConnected}`,
  //     text2:'online',
  //     type:'warning',
  //   })
  // },[isConnected])

  useEffect(()=>{
    console.log('======> Inside useEffect() logic <======')
    if(!isConnected){
      setNoWifi(true)
      Toast.show({
        text1:'You\'re offline now!',
        text2:'offline',
        type:'warning',
      })
    }
  },[isConnected])

  useEffect(()=>{
    if(noWifi && isConnected){
      setNoWifi(false)
      Toast.show({
        text1:'You\'re online again ...',
        text2:'online',
        type:'warning',
      })
    }
  },[noWifi,isConnected])

  const { theme, setScheme, bg } = useTheme()
  console.log(bg)

  return (
    <View style={styles.bgProvider}>
      {bg.type === 'lottie' ? (
        <LottieView
          source={bg.file}
          autoPlay
          loop
          style={styles.bg}
          resizeMode="cover"
        />
      ) : bg.type === 'video' ?
        <Video
          source={bg.file}
          style={styles.backgroundVideo}
          muted
          repeat
          resizeMode="cover"
        /> : (
          <FastImage
            source={bg.file}
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            resizeMode="cover"
          />
        )}
      {children}
      <Toast
        position="top"
        topOffset={80}
        config={toastConfig}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  bgProvider: {
    flex: 1,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: DIM.width,
    height: '100%' //DIM.height,
  }
})
