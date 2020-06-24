import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, Linking, Alert} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Axios from 'axios';

import email from 'react-native-email';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default function Upload() {

  ifScaned = e => {
    Linking.openURL(e.data).catch(err => {
      Alert.alert("QRCode invalido!", e.data);
    })
  }

  const [avatar, setAvatar] = useState();

  const imagePickerOptions = {
    title: 'Selecione uma imagem',
    customButtons: [
      {
        name: 'fb',
        title: 'Selecione uma imagem do facebook',
      },
      {
        name: 'ig',
        title: 'Selecione uma imagem do instagram',
      },
    ],
  };

  function imagePickerCallback(data) {
    if (data.didCancel) {
      return;
    }

    if (data.error) {
      return;
    }

    if (data.customButton) {
      return;
    }

    if (!data.uri) {
      return;
    }

    setAvatar(data);
  }

  async function uploadImage() {
    const data = new FormData();

    data.append('avatar', {
      fileName: avatar.fileName,
      uri: avatar.uri,
      type: avatar.type,
    });

    await Axios.post('http://localhost:3333/files', data);
  }

  handleEmail = () => {
    const to = ['Enviar para quem ?',]
    email(to, {
        subject: 'Teste Envio email',
        body: 'Escreva algo aqui!'
    }).catch(console.error)
  }

  return (
    <View style={styles.container}>
      <View style = {styles.view}>
        {<Image
          source={{
            uri: avatar
              ? avatar.uri
              : 'https://mltmpgeox6sf.i.optimole.com/w:761/h:720/q:auto/https://redbanksmilesnj.com/wp-content/uploads/2015/11/man-avatar-placeholder.png',
          }}
          style={styles.avatar}
        />}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            ImagePicker.showImagePicker(imagePickerOptions, imagePickerCallback)
          }>
          <Text style={styles.buttonText}>Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Text style={styles.buttonText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Text style={styles.buttonText}>Maps</Text>
        </TouchableOpacity>
      </View>
      <QRCodeScanner
        containerStyle = {{backgroundColor: "#FFF"}}
        onRead={this.ifScaned}
        reactivate = {true}
        permissionDialogMessage = "Permissão para acessar a camera"
        reactivateTimeout = {10}
        showMarker = {true}
        markerStyle = {{borderColor: "#FFF", borderRadius: 10}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 60,
    height: 50,
    borderRadius: 3,
    backgroundColor: '#7159c1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    width: 50,
    height: 50,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
