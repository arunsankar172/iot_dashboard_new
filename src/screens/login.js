import React, {useState, useRef, useEffect} from 'react';
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

export default function Login({navigation}) {
  const numberOfInputs = 4;
  const inputs = Array.from(
    {
      length: numberOfInputs,
    },
    () => useRef(),
  );

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const db = SQLite.openDatabase({
      name: 'iot_dashboard.db',
      location: 'default',
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM users', [], (tx, results) => {
        console.log('Query completed 3');
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          setUserData(row);
          console.log(`Username: ${row.username}, Pin: ${row.login_pin}`);
        }
      });
    });
  }, []);

  const [inputValues, setInputValues] = useState(
    Array(numberOfInputs).fill(''),
  );

  const handleChangeText = (text, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = text;
    setInputValues(newInputValues);

    if (text.length === 0 && index > 0) {
      // Clear the current input box
      newInputValues[index] = '';
      setInputValues(newInputValues);

      // Focus on the previous input box
      inputs[index - 1].current.focus();
    } else if (text.length === 1 && index < numberOfInputs - 1) {
      inputs[index + 1].current.focus();
    }
  };

  const handleGetAllValues = () => {
    Alert.alert('All Input Values', inputValues.join(''));
  };

  const handleLoginConfirm = () => {
    console.log('UserData: ' + JSON.stringify(userData));
    if (inputValues.join('').length == 4) {
      if (inputValues.join('') === userData.login_pin) {
        setInputValues([]);
        Alert.alert('Authentication Success ', inputValues.join(''));
        navigation.navigate('DashboardMain');
      } else {
        Alert.alert('Pin does not match! ', inputValues.join(''));
      }
    } else {
      Alert.alert('Please enter valid PIN to continue');
    }
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
      <Text style={styles.mainTextStyle}> Login to Continue </Text>
      <Text style={styles.loginDescription}>
        Please enter the six digit pin to login or use Biometric authentication
      </Text>
      <View
        style={{
          marginTop: 60,
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        {inputs.map((inputRef, index) => (
          <TextInput
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={text => handleChangeText(text, index)}
            ref={inputRef}
            value={inputValues[index]}
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
        onPress={handleLoginConfirm}>
        <Text style={{textAlign: 'center', color: '#22c55e'}}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = require('../styles/styles');
