import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

export default function Spectrums() {
  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          margin: 20,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 20,
            color: '#171717',
          }}>
          --
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: '#171717',
            marginLeft: 20,
          }}>
          Spectrums
        </Text>
      </View>
      <View
        style={{
          marginLeft: 20,
          borderColor: '#d4d4d4',
          marginRight: 20,
          borderWidth: 1,
          borderRadius: 8,
          height: 44,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: 15,
            color: '#171717',
            margin: 10,
          }}>
          Spectrum 1
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: '#171717',
            margin: 10,
          }}>
          D
        </Text>
      </View>

      <View
        style={{
          marginLeft: 20,
          borderColor: '#d4d4d4',
          marginRight: 20,
          marginTop: 12,
          borderWidth: 1,
          borderRadius: 8,
          height: 44,
        }}>
        <Text
          style={{
            fontSize: 15,
            color: '#171717',
            margin: 10,
          }}>
          Spectrum 2
        </Text>
      </View>
    </View>
  );
}

const styles = require('../styles/styles');
