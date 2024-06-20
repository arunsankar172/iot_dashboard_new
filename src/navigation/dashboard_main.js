import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/dashboard';
import Spectrums from '../screens/spectrums';
import Device from '../screens/devices';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import Routines from '../screens/routines';

const Tab = createBottomTabNavigator();

export default function DashboardMain({navigation}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarIcon: ({size, focused, color}) => {
            return <Icon name={'home'} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Spectrum"
        component={Spectrums}
        options={{
          tabBarIcon: ({size, focused, color}) => {
            return (
              <Ionicons
                name={'color-filter-outline'}
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Devices"
        component={Device}
        options={{
          tabBarIcon: ({size, focused, color}) => {
            return (
              <MaterialIcons name={'devices-other'} size={size} color={color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Routines"
        component={Routines}
        options={{
          tabBarIcon: ({size, focused, color}) => {
            return <FontAwesome name={'tasks'} size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
