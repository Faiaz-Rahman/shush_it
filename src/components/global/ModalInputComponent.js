import React, {Component} from 'react';
import {Modal, View, TextInput, Button, StyleSheet} from 'react-native';

class ModalInput extends Component {
  render() {
    const {onTextChange, onSubmit, visible, value, toggle} = this.props;

    return (
      <Modal visible={visible} transparent={true} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            value={value}
            onChangeText={onTextChange}
            placeholder={'Enter text'}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button title="close" onPress={toggle} />
            <Button title="ok" onPress={onSubmit} />
          </View>
        </View>
      </Modal>
    );
  }
}

export default ModalInput;
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: 100,
    padding: 20,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});
