import React from 'react'
import MapDisplay from "../map/MapDisplay";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ScheduleDisplay from "../schedule/ScheduleDisplay";
import TodayMapDisplay from '../map/TodayMapDisplay';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({route}) => {
    return (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Schedule"
            component={ScheduleDisplay}
            initialParams={route.params}
          />
          {  route.params.date == new Date(new Date() -  new Date().getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
            ? <Tab.Screen name="TodayMap" component={TodayMapDisplay} initialParams={route.params}  />
            : <Tab.Screen name="Map" component={MapDisplay} initialParams={route.params}/>

          }
        </Tab.Navigator>
      );
};

export default BottomTabNavigator;