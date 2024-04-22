import LottieView from 'lottie-react-native';
import { Button } from 'native-base';
import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground
} from 'react-native';
import PasswordSVG from '../../../assets/sign_in_password_icon.svg';
import globalStyle from '../../../styles/MainStyle.js';
import PasswordInput from './InputPasswordComponent.js';
import ButtonComponentSmall from './ButtonComponentSmall.js';

import { Elegant } from '../../../styles/Theme';

const ModalPopupForBioLoginEnable = ({
  visible,
  title,
  source,
  msg,
  onPressClose,
  onSave,
  btnLoad = false,
  onCancel,
  theme = null,
}) => {
  const [showModal, setShowModal] = React.useState(visible);
  const [password, setPassword] = React.useState(null);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const animation = useRef(null);
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setPassword('');
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
            style={styles.bgImage}
            imageStyle={{ borderRadius: 20}}
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

              {/* {theme?.name == 'Light' &&
                <Image
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

            {/* <View style={{ alignItems: 'center' }}>
              <Image
              source={require('../../../assets/success_icon.png')}
              style={{height: 150, width: 150, marginVertical: 10}}
            />
            </View> */}

            {/* <Text style={styles.title}>{title}</Text>
            {msg && <Text style={styles.msg}>{msg}</Text>} */}

            <Text style={{
              ...styles.title,
              color: theme?.name == 'Light' ? 'black' : 'white',
            }}
            >
              {title}
            </Text>

            {msg &&
              <Text style={{
                ...styles.msg,
                color: theme?.name == 'Light' ? 'black' : 'white',
              }}
              >{msg}</Text>
            }

            {/* <View>
              <View style={{ paddingBottom: 20, alignItems: 'center' }}>
                <PasswordInput
                  placeholderTitle={'Password'}
                  // icon={<PasswordSVG />}
                  icon={theme?.profileIcon?.password}
                  eyeOn={theme?.profileIcon?.eyeOn}
                  eyeOff={theme?.profileIcon?.eyeOff}
                  borderColor={theme?.textInput?.borderColor}
                  backgroundColor={theme?.textInput?.backgroundColor}
                  borderWidth={theme?.textInput?.borderWidth}
                  darkShadowColor={theme?.textInput?.darkShadowColor}
                  lightShadowColor={theme?.textInput?.lightShadowColor}
                  shadowOffset={theme?.textInput?.shadowOffset}
                  placeholderColor={theme?.textInput?.placeholderColor}
                  inputColor={theme?.textInput?.inputColor}


                  customWidthRatio={1.5}
                  onChangeText={value => {
                    // console.log('password==: ' + value);
                    setPassword(value);
                  }}
                />
              </View>

            </View> */}

            <View
              style={{
                padding: 36,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 20,
              }}>


              <View style={styles.buttonContainer}>
                <ButtonComponentSmall
                  title={'Cancel'}
                  color={theme?.colors?.btnText}
                  colors={theme?.colors?.colors}
                  bordered={true}
                  borderWidth={theme?.name == 'Light' ? 0 : 3}
                  borderColor={theme?.colors?.borderColor}
                  borderColors={theme?.colors?.borderColors}
                  shadow={theme?.name == 'Light'}
                  onPress={onPressClose}
                />
              </View>

              <View style={{ ...styles.buttonContainer, minWidth: 50 }}>
                {btnLoad ?
                  <ActivityIndicator color={theme?.name == 'Light' ? 'black' : 'white'} />
                  :
                  <ButtonComponentSmall
                    title={'Ok'}
                    color={theme?.colors?.btnText}
                    colors={theme?.colors?.colors}
                    bordered={true}
                    borderWidth={theme?.name == 'Light' ? 0 : 3}
                    borderColor={theme?.colors?.borderColor}
                    borderColors={theme?.colors?.borderColors}
                    shadow={theme?.name == 'Light'}
                    onPress={() => { onSave(password) }}
                  />
                }
              </View>

              {/* <Button
                mt="2"
                mb="2"
                size="sm"
                width="1/2"
                height="10"
                // shadow={'6'}
                colorScheme="blue"
                borderRadius={'3xl'}
                variant="outline"
                onPress={() => {
                  onPressClose();
                }}>
                <Text style={{ ...styles.btnText, color: '#3d50df' }}>Cancel</Text>
              </Button>

              <Button
                mt="2"
                mb="2"
                size="sm"
                width="1/2"
                height="10"
                shadow={saveBtnDisable ? null : '6'}
                colorScheme={saveBtnDisable ? null : 'blue'}
                variant={saveBtnDisable ? 'outline' : null}
                disabled={saveBtnDisable}
                borderRadius={'3xl'}
                onPress={() => {
                  onSave(password);
                }}>
                {saveBtnDisable ? (
                  <ActivityIndicator color={globalStyle.colorAccent} />
                ) : (
                  <Text style={styles.btnText}>Enable</Text>
                )}
              </Button> */}
            </View>
          </ImageBackground>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 'auto',
    // height: 50,
    // paddingBottom: 32,
    // width: '45%',
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
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
    height: 170,
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
    paddingBottom: 24,
    marginTop: 24,
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

export default ModalPopupForBioLoginEnable;
