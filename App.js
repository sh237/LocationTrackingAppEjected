import React,{useEffect}  from 'react';
import {Platform} from 'react-native';
import RootStackScreen from './components/navigation';
import { enableScreens } from 'react-native-screens';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';

Icon.loadFont();

class NavigationWrapper extends React.Component {
  render() {
    return (
      <RootStackScreen />
    );
  }
}


function App (){
  enableScreens();

  useEffect(() => {
    
    // axios.defaults.baseURL = 'http://10.138.55.185:8000';
    // axios.defaults.baseURL = 'http://10.10.29.15:8000';
    // axios.defaults.baseURL = 'http://172.20.10.2:8000';
    // axios.defaults.baseURL = 'http://127.0.0.1:8000';
    // axios.defaults.baseURL = 'http://10.4.101.138:8000';
    // axios.defaults.baseURL = 'http://192.168.3.255:8000';
    // axios.defaults.baseURL = 'http://192.168.3.8:8000';
    // axios.defaults.baseURL = 'http://10.4.102.24:8000';
    // axios.defaults.baseURL = 'http://10.10.24.137:8000';
    axios.defaults.baseURL = 'http://18.179.40.46';
    // axios.defaults.headers.common['Content-Type'] = 'application/json';
    console.log("axios.defaults.baseURL:"+axios.defaults.baseURL);
    axios.defaults.timeout = 300000;
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
  }, []);
  return (<NavigationWrapper/>);
}

export default App;