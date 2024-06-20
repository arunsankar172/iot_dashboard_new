import React, {useState, useRef, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Signup from '../screens/signup';
import DashboardMain from './dashboard_main';
import SQLite from 'react-native-sqlite-storage';
import Login from '../screens/login';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [userExists, setUserExists] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const db = SQLite.openDatabase({
      name: 'iot_dashboard.db',
      location: 'default',
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM users', [], (tx, results) => {
        console.log('Query completed');
        var len = results.rows.length;
        if (len > 0) {
          setUserExists(true);
        } else {
          setUserExists(false);
        }
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          setUserData(row);
          console.log(`Username: ${row.username}, Pin: ${row.login_pin}`);
        }
      });
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* <Stack.Screen name="Login" component={Login} /> */}
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="DashboardMain" component={DashboardMain} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
