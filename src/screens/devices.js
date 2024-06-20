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
  ScrollView,
  PermissionsAndroid,
  FlatList,
  Platform,
  Linking,
  NativeModules,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {WifiScanner} = NativeModules;

export default function Device({navigation}) {
  const [wifiList, setWifiList] = useState([]);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [connectedSSID, setConnectedSSID] = useState('');
  const [gateway, setGateway] = useState('');

  useEffect(() => {
    checkLocationPermissionAndStartScan();
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

  const checkLocationPermissionAndStartScan = async () => {
    console.log('Scanning WiFi Networks');
    try {
      const locationEnabled = await WifiScanner.isLocationEnabled();
      if (!locationEnabled) {
        Alert.alert(
          'Location Service Required',
          'Please enable Location Service to scan WiFi networks.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                WifiScanner.enableLocationService();
              },
            },
          ],
          {cancelable: false},
        );
        return;
      }

      const wifiEnabled = await WifiScanner.isWifiEnabled();
      console.log('WiFi Enabled:', wifiEnabled);
      if (!wifiEnabled) {
        Alert.alert(
          'WiFi Service Required',
          'Please enable WiFi to scan WiFi networks.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                WifiScanner.enableWifi();
              },
            },
          ],
          {cancelable: false},
        );
        return;
      }

      const result = await WifiScanner.checkAndScanWifiNetworks();
      console.log('Wifi Result: ' + JSON.stringify(result));
      setWifiList(result);
    } catch (error) {
      console.error(error);
    }
  };

  const connectToWifi = async (ssid, password) => {
    try {
      console.log('Connecting to WiFi network:', ssid);
      const connected = await WifiScanner.connectToWifi(ssid, password);
      if (connected) {
        console.log('Connected to WiFi:', ssid);
        // Add your logic here after successful connection
      } else {
        console.log('Failed to connect to WiFi:', ssid);
      }
    } catch (error) {
      console.error('Error connecting to WiFi:', error);
    }
  };

  const openWifiSettings = async () => {
    if (Platform.OS === 'ios') {
      // Check iOS version to use the appropriate method
      const systemVersion = await DeviceInfo.getSystemVersion();
      const majorVersion = parseInt(systemVersion.split('.')[0], 10);

      if (majorVersion >= 11) {
        // Use a more general settings approach
        Linking.openURL('App-Prefs:root=General').catch(() => {
          Alert.alert(
            'Failed to open settings',
            'Unable to open general settings.',
          );
        });
      } else {
        // Use App-Prefs:root=WIFI for older iOS versions
        Linking.openURL('App-Prefs:root=WIFI').catch(() => {
          Alert.alert(
            'Failed to open settings',
            'Unable to open Wi-Fi settings.1',
          );
        });
      }
    } else {
      // Android: Use direct Wi-Fi settings intent
      Linking.openURL(
        'content://com.android.settings/.wifi.WifiSettings',
      ).catch(() => {
        Alert.alert(
          'Failed to open settings',
          'Unable to open Wi-Fi settings.2',
        );
      });
    }
  };
  return (
    // <View style={styles.container}>
    //   <View
    //     style={{
    //       position: 'absolute',
    //       bottom: 0,
    //       width: '100%',
    //       backgroundColor: '#86efac',
    //       height: 20,
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //       flexDirection: 'row',
    //     }}>
    //     <Icon name="wifi" size={16} color="black" />
    //     <Text style={{color: 'black', marginLeft: 8}}>
    //       Connected to - {connectedSSID}
    //     </Text>
    //   </View>
    //   <View style={{margin: 20, marginTop: 50}}>
    //     <Text style={{color: 'black'}}>
    //       Connected WiFi SSID: {connectedSSID}
    //     </Text>
    //     <Text style={{color: 'black'}}>Gateway IP: {gateway}</Text>

    //     <ScrollView>
    //       {wifiList.length > 0 ? (
    //         wifiList.map((wifi, index) => (
    //           <View key={index} style={{marginBottom: 10}}>
    //             <Text style={{color: 'black'}}>SSID: {wifi.SSID}</Text>
    //             <Text style={{color: 'black'}}>BSSID: {wifi.BSSID}</Text>
    //             <Text style={{color: 'black'}}>
    //               Signal Strength: {wifi.level}
    //             </Text>
    //             <Button
    //               title="Connect"
    //               onPress={() => connectToWifi(wifi.SSID, 'arun1234')}
    //             />
    //           </View>
    //         ))
    //       ) : (
    //         <Text style={{color: 'black'}}>No WiFi networks found</Text>
    //       )}
    //     </ScrollView>
    //   </View>
    // </View>

    <View style={styles.container}>
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
        <Icon name="wifi" size={16} color="black" />
        <Text style={{color: 'black', marginLeft: 8}}>
          Connected to - {connectedSSID}
        </Text>
      </View>
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
          Devices
        </Text>
      </View>
      <ScrollView>
        {wifiList.length > 0 ? (
          wifiList.map((wifi, index) => (
            <View
              key={index}
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
                {wifi.SSID}
              </Text>
              <AntDesign
                name="delete"
                size={16}
                style={{
                  color: '#171717',
                  margin: 12,
                }}
              />
            </View>
          ))
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: 'black',
              }}>
              Scanning for WiFi Devices
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={{marginTop: 50}}>
        <Button title="Open Wi-Fi Settings" onPress={openWifiSettings} />
      </View>
    </View>
  );
}

const styles = require('../styles/styles');
