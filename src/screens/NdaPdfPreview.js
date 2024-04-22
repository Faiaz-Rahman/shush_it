import { useNavigation } from '@react-navigation/native';
import { React, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Alert, View, ImageBackground } from 'react-native';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import { decode as atob, encode as btoa } from 'base-64';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ReactNativeBlobUtil from 'react-native-blob-util';

//Image Resource
//Assets
//Variables
import Url from '../Api.js';
const RNFS = require('react-native-fs');

//Class
import DocumentListHeader from '../components/global/DocumentListHeaderComponent.js';
import CustomButton from '../components/global/ButtonComponent.js';
import globalStyle from '../../styles/MainStyle.js';
import { Fab } from 'native-base';
import { useTheme } from '../../styles/ThemeProvider.js';
import ThemeSelectorForTest from '../components/global/ThemeSelectorForTest.js';

export default function NdaPdfPreView(navigation) {
  const { theme } = useTheme();

  // const { id, name } = route.params;
  const { id, name, link, data } = navigation.route.params;
  const [fileDownloaded, setFileDownloaded] = useState(false); //Default false
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const [filePath, setFilePath] = useState(
    `${RNFS.DocumentDirectoryPath}/Shush-${name}.pdf`,
  );

  const [isDownLoading, setIsDownLoading] = useState(false);

  const navi = useNavigation();
  const handlePress = () => {
    navi.goBack();
  };

  const { localFile } = navigation.route.params;

  useEffect(() => {
    console.log('File: ' + localFile);
    if (localFile === null || localFile === undefined) {
      downloadFile();
    } else {
      readPdf(localFile)
    }

  }, [isDownLoading]);

  const readPdf = async localFile => {
    await readFile(localFile);
  }

  const _base64ToArrayBuffer = base64 => {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const downloadPDF = async () => {

    //setIsDownLoading(true);

    const time = new Date().getTime();
    const url = Url.FILE_URL + link; // Replace with the actual URL of the PDF file
    console.log('Download url: ' + url);
    //DownloadDirectoryPath
    const downloadDest = `${RNFS.DocumentDirectoryPath}/pdf-${time}.pdf`; // Save the PDF file to the device's download folder
    console.log('Downlload uri: ' + downloadDest);

    try {
      if (Platform.OS === 'ios') {
        // const fileDir = ReactNativeBlobUtil.fs.dirs.CacheDir;
        // const filePath = fileDir + `/pdf-${time}.pdf`;

        // setIsDownLoading(true);
        // RNFS.downloadFile({
        //   fromUrl: url,
        //   toFile: downloadDest,
        //   progress: res => {
        //     const progress = (res.bytesWritten / res.contentLength) * 100;
        //     console.log(`Progress: ${progress.toFixed(2)}%`);
        //   },
        // }).promise.then(res => {
        //   setIsDownLoading(false);
        //   console.log('Downloaded file end');
        //   ReactNativeBlobUtil.ios.previewDocument(downloadDest);
        //   // await RNFS.readFile(filePath, 'base64').then(async contents => {
        //   //   await ReactNativeBlobUtil.fs.writeFile(fileDir, contents, 'base64');
        //   //   ReactNativeBlobUtil.ios.previewDocument(filePath);
        //   // });
        // });

        ReactNativeBlobUtil.ios.previewDocument(filePath);
      }
      else if (Platform.OS === 'android') {
        //Download
        if (false) {
          setIsDownLoading();
          ReactNativeBlobUtil.config({
            addAndroidDownloads: {
              useDownloadManager: true, // <-- this is the only thing required
              // Optional, override notification setting (default to true)
              notification: true,
              // Optional, but recommended since android DownloadManager will fail when
              // the url does not contains a file extension, by default the mime type will be text/plain
              mime: 'file/pdf', //'text/plain',
              title: `pdf-${time}.pdf`,
              //path: RNFS.DownloadDirectoryPath,
              description: 'Shush.',
            },
          })
            .fetch('GET', url)
            .then(resp => {
              // the path of downloaded file

              let shareOptions = {
                title: name,
                url: downloadDest,
                message: 'Share this NDA',
                subject: 'Subject'
              };

              Share.open(shareOptions)
                .then(res => {
                  console.log(res);
                  setIsDownLoading(false);
                })
                .catch(err => {
                  err && console.log(err);
                  setIsDownLoading(false);
                });
              console.log('PDF downloaded');
              //console.log('downloaded PDF file path:' + resp.path());
              //resp.path();
            });
        } else {

          const shareOptions = {
            title: 'Share nda PDF',
            message: 'Check out this PDF file!',
            url: `file://${filePath}`,
            type: 'application/pdf',
          };

          await Share.open(shareOptions);
        }
      }
    } catch (error) {
      console.log('Error downloading PDF:', error);
      setIsDownLoading(false);
    }
  };

  const downloadFile = async () => {
    setIsLoad(true);
    if (!fileDownloaded) {
      console.log('Downloaded file start');

      RNFS.downloadFile({
        fromUrl: Url.FILE_URL + link,
        toFile: filePath,
        //background: true, // Enable downloading in the background (iOS only)
        //discretionary: true, // Allow the OS to control the timing and speed (iOS only)
        progress: res => {
          // Handle download progress updates if needed
          const progress = (res.bytesWritten / res.contentLength) * 100;
          // if (progress >= 100) {
          //   setIsLoad(false)
          // }
          console.log(`Progress: ${progress.toFixed(2)}%`);
        },
      }).promise.then(async res => {
        console.log('Downloaded file end');
        setFileDownloaded(true);
        await readFile(filePath);
        // navi.navigate('create_nda_acceptance');
        setIsLoad(false);
      });
    }
  };

  const readFile = async filePath => {
    console.log('PDF read ');
    await RNFS.readFile(filePath, 'base64').then(contents => {
      setPdfBase64(contents);
      setPdfArrayBuffer(_base64ToArrayBuffer(contents));
    });
    setIsLoad(false);
  };

  // console.log("FILE_URL==><", Url.FILE_URL);
  // console.log("link==><", link);

  return (
    <View style={{
      flex:1,
      backgroundColor:'transparent',
    }}>
      <SafeAreaView style={styles.container}>

        <DocumentListHeader
          onPress={handlePress}
          // title={name || "N/A"}

          backIcon={theme?.header?.backIcon}
          statusBarColor={theme?.colors?.statusBarColor}
          dark={theme?.name == 'Light'}
          color={theme?.colors?.text}
        />

        <View style={styles.template}>
          {isLoad ? (
            <ActivityIndicator
              color={theme?.name == 'Light' ? globalStyle.colorAccent : theme?.colors?.text}
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                height: '100%',
              }}
            />
          ) : (
            <>
              <Pdf
                // minScale={1.0}
                // maxScale={1.0}
                scale={1.0}
                // spacing={-50}
                fitPolicy={0}
                enablePaging={true}
                source={{ uri: filePath }}
                // source={{ uri: Url.FILE_URL + link }}
                usePDFKit={false}
                // onLoadComplete={(
                //   numberOfPages,
                //   filePath,
                //   { width, height },
                // ) => {
                //   setPageWidth(width);
                //   setPageHeight(height);
                // }}
                // onPageSingleTap={(page, x, y) => {
                //   handleSingleTap(page, x, y);
                // }}
                style={{ ...styles.pdf, borderColor: (theme?.name == 'Elegant' || theme?.name == 'Honeycomb') ? 'gray' : theme?.name == 'Gold' ? 'gold' : theme?.colors?.text }}
              />

              <View style={{ marginTop: 20 }}>
              {/* <View style={{ flex: 1, paddingTop: 20, borderColor: 'red', borderWidth: 2 }}> */}

                <CustomButton
                  title={'SHARE'}

                  color={theme?.colors?.btnText}
                  colors={theme?.colors?.colors}
                  bordered={true}
                  borderWidth={theme?.name == 'Light' ? 0 : 3}
                  borderColor={theme?.colors?.borderColor}
                  borderColors={theme?.colors?.borderColors}
                  shadow={theme?.name == 'Light'}
                  isLoading={isDownLoading}
                  onPress={() => {
                    //navi.navigate('create_nda_Acceptance');
                    ///downloadFile()

                    console.log("Press Download");
                    downloadPDF();
                    // navi.navigate('create_nda_signing', {
                    //   id: id,
                    //   name: name,
                    //   filePath: filePath,
                    //   type: 'receiver',
                    // });
                  }}
                />

              </View>
            </>
          )}
        </View>

        {/* <ThemeSelectorForTest /> */}

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    // justifyContent: 'center',
  },
  container: {
    // flex: 1,
    //paddingTop: globalStyle.topPadding,
    //paddingBottom: globalStyle.bottomPadding,
    // backgroundColor: globalStyle.statusBarColor,
  },
  pdf: {
    width: Dimensions.get('window').width * 0.9, //* 0.95,
    height: Dimensions.get('window').height * 0.7, //0.8,
    alignSelf: 'center',

    borderWidth: 5,
    borderRadius: 10,

    // backgroundColor: 'red',
    // margin: 5,
    //height: '40%',
    //height: 550,
  },
  template: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 20,
  },
  btnDiv: {
    flex: 1,
    marginTop: 5,
    width: '100%',
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  bottomControlBtnContainer: {
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    marginBottom: 0,
    //gap: 15,
    //bottom: 0,
    //zIndex: 1,
    width: '100%',
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 5,
    // backgroundColor: 'white',
  },
  btnContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.88,
  },
});
