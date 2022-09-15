import React,{useEffect}  from 'react';
import {Platform} from 'react-native';
import RootStackScreen from './components/navigation';
import { enableScreens } from 'react-native-screens';
import Geolocation from 'react-native-geolocation-service';


function App (){
  enableScreens();

  useEffect(() => {
    axios.defaults.baseURL = 'http://http://127.0.0.1:8000/api';
    axios.defaults.timeout = 1500;
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
  }, []);
  return (<RootStackScreen/>);
}

export default App;