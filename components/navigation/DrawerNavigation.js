import React,{ useState, useEffect, useContext } from 'react'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import CalendarDisplay from '../calendar/CalendarDisplay';
import ColorSettingsDisplay from '../settings/ColorSettingsDisplay';
import TrackingSettingsDisplay from '../settings/TrackingSettingsDisplay'
import AddLatLongs from '../map/AddLatLongs';
import { ThemeColorContext } from '../navigation/index';
import Icon from 'react-native-vector-icons/Entypo';

const Drawer = createDrawerNavigator();
export const OnLocationContext = React.createContext({
  subscription: null,
  setSubscription: () => undefined,
  calendarid: 0,
  setCalendarid: () => undefined,
});




const DrawerNavigator = ({route}) => {
  const {theme_color, setThemeColor} = useContext(ThemeColorContext);
  const [subscription, setSubscription] = useState(null); 
  const [calendarid, setCalendarid] = useState(0);
  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="ログアウト"
          onPress={() => props.navigation.navigate("Login")}
          icon={({ focused, color, size }) => 
          // if(!focused){
          //   color = (theme_color == 0) ? 'blue' : (theme_color == 1) ? 'red' : 'green';
          // }
          <Icon name="log-out" size={size} color={(focused) ? color : (theme_color == 0) ? '#fff' : (theme_color == 1) ? 'gainsboro' : 'white'} />
        }
          // options={{
          //   drawerIcon: ({ focused, color, size }) => {
          //     return (
          //       <Icon name="home" size={size} color={color} />
          //     );
          //   },
          // }}
          labelStyle={{color: (theme_color == 0) ? '#fff'  : (theme_color == 1) ? 'gainsboro' : 'white'}}
        />
      </DrawerContentScrollView>
    );
  }
    return (
      <OnLocationContext.Provider value={{subscription, setSubscription, calendarid, setCalendarid}}>
        <Drawer.Navigator initialRouteName="Calendar" screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: (theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#404040' : 'lightpink',
          },
          headerTintColor: (theme_color == 0) ? 'snow'  : (theme_color == 1) ? 'gainsboro' : 'white',
          drawerStyle: {
            backgroundColor: (theme_color == 0) ? '#404040'  : (theme_color == 1) ? '#404040' : 'lightpink',
          },
          drawerLabelStyle: {
            color:((theme_color == 0) ? '#fff'  : (theme_color == 1) ? 'gainsboro' : 'white'),
          },
            

        }} drawerContent={props => <CustomDrawerContent {...props} />}>

            <Drawer.Screen name="Calendar" component={CalendarDisplay} 
            options={{
              headerShown:true,
              headerTitle:"カレンダー",
              drawerLabel:"トップ",
              drawerIcon: ({ focused, color, size }) => {
                return (
                  <Icon name="home" size={size} color={(focused) ? color : (theme_color == 0) ? '#fff' : (theme_color == 1) ? 'gainsboro' : 'white'} />
                );
              },
              // drawerPosition: 'right',
            }}
          initialParams={route.params}/>
            <Drawer.Screen name="ColorSettingsDisplay" component={ColorSettingsDisplay} 
            options={{
              headerShown:true,
              headerTitle:"テーマカラー設定",
              drawerLabel:"テーマカラー設定",
              drawerIcon: ({ focused, color, size }) => {
                return (
                  <Icon name="colours" size={size} color={(focused) ? color : (theme_color == 0) ? '#fff' : (theme_color == 1) ? 'gainsboro' : 'white'} />
                );
              },
              // drawerPosition: 'right',
            }}
          initialParams={route.params}/>
            <Drawer.Screen name="TrackingSettingsDisplay" component={TrackingSettingsDisplay} 
            options={{
              headerShown:true,
              headerTitle:"トラッキング設定",
              drawerLabel:"トラッキング設定",
              drawerIcon: ({ focused, color, size }) => {
                return (
                  <Icon name="location-pin" size={size} color={(focused) ? color : (theme_color == 0) ? '#fff' : (theme_color == 1) ? 'gainsboro' : 'white'} />
                );
              },
              // drawerPosition: 'right',
            }}
          initialParams={route.params}/>
            <Drawer.Screen name="AddLatLongs" component={AddLatLongs} 
            options={{
              headerShown:true,
              headerTitle:"写真の位置情報追加",
              drawerLabel:"写真の位置情報追加",
              drawerIcon: ({ focused, color, size }) => {
                return (
                  <Icon name="camera" size={size} color={(focused) ? color : (theme_color == 0) ? '#fff' : (theme_color == 1) ? 'gainsboro' : 'white'} />
                );
              },
              // drawerPosition: 'right',
            }}
          initialParams={route.params}/>
      </Drawer.Navigator>
  </OnLocationContext.Provider>
    );

}
export default DrawerNavigator;