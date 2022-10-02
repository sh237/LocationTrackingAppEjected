import React from 'react'
import {TouchableOpacity,Text} from 'react-native';
import MapDisplay from "../map/MapDisplay";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ScheduleDisplay from "../schedule/ScheduleDisplay";
import TodayMapDisplay from '../map/TodayMapDisplay';


const Tab = createBottomTabNavigator();
const BottomTabNavigator = ({route}) => {
    return (
        <Tab.Navigator
          screenOptions={({ navigation,route })=>({
            title:"",
            headerLeft: () => (
            <TouchableOpacity style={this.button}>
                <Text style={{fontFamily:'TrebuchetMS-Bold', color:((route.params.theme_color == 0) ? '#fff'  : (route.params.theme_color == 1) ? 'gainsboro' : 'white')}} onPress={()=>{navigation.navigate("Drawer", { screen: "Calendar" ,user: route.params.user, date: route.params.date, theme_color:route.params.theme_color});}}>{"  < カレンダーに戻る"}</Text>
            </TouchableOpacity>
            ),
            headerShown: true,
            headerStyle: {
                backgroundColor: ((route.params.theme_color == 0) ? 'gray'  : (route.params.theme_color == 1) ? '#292929' : 'lightpink'),
            },
            tabBarStyle:{
                backgroundColor: (route.params.theme_color == 0) ? 'gray'  : (route.params.theme_color == 1) ? '#404040' : 'lightpink',
                height: '10%',
            },
            tabBarLabelStyle:{
                color: (route.params.theme_color == 0) ? '#fff'  : (route.params.theme_color == 1) ? 'gainsboro' : 'black',
            },
                
          })}
        >
          <Tab.Screen
            name="Schedule"
            component={ScheduleDisplay}
            options={{
                tabBarLabel: 'スケジュール',
            }}
            initialParams={route.params}
          />
          {  route.params.date == new Date(new Date() -  new Date().getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
            ? <Tab.Screen name="TodayMap" component={TodayMapDisplay} initialParams={route.params}  options={{tabBarLabel: '地図',headerShown:false}}/>
            : <Tab.Screen name="Map" component={MapDisplay} initialParams={route.params} options={{tabBarLabel: '地図',headerShown:false}}/>

          }
        </Tab.Navigator>
      );
};

export default BottomTabNavigator;