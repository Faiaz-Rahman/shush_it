import { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Alert,
  View,
  BackHandler,
  ImageBackground,
  Image,
} from 'react-native';
import Signature from 'react-native-signature-canvas';
import Utils from '../../class/Utils';
import Delete from '../../../assets/delete.svg';
import Edit from '../../../assets/edit.svg';
import Eraser from '../../../assets/eraser.svg';
import DocumentListHeader from './DocumentListHeaderComponent';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../styles/ThemeProvider';
import Toast from 'react-native-toast-message';
import Url from '../../Api.js';


const SignatureComponentNew = ({
  signatureValue,
  onBackClick,
  getSignature,
  descriptionText,
  clearText,
  confirmText,
}) => {
  const ref = useRef();
  const { theme } = useTheme();
  const [btnLoad, setBtnLoad] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureLocal, setSignatureLocal] = useState(false);

  // console.log("called ===>", signatureValue+ ' <<<<<<<<<<<<<<<<<<<< ====');

  useEffect(() => {
    if (signatureValue) {
      setShowSignaturePad(false)
    } else {
      setShowSignaturePad(true)
    }
  }, [signatureValue])

  const handleOnSave = () => {
    console.log('signature save ==>: ');
    if (showSignaturePad) {
      ref.current?.readSignature();
    } else {
      handleSignature()
    }
    //setBtnLoad(true);
  };

  const handleSignature = signature => {
    // console.log('signature==>: ' + signature);
    setBtnLoad(true);
    getSignature(signature).then(() => {
      setBtnLoad(false);
    });
  };

  const style = `
  // .m-signature-pad--footer {display: none; margin: 0px;}

  .m-signature-pad--footer{display: none;}
  .save {
      display: none;
  }
  .clear {
      display: none;
  }
  .description {
    font-size: 18px !important;
    margin: auto;
    margin-top: 0px;
    color: black !important;
    font-weight: bold !important;
  }
  
    .m-signature-pad {
      // position: absolute;
      font-size: 10px;
      // width: 100%;
      // height: 400px;
      // width: 700px;
      // height: 300px;
      // top: 50%;
      // left: 50%;
      // margin-left: -350px;
      // margin-top: -200px;
      border: 1px dashed ${theme?.name == 'Light' ? "black" : 'transparent'};
      // border: 1px solid #e8e8e8;
      background-color: white;
      box-shadow: none;
      // box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
    }

    .m-signature-pad--body {
      border-bottom: 1px dashed gray;
    }
    `;


  return (
    // <ImageBackground
    //   source={theme?.bg?.bgImg}
    //   resizeMode="cover"
    //   style={styles.bgImage}
    // >
    <View style={{
      flex:1,
      justifyContent:'center',
      backgroundColor:'transparent',
    }}>
      <Text
        style={{
          fontSize: 25,
          color: theme?.colors?.text,
          textAlign: "center",
        }}
      >
        Add Signature
      </Text>

      {!showSignaturePad && signatureValue ?
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: signatureValue,
              }}
              fallbackSource={{
                uri: 'https://www.w3schools.com/css/img_lights.jpg',
              }}
              style={styles.profilePic}
              aspectRatio={1}
              alt=""
              // size="2xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              style={{
                zIndex: 1,
                alignSelf: 'center',
                position: 'absolute',
                bottom: 10,
                right: 10,
              }}
              onPress={() => {
                if (showSignaturePad) {
                  ref.current.clearSignature();
                } else {
                  setShowSignaturePad(true);
                }
              }}
            >
              {theme?.profileIcon?.refresh}
            </TouchableOpacity>
          </View>
        </View>
        :
        <View style={styles.container}>
          <Signature
            ref={ref}
            // style={{
            //   paddingHorizontal: 25,
            //   paddingVertical: 65,
            // }}
            onOK={sig => handleSignature(sig)}
            onEmpty={async () => {
              Toast.show({
                type: 'error',
                text1: 'Draw a signature first',
                onPress: () => {
                  closeToast();
                }
              })
              // setSignatureLocal(false)
              console.log('___onEmpty');
            }}
            descriptionText={descriptionText || ''}
            clearText={clearText || ''}
            confirmText={confirmText || ''}
            webStyle={style}
          />

          <TouchableOpacity
            style={{
              zIndex: 1,
              alignSelf: 'center',
              position: 'absolute',
              bottom: 10,
              right: 10,
            }}
            onPress={() => {
              if (showSignaturePad) {
                ref.current.clearSignature();
              } else {
                setShowSignaturePad(true);
              }
            }}
          >
            {theme?.profileIcon?.refresh}
          </TouchableOpacity>
        </View>
      }
      {/* </View> */}

      {/* <TouchableOpacity
        style={{ zIndex: 1, alignSelf: 'center' }}
        onPress={() => {
          if (showSignaturePad) {
            ref.current.clearSignature();
          } else {
            setShowSignaturePad(true);
          }
        }}
      >
        {theme?.profileIcon?.eraser}
      </TouchableOpacity> */}

      <View
        style={styles.direction}>
        <TouchableOpacity
          onPress={() => onBackClick()}
          style={{ zIndex: 1 }}>
          {theme?.profileIcon?.backward}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleOnSave()}
          style={{ zIndex: 1 }}>
          {theme?.profileIcon?.forward}
        </TouchableOpacity>
      </View>

    {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    justifyContent: 'center',
  },
  direction: {
    marginVertical: 40,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 200,
    // maxHeight: "30%",
    marginHorizontal: 20,
    marginVertical: 30,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    // borderWidth: 2,
    // borderColor: 'red',
  },
  profilePic: {
    height: 200,
    // borderWidth: 1,
    // borderColor: 'red',
    backgroundColor: 'white',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: "flex-start",
    justifyContent: 'space-between',
    // alignItems: "center",
    // width: "100%",
    // alignItems: "center",
    // borderWidth: 1,
    paddingHorizontal: 25,
  },
  modeTheme: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    // marginVertical: 20,
    gap: 10,
  },
  modeText: {
    alignSelf: 'center',
    fontWeight: 500,
    marginVertical: 10,
  },
  circleOutside: {
    alignSelf: 'center',
    // borderColor: 'gray',
    borderRadius: 50,
    height: 25,
    width: 25,
    padding: 1.5,
  },
  circleInside: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
  iconDiv2: {
    height: 30,
    width: 30,
    borderRadius: 50,
  },
  icon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default SignatureComponentNew;
