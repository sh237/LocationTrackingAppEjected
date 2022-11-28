import React,{useContext} from 'react'
import {TouchableOpacity,Text} from 'react-native';
import MapDisplay from "../map/MapDisplay";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ScheduleDisplay from "../schedule/ScheduleDisplay";
import TodayMapDisplay from '../map/TodayMapDisplay';
import AddedPhotoDisplay from '../map/AddedPhotoDisplay';
import { ThemeColorContext } from '../navigation/index';
import Icon from 'react-native-vector-icons/Entypo';

const Tab = createBottomTabNavigator();
const BottomTabNavigator = ({route}) => {
  const {theme_color, setThemeColor} = useContext(ThemeColorContext);
    return (
        <Tab.Navigator
          screenOptions={({ navigation,route })=>({
            title:"",
            headerLeft: () => (
            <TouchableOpacity style={this.button}>
                <Text style={{fontFamily:'TrebuchetMS-Bold', color:((theme_color == 0) ? '#fff'  : (theme_color == 1) ? 'gainsboro' : 'white')}} onPress={()=>{navigation.navigate("Drawer", { screen: "Calendar" ,user: route.params.user, date: route.params.date, theme_color:theme_color});}}>{"  < カレンダーに戻る"}</Text>
            </TouchableOpacity>
            ),
            headerShown: true,
            headerStyle: {
                backgroundColor: ((theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#292929' : 'lightpink'),
            },
            tabBarStyle:{
                backgroundColor: (theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#404040' : 'lightpink',
                height: '10%',
            },
            tabBarLabelStyle:{
                color: (theme_color == 0) ? '#fff'  : (theme_color == 1) ? 'gainsboro' : 'black',
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Map' || 'TodayMap') {
                  iconName = focused ? 'map' : 'map';
              } else if (route.name === 'Schedule') {
                  iconName = focused ? 'pencil' : 'pencil';
              } else if (route.name === 'AddedPhoto') {
                  iconName = focused ? 'camera' : 'camera';
              }
              return <Icon name={iconName} size={size} color={color} />;
          }
                
          })}
        >
          <Tab.Screen
            name="Schedule"
            component={ScheduleDisplay}
            options={{
                tabBarLabel: 'スケジュール',
                tabBarIcon: ({ focused, color, size }) => {
                  iconName = focused ? 'pencil' : 'pencil';
                  return <Icon name={iconName} size={size} color={color} />;
              }
            }}
            initialParams={route.params}
          />
          {  route.params.date == new Date(new Date() -  new Date().getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
            ? <Tab.Screen name="TodayMap" component={TodayMapDisplay} initialParams={route.params}  
            options={{
              tabBarLabel: '地図',
              headerShown:false,
              tabBarIcon: ({ focused, color, size }) => {
              iconName = focused ? 'map' : 'map';
              return <Icon name={iconName} size={size} color={color} />;
          }}}/>
            : <Tab.Screen name="Map" component={MapDisplay} initialParams={route.params} 
            options={{
              tabBarLabel: '地図',
              headerShown:false,
              tabBarIcon: ({ focused, color, size }) => {
                iconName = focused ? 'map' : 'map';
                return <Icon name={iconName} size={size} color={color} />;
            }
            }}/>

          }
          <Tab.Screen name="AddedPhoto" component={AddedPhotoDisplay} initialParams={route.params} 
          options={{
            tabBarLabel: '画像位置修正',
            headerShown:false,
            tabBarIcon: ({ focused, color, size }) => {
              iconName = focused ? 'camera' : 'camera';
              return <Icon name={iconName} size={size} color={color} />;
          }
          }}/>
        </Tab.Navigator>
      );
};

export default BottomTabNavigator;