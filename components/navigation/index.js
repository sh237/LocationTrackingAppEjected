import React,{useRef, useState,useEffect} from 'react';
import { StyleSheet,TouchableOpacity,Text,Button,Animated } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MapDisplay from '../map/MapDisplay';
import TodayMapDisplay from '../map/TodayMapDisplay';
import CalendarDisplay from '../calendar/CalendarDisplay';
import WatchLocation from '../tracking/TrackingDisplay'
import MapModal from '../modal/MapModal';
import Login from '../authentication/Login';
import PasswordChange from '../authentication/PasswordChange';
import Register from '../authentication/Register';
import Home from '../authentication/Home';
import Icon from 'react-native-vector-icons/Entypo';
import { forHorizontalModal } from './forHorizontalMordal';
import ScheduleDisplay from '../schedule/ScheduleDisplay';
import EditModal from '../modal/EditModal';
import BottomTabNavigator from './BottomTabNavigator';
import SettingsDisplay from '../settings/ColorSettingsDisplay';
import DrawerNavigator from './DrawerNavigation';
import SendEmail from '../authentication/SendEmail';


const RootStack = createStackNavigator();
export const ImageContext = React.createContext({
  group: null,
  setGroup: () => undefined,
});
export const UriContext = React.createContext({
  uri: null,
  setUri: () => undefined,
});

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

  const linking = {
    prefixes: ['lta://'],
    config: {
      screens: {
        PasswordChange: 'password_change/:uid/:token',
      }
    },
  };

  const [group, setGroup] = React.useState(null);
  const [uri, setUri] = React.useState(null);


  return (
    // <AuthProvider>
    
    <ImageContext.Provider value={{group, setGroup}}>
    <UriContext.Provider value={{uri, setUri}}>
    {/* <NavigationContainer> */}
    <NavigationContainer linking={linking}  >
    {/* <NavigationContainer initialState={initialState} ref={ref}  > */}
      <RootStack.Navigator screenOptions={({ navigation,route })=>({
          headerStyle: {
            backgroundColor: (route.params != undefined) ? ((route.params.theme_color == 0) ? 'gray'  : (route.params.theme_color == 1) ? '#404040' : 'lightpink') : 'white',
          },
          headerTintColor:(route.params != undefined) ? ((route.params.theme_color == 0) ? 'snow'  : (route.params.theme_color == 1) ? 'gainsboro' : 'lightpink') : 'white',
        })}>
        <RootStack.Screen name="Login" component={Login} screenOptions={{headerShown:false}}/>
        <RootStack.Screen name="PasswordChange" component={PasswordChange} options={{headerShown:false}}/>
        <RootStack.Screen name="SendEmail" component={SendEmail} options={{headerShown:false}}/>

        {/* <RootStack.Screen
         name="Calendar" component={CalendarDisplay} screenOptions={{ headerStyle: styles.header }}
         options={({ navigation,route })=>({
          // headerTitle: (props) => <LogoTitle {...props} />,
          // headerTitle: "" ,
          headerRight: () => (
            <TouchableOpacity style={this.button}>
            <Icon name="menu" size={40} onPress={()=>navigation.navigate("Drawer", { screen: "RightDrawer" ,date:route.params.date,user:route.params.user,email:route.params.email, title:route.params.title, description:route.params.description, theme_color:route.params.theme_color})}/>
          </TouchableOpacity>
          ),
          headerLeft: (props) => (
            // <Button title="< ログアウト"  style={{fontSize:100,fontFamily: 'TrebuchetMS-Bold',}} onPress={()=>{navigation.navigate("Login",{})}}>ログアウト</Button>
            <TouchableOpacity style={this.button}>
              <Text style={{fontFamily:'TrebuchetMS-Bold', color:"skyblue"}} onPress={()=>navigation.navigate("Login",{})}>{"< ログアウト"}</Text>
          </TouchableOpacity>
          ),
          headerTitle:"カレンダー",
          headerLeftContainerStyle:{fontFamily:'TrebuchetMS-Bold',},
          headerTitleStyle:{fontFamily: 'TrebuchetMS-Bold',},
          // mode: "modal",
          // gestureDirection: "horizontal",
          // cardStyleInterpolator: forHorizontalModal,
        })}/> */}

        {/* <RootStack.Screen name="Map" component={MapDisplay} /> */}
        <RootStack.Screen name="TodayMap" component={TodayMapDisplay} 
              options={({ navigation,route })=>({
                headerLeft: () => (
                  <TouchableOpacity style={this.button}>
                    <Text style={{fontFamily:'TrebuchetMS-Bold', color:"skyblue"}} onPress={()=>navigation.navigate("Login",{})}>{"< ログアウト"}</Text>
                </TouchableOpacity>
                ),
              // headerLeft: (props) => (
              //   <Button title="Calendar" onPress={()=>{navigation.navigate("Drawer", { screen: "Calendar" ,user: route.params.user, date: route.params.date, theme_color:route.params.theme_color});}}>Calendar</Button>
              // ),
        })}
  />
  
        <RootStack.Screen name="Tracking" component={WatchLocation} />
        <RootStack.Screen name="Register" component={Register} />
        <RootStack.Screen name="Home" component={Home} />
        {/* <RootStack.Screen name="Schedule" component={ScheduleDisplay} /> */}
        <RootStack.Screen name="BottomTab" component={BottomTabNavigator} 
        options={({ navigation,route })=>({
                    // title:"",
                    headerShown:false,
                    // headerLeft: () => (
                    // <TouchableOpacity style={this.button}>
                    //     <Text style={{fontFamily:'TrebuchetMS-Bold', color:((route.params.theme_color == 0) ? '#fff'  : (route.params.theme_color == 1) ? 'gainsboro' : 'white')}} onPress={()=>{navigation.navigate("Drawer", { screen: "Calendar" ,user: route.params.user, date: route.params.date, theme_color:route.params.theme_color});}}>{"  < カレンダーに戻る"}</Text>
                    // </TouchableOpacity>
                    // ),
                    
                // headerLeft: (props) => (
                //   <Button title="Calendar" onPress={()=>{navigation.navigate("Drawer", { screen: "Calendar" ,user: route.params.user, date: route.params.date, theme_color:route.params.theme_color});}}>Calendar</Button>
                // ),
            })}/>
        <RootStack.Screen name="Drawer" component={DrawerNavigator} options={{headerShown:false}}/>
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
          presentation: 'modal',
          headerShown: true,
        }}
      >
        <RootStack.Screen name="Settings" component={SettingsDisplay} 
        options={
          ({ navigation,route })=>({
            headerShown: true,
            headerLeft: (props) => (
            <Button title="Calendar" onPress={()=>{navigation.navigate("Calendar",{user: route.params.user, date: route.params.date,theme_color:route.params.theme_color})}}>Calendar</Button>
          ),
        })}
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
      </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
    </UriContext.Provider>
    </ImageContext.Provider>
    // </AuthProvider>
  );
};


export default RootStackScreen;