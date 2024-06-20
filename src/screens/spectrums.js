import React, {useEffect, useState} from 'react';
import {Text, View, NativeModules, TouchableOpacity} from 'react-native';

import NetInfo from '@react-native-community/netinfo';
const {WifiScanner} = NativeModules;

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SQLite from 'react-native-sqlite-storage';

export default function Spectrums({navigation}) {
  const [connectedSSID, setConnectedSSID] = useState('');
  const [spectrumControlList, setSpectrumControlList] = useState([]);

  const db = SQLite.openDatabase({
    name: 'iot_dashboard.db',
    location: 'default',
  });

  useEffect(() => {
    getAndSetSpectrum();
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.type === 'wifi' && state.isConnected) {
        setConnectedSSID(state.details.ssid);
        WifiScanner.getGatewayIPAddress()
          .then(ip => {
            setGateway(ip);
          })
          .catch(error => {
            console.error('Error getting gateway IP address:', error);
          });
      } else {
        setConnectedSSID('');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getAndSetSpectrum = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM spectrum_controls;', [], (tx, results) => {
        console.log('Spectrum List complete');
        var len = results.rows.length;
        const spectrum_list = [];
        for (let i = 0; i < len; i++) {
          spectrum_list.push(results.rows.item(i));
        }
        setSpectrumControlList(spectrum_list);
      });
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          margin: 20,
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="arrowleft"
            size={16}
            style={{
              fontSize: 22,
              color: '#171717',
              marginTop: 3,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            color: '#171717',
            marginLeft: 20,
          }}>
          Spectrums
        </Text>
      </View>
      {spectrumControlList.map((spectrum, index) => (
        <View
          key={index}
          style={{
            marginLeft: 20,
            borderColor: '#d4d4d4',
            marginRight: 20,
            borderWidth: 1,
            borderRadius: 8,
            marginTop: 10,
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
            {spectrum.spectrum_name}
          </Text>
          {spectrum.spectrum_name != 'Default Spectrum' && (
            <AntDesign
              name="delete"
              size={16}
              style={{
                color: '#171717',
                margin: 12,
              }}
            />
          )}
        </View>
      ))}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          backgroundColor: '#86efac',
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <MaterialCommunityIcons name="wifi" size={16} color="black" />
        <Text style={{color: 'black', marginLeft: 8}}>
          Connected to - {connectedSSID}
        </Text>
      </View>
    </View>
  );
}

const styles = require('../styles/styles');
