import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  NativeModules,
  TouchableOpacity,
  TextInput,
  Button,
  Switch,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import CheckBox from '@react-native-community/checkbox';

import NetInfo from '@react-native-community/netinfo';
const {WifiScanner} = NativeModules;

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SQLite from 'react-native-sqlite-storage';

export default function Routines({navigation}) {
  const [connectedSSID, setConnectedSSID] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isCreateNewVisible, setCreateNewVisible] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [spectrumControlList, setSpectrumControlList] = useState([]);
  const [spectrumControlActive, setSpectrumControlActive] = useState({});
  const [routineName, setRoutineName] = useState('');
  const [routineAction, setRoutineAction] = useState(false);
  const [routineSpectrum, setRoutineSpectrum] = useState([]);
  const [weekValues, setWeekValues] = useState([]);
  const [routinesList, setRoutinesList] = useState([]);

  const [weekValueData, setWeekValueData] = useState([
    {name: 'Sun', value: false},
    {name: 'Mon', value: false},
    {name: 'Tue', value: false},
    {name: 'Wed', value: false},
    {name: 'Thu', value: false},
    {name: 'Fri', value: false},
    {name: 'Sat', value: false},
  ]);

  const db = SQLite.openDatabase({
    name: 'iot_dashboard.db',
    location: 'default',
  });

  useEffect(() => {
    getRoutines();
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

  const spectrumDropDownChange = item => {
    console.log('Spectrum Dropdown Change  ' + JSON.stringify(item));
    setSpectrumSaveDisabled(false);
    setSpectrumControlActive(item);
    setSpectrum(JSON.parse(item.channel_data));
    setLockRatio(item.lock_ratio == 1 ? true : false);
    setIsFocus(false);
  };

  const handleWeekCheckbox = (event, index) => {
    setWeekValueData(prevValues => {
      const newValues = [...prevValues];
      newValues[index].value = !newValues[index].value;
      return newValues;
    });
    console.log(weekValueData);
  };

  const cancelNewRoutine = () => {
    setRoutineName('');
    setRoutineAction(false);
    setWeekValues([]);
    setWeekValueData([
      {name: 'Sun', value: false},
      {name: 'Mon', value: false},
      {name: 'Tue', value: false},
      {name: 'Wed', value: false},
      {name: 'Thu', value: false},
      {name: 'Fri', value: false},
      {name: 'Sat', value: false},
    ]);
    setCreateNewVisible(false);
  };

  const saveNewRoutine = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO routines (routine_name, routine_time, routine_action, spectrum_data, days_in_week, device_serial) VALUES (?, ?, ?, ?, ?, ?)',
        [routineName, '', routineAction, '', '', 'AndroidWifi'],
        error => {
          console.error('Error retrieving data:', error);
        },
      );
    });

    setRoutineName('');
    setRoutineAction(false);
    setWeekValues([]);
    setWeekValueData([
      {name: 'Sun', value: false},
      {name: 'Mon', value: false},
      {name: 'Tue', value: false},
      {name: 'Wed', value: false},
      {name: 'Thu', value: false},
      {name: 'Fri', value: false},
      {name: 'Sat', value: false},
    ]);
    setCreateNewVisible(false);
  };

  const changeRoutineAction = () =>
    setRoutineAction(previousState => !previousState);

  const getRoutines = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM routines WHERE device_serial = ?;',
        ['AndroidWifi'],
        (tx, results) => {
          console.log('Routine List complete');
          var len = results.rows.length;
          const routine_list = [];
          for (let i = 0; i < len; i++) {
            routine_list.push(results.rows.item(i));
          }
          routinesList(routine_list);
        },
        error => {
          console.error('Error retrieving data:', error);
        },
      );
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
          Routines
        </Text>
      </View>

      {isCreateNewVisible && (
        <View style={{margin: 20}}>
          <TextInput
            style={{
              height: 40,
              borderWidth: 1,
              padding: 6,
              paddingLeft: 10,
              borderRadius: 4,
            }}
            onChangeText={setRoutineName}
            value={routineName}
            placeholder="Routine Name"
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <TextInput
              style={{
                height: 40,
                width: '50%',
                borderWidth: 1,
                padding: 6,
                paddingLeft: 30,
                marginTop: 10,
                borderRadius: 4,
              }}
              value={date.toLocaleTimeString()}
              onPressIn={() => setOpen(true)}
              placeholder="Routine Time"
              keyboardType="numeric"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginRight: 20,
              }}>
              <Text style={{marginTop: 15, fontSize: 18}}>ON</Text>
              <Switch
                style={{marginTop: 5, marginLeft: 4}}
                activeText={'ON'}
                inActiveText={'OFF'}
                onValueChange={changeRoutineAction}
                value={routineAction}></Switch>
              <Text style={{marginTop: 15, fontSize: 18}}>OFF</Text>
            </View>
          </View>

          <Dropdown
            style={[
              styles.dropdown,
              {marginTop: 15, height: 40},
              isFocus && {borderColor: 'blue'},
            ]}
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
          {/* <Button title="Open" onPress={() => setOpen(true)} /> */}
          <DatePicker
            modal
            mode="time"
            // theme="dark"
            open={open}
            date={date}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
              console.log('Date confirmed: ' + date.toLocaleTimeString());
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <View style={{flexDirection: 'row', marginTop: 10, flexWrap: 'wrap'}}>
            {weekValueData.map((day, index) => (
              <View style={{flexDirection: 'row', marginLeft: 5}}>
                <CheckBox
                  value={day.value}
                  onValueChange={e => handleWeekCheckbox(e, index)}
                />
                <Text style={{marginTop: 6}}>{day.name}</Text>
              </View>
            ))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            <Button
              // style={{margin: 5}}
              color="#f87171"
              title="Cancel"
              onPress={cancelNewRoutine}
            />
            <Button title="Save" onPress={saveNewRoutine} />
          </View>
        </View>
      )}

      {!isCreateNewVisible && (
        <ScrollView>
          {routinesList.length > 0 ? (
            routinesList.map((routine, index) => (
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
                  {routine.routineName}
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
                No Routines found
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {!isCreateNewVisible && (
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setCreateNewVisible(true)}>
          <MaterialIcons
            // style={{marginRight: 10}}
            name="add-circle-outline"
            size={22}
            color="#404040"
          />
        </TouchableOpacity>
      )}

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
