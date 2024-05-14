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
} from 'react-native';

// import * as SQLite from 'expo-sqlite';
// const SQLite = require('react-native-sqlite-storage');

// const db = SQLite.openDatabase('iot_dashboard', 1.1);
import SQLite from 'react-native-sqlite-storage';

export default function SQL() {
  // useEffect(() => {
  //   // createTable();
  //   // insertData();
  //   readData();
  // }, []);

  useEffect(() => {
    const db = SQLite.openDatabase({
      name: 'iot_dashboard.db',
      location: 'default',
    });
    // db.transaction(tx => {
    //   tx.executeSql(
    //     'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)',
    //   );
    //   tx.executeSql('INSERT INTO users (name, email) VALUES (?, ?)', [
    //     'John Doe',
    //     'john@example.com',
    //   ]);
    //   tx.executeSql('INSERT INTO users (name, email) VALUES (?, ?)', [
    //     'Jane Doe',
    //     'jane@example.com',
    //   ]);
    // });

    // db.transaction(tx => {
    //   tx.executeSql('SELECT * FROM users', [], (_, {rows}) => {
    //     console.log('rows ' + JSON.stringify(rows));
    //   });
    // });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM users', [], (tx, results) => {
        console.log('Query completed');

        // Get rows with Web SQL Database spec compliance.

        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          console.log(`Username: ${row.username}, Pin: ${row.login_pin}`);
        }
      });
    });
  }, []);

  const createTable = async () => {
    console.log('create clicked');
    const query_create = `CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,
        mobileNo TEXT NOT NULL UNIQUE, password TEXT NOT NULL
    );`;
    try {
      const readOnly = false;
      await db.transaction(async tx => {
        console.log('create in progress');
        const result = await tx.executeSqlAsync(query_create, []);
        console.log('Count:', result);
      }, readOnly);
    } catch (err) {
      console.log({err});
    }
  };

  const insertData = async () => {
    const query_insert =
      'INSERT INTO users (name, mobileNo ,password) VALUES (?, ?, ?)';
    const params = ['Xyz', '1234567890', '123'];

    try {
      const readOnly = false;
      await db.transaction(async tx => {
        const result = await tx.executeSqlAsync(query_insert, params);
        ToastAndroid.show('Data' + result, ToastAndroid.SHORT);
        console.log('Count:', result);
      }, readOnly);
    } catch (err) {
      console.log({err});
    }
  };

  const readData = async () => {
    const query_insert = 'SELECT * FROM users;';

    try {
      const readOnly = false;
      await db.transaction(async tx => {
        const result = await tx.executeSqlAsync(query_insert, []);
        console.log('Count:', result);
      }, readOnly);
    } catch (err) {
      console.log({err});
    }
  };

  return (
    <View style={{margin: 50, padding: 20}}>
      <Button title="Create Database" onPress={createTable} />
      <Button title="Insert" onPress={insertData} />
      <Button title="Get Data" onPress={readData} />
    </View>
  );
}

const styles = require('../styles/styles');
