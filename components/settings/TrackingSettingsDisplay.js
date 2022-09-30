import React,{useEffect, useState,useContext} from 'react'
import {View, Button,StyleSheet,Switch} from 'react-native';
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

  const toggleSwitch = (value) => {
    console.log(value)
    setIsEnabled(previousState => !previousState)
    let payload;
    if(value){
      payload = {id:route.params.user, is_tracking:value}
      startOnLocation();
    }else{
      payload = {id:route.params.user, is_tracking:value}
      stopOnLocation();
    }
    console.log(payload)
    axios.patch(`/auth/update/is_tracking`,payload).then(response => {
    }).catch(error => console.log("error"))
  };
  const stopOnLocation = () =>{
    console.log("stopOnLocation");
    if(subscription!= null){
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value)=>toggleSwitch(value)}
            value={isEnabled}
          />
    </View>
  )
}



export default TrackingSettingsDisplay