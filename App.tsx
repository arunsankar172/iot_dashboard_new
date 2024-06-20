/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from './src/screens/dashboard';
import Rooms from './src/screens/rooms';
import Spectrums from './src/screens/spectrums';
import SQL from './src/screens/sql';
import Signup from './src/screens/signup';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './src/screens/routines';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Device from './src/screens/devices';
import Navigation from './src/navigation/navigation';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    // <NavigationContainer>
    //   <Stack.Navigator
    //     screenOptions={{
    //       headerShown: false,
    //     }}>
    //     <Stack.Screen name="Rooms" component={Signup} />
    //   </Stack.Navigator>
    // </NavigationContainer>

    // <NavigationContainer>
    //   <Tab.Navigator
    //     screenOptions={{
    //       headerShown: false,
    //     }}>
    //     <Tab.Screen
    //       name="Home"
    //       component={Dashboard}
    //       options={{
    //         tabBarIcon: ({size, focused, color}) => {
    //           return <Icon name={'home'} size={size} color={color} />;
    //         },
    //       }}
    //     />
    //     <Tab.Screen
    //       name="Spectrum"
    //       component={Spectrums}
    //       options={{
    //         tabBarIcon: ({size, focused, color}) => {
    //           return (
    //             <Ionicons
    //               name={'color-filter-outline'}
    //               size={size}
    //               color={color}
    //             />
    //           );
    //         },
    //       }}
    //     />
    //     <Tab.Screen
    //       name="Devices"
    //       component={Device}
    //       options={{
    //         tabBarIcon: ({size, focused, color}) => {
    //           return (
    //             <MaterialIcons
    //               name={'devices-other'}
    //               size={size}
    //               color={color}
    //             />
    //           );
    //         },
    //       }}
    //     />
    //     <Tab.Screen
    //       name="Settings"
    //       component={Settings}
    //       options={{
    //         tabBarIcon: ({size, focused, color}) => {
    //           return (
    //             <Ionicons name={'settings-outline'} size={size} color={color} />
    //           );
    //         },
    //       }}
    //     />
    //   </Tab.Navigator>
    // </NavigationContainer>
    <Navigation />
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
