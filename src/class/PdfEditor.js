import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';
const RNFS = require('react-native-fs');
import { decode as atob, encode as btoa } from 'base-64';
import { Platform } from 'react-native';

class PdfEditor {
  constructor() {
    // Initialize the utility with any necessary configuration or state
  }

  //Token get
  static getData = async key => {
    try {
    } catch (error) {
      console.error('Async data Error retrieving :', error);
      return null;
    }
  };

  static _base64ToArrayBuffer = base64 => {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };

  static _uint8ToBase64 = u8Arr => {
    const CHUNK_SIZE = 0x8000; //arbitrary number
    let index = 0;
    const length = u8Arr.length;
    let result = '';
    let slice;
    while (index < length) {
      slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return btoa(result);
  };

  static setDocumentMetadata = async callback => {
    var pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    var partyAName = '';
    var partyATitle = '';
    var partyASignedDate = '';

    var partyBName = '';
    var partyBTitle = '';
    var partyBSignedDate = '';

    var party_A_x_val = 400; //250;
    var party_A_y_val = 700; //930; //
    //const page = pdfDoc.addPage([500, 600]);
    const page = pdfDoc.addPage(PageSizes.Letter); //Letter//Legal: [612.0, 1008.0] // Letter: [612.0, 792.0]
    page.setFont(timesRomanFont);
    page.drawText(
      'The parties have executed this Mutual Nondisclosure Agreement as of the dat first  above written.',
      { x: 30, y: party_A_y_val + 60, size: 14 },
    );
    page.drawText('PARTY_A:', {
      x: party_A_x_val,
      y: party_A_y_val + 30,
      size: 14,
    });
    page.drawLine({
      start: { x: party_A_x_val, y: party_A_y_val - 40 },
      end: { x: party_A_x_val + 100, y: party_A_y_val - 40 },
      thickness: 2,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.75,
    });
    // page.drawText('Signed on: ' + partyBSignedDate, {
    //   x: party_A_x_val + 40,
    //   y: party_A_y_val - 60,
    //   size: 12,
    // });
    page.drawText('Name: ' + partyAName, {
      x: party_A_x_val,
      y: party_A_y_val - 80,
      size: 12,
    });
    page.drawText('Title: ' + partyATitle, {
      x: party_A_x_val,
      y: party_A_y_val - 100,
      size: 12,
    });
    page.drawText('Email: ' + partyASignedDate, {
      x: party_A_x_val,
      y: party_A_y_val - 120,
      size: 12,
    });

    var party_B_x_val = party_A_x_val;
    var party_B_y_val = party_A_y_val - 200;

    page.drawText('PARTY_B:', {
      x: party_B_x_val,
      y: party_B_y_val + 30,
      size: 14,
    });
    page.drawLine({
      start: { x: party_B_x_val, y: party_B_y_val - 40 },
      end: { x: party_B_x_val + 100, y: party_B_y_val - 40 },
      thickness: 2,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.75,
    });
    // page.drawText('Signed on: ' + partyBSignedDate, {
    //   x: party_B_x_val + 50,
    //   y: party_B_y_val - 60,
    //   size: 12,
    // });
    page.drawText('Name: ' + partyBName, {
      x: party_B_x_val,
      y: party_B_y_val - 80,
      size: 12,
    });
    page.drawText('Title: ' + partyBTitle, {
      x: party_B_x_val,
      y: party_B_y_val - 100,
      size: 12,
    });
    page.drawText('Email: ', {
      x: party_B_x_val,
      y: party_B_y_val - 120,
      size: 12,
    });

    // Note that these fields are visible in the "Document Properties" section of
    // most PDF readers.
    pdfDoc.setTitle('🥚 The Life of an Egg 🍳');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('📘 An Epic Tale of Woe 📖');
    pdfDoc.setKeywords(['eggs', 'wall', 'fall', 'king', 'horses', 'men']);
    pdfDoc.setProducer('PDF App 9000 🤖');
    pdfDoc.setCreator('pdf-lib (https://github.com/Hopding/pdf-lib)');
    pdfDoc.setCreationDate(new Date('2018-06-24T01:58:37.228Z'));
    pdfDoc.setModificationDate(new Date('2019-12-21T07:00:11.000Z'));

    //const pdfBytes = await pdfDoc.save();

    //const pdfBytes = await pdfDoc.saveAsBase64;
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    //const pdfDataUri = await document.saveAsBase64({dataUri: true});

    // console.log(JSON.stringify(pdfDataUri));
    //setCreatedPdf(pdfDataUri);

    // Call the callback function here
    if (typeof callback === 'function') {
      callback(pdfDataUri);
    }
  };

  static getCombinedPdf = async (
    filePath,

    sender_name,
    sender_email,
    sender_address,
    sender_address_full,

    receiver_name,
    receiver_email,
    receiver_address,
    receiver_address_full,

    type,
    signatureBase64,
    callback,

  ) => {
    console.log('Callback params: ' + callback + ' Type: '+ type);
    console.log('File path: ' + filePath);
    var contant = await RNFS.readFile(filePath, 'base64');
    var buffer = this._base64ToArrayBuffer(contant);
    var pdfDocSample = await PDFDocument.load(buffer);

    var pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    const copiedPages = await pdfDoc.copyPages(pdfDocSample, [0, 1, 2]);

    for (let page of copiedPages) {
      // Do something with each page
      pdfDoc.addPage(page);
    }
    console.log('sender name ' + sender_name);
    var partyAName = sender_name;
    var partyATitle = sender_address;
    var partyAAddressFull = sender_address_full;
    var partyAEmail = sender_email;

    var partyASignedDate = '';

    var partyBName = receiver_name;
    var partyBTitle = receiver_address;
    var partyBAddressFull = receiver_address_full;
    var partyBEmail = receiver_email;
    var partyBSignedDate = '';

    var party_A_x_val = 400; //250;
    var party_A_y_val = 700; //930; //

    //const page = pdfDoc.addPage([500, 600]);
    const page = pdfDoc.addPage(PageSizes.Letter); //Letter//Legal: [612.0, 1008.0] // Letter: [612.0, 792.0]
    page.setFont(timesRomanFont);
    page.drawText(
      'The parties have executed this Mutual Nondisclosure Agreement as of the dat first  above written.',
      { x: 30, y: party_A_y_val + 60, size: 14 },
    );
    page.drawText('PARTY_A:', {
      x: party_A_x_val,
      y: party_A_y_val + 30,
      size: 14,
    });
    page.drawLine({
      start: { x: party_A_x_val, y: party_A_y_val - 40 },
      end: { x: party_A_x_val + 150, y: party_A_y_val - 40 },
      thickness: 2,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.75,
    });
    // page.drawText('Signed on: ' + partyBSignedDate, {
    //   x: party_A_x_val,
    //   y: party_A_y_val - 60,
    //   size: 12,
    // });
    page.drawText('Name: ' + partyAName, {
      x: party_A_x_val,
      y: party_A_y_val - 80,
      size: 12,
    });
    page.drawText('Address: ' + partyATitle, {
      x: party_A_x_val,
      y: party_A_y_val - 100,
      size: 12,
    });
    page.drawText(partyAAddressFull, {
      x: party_A_x_val,
      y: party_A_y_val - 120,
      size: 12,
    });
    page.drawText('Email: ' + partyAEmail, {
      x: party_A_x_val,
      y: party_A_y_val - 140,
      size: 12,
    });

    var party_B_x_val = party_A_x_val;
    var party_B_y_val = party_A_y_val - 200;

    page.drawText('PARTY_B:', {
      x: party_B_x_val,
      y: party_B_y_val + 30,
      size: 14,
    });

    page.drawLine({
      start: { x: party_B_x_val, y: party_B_y_val - 40 },
      end: { x: party_B_x_val + 150, y: party_B_y_val - 40 },
      thickness: 2,
      color: rgb(0.75, 0.75, 0.75),
      opacity: 0.75,
    });
    // page.drawText('Signed on: ' + partyBSignedDate, {
    //   x: party_B_x_val,
    //   y: party_B_y_val - 60,
    //   size: 12,
    // });
    page.drawText('Name: ' + partyBName, {
      x: party_B_x_val,
      y: party_B_y_val - 80,
      size: 12,
    });
    page.drawText('Address: ' + partyBTitle, {
      x: party_B_x_val,
      y: party_B_y_val - 100,
      size: 12,
    });
    page.drawText(partyBAddressFull, {
      x: party_B_x_val,
      y: party_B_y_val - 120,
      size: 12,
    });
    page.drawText('Email: ' + partyBEmail, {
      x: party_B_x_val,
      y: party_B_y_val - 140,
      size: 12,
    });


    var X_VAL = 0;
    var Y_VAL = 0;
    if (type === 'sender') {
      X_VAL = party_A_x_val;
      Y_VAL = party_A_y_val - 40;
    } else {
      X_VAL = party_B_x_val;
      Y_VAL = party_B_y_val - 40;
    }
    // var page = 4;
    // console.log('pdf page: ' + page);

    // //const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
    // const pages = pdfDoc.getPages();

    // const firstPage = pages[page - 1];
    // The meat
    // var temp_x = (pageWidth * (x - 12)) / windowWidth; //Dimensions.get('window').width
    // var temp_y = pageHeight - (pageHeight * (y + 12)) / pageHeight - 25;

    // console.log('Put Sign: X= ' + temp_x + ' Y= ' + temp_y);

    console.log('signature start= ' + signatureBase64);
    const signatureImage = await pdfDoc.embedPng(signatureBase64);
    if (Platform.OS === 'ios') {
      page.drawImage(signatureImage, {
        // x: (pageWidth * (x - 12)) / windowWidth, //Dimensions.get('window').width
        // y: pageHeight - (pageHeight * (y + 12)) / 540, // Pdf view hight
        x: X_VAL,
        y: Y_VAL,
        width: 70,
        height: 70,
      });
    } else {
      page.drawImage(signatureImage, {
        // x: (pageWidth * (x - 12)) / windowWidth, //Dimensions.get('window').width
        // y: pageHeight - (pageHeight * (y + 12)) / firstPage.getHeight(), // Pdf view hight
        x: X_VAL, //(firstPage.getWidth() * x) / pageWidth,
        y: Y_VAL,
        //firstPage.getHeight() - (firstPage.getHeight() * y) / pageHeight - 25,
        width: 70,
        height: 70,
      });
    }
    console.log('pdf array: signed--- ');



    // Note that these fields are visible in the "Document Properties" section of
    // most PDF readers.
    pdfDoc.setTitle('Shush');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('📘 An Epic Tale of Woe 📖');
    pdfDoc.setKeywords(['eggs', 'wall', 'fall', 'king', 'horses', 'men']);
    pdfDoc.setProducer('Shush Privacy App');
    pdfDoc.setCreator('Shush Privacy App');
    pdfDoc.setCreationDate(new Date('2018-06-24T01:58:37.228Z'));
    pdfDoc.setModificationDate(new Date('2019-12-21T07:00:11.000Z'));

    //const pdfBytes = await pdfDoc.save();
    //const pdfBytes = await pdfDoc.saveAsBase64;
    //const pdfDataUri = await pdfDoc.saveAsBase64({dataUri: true});
    // pdfDoc.save();

    //const pdfDataUri = await document.saveAsBase64({dataUri: true});

    //console.log(JSON.stringify(pdfDataUri));
    //setCreatedPdf(pdfDataUri);
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = this._uint8ToBase64(pdfBytes);
    const path = `${RNFS.DocumentDirectoryPath
      }/react-native_signed_combined_${Date.now()}.pdf`;
    console.log('path', path);
    
    try {
      //RNFS.writeFile(path, pdfBase64, 'base64')
      RNFS.writeFile(path, pdfBase64, 'base64')
        .then(success => {
          //setNewPdfPath(path);
          //setNewPdfSaved(true);
          //setPdfBase64(pdfBase64);
          //Update ui
          callback(true, path);
        })
        .catch(err => {
          console.log(err.message);
          callback(false, path);
        });
    } catch (error) {
      console.log('Error saving PDF:', error);
      callback(false, error);
    }


    // RNFS.writeFile(path, pdfBase64, 'base64')
    //   .then(success => {
    //     console.log('Save file in path', path);
    //     //callback(path);

    //     if (typeof callback === 'function') {
    //       //callback(pdfDataUri);
    //       //callback(pdfBytes);
    //        callback(path);
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err.message);
    //   });
    // Call the callback function here

  };

  static signOnPdf = async (filePath, type, signatureBase64, callback) => {
    //pdfEditMode
    //setNewPdfSaved(false);
    //setFilePath(null);
    //setPdfEditMode(false);
    console.log('pdf array: ');
    var contant = await RNFS.readFile(filePath, 'base64');
    var buffer = this._base64ToArrayBuffer(contant);

    //var pdfDoc = await PDFDocument.load(createdPdf);
    var pdfDoc = await PDFDocument.load(buffer);

    var party_A_x_val = 400; //250;
    var party_A_y_val = 700; //930; //

    var party_B_x_val = party_A_x_val;
    var party_B_y_val = party_A_y_val - 200;

    var X_VAL = 0;
    var Y_VAL = 0;
    if (type === 'sender') {
      X_VAL = party_A_x_val;
      Y_VAL = party_A_y_val - 40;
    } else {
      X_VAL = party_B_x_val;
      Y_VAL = party_B_y_val - 40;
    }
    var page = 4;
    console.log('pdf page: ' + page);

    //const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
    const pages = pdfDoc.getPages();

    const firstPage = pages[page - 1];
    // The meat
    // var temp_x = (pageWidth * (x - 12)) / windowWidth; //Dimensions.get('window').width
    // var temp_y = pageHeight - (pageHeight * (y + 12)) / pageHeight - 25;

    // console.log('Put Sign: X= ' + temp_x + ' Y= ' + temp_y);

    const signatureImage = await pdfDoc.embedPng(signatureBase64);
    if (Platform.OS === 'ios') {
      firstPage.drawImage(signatureImage, {
        // x: (pageWidth * (x - 12)) / windowWidth, //Dimensions.get('window').width
        // y: pageHeight - (pageHeight * (y + 12)) / 540, // Pdf view hight
        x: X_VAL,
        y: Y_VAL,
        width: 70,
        height: 70,
      });
    } else {
      firstPage.drawImage(signatureImage, {
        // x: (pageWidth * (x - 12)) / windowWidth, //Dimensions.get('window').width
        // y: pageHeight - (pageHeight * (y + 12)) / firstPage.getHeight(), // Pdf view hight
        x: X_VAL, //(firstPage.getWidth() * x) / pageWidth,
        y: Y_VAL,
        //firstPage.getHeight() - (firstPage.getHeight() * y) / pageHeight - 25,
        width: 70,
        height: 70,
      });
    }
    console.log('pdf array: signed--- ');
    // Play with these values as every project has different requirements
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = this._uint8ToBase64(pdfBytes);
    const path = `${RNFS.DocumentDirectoryPath
      }/react-native_signed_1_${Date.now()}.pdf`;
    console.log('path', path);

  
    try {
      //RNFS.writeFile(path, pdfBase64, 'base64')
      RNFS.writeFile(path, pdfBase64, 'base64')
        .then(success => {
          //setNewPdfPath(path);
          //setNewPdfSaved(true);
          //setPdfBase64(pdfBase64);
          //Update ui
          callback(true, path);
        })
        .catch(err => {
          console.log(err.message);
          callback(false, path);
        });
    } catch (error) {
      console.log('Error saving PDF:', error);
      callback(false, error);
    }

  };

  static putDateOnPdf = async (filePath, type, date, callback) => {
    //pdfEditMode
    //setNewPdfSaved(false);
    //setFilePath(null);
    //setPdfEditMode(false);
    console.log('pdf array: ');
    var contant = await RNFS.readFile(filePath, 'base64');
    var buffer = this._base64ToArrayBuffer(contant);

    //var pdfDoc = await PDFDocument.load(createdPdf);
    var pdfDoc = await PDFDocument.load(buffer);

    var party_A_x_val = 400; //250;
    var party_A_y_val = 700; //930; //

    var party_B_x_val = party_A_x_val;
    var party_B_y_val = party_A_y_val - 200;

    var X_VAL = 0;
    var Y_VAL = 0;
    if (type === 'sender') {
      X_VAL = party_A_x_val;
      Y_VAL = party_A_y_val;
    } else {
      X_VAL = party_B_x_val;
      Y_VAL = party_B_y_val;
    }
    var page = 4;
    console.log('pdf page: ' + page);

    //const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[page - 1];

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    firstPage.setFont(timesRomanFont);
    // The meat
    // var temp_x = (pageWidth * (x - 12)) / windowWidth; //Dimensions.get('window').width
    // var temp_y = pageHeight - (pageHeight * (y + 12)) / pageHeight - 25;

    // console.log('Put Sign: X= ' + temp_x + ' Y= ' + temp_y);

    //const signatureImage = await pdfDoc.embedPng(signatureBase64);
    if (Platform.OS === 'ios') {
      firstPage.drawText('Signed on: ' + date, {
        x: X_VAL,
        y: Y_VAL - 60,
        size: 12,
      });
    } else {
      firstPage.drawText('Signed on: ' + date, {
        x: X_VAL,
        y: Y_VAL - 60,
        size: 12,
      });
    }
    console.log('pdf array: signed--- ');
    // Play with these values as every project has different requirements
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = this._uint8ToBase64(pdfBytes);
    const path = `${RNFS.DocumentDirectoryPath
      }/react-native_signed_1_${Date.now()}.pdf`;
    console.log('path', path);

    try {
      //RNFS.writeFile(path, pdfBase64, 'base64')
      RNFS.writeFile(path, pdfBase64, 'base64')
        .then(success => {
          //setNewPdfPath(path);
          //setNewPdfSaved(true);
          //setPdfBase64(pdfBase64);
          //Update ui
          callback(true, path);
        })
        .catch(err => {
          console.log(err.message);
          callback(false, path);
        });
    } catch (error) {
      console.log('Error saving PDF:', error);
      callback(false, error);
    }
  };
}

export default PdfEditor;
