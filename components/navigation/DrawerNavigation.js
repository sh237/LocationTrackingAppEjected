import React,{ useState, createContext, useContext } from 'react'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import CalendarDisplay from '../calendar/CalendarDisplay';
import ColorSettingsDisplay from '../settings/ColorSettingsDisplay';
import TrackingSettingsDisplay from '../settings/TrackingSettingsDisplay'

const Drawer = createDrawerNavigator();
export const OnLocationContext = React.createContext({
  subscription: null,
  setSubscription: () => undefined,
});

function CustomDrawerContent(props) {
  console.log("props")
  console.log(props)
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Help"
        onPress={() => Linking.openURL('https://mywebsite.com/help')}
      />
    </DrawerContentScrollView>
  );
}


const DrawerNavigator = ({route}) => {
  const [subscription, setSubscription] = useState(null); 
    return (
      <OnLocationContext.Provider value={{subscription, setSubscription}}>
        <Drawer.Navigator initialRouteName="Calendar" screenOptions={{
          headerShown: false,
        }} >

            <Drawer.Screen name="Calendar" component={CalendarDisplay} 
            options={{
              headerShown:true,
              headerTitle:"カレンダー",
              drawerLabel:"トップ"
              // drawerPosition: 'right',
            }}
          initialParams={route.params}/>
            <Drawer.Screen name="ColorSettingsDisplay" component={ColorSettingsDisplay} 
            options={{
              headerShown:true,
              headerTitle:"テーマカラー設定",
              drawerLabel:"テーマカラー設定"
              // drawerPosition: 'right',
            }}
          initialParams={route.params}/>
            <Drawer.Screen name="TrackingSettingsDisplay" component={TrackingSettingsDisplay} 
            options={{
              headerShown:true,
              headerTitle:"トラッキング設定",
              drawerLabel:"トラッキング設定"
              // drawerPosition: 'right',
            }}
          initialParams={route.params}/>
      </Drawer.Navigator>
  </OnLocationContext.Provider>
    );

}
export default DrawerNavigator;