import React, {useState} from 'react';
import {View, Image} from 'react-native';
import {Button, Center} from 'native-base';
import {
  launchCamera,
  ImagePicker,
  launchImageLibrary,
} from 'react-native-image-picker';
export default function ImageUpload({onImagePick}) {
  const [imageSource, setImageSource] = useState(null);

  const pickImage = async () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    await launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let assets = response.assets[0];
        console.log('Image Pick: ' + assets);
        //setFilePath(response);
        var uri = assets.uri;
        onImagePick(assets);
        //setImageSource({uri: uri});
      }
    });

    // You can also use as a promise without 'callback':
    //const result = await launchImageLibrary(options);

    // ImagePicker.showImagePicker(options, response => {
    //   if (!response.didCancel && !response.error) {
    //     const formData = new FormData();
    //     formData.append('image', {
    //       uri: response.uri,
    //       type: response.type,
    //       name: response.fileName,
    //     });

    //     // Replace with your API endpoint for image upload
    //     // axios
    //     //   .post('YOUR_UPLOAD_API_ENDPOINT', formData)
    //     //   .then(response => {
    //     //     console.log('Image uploaded:', response.data);
    //     //     // Handle the response or update your UI as needed
    //     //   })
    //     //   .catch(error => {
    //     //     console.error('Image upload failed:', error);
    //     //     // Handle the error
    //     //   });

    //     //setImageSource({uri: response.uri});
    //     //setImageSource({uri: response.uri});
    //   }
    // });
  };
  return (
    <View>
      {imageSource && (
        <Center>
          <Image
            source={imageSource}
            style={{
              width: 100,
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Center>
      )}
      {/* <Button
        title="Pick an image"
        style={{borderRadius: 10}}
        onPress={pickImage}
      /> */}
      <Button
        flex={1}
        mt="2"
        mb="2"
        ml="1"
        size="md"
        colorScheme="blue"
        borderRadius={'3xl'}
        onPress={pickImage}>
        Pick an image
      </Button>
    </View>
  );
}
