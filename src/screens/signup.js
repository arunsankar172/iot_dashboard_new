import React, {useState, useRef} from 'react';
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
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';

export default function Signup() {
  const numberOfInputs = 4;
  const [userName, onChangeUserName] = useState('');
  const inputsNewPin = Array.from({length: numberOfInputs}, () => useRef());
  const inputsConfirmPin = Array.from({length: numberOfInputs}, () => useRef());
  const [newPin, setNewPin] = useState(Array(numberOfInputs).fill(''));
  const [confirmPin, setConfirmPin] = useState(Array(numberOfInputs).fill(''));

  const handleChangeNewPin = (text, index) => {
    const newInputValues = [...newPin];
    newInputValues[index] = text;
    setNewPin(newInputValues);

    if (text.length === 0 && index > 0) {
      // Clear the current input box
      newInputValues[index] = '';
      setNewPin(newInputValues);

      // Focus on the previous input box
      inputsNewPin[index - 1].current.focus();
    } else if (text.length === 1 && index < numberOfInputs - 1) {
      inputsNewPin[index + 1].current.focus();
    }
  };

  const handleChangeConfirmPin = (text, index) => {
    const newInputValues = [...confirmPin];
    newInputValues[index] = text;
    setConfirmPin(newInputValues);

    if (text.length === 0 && index > 0) {
      // Clear the current input box
      newInputValues[index] = '';
      setConfirmPin(newInputValues);

      // Focus on the previous input box
      inputsConfirmPin[index - 1].current.focus();
    } else if (text.length === 1 && index < numberOfInputs - 1) {
      inputsConfirmPin[index + 1].current.focus();
    }
  };

  const handleGetConfirmPin = () => {
    if (userName !== '' && userName.length < 10) {
      if (newPin.join('').length == 4 && confirmPin.join('').length == 4) {
        if (newPin.join('') === confirmPin.join('')) {
          Alert.alert('Valid PIN ', confirmPin.join(''));
          createUserAccount(userName, confirmPin.join(''));
        } else {
          Alert.alert('Pin does not match!');
        }
      } else {
        Alert.alert('Please enter valid PIN to continue');
      }
    } else {
      Alert.alert('Please enter valid UserName with 10 characters');
    }
  };

  const createUserAccount = (username, pin) => {
    const db = SQLite.openDatabase({
      name: 'iot_dashboard.db',
      location: 'default',
    });
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, login_pin TEXT)',
      );
      tx.executeSql('INSERT INTO users (username, login_pin) VALUES (?, ?)', [
        username,
        pin,
      ]);
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM users', [], (tx, results) => {
        console.log('Query completed');

        // Get rows with Web SQL Database spec compliance.

        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`Username: ${row.username}, Pin: ${row.login_pin}`);
        }
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginRocket}>
        <Image
          source={require('../../assets/img/login_rocket.png')}
          style={{
            width: 160,
            height: 160,
          }}
        />
      </View>
      <Text style={styles.mainTextStyle}>Signup and set PIN</Text>
      <Text style={styles.loginDescription}>
        Please enter a UserName and create the six digit pin
      </Text>
      <TextInput
        style={{
          height: 40,
          marginLeft: 40,
          marginRight: 40,
          borderWidth: 1,
          margin: 12,
          padding: 10,
          borderRadius: 5,
        }}
        onChangeText={onChangeUserName}
        value={userName}
        placeholder="Username"
        // keyboardType="text"
      />

      <Text
        style={{
          marginTop: 0,
          fontSize: 12,
          textAlign: 'center',
          color: '#737373',
        }}>
        New PIN:
      </Text>
      <View
        style={{
          marginTop: 5,
          // flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {inputsNewPin.map((inputRef, index) => (
          <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={text => handleChangeNewPin(text, index)}
            ref={inputRef}
            value={newPin[index]}
          />
        ))}
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 12,
          textAlign: 'center',
          color: '#737373',
        }}>
        Confirm PIN:
      </Text>

      <View
        style={{
          marginTop: 5,
          // flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {inputsConfirmPin.map((inputRef, index) => (
          <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={text => handleChangeConfirmPin(text, index)}
            ref={inputRef}
            value={confirmPin[index]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={{
          marginTop: 100,
          margin: 100,
          padding: 10,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#22c55e',
        }}
        onPress={handleGetConfirmPin}>
        <Text style={{textAlign: 'center', color: '#22c55e'}}>
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = require('../styles/styles');
