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
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
// import Ionicons from "@expo/vector-icons/Ionicons";
// import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Dropdown} from 'react-native-element-dropdown';
// const Slider = require('react-native-slider');
import Icon from 'react-native-vector-icons/AntDesign';

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
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: '#f5f5f5',
          flex: 1,
          borderRadius: 20,
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
          {/* <Ionicons name="notifications-outline" size={24} color="black" />
                  <Ionicons
                    name="menu"
                    size={24}
                    style={{ marginLeft: 10 }}
                    color="black"
                  /> */}
        </View>
        <ScrollView
          horizontal={true}
          style={{
            flex: 1,
            marginTop: 8,
            flexDirection: 'row',
          }}>
          {rooms.map((inputRef, index) => (
            <View>
              <View
                style={{
                  backgroundColor: '#bfdbfe',
                  width: 54,
                  height: 54,
                  borderRadius: 50,
                  padding: 11,
                  marginTop: 15,
                  marginLeft: 20,
                  justifyContent: 'center',
                }}>
                {/* <MaterialCommunityIcons
                              name="home-lightbulb-outline"
                              size={32}
                              color="#525252"
                              font
                            /> */}
              </View>
              <Text
                style={{
                  color: '#404040',
                  marginLeft: 25,
                }}>
                Room 2
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          flex: 2.7,
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

          <Icon
            style={{marginTop: 10, marginLeft: -30}}
            name="edit"
            size={15}
            color="#171717"
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <View
          style={{
            marginLeft: 20,
            borderColor: '#d4d4d4',
            marginRight: 20,
            borderWidth: 1,
            borderRadius: 8,
            height: 74,
            flexDirection: 'colmun',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#171717',
                  margin: 10,
                }}>
                Room1
              </Text>
              <Pressable onPress={() => setModalVisible(true)}>
                <Icon
                  style={{
                    // margin: 10,
                    marginLeft: 0,
                    marginTop: 13,
                  }}
                  name="edit"
                  size={15}
                  color="#171717"
                />
              </Pressable>
            </View>

            <Text
              style={{
                fontSize: 15,
                color: '#171717',
                margin: 10,
              }}>
              D3
            </Text>
          </View>
          <Slider
            // style={{width: '100%', height: 35}}
            trackStyle
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="blue"
            maximumTrackTintColor="grey"
            thumbTintColor="blue"
            onValueChange={value => setSliderValue(value)}
            value={sliderValue}
          />
        </View>
      </View>
    </View>
  );
}

const styles = require('../styles/styles');
