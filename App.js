import React,{useEffect}  from 'react';
import {Platform} from 'react-native';
import RootStackScreen from './components/navigation';
import { enableScreens } from 'react-native-screens';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';


function App (){
  enableScreens();

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8000';
    // axios.defaults.baseURL = 'http://127.0.0.1:8000/';
    axios.defaults.timeout = 3000;
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
  }, []);
  return (<RootStackScreen/>);
}

export default App;