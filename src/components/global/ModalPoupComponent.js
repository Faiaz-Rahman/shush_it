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
import CustomButton from '../global/ButtonComponent.js';
import { Elegant } from '../../../styles/Theme.js';

const ModalPoup = ({
  visible,
  title,
  source,
  btnTxt,
  onPressOk,
  onPressClose,
  theme = null,
}) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const animation = useRef(null);
  React.useEffect(() => {
    console.log("Status modal : "+ visible);
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
          style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}
        >
          <ImageBackground
            source={Elegant.bg.bgImg}
            resizeMode="cover"
            imageStyle={{ borderRadius: 20}}
            style={styles.bgImage}
          >
            <View style={styles.mainContainer}>
              <View style={styles.headerDialog}>
                <TouchableOpacity onPress={onPressClose}>
                  <Image
                    source={require('../../../assets/cross_icon.png')}
                    style={styles.closeButton}
                  />
                </TouchableOpacity>
              </View>
{/* 
              {theme?.name == 'Light' &&
                < Image
                  source={require('../../../assets/half_circle_p.png')}
                  style={styles.headerImage}
                  resizeMode="stretch"
                />
              } */}

              <LottieView
                autoPlay
                ref={animation}
                style={styles.animation}
                source={source}
                loop
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              {/* <Image
              source={require('../../../assets/success_icon.png')}
              style={{height: 150, width: 150, marginVertical: 10}}
            /> */}
            </View>

            {/* <Text style={styles.title}>{title}</Text> */}
            <Text style={{
              ...styles.title,
              color: theme?.name == 'Light' ? 'black' : 'white',
            }}
            >
              {title}
            </Text>

            {btnTxt && (
              <View style={{ padding: 36 }}>
                <CustomButton
                  title={btnTxt}
                  onPress={onPressOk}

                  color={theme?.colors?.btnText}
                  colors={theme?.colors?.colors}
                  bordered={true}
                  borderWidth={theme?.name == 'Light' ? 0 : 3}
                  borderColor={theme?.colors?.borderColor}
                  borderColors={theme?.colors?.borderColors}
                  shadow={theme?.name == 'Light'}
                />
              </View>
            )}
          </ImageBackground>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    height: 200,
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

export default ModalPoup;
