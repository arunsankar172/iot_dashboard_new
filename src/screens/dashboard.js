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

const {WifiScanner} = NativeModules;

import {updateChannel, updateSchedules} from '../service/service_handler';

const data = [
  {
    label: 'Item 1',
    value: '1',
  },
  {
    label: 'Item 2',
    value: '2',
  },
  {
    label: 'Item 3',
    value: '3',
  },
  {
    label: 'Item 4',
    value: '4',
  },
  {
    label: 'Item 5',
    value: '5',
  },
  {
    label: 'Item 6',
    value: '6',
  },
  {
    label: 'Item 7',
    value: '7',
  },
  {
    label: 'Item 8',
    value: '8',
  },
];

const spectrum_data = [
  {
    channelName: 'Channel 1',
    channelValue: 10,
    isActive: true,
    colorCode: '#fef2f2',
  },
  {
    channelName: 'Channel 2',
    channelValue: 20,
    isActive: true,
    colorCode: '#fffbeb',
  },
  {
    channelName: 'Channel 3',
    channelValue: 20,
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

export default function Dashboard() {
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
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [deleteMmodalVisible, setDeleteModalVisible] = useState(false);
  const [saveMmodalVisible, setSaveModalVisible] = useState(false);
  const [spectrumSaveDisabled, setSpectrumSaveDisabled] = useState(true);
  const [spectrum, setSpectrum] = useState(spectrum_data);
  const [lockRatio, setLockRatio] = useState(true);
  const [editedChannelName, setEditedChannelName] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);

  const [wifiList, setWifiList] = useState([]);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [connectedSSID, setConnectedSSID] = useState('');
  const [gateway, setGateway] = useState('');

  useEffect(() => {
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
    console.log('save clicked');
    setSpectrumSaveDisabled(true);
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
    // updateSchedules(scheduleData)
    //   .then(function (response) {
    //     console.log('response');
    //     console.log('update spectrum' + response.data.code);
    //   })
    //   .catch(error => {
    //     console.log('service-error', error);
    //   });
    axios
      .get('http://192.168.4.1/iot/channel')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: '#f5f5f5',
          flex: 1,
          borderRadius: 16,
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
      <View
        style={{
          flex: 6,
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
              data={data}
              maxHeight={250}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Spectrum' : 'Select Spectrumm'}
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValue(item.value);
                setIsFocus(false);
              }}
            />
          </View>

          <Pressable
            style={{marginTop: 8, marginLeft: -30}}
            onPress={() => setSettingsModalVisible(true)}>
            <Ionicons name="settings-outline" size={18} color="#171717" />
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
              margin: 5,
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
        </Popup>

        <Popup
          visible={settingsModalVisible}
          onClose={() => setSettingsModalVisible(false)}>
          <Text>This is the popup content. for Settings</Text>
        </Popup>

        <Popup
          visible={deleteMmodalVisible}
          onClose={() => setDeleteModalVisible(false)}>
          <Text>This is the popup content. for Delete</Text>
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
                  {/* <Pressable onPress={() => setDeleteModalVisible(true)}>
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
      </View>
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
