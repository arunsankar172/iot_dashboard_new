import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ToastAndroid,
  Button,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function Splash() {
  const navigation = useNavigation();
  setTimeout(() => {
    navigation.navigate('Login');
  }, 1500);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/img/splash_background.png')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.mainLogo}>
          <Image
            source={require('../../assets/img/fluortronix-logo.png')}
            style={{
              width: 244,
              height: 157,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
        <Text style={styles.mainTextStyle}>Welcome</Text>
      </ImageBackground>
    </View>
  );
}

const styles = require('../styles/styles');
