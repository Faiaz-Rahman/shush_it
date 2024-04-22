import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../styles/ThemeProvider';
import CONSTANTS from '../../Constants';

const ThemeSelectorForTest = () => {
    const [active, setActive] = useState(null);

    const modes = ['Light', 'Honeycomb', 'Rose Gold', 'Gold'];
    const { theme, setScheme } = useTheme();

    const changeTheme = (index) => {
        if (index == 0) {
            setScheme(CONSTANTS.THEME.LIGHT /*'light'*/)
        } else if (index == 1) {
            setScheme(CONSTANTS.THEME.HONEYCOMB /*'honeycomb'*/)
        } else if (index == 2) {
            setScheme(CONSTANTS.THEME.ROSEGOLD /*'roseGold'*/)
        } else if (index == 3) {
            setScheme(CONSTANTS.THEME.GOLD /*'gold'*/)
        } else if (index == 4) {
            setScheme(CONSTANTS.THEME.ELEGENT /*'elegant'*/)
        } else {
            setScheme(CONSTANTS.THEME.LIGHT /*'light'*/)
        }
    }


    return (
        <View style={styles.modeTheme}>
            {modes?.map((item, index) => {
                return (
                    <View key={item + index}>
                        <TouchableOpacity
                            onPress={() => {
                                setActive(index);
                                changeTheme(index)
                            }}>
                            <Text
                                style={{
                                    ...styles.modeText,
                                    color: theme?.name == 'Light' ? index == active ? '#3D50DF' : 'black' : index == active ? theme?.colors?.switch : 'white',
                                }}>
                                {item}
                            </Text>


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
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    modeTheme: {
        flexDirection: 'row',
        justifyContent: 'center',
        // flexWrap: 'wrap',
        marginVertical: 30,
        // columnGap: -75,
        gap: 15,
        // rowGap: 25,
    },
    modeText: {
        alignSelf: 'center',
        fontWeight: 500,
        marginVertical: 10,
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
});

export default ThemeSelectorForTest;
