import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import Video from 'react-native-video'
import FastImage from 'react-native-fast-image';

import Light from '../../assets/light.svg';
//Rose gold

// Gold
//Elegant

//Video Preview
import PinkFlareRoseGold from '../../assets/ui/preview_pink_flare_rose_gold.mp4'
import GoldFlareRoseGold from '../../assets/ui/preview_gold_flare_gold.mp4'
import BlueFlareRoseGold from '../../assets/ui/preview_blue_flare_elegent.mp4'

import globalStyle from '../../styles/MainStyle.js';
import { useTheme } from '../../styles/ThemeProvider';
import Url from '../Api.js';
import Token from '../class/TokenManager';
import DocumentListHeader from '../components/global/DocumentListHeaderComponent';
import CONSTANTS from '../Constants';

export default function ThemeComponent() {

    const { theme, setScheme, bg, setBg } = useTheme();
    const navi = useNavigation();
    const insets = useSafeAreaInsets();

    const [active, setActive] = useState(null);
    const [isAuto, setIsAuto] = useState(false);
    const [sendReminder, setSendReminder] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [themeChanging, setThemeChanging] = useState(false);
    const [dateFormat, setDateFormat] = useState(null);
    const [timeFormat, setTimeFormat] = useState(null);
    const [token, setToken] = useState('');

    const uiList = [
        { name: 'Light', id: '1' },
        { name: 'HoneyComb chrome', id: '2' },

        { name: 'Pink Flare', id: CONSTANTS.UI.PINK_FLARE },
        { name: 'Blue Flare', id: CONSTANTS.UI.BLUE_FLARE },
        { name: 'Gold Flare', id: CONSTANTS.UI.GOLD_FLARE },

        { name: 'Gold Flower', id: CONSTANTS.UI.GOLD_FLOWER },
        { name: 'Gold Pearl', id: CONSTANTS.UI.GOLD_PEARL },
        { name: 'Gold Water Drop', id: CONSTANTS.UI.GOLD_WATER_DROP },

        { name: 'Default ', id: CONSTANTS.UI.DEFAULT},
    ];

    // Need to replace From CONSTANT file

    console.log("theme ===>", theme?.name);


    useEffect(() => {

        let currentUi = theme?.ui

        uiList.forEach((item, index) => {
            console.log('For each item id: ' + item.id + " i:" + index)
            if (currentUi === item.id) {
                setActive(index)
            }
        });

        const asyncFunc = async () => {
            let userToken = await Token.getToken();
            if (userToken) {
                setToken(userToken);
                setIsLoading(false);
                // getSettings(userToken); // Hidden for theme check
            } else {
                console.log('Token not found');
                return false;
            }
        };

        asyncFunc();
    }, []);


    const saveSettings = (
        current_theme = active
    ) => {
        // setBtnLoad(true);
        const payload = {
            current_theme: uiList[current_theme].id //current_theme == 0 ? 'Light' : current_theme == 1 ? 'Silver' : current_theme == 2 ? 'RoseGold' : current_theme == 3 ? 'Gold' : current_theme == 4 ? 'Elegant' : 'Silver',
        };

        try {
            var stateApi = Url.SAVE_SETTING;
            fetch(stateApi, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Bearer ${token} notice the Bearer before your token
                },
                body: JSON.stringify(payload),
            })
                .then(response => response.json())
                .then(responseJson => {
                    try {
                        var a = JSON.stringify(responseJson);
                        var json = JSON.parse(a);
                        if (responseJson.status === 200) {

                            setScheme(uiList[current_theme].id);
                            setThemeChanging(false);
                            console.log('Status==> ok');
                        } else {
                            console.log('Error==>', JSON.stringify(json));
                            // setBtnLoad(false);
                        }
                    } catch (error) {
                        console.error(error);
                        console.log(error);
                        // setBtnLoad(false)
                    }
                })
                .catch(error => {
                    console.error(error);
                    // setBtnLoad(false)
                });
        } catch (error) {
            console.error(error);
            console.log(error);
            // setBtnLoad(false)
        }
    };

    const handlePress = () => {
        navi.goBack();
    };


    return (
        // <ImageBackground
        //     source={bg?.type == 'image' ? bg?.file : bg?.transparentImg}
        //     // source={theme?.bg?.bgImg}
        //     resizeMode="cover"
        //     style={styles.bgImage}
        // >
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            {/* {bg?.type == 'lottie' && <LottieBackground file={bg.file} />} */}

            <SafeAreaView
                style={styles.container}
            >

                {/* <DocumentListHeader
                    title={'Select Theme'}
                    onPress={handlePress}

                    backIcon={theme?.header?.backIcon}
                    statusBarColor={theme?.colors?.statusBarColor}
                    dark={theme?.name === 'Light'}
                    color={theme?.colors?.text}
                /> */}

                {isLoading ? (
                    <ActivityIndicator
                        color={theme?.name != 'Light' ? theme?.colors?.text : globalStyle.colorAccent}
                        style={{
                            marginTop: 'auto',
                            marginBottom: 'auto',
                            height: 540,
                        }}
                    />
                ) : (
                    // <View style={styles.content}>
                    <SafeAreaView
                        style={[
                            {
                                // paddingTop: insets.top,
                                paddingBottom: insets.bottom,
                            },
                        ]}
                    >
                        <ScrollView
                            horizontal={false}
                            contentContainerStyle={styles.content}
                            showsHorizontalScrollIndicator={true}
                        >
                            <View style={{ marginBottom: 30 }}>
                                <TouchableOpacity
                                    style={{ marginStart: 25 }}
                                    // style={{ position: 'absolute', left: 25, zIndex: 100 }}
                                    onPress={handlePress}
                                >
                                    {theme?.header?.backIcon}
                                </TouchableOpacity>
                                {/* <Text style={{ ...styles.title, color: theme?.colors?.text }}>Select Theme</Text> */}
                            </View>

                            <View style={{ paddingBottom: 80 }}>
                                {themeChanging ?
                                    <ActivityIndicator
                                        color={theme?.name != 'Light' ? theme?.colors?.text : globalStyle.colorAccent}
                                        style={{
                                            marginTop: 'auto',
                                            marginBottom: 'auto',
                                            height: 540,
                                        }}
                                    />
                                    :
                                    <View style={styles.modeTheme}>
                                        {uiList?.map((item, index) => {
                                            return (
                                                <View key={item.name + index}>
                                                    {index == 0 || index == 1 ? null :
                                                        <View key={item.name + index}>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setActive(index);
                                                                    setIsAuto(false);
                                                                    // changeTheme(index)
                                                                    // saveSettings(sendReminder, dateFormat, isOtpRequired, index)
                                                                    // setThemeChanging(true);
                                                                    if (active != index) {
                                                                        saveSettings(index)
                                                                        setThemeChanging(true);
                                                                    }
                                                                }}>
                                                                {
                                                                    // index == 0 ? (
                                                                    //     <Light style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'gray' }} />
                                                                    // ) : index == 1 ? (
                                                                    //     <Honey style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'gray' }} />
                                                                    // ) : 
                                                                    index == 2 ? (
                                                                        <View style={styles.themePreviewHolder}>
                                                                            <Video
                                                                                source={PinkFlareRoseGold}
                                                                                style={styles.backgroundVideo}
                                                                                muted
                                                                                repeat
                                                                                resizeMode="cover"
                                                                            />
                                                                        </View>
                                                                    ) : index == 3 ? (
                                                                        <View style={styles.themePreviewHolder}>
                                                                            <Video
                                                                                source={BlueFlareRoseGold}
                                                                                style={styles.backgroundVideo}
                                                                                muted
                                                                                repeat
                                                                                resizeMode="cover"
                                                                            />
                                                                        </View>
                                                                    ) : index == 4 ? (
                                                                        <View style={styles.themePreviewHolder}>
                                                                            <Video
                                                                                source={GoldFlareRoseGold}
                                                                                style={styles.backgroundVideo}
                                                                                muted
                                                                                repeat
                                                                                resizeMode="cover"
                                                                            />
                                                                        </View>
                                                                    ) : index == 5 ? (
                                                                        <View style={styles.themePreviewHolder}>
                                                                            <FastImage
                                                                                source={require('../../assets/ui/preview_gold_flower.webp')}
                                                                                style={styles.themePreview}
                                                                                resizeMode="cover"
                                                                            />
                                                                        </View>
                                                                    ) : index == 6 ? (
                                                                        <View style={styles.themePreviewHolder}>
                                                                            <FastImage
                                                                                source={require('../../assets/ui/preview_gold_pearl.webp')}
                                                                                style={styles.themePreview}
                                                                                resizeMode="cover"
                                                                            />
                                                                        </View>
                                                                    ) : index == 7 ? (
                                                                        <View style={styles.themePreviewHolder}>
                                                                            <FastImage
                                                                                source={require('../../assets/ui/preview_gold_water_drop.webp')}
                                                                                style={styles.themePreview}
                                                                                resizeMode="cover"
                                                                            />
                                                                        </View>
                                                                    ) : index == 8 ? (
                                                                        <View style={styles.themePreviewHolder}>
                                                                            <FastImage
                                                                                source={require('../../assets/ui/preview_elegent_defult.webp')}
                                                                                style={styles.themePreview}
                                                                                resizeMode="cover"
                                                                            />
                                                                        </View>
                                                                    ) : (
                                                                        <Light style={{ alignSelf: 'center', borderWidth: 1, borderColor: 'gray' }} />
                                                                    )
                                                                }
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setActive(index);
                                                                    setIsAuto(false);
                                                                    if (active != index) {
                                                                        saveSettings(index) //Send to server
                                                                        setThemeChanging(true);
                                                                    }
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        ...styles.modeText,
                                                                        color: theme?.name == 'Light' ? index == active ? '#3D50DF' : 'black'
                                                                            : index == active ? theme?.colors?.switch : 'white',
                                                                    }}>
                                                                    {item.name}
                                                                </Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setActive(index);
                                                                    setIsAuto(false);
                                                                    // changeTheme(index)
                                                                    // saveSettings(sendReminder, dateFormat, isOtpRequired, index);
                                                                    // setThemeChanging(true);
                                                                    if (active != index) {
                                                                        saveSettings(index)
                                                                        setThemeChanging(true);
                                                                    }
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        ...styles.circleOutside,
                                                                        borderColor: theme?.name == 'Light' ? index == active ? '#3D50DF' : 'black' : index == active ? theme?.colors?.switch : 'white',
                                                                    }}>
                                                                    <View
                                                                        style={{
                                                                            ...styles.circleInside,
                                                                            backgroundColor: index == active ? theme?.name == 'Light' ? '#3D50DF' : theme?.colors?.switch : 'transparent',
                                                                        }}
                                                                    />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    }
                                                </View>
                                            );
                                        })}
                                    </View>
                                }
                            </View>

                        </ScrollView>
                    </SafeAreaView>
                )
                }
            </SafeAreaView >
            {/* </ImageBackground> */}
        </View>
    );
}

const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        justifyContent: 'center',
    },
    autoDiv: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 500,
        textAlign: 'center',
        marginBottom: 30,
    },
    modeTheme: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginVertical: 20,
        // marginVertical: 50,
        columnGap: 0, //15,
        // gap: 25,
        rowGap: 35,
    },
    modeText: {
        alignSelf: 'center',
        fontWeight: 500,
        marginVertical: 10,
        width: 85,
        height: 35,
        textAlign: 'center',
    },
    circleOutside: {
        alignSelf: 'center',
        borderRadius: 50,
        borderWidth: 1,
        height: 25,
        width: 25,
        padding: 1.5,
    },
    circleInside: {
        height: 20,
        width: 20,
        borderRadius: 50,
    },
    container: {
        // paddingBottom: 70,
        flex: 1,
    },
    containerDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 20,
        height: 65,
        padding: 15,
        marginVertical: 10,
    },
    content: {
        paddingHorizontal: 27,
        // marginBottom: 60,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        marginStart: 15,
        // marginTop: 16,
        // marginBottom: 16,
        fontSize: 15,
        color: '#2E476E',
    },
    line: {
        borderBottomColor: '#c0c0c0',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    selectComponent: {
        // height: 20,
        // marginTop: 12,
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    backgroundVideo: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 72,
        height: 150,
        borderRadius: 8,
    },
    themePreviewHolder: { 
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center' , 
        borderRadius: 20,
        marginHorizontal: 10, //15,

    },
    themePreview: {
        height: 150,
        width: 72,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 8,

    },
});
