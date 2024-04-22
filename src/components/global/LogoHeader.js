import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { DIM } from '../../../styles/Dimensions'

import { useTheme } from '../../../styles/ThemeProvider.js';
import { Image } from 'react-native'
import FastImage from 'react-native-fast-image'

export default function LogoHeader({ extraStyles }) {
    const { theme } = useTheme()

    const goldLogoWebp = require('../../../assets/gold/ShushGoldLogo.webp')
    const roseGoldLogoWebp = require('../../../assets/roseGold/ShushRoseGoldLogo.webp')
    const silverLogoWebp = require('../../../assets/honey/ShushSilverLogo.webp')

    // const returnLogo = () => {
    //     if (theme.name === 'Gold') {
    //         return <ShushGoldLogo />;
    //     } else if (theme.name === 'RoseGold') {
    //         return <ShushRoseGoldLogo />;
    //     } else {
    //         return <ShushSilverLogo />;
    //     }
    // }

    const returnLogoPng = () => {
        if (theme.name === 'Gold') {
            return (
                <FastImage
                    source={goldLogoWebp}
                    resizeMode='contain'
                    style={{
                        // backgroundColor: 'red'
                        height: 82,
                        width: 240,
                    }}
                />
            )
        } else if (theme.name === 'RoseGold') {
            return (
                <FastImage
                    source={roseGoldLogoWebp}
                    resizeMode='contain'
                    style={{
                        // backgroundColor: 'red'
                        height: 82,
                        width: 240,
                    }}
                />
            )
        } else {
            return (
                <FastImage
                    source={silverLogoWebp}
                    resizeMode='contain'
                    style={{
                        // backgroundColor: 'red'
                        height: 82,
                        width: 240,
                    }}
                />
            )
        }
    }

    return (
        <View style={[styles.logoHeader, extraStyles]}>
            {/* {returnLogo()} */}
            {returnLogoPng()}
        </View>
    )
}

const styles = StyleSheet.create({
    logoHeader: {
        height: DIM.height * .15,
        width: DIM.width,
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: DIM.height * .18,
        // paddingRight: DIM.width * .1,
    }
})