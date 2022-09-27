import React from 'react';
import { StyleSheet,TouchableOpacity,Text,Button,Animated } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MapDisplay from '../map/MapDisplay';
import TodayMapDisplay from '../map/TodayMapDisplay';
import CalendarDisplay from '../calendar/CalendarDisplay';
import WatchLocation from '../tracking/TrackingDisplay'
import MapModal from '../modal/MapModal';
import SettingModal from '../modal/SettingModal';
import Login from '../authentication/Login';
import Register from '../authentication/Register';
import Home from '../authentication/Home';
import Icon from 'react-native-vector-icons/Entypo';
import { forHorizontalModal } from './forHorizontalMordal';
import BeforeModal from '../modal/BeforeModal';
import ScheduleDisplay from '../schedule/ScheduleDisplay';
import EditModal from '../modal/EditModal';
import BottomTabNavigator from './BottomTabNavigator';

// then use it as 


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
  const config = {
    animation: 'timing',
    config: {
      stiffness: 10000,
      damping: 5000,
      mass: 1,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.0001,
    },
  };
  // const translateFocused = Animated.multiply(
  //   current.progress.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: [screen.width, 0],
  //     extrapolate: "clamp"
  //   }),
  //   inverted
  // );


  // const horizontalAnimation = {
  //   cardStyleInterpolator: ({ current, layouts }) => {
  //     return {
  //       cardStyle: {
  //         transform: [
  //           {
  //             translateX: current.progress.interpolate({
  //               inputRange: [0, 1],
  //               outputRange: [layouts.screen.width, 0],
  //             }),
  //           },
  //         ],
  //       },
  //     };
  //   },
  // };
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Login" component={Login} />

        <RootStack.Screen
         name="Calendar" component={CalendarDisplay} screenOptions={{ headerStyle: styles.header }}
         options={({ navigation,route })=>({
          // headerTitle: (props) => <LogoTitle {...props} />,
          // headerTitle: "" ,
          headerRight: () => (
            <TouchableOpacity style={this.button}>
            <Icon name="menu" size={40} onPress={()=>navigation.navigate("BeforeModal",{user:route.params.user, date:route.params.date})}/>
          </TouchableOpacity>
            // <Button
            //   onPress={() => alert('This is a button!')}
            //   title="Info"
            //   // color="#fff"
            //   style={styles.button}
            // />
          ),
          // mode: "modal",
          // gestureDirection: "horizontal",
          // cardStyleInterpolator: forHorizontalModal,
          
        })}/>

        {/* <RootStack.Screen name="Map" component={MapDisplay} /> */}
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
        {/* <RootStack.Screen name="Schedule" component={ScheduleDisplay} /> */}
        <RootStack.Screen name="BottomTab" component={BottomTabNavigator} />
        <RootStack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
        }}>
        <RootStack.Screen name="EditModal" component={EditModal}
        options={{
          headerShown: false,
          cardStyle:{ position:"relative",backgroundColor: '#00000099',flex: 1,opacity:1},
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
         />
        </RootStack.Group>

        <RootStack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
          // gestureDirection: "horizontal",
          // cardStyleInterpolator: forHorizontalModal,
        }}>
        <RootStack.Screen name="BeforeModal" component={BeforeModal}
        options={{
          headerShown: false,
          cardStyle:{ position:"relative",backgroundColor: '#00000099'},
          // gestureDirection: "horizontal",
          // cardStyleInterpolator: forHorizontalModal,
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
         />
        </RootStack.Group>
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

        <RootStack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
          // gestureDirection: "horizontal",
          // cardStyleInterpolator: forHorizontalModal,
        }}
      >
        <RootStack.Screen name="SettingModal" component={SettingModal} 
        options={{
          headerShown: false,
          cardStyle:{ position:"relative"},
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontalModal,
         
        }}
      />
      </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};


export default RootStackScreen;