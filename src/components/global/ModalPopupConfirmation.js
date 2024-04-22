import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from 'react-native';
import LottieView from 'lottie-react-native';
import ButtonComponentSmall from './ButtonComponentSmall.js';
import Url from '../../Api.js';

import { Elegant } from '../../../styles/Theme.js';


const ModalPopupConfirmation = ({ visible, title, source, msg, onPressClose, onPressOk, okText, cancelText, isLoading, theme = null, customImg = null, showCustom = false }) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const animation = useRef(null);
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <ImageBackground
            source={Elegant.bg.bgImg}
            resizeMode="cover"
            imageStyle={{ borderRadius: 20}}
            style={styles.bgImage}
          >
            <View style={styles.mainContainer}>
              {!customImg &&
                <View style={styles.headerDialog}>
                  <TouchableOpacity onPress={onPressClose}>
                    <Image
                      source={require('../../../assets/cross_icon.png')}
                      style={styles.closeButton}
                    />
                  </TouchableOpacity>
                </View>
              }

              {/* {theme?.name == 'Light' &&
                <Image
                  source={require('../../../assets/half_circle_p.png')}
                  style={styles.headerImage}
                  resizeMode="stretch"
                />
              } */}

              {!customImg && !showCustom &&
                <LottieView
                  autoPlay
                  ref={animation}
                  style={styles.animation}
                  source={source || require('../../../assets/warning.json')}
                  loop
                />
              }
            </View>

            {customImg &&
              <View style={{ alignItems: 'center' }}>
                {/* {customImg} */}
                <Image
                  source={{ uri: customImg }}
                  style={{ height: 72, width: 72, marginVertical: 20 }}
                />
              </View>
            }

            {title && <Text style={{
              ...styles.title,
              color: theme?.name == 'Light' ? 'black' : 'white',
            }}
            >
              {title}
            </Text>}

            {msg &&
              <Text style={{
                ...styles.msg,
                color: theme?.name == 'Light' ? 'black' : 'white',
              }}>{msg}</Text>
            }

            <View style={{ padding: 22, flexDirection: 'row', justifyContent: 'flex-end', gap: 20 }}
            >
              <ButtonComponentSmall
                title={cancelText || 'Cancel'}
                color={theme?.colors?.btnText}
                colors={theme?.colors?.colors}
                bordered={true}
                borderWidth={theme?.name == 'Light' ? 0 : 3}
                borderColor={theme?.colors?.borderColor}
                borderColors={theme?.colors?.borderColors}
                shadow={theme?.name == 'Light'}
                onPress={onPressClose}
              // colors={['#808080', '#808080', '#808080']}
              />
              {/* <View style={{ width: '45%' }}> */}
              <ButtonComponentSmall
                title={okText || 'Delete'}
                color={theme?.colors?.btnText}
                colors={theme?.colors?.colors}
                bordered={true}
                borderWidth={theme?.name == 'Light' ? 0 : 3}
                borderColor={theme?.colors?.borderColor}
                borderColors={theme?.colors?.borderColors}
                shadow={theme?.name == 'Light'}
                // colors={['#FD371F', '#FD371F', '#FD371F']}
                isLoading={isLoading}
                onPress={onPressOk}
              />
              {/* </View> */}
            </View>
          </ImageBackground>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    // flex: 1,
    // justifyContent: 'center',
    // borderRadius: 20,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 20,
    elevation: 20,
  },
  mainContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    // backgroundColor: 'white',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 20,
    elevation: 0,
  },
  animation: {
    width: '100%',
    height: 150,
    backgroundColor: '#ffffff00',
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerImage: {
    height: 180,
    width: '100%',
    marginVertical: 0,
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
    position: 'absolute',
  },
  closeButton: { height: 30, width: 30, tintColor: 'white' },
  title: {
    marginTop: 50,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 24,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    color: 'black',
    textAlign: 'center',
  },
  msg: {
    paddingLeft: 24,
    paddingRight: 24,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    textAlign: 'center',
  },
  headerDialog: {
    zIndex: 1,
    width: '100%',
    height: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
  },
});

export default ModalPopupConfirmation;
