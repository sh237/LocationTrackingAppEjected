import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MapDisplay from '../map/MapDisplay';
import CalendarDisplay from '../calendar/CalendarDisplay';
import WatchLocation from '../tracking/TrackingDisplay'
import MapModal from '../modal/MapModal';
import Login from '../authentication/Login';
import Register from '../authentication/Register';
import Home from '../authentication/Home';

const RootStack = createStackNavigator();

const RootStackScreen = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Calendar" component={CalendarDisplay} />
        <RootStack.Screen name="Map" component={MapDisplay} />
        <RootStack.Screen name="Tracking" component={WatchLocation} />
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Register" component={Register} />
        <RootStack.Screen name="Home" component={Home} />

        <RootStack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
        }}
      >
        <RootStack.Screen name="MapModal" component={MapModal} 
        options={{
          headerShown: false,
          cardStyle:{ backgroundColor: '#00000099' },
        }}
      />
      </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackScreen;