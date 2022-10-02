import React,{useEffect, useState,useContext} from 'react'
import {View, StyleSheet,Text,Switch} from 'react-native';
import {OnLocationContext} from '../navigation/DrawerNavigation'
import BackgroundGeolocation from "react-native-background-geolocation";
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';

const TrackingSettingsDisplay = ({navigation,route}) => {
  //axios.put(`/auth/update/${id}`,{id:id}).then(response => {
  const [start, setStart] = useState(null);
  const [stop, setStop] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const {subscription, setSubscription } = useContext(OnLocationContext);
  const {calendarid, setCalendarid} = useContext(OnLocationContext);

  const toggleSwitch = (value) => {
    console.log(value)
    setIsEnabled(previousState => !previousState)
    console.log("subscription")
    console.log(subscription)
    let payload;
    if(value){
      payload = {id:route.params.user, is_tracking:value}
      startOnLocation();
    }else{
      payload = {id:route.params.user, is_tracking:value}
      stopOnLocation();
    }
    console.log("subscription")
    console.log(subscription)
    axios.patch(`/auth/update/is_tracking`,payload).then(response => {
    }).catch(error => console.log("error"))
  };
  const stopOnLocation = () =>{
    console.log("stopOnLocation");
    if(subscription != null){
      subscription["remove"]();
      setSubscription(null);
    }
  }
  
  const startOnLocation = () =>{
    console.log("startOnLocation")
    if(subscription==null){
      setSubscription(BackgroundGeolocation.onLocation(onLocation, onError));
    }
  }

  const onLocation = (location) => {
    // console.log("latlngs"+latlngs);
    console.log("onlocation"+calendarid+location);
    if(calendarid!=0){
      const payload = { calendar: calendarid, mpoint:"MULTIPOINT ("+location.coords.longitude+" "+location.coords.latitude+")"};
      axios.put(`/api/location/update/${calendarid}`,payload).then(response => {
        console.log("updated location");
      }).catch(error => console.log("post error:::"+error));
    }
    }
  
  const onError = (error) => {
    console.warn('[location] ERROR -', error);
  }

  useEffect(()=>{
    setIsEnabled(route.params.is_tracking);
    },[]);

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (route.params.theme_color == 0) ? '#fff'  : (route.params.theme_color == 1) ? '#292929' : 'mistyrose', 
    }
  });
  

  return (
    <View style={styles.screen}>
      <View style={{flexDirection:"row",justifyContent:"space-between",}}>
        <Text style={{color: ((route.params.theme_color == 0) ? 'black'  : (route.params.theme_color == 1) ? 'white' : '#404040') , top:"1%",fontSize:20,fontFamily:'TrebuchetMS-Bold'} }>位置情報追跡オフ/オン：</Text>
          <Switch
            trackColor={{ false: "#767577", true: "black" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value)=>toggleSwitch(value)}
            value={isEnabled}
          />
        </View>
    </View>
  )
}



export default TrackingSettingsDisplay