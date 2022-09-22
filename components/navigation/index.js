import React from 'react';
import { StyleSheet,TouchableOpacity,Text,Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MapDisplay from '../map/MapDisplay';
import TodayMapDisplay from '../map/TodayMapDisplay';
import CalendarDisplay from '../calendar/CalendarDisplay';
import WatchLocation from '../tracking/TrackingDisplay'
import MapModal from '../modal/MapModal';
import Login from '../authentication/Login';
import Register from '../authentication/Register';
import Home from '../authentication/Home';


// import {LogBox} from "react-native";
// LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications

const RootStack = createStackNavigator();

const RootStackScreen = () => {
  const styles = StyleSheet.create({
    header: {
      borderBottomWidth: 5,
      borderBottomColor: 'blue',
   
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10,
    },
  });
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen
         name="Calendar" component={CalendarDisplay} screenOptions={{ headerStyle: styles.header }}
         options={{
          // headerTitle: (props) => <LogoTitle {...props} />,
          // headerTitle: "" ,
          headerRight: () => (
            <TouchableOpacity style={this.button}>
            <Text >aaa</Text>
          </TouchableOpacity>
            // <Button
            //   onPress={() => alert('This is a button!')}
            //   title="Info"
            //   // color="#fff"
            //   style={styles.button}
            // />
          ),
        }}/>
        <RootStack.Screen name="Map" component={MapDisplay} />
        <RootStack.Screen name="TodayMap" component={TodayMapDisplay} 
              options={({ navigation,route })=>({
          headerLeft: (props) => (
            <Button title="Calendar" onPress={()=>{navigation.navigate("Calendar",{user: route.params.user, date: route.params.date})}}>Calendar</Button>
          ),
        })}
  />
        <RootStack.Screen name="Tracking" component={WatchLocation} />
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