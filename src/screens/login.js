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

export default function Login() {
  const numberOfInputs = 4;
  const inputs = Array.from(
    {
      length: numberOfInputs,
    },
    () => useRef(),
  );
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
      <Button title="Get All Values" onPress={handleGetAllValues} />
    </View>
  );
}

const styles = require('../styles/styles');
