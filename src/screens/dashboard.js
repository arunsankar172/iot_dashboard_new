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
  Modal,
  Pressable,
  Switch,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableHighlight,
  NativeModules,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
// import Ionicons from "@expo/vector-icons/Ionicons";
// import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Dropdown} from 'react-native-element-dropdown';
// const Slider = require('react-native-slider');
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import SQLite from 'react-native-sqlite-storage';

const {WifiScanner} = NativeModules;

import {updateChannel, updateSchedules} from '../service/service_handler';
import DashboardMain from '../navigation/dashboard_main';
import Device from './devices';

const data1 = [
  {
    spectrumName: 'Spectrum 1',
    spectrumId: '1',
  },
  {
    spectrumName: 'Spectrum 2',
    spectrumId: '2',
  },
  {
    spectrumName: 'Spectrum 3',
    spectrumId: '3',
  },
  {
    spectrumName: 'Spectrum 4',
    spectrumId: '4',
  },
  {
    spectrumName: 'Spectrum 5',
    spectrumId: '5',
  },
];

const spectrum_data = [
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
  {
    channelName: 'Channel 5',
    channelValue: 0,
    isActive: true,
    colorCode: '#faf5ff',
  },
  {
    channelName: 'Channel 6',
    channelValue: 0,
    isActive: false,
    colorCode: '#fff1f2',
  },
];

const Popup = ({visible, title, onClose, children}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={20} color="#737373" />
              </TouchableOpacity>
            </View>
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const ColorPicker = ({selectedColor, onSelectColor}) => {
  const colors = [
    '#e11d48',
    '#c026d3',
    '#7c3aed',
    '#2563eb',
    '#16a34a',
    '#ca8a04',
  ];

  return (
    <View style={styles.colorContainer}>
      <Text style={styles.title}>Select a color:</Text>
      <View style={styles.colorPicker}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorCircle, {backgroundColor: color}]}
            onPress={() => onSelectColor(color)}>
            {selectedColor === color && (
              <Icon name="check" size={16} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function Dashboard({navigation}) {
  const roomCount = 10;
  const rooms = Array.from(
    {
      length: roomCount,
    },
    () => useRef(),
  );
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [sliderValue, setSliderValue] = useState(10);
  const [SaveSpectrumModalVisible, setSaveSpectrumModalVisible] =
    useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [settingsModaVisible, setSettingsModalVisible] = useState(false);
  const [saveMmodalVisible, setSaveModalVisible] = useState(false);
  const [spectrumSaveDisabled, setSpectrumSaveDisabled] = useState(true);
  const [spectrum, setSpectrum] = useState([]);
  const [spectrumControlActive, setSpectrumControlActive] = useState({});
  const [spectrumControlList, setSpectrumControlList] = useState([]);
  const [lockRatio, setLockRatio] = useState(false);
  const [editedChannelName, setEditedChannelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [newSpectrumName, setNewSpectrumname] = useState('');

  const [wifiList, setWifiList] = useState([]);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [connectedSSID, setConnectedSSID] = useState('');
  const [gateway, setGateway] = useState('');
  const [isRatioEnabled, setIsRatioEnabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const db = SQLite.openDatabase({
    name: 'iot_dashboard.db',
    location: 'default',
  });

  useEffect(() => {
    getAndSetSpectrum();
    navigation.dispatch(DashboardMain);
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.type === 'wifi' && state.isConnected) {
        setConnectedSSID(state.details.ssid);
        setIsDisabled(false);
        console.log('Wifi Connected');
        // Logic to check SSID patten in wifi name
        // call esp to get name and channel data
        if (connectedSSID == 'AndroidWifi') {
          console.log('ESP connectedd');
          const espData = {
            deviceName: 'AndroidWifi', //ssid extracted
            channelCount: 4,
          };
          // getSpectrumOrCreateTables(espData);
        }
        // WifiScanner.getGatewayIPAddress()
        //   .then(ip => {
        //     setGateway(ip);
        //   })
        //   .catch(error => {
        //     console.error('Error getting gateway IP address:', error);
        //     setIsDisabled(true);
        //   });
      } else {
        setConnectedSSID('');
        setIsDisabled(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getSpectrumOrCreateTables = espData => {
    db.transaction(async tx => {
      var isDeviceExists = false;
      await tx.executeSql(
        'SELECT * FROM device_nodes WHERE device_name =?',
        [espData.deviceName],
        (tx, results) => {
          console.log('check device nodes');
          var len = results.rows.length;
          if (length == 0) {
            console.log('Device Not found');
            isDeviceExists = false;
            // create device and spectrum
            createSpectrum(espData);
            // console.log('created spectrum');
          } else {
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(
                `Device Name: ${row.device_name}, Serial: ${row.device_serial}`,
              );
              if (row.device_serial == 'AndroidWifi') {
                console.log('Found device');
                getAndSetSpectrum(espData.deviceName);
                break;
              }
            }
          }
        },
        error => {
          console.error('Error retrieving data:', error);
          isDeviceExists = false;
          // setIsDisabled(true);
        },
      );
      // tx.executeSql(
      //   'CREATE TABLE IF NOT EXISTS device_nodes ( device_id INTEGER PRIMARY KEY AUTOINCREMENT, device_name TEXT, device_serial TEXT, channel_count INTEGER, status INTEGER);',
      // );
      // console.log('Created device table');
      // const device_serial = connectedSSID;
      // //do additional proocess to check device serial
      // tx.executeSql(
      //   'INSERT INTO device_nodes (device_name, device_serial, channel_count, status) VALUES (?, ?,?,?)',
      //   [device_serial, device_serial, 0, 3],
      // );
      // console.log('Inserted device table');

      // tx.executeSql(
      //   'SELECT * FROM device_nodes',
      //   [],
      //   (tx, results) => {
      //     console.log('check device nodes');
      //     var len = results.rows.length;
      //     for (let i = 0; i < len; i++) {
      //       let row = results.rows.item(i);
      //       console.log(
      //         `Device Name: ${row.device_name}, Serial: ${row.device_serial}`,
      //       );
      //       if (row.device_serial == 'AndroidWifi') {
      //         console.log('Found device');
      //         isDeviceExists = true;
      //         break;
      //       }
      //     }
      //   },
      //   error => {
      //     console.error('Error retrieving data1:', error);
      //     isDeviceExists = false;
      //     // setIsDisabled(true);
      //   },
      // );
      // tx.executeSql(
      //   'CREATE TABLE IF NOT EXISTS spectrum_controls ( spectrum_control_id INTEGER PRIMARY KEY AUTOINCREMENT, channel_data TEXT, lock_ratio INTEGER, spectrum_name TEXT, status INTEGER);',
      // );
      // console.log('Created spectrum table');
      // tx.executeSql(
      //   'INSERT INTO spectrum_controls (channel_data, lock_ratio, spectrum_name, status) VALUES (?, ?,?,?)',
      //   [JSON.stringify(channel_data), 0, 'Default Spectrum', 1],
      // );
      // tx.executeSql('SELECT * FROM spectrum_controls', [], (tx, results) => {
      //   console.log('Query completed 4');
      //   var len = results.rows.length;
      //   for (let i = 0; i < len; i++) {
      //     let row = results.rows.item(i);
      //     console.log(
      //       `Spectrum Name: ${row.spectrum_name}, Lock Ratio: ${row.status}`,
      //     );
      //   }
      // });
    });
  };

  const createSpectrum = espData => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS spectrum_controls ( spectrum_control_id INTEGER PRIMARY KEY AUTOINCREMENT, channel_data TEXT, lock_ratio INTEGER, spectrum_name TEXT, device_serial TEXT,status INTEGER);',
      );
      console.log('Created spectrum table');
      tx.executeSql(
        'INSERT INTO spectrum_controls (channel_data, lock_ratio, spectrum_name, status) VALUES (?, ?,?,?)',
        [
          JSON.stringify(channel_data),
          0,
          'Default Spectrum',
          espData.deviceName,
          1,
        ],
      );
    });
  };

  const getAndSetSpectrum = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM spectrum_controls WHERE status=1',
        [],
        (tx, results) => {
          console.log('Query completed 4');
          var len = results.rows.length;
          console.log(
            'DB Channel Data : ' +
              results.rows.item(0).channel_data +
              ' Spectrum Id: ' +
              results.rows.item(0).spectrum_control_id,
          );
          setSpectrumControlActive(results.rows.item(0));
          setSpectrum(JSON.parse(results.rows.item(0).channel_data));
          setLockRatio(results.rows.item(0).lock_ratio == 1 ? true : false);
        },
      );
      tx.executeSql('SELECT * FROM spectrum_controls;', [], (tx, results) => {
        console.log('Query completed 4');
        var len = results.rows.length;
        const spectrum_list = [];
        for (let i = 0; i < len; i++) {
          spectrum_list.push(results.rows.item(i));
        }
        setSpectrumControlList(spectrum_list);
      });
    });
  };

  const changeSliderState = (event, index) => {
    console.log('Channel toggle clicked for channel #' + (index + 1));
    setSpectrumSaveDisabled(false);
    // handleSaveAlert();
    setSpectrum(prevValues => {
      const newValues = [...prevValues];
      newValues[index].isActive = !newValues[index].isActive;
      newValues[index].channelValue = 1;
      return newValues;
    });
  };

  const handleSliderChange = (e, index) => {
    setSpectrumSaveDisabled(false);
    // handleSaveAlert();
    if (lockRatio) {
      const ratios = spectrum.map((value, indexChange) =>
        value.isActive
          ? indexChange === index
            ? 1
            : value.channelValue == 0
            ? 1
            : value.channelValue / spectrum[index].channelValue || 1
          : value.channelValue,
      );
      console.log('Ratio: ' + ratios);
      setSpectrum(
        spectrum.map((value, index) => {
          if (value.isActive) {
            value.channelValue = parseFloat(e) * ratios[index];
            console.log('values:' + value);
            return value;
          } else {
            console.log('values:' + value);
            return value;
          }
        }),
      );
    } else {
      const newValue = parseFloat(e);
      setSpectrum(prevValues => {
        console.log(...prevValues);
        const newValues = [...prevValues];
        newValues[index].channelValue = newValue;
        return newValues;
      });
    }
  };

  const editLableName = (event, index) => {
    setOpenEditName(!openEditName);
    const edit_lable = {
      index: index,
      channelName: spectrum[index].channelName,
    };
    setEditedChannelName(spectrum[index].channelName);
    setLableData(edit_lable);
  };

  const handleEditSave = (event, index) => {
    setSpectrum(prevValues => {
      const newValues = [...prevValues];
      newValues[lableData.index].channelName = editedChannelName;
      return newValues;
    });
  };

  const handleColorSelect = color => {
    setSelectedColor(color);
  };

  const saveSpectrumUpdate = () => {
    console.log('save clicked id:' + spectrumControlActive.spectrum_control_id);

    const scheduleData = [
      {
        spectrumName: 'Spectrum1',
        channelData: [1, 1, 1, 1, 1, 1],
        start: [10, 20],
        end: [11, 20],
        days: [1, 1, 0, 1, 1, 1, 1],
        action: 'ON',
      },
      {
        spectrumName: 'Spectrum2',
        channelData: [0, 0, 0, 0, 0, 0],
        start: '12:20',
        end: '13:20',
        days: [1, 1, 0, 1, 1, 1, 1],
        action: 'OFF',
      },
    ];
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE spectrum_controls SET status=0;;',
        [],
        (tx, results) => {
          console.log('Query completed 7');
        },
      );
      tx.executeSql(
        'UPDATE spectrum_controls SET channel_data=?, lock_ratio=?, status=1 WHERE spectrum_control_id=?;',
        [
          JSON.stringify(spectrum),
          lockRatio,
          spectrumControlActive.spectrum_control_id,
        ],
        (tx, results) => {
          console.log('Query completed 7');
          setSpectrumSaveDisabled(true);
        },
      );
    });
    // updateSchedules(scheduleData)
    //   .then(function (response) {
    //     console.log('response');
    //     console.log('update spectrum' + response.data.code);
    //   })
    //   .catch(error => {
    //     console.log('service-error', error);
    //   });
    // axios
    //   .get('http://192.168.4.1/iot/channel')
    //   .then(response => {
    //     console.log(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching data: ', error);
    //   });
  };

  const cancelSaveSpectrum = () => {
    console.log('cancel Save New spectrum');
    setSaveSpectrumModalVisible(false);
    setNewSpectrumname('');
  };

  const confirmSaveSpectrum = () => {
    console.log('Save New Spectrum confirm - ' + newSpectrumName);

    db.transaction(tx => {
      tx.executeSql(
        'UPDATE spectrum_controls SET status=0;;',
        [],
        (tx, results) => {
          console.log('Query completed 7');
        },
      );
      tx.executeSql(
        'INSERT INTO spectrum_controls (channel_data, lock_ratio, spectrum_name, status) VALUES (?, ?,?,?)',
        [JSON.stringify(spectrum), 0, newSpectrumName, 1],
      );
      tx.executeSql('SELECT * FROM spectrum_controls', [], (tx, results) => {
        console.log('Query completed 4');
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(
            `Spectrum Name: ${row.spectrum_name}, Lock Ratio: ${row.status}`,
          );
        }
      });
    });
    getAndSetSpectrum();
    setSaveSpectrumModalVisible(false);
    setNewSpectrumname('');
  };

  const cancelSaveEditChannel = () => {
    console.log('cancel Save edit channel');
    setNameModalVisible(false);
  };

  const confirmSaveEditChannel = () => {
    console.log('edit channel name save confirm');
    setNameModalVisible(false);
  };

  const cancelSaveSettings = () => {
    console.log('cancel Save settings');
    setSettingsModalVisible(false);
  };

  const confirmSaveSettings = () => {
    console.log(
      'confirm settings ' + spectrumControlActive.spectrum_control_id,
    );
    const lock_ratio = isRatioEnabled ? 1 : 0;
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE spectrum_controls SET lock_ratio=? WHERE spectrum_control_id=?;',
        [lockRatio, spectrumControlActive.spectrum_control_id],
        (tx, results) => {
          console.log('Query completed 6');
        },
      );
    });
    setSettingsModalVisible(false);
  };

  const spectrumDropDownChange = item => {
    console.log('Spectrum Dropdown Change  ' + JSON.stringify(item));
    setSpectrumSaveDisabled(false);
    setSpectrumControlActive(item);
    setSpectrum(JSON.parse(item.channel_data));
    setLockRatio(item.lock_ratio == 1 ? true : false);
    setIsFocus(false);
  };

  const toggleSwitch = () => {
    setSpectrumSaveDisabled(!spectrumSaveDisabled);
    setLockRatio(previousState => !previousState);
  };

  const changeSliderStateCompleted = () => {
    console.log('slided-change-completed');
  };

  return (
    <View
      style={[
        styles.container,
        isDisabled && {backgroundColor: 'rgba(0, 0, 0, 0.3)'},
      ]}>
      <View
        style={{
          backgroundColor: '#f5f5f5',
          flex: 1,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}>
        <Text
          style={{
            fontSize: 12,
            color: '#171717',
            marginLeft: 20,
            marginTop: 32,
          }}>
          Welcome back👋
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: '#171717',
            marginLeft: 20,
            marginTop: 0,
          }}>
          Arun Arun
        </Text>
        <View
          style={{
            marginTop: -30,
            margin: 20,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </View>
      </View>

      {/* Main View */}
      <View
        style={{
          flex: 6,
          backgroundColor: '#FFFFFF',
        }}>
        <View
          style={{
            margin: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: '#171717',
            }}>
            Spectrum
          </Text>

          <View
            style={{
              width: '50%',
              marginTop: -5,
              // flexDirection: 'row',
            }}>
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              // iconStyle={styles.iconStyle}
              data={spectrumControlList}
              maxHeight={200}
              labelField="spectrum_name"
              valueField="spectrum_control_id"
              placeholder={!isFocus ? 'Select Spectrum' : 'Select Spectrumm'}
              value={spectrumControlActive.spectrum_control_id}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => spectrumDropDownChange(item)}
            />
          </View>

          <Pressable
            style={{marginTop: 7, marginLeft: -15}}
            onPress={() => setSaveSpectrumModalVisible(true)}>
            <MaterialCommunityIcons
              name="content-save-cog-outline"
              size={20}
              color="#171717"
            />
          </Pressable>
          <Pressable
            style={{marginTop: 7, marginLeft: -15}}
            onPress={() => setSettingsModalVisible(true)}>
            <Ionicons name="settings-outline" size={20} color="#171717" />
          </Pressable>
        </View>

        <Popup
          visible={nameModalVisible}
          title="Edit Channel"
          onClose={() => setNameModalVisible(false)}>
          <Text style={{fontSize: 14}}>Edit Spectrum channel Name</Text>
          <TextInput
            style={{
              height: 30,
              borderRadius: 4,
              // margin: 5,
              marginTop: 5,
              marginRight: 5,
              fontSize: 18,
              borderWidth: 1,
              padding: 6,
            }}
            // onChangeText={onChangeText}
            // value={text}
          />
          <ColorPicker
            selectedColor={selectedColor}
            onSelectColor={handleColorSelect}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 10,
            }}>
            <TouchableOpacity onPress={cancelSaveEditChannel}>
              <Text style={{color: '#ef4444', marginLeft: 10}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmSaveEditChannel}>
              <Text style={{color: '#0ea5e9', marginLeft: 10}}>Save</Text>
            </TouchableOpacity>
          </View>
        </Popup>

        <Popup
          visible={SaveSpectrumModalVisible}
          title="Save Spectrum"
          onClose={() => setSaveSpectrumModalVisible(false)}>
          <Text>Enter new spectrum name</Text>
          <TextInput
            placeholder="New Spectrum Name"
            style={{
              height: 30,
              borderRadius: 4,
              marginTop: 5,
              marginBottom: 5,
              fontSize: 14,
              borderWidth: 1,
              padding: 6,
            }}
            onChangeText={setNewSpectrumname}
            value={newSpectrumName}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 10,
            }}>
            <TouchableOpacity onPress={cancelSaveSpectrum}>
              <Text style={{color: '#ef4444', marginLeft: 10}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmSaveSpectrum}>
              <Text style={{color: '#0ea5e9', marginLeft: 10}}>Save</Text>
            </TouchableOpacity>
          </View>
        </Popup>

        <Popup
          visible={settingsModaVisible}
          title="Spectrum Settings"
          onClose={() => setSettingsModalVisible(false)}>
          <Text>Enable/Disable Lock ratio</Text>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Switch onValueChange={toggleSwitch} value={lockRatio} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 10,
            }}>
            <TouchableOpacity onPress={cancelSaveSettings}>
              <Text style={{color: '#ef4444', marginLeft: 10}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmSaveSettings}>
              <Text style={{color: '#0ea5e9', marginLeft: 10}}>Save</Text>
            </TouchableOpacity>
          </View>
        </Popup>

        <ScrollView>
          {spectrum.map((channel, index) => (
            <View
              key={index}
              style={{
                marginLeft: 20,
                borderColor:
                  channel.colorCode == '' ? '#d4d4d4' : channel.colorCode,
                marginRight: 20,
                marginBottom: 12,
                borderWidth: 1,
                borderRadius: 8,
                backgroundColor: channel.colorCode,
                height: 74,
                flexDirection: 'colmun',
                ...Platform.select({
                  ios: {
                    shadowColor: 'black',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.4,
                    shadowRadius: 2,
                  },
                  android: {
                    elevation: 3,
                  },
                }),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#171717',
                      margin: 10,
                    }}>
                    {channel.channelName}
                  </Text>
                  <Pressable onPress={() => setNameModalVisible(true)}>
                    <Icon
                      style={{
                        // margin: 10,
                        marginLeft: 0,
                        marginTop: 13,
                      }}
                      name="edit"
                      size={15}
                      color="#a3a3a3"
                    />
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Switch
                    style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
                    onValueChange={e => changeSliderState(e, index)}
                    value={channel.isActive}
                  />
                  {/* <Pressable onPress={() => setSettingsModalVisible(true)}>
                    <MaterialIcons
                      style={{
                        marginTop: 12,
                        marginRight: 10,
                      }}
                      name="delete-outline"
                      size={16}
                      color="#dc2626"
                    />
                  </Pressable> */}
                </View>
              </View>
              <Slider
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="blue"
                maximumTrackTintColor="grey"
                thumbTintColor="blue"
                onValueChange={e => handleSliderChange(e, index)}
                onTouchEndCapture={changeSliderStateCompleted}
                value={
                  typeof channel.channelValue === 'number'
                    ? channel.channelValue >= 100
                      ? 100
                      : Math.round(channel.channelValue)
                    : 0
                }
                trackStyle={{
                  height: 10, // Height of the track
                  borderRadius: 5,
                }}
              />
            </View>
          ))}
          <View style={{height: 60}}></View>
        </ScrollView>

        <TouchableOpacity
          disabled={spectrumSaveDisabled}
          style={
            !spectrumSaveDisabled ? styles.fabButton : styles.fabButtonDisabled
          }
          onPress={() => saveSpectrumUpdate()}>
          <Ionicons
            // style={{marginRight: 10}}
            name="save"
            size={22}
            color="#404040"
          />
        </TouchableOpacity>

        {isDisabled && (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button
              style={{borderRadius: 20}}
              title=" Connect to Device "
              onPress={() => navigation.navigate('Devices')}
            />
          </View>
        )}
      </View>

      {!isDisabled && (
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
      )}

      {isDisabled && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: '#ef4444',
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <MaterialCommunityIcons name="wifi" size={16} color="black" />
          <Text style={{color: 'black', marginLeft: 8}}>Disconnected</Text>
        </View>
      )}
    </View>
  );
}

const styles = require('../styles/styles');
