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

export default function Signup({navigation}) {
  const numberOfInputs = 4;
  const [userName, onChangeUserName] = useState('');
  const inputsNewPin = Array.from({length: numberOfInputs}, () => useRef());
  const inputsConfirmPin = Array.from({length: numberOfInputs}, () => useRef());
  const [newPin, setNewPin] = useState(Array(numberOfInputs).fill(''));
  const [confirmPin, setConfirmPin] = useState(Array(numberOfInputs).fill(''));
  const channel_data = [
    {
      channelName: 'Channel 1',
      channelValue: 0,
      isActive: true,
      colorCode: '#fef2f2',
    },
    {
      channelName: 'Channel 2',
      channelValue: 0,
      isActive: true,
      colorCode: '#fffbeb',
    },
    {
      channelName: 'Channel 3',
      channelValue: 0,
      isActive: true,
      colorCode: '#f0fdfa',
    },
    {
      channelName: 'Channe; 4',
      channelValue: 0,
      isActive: true,
      colorCode: '#eff6ff',
    },
  ];

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
    try {
      db.transaction(tx => {
        tx.executeSql('DROP TABLE users;', [], (tx, results) => {
          console.log('Dropped users');
        });
      });
      db.transaction(tx => {
        tx.executeSql('DROP TABLE spectrum_controls;', [], (tx, results) => {
          console.log('Dropped spectrums');
        });
      });
      db.transaction(tx => {
        tx.executeSql('DROP TABLE device_nodes;', [], (tx, results) => {
          console.log('Dropped devices');
        });
      });
      db.transaction(tx => {
        tx.executeSql('DROP TABLE routines;', [], (tx, results) => {
          console.log('Dropped routines');
        });
      });

      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, login_pin TEXT)',
        );
        tx.executeSql('INSERT INTO users (username, login_pin) VALUES (?, ?)', [
          username,
          pin,
        ]);
        console.log('Create and inserted Users');
        tx.executeSql('SELECT * FROM users', [], (tx, results) => {
          console.log('Query completed 3');
          var len = results.rows.length;
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            console.log(`Username: ${row.username}, Pin: ${row.login_pin}`);
          }
        });
      });

      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS device_nodes ( device_id INTEGER PRIMARY KEY AUTOINCREMENT, device_name TEXT, device_serial TEXT, channel_count INTEGER, status INTEGER);',
        );
        console.log('Created device table');

        tx.executeSql(
          'INSERT INTO device_nodes (device_name, device_serial, channel_count, status) VALUES (?, ?,?,?)',
          ['AndroidWifi', 'AndroidWifi', 4, 1],
        );
        console.log('Inserted device table');
      });

      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS spectrum_controls ( spectrum_control_id INTEGER PRIMARY KEY AUTOINCREMENT, channel_data TEXT, lock_ratio INTEGER, spectrum_name TEXT, status INTEGER, device_serial TEXT);',
        );
        console.log('Created spectrum table');
        tx.executeSql(
          'INSERT INTO spectrum_controls (channel_data, lock_ratio, spectrum_name, status) VALUES (?, ?,?,?)',
          [JSON.stringify(channel_data), 0, 'Default Spectrum', 1],
        );
        console.log('Inserted spectrum table');
      });

      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS routines ( routine_id INTEGER PRIMARY KEY AUTOINCREMENT, routine_name TEXT, routine_time TEXT, routine_action INTEGER, spectrum_data TEXT, days_in_week TEXT, device_serial TEXT);',
        );
        console.log('Created routines table');
      });

      // db.transaction(tx => {
      //   tx.executeSql(
      //     'CREATE TABLE IF NOT EXISTS spectrum_controls ( spectrum_control_id INTEGER PRIMARY KEY AUTOINCREMENT, channel_data TEXT, lock_ratio INTEGER, spectrum_name TEXT, status INTEGER);',
      //   );
      //   console.log('Created spectrum table');
      //   tx.executeSql(
      //     'INSERT INTO spectrum_controls (channel_data, lock_ratio, spectrum_name, status) VALUES (?, ?,?,?)',
      //     [JSON.stringify(channel_data), 0, 'Default Spectrum', 1],
      //   );
      //   tx.executeSql('SELECT * FROM spectrum_controls', [], (tx, results) => {
      //     console.log('Query completed 4');
      //     var len = results.rows.length;
      //     for (let i = 0; i < len; i++) {
      //       let row = results.rows.item(i);
      //       console.log(
      //         `Spectrum Name: ${row.spectrum_name}, Lock Ratio: ${row.status}`,
      //       );
      //     }
      //   });
      // });
    } catch (err) {
      console.log('SQL Error: ' + err);
    }
    navigation.navigate('DashboardMain');
  };

  const createSpectrumTable = () => {
    const db = SQLite.openDatabase({
      name: 'iot_dashboard.db',
      location: 'default',
    });
    db.transaction(tx => {
      tx.executeSql('DROP TABLE spectrum_controls;', [], (tx, results) => {
        console.log('Query completed');
      });
    });
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS spectrum_controls ( spectrum_control_id int NOT NULL AUTO_INCREMENT, channel_data varchar(1000), lock_ratio int, spectrum_name varchar(100), );',
      );
      tx.executeSql(
        'INSERT INTO spectrum_controls (channel_data, lock_ratio, spectrum_name) VALUES (?, ?,?)',
        [channel_data, 0, 'Default Spectrum'],
      );
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
