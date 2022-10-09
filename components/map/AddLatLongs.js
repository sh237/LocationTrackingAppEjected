import React,{useContext, useEffect, useState} from 'react'
import { TouchableOpacity, Text, View ,Image, StyleSheet, Alert, Dimensions, Modal} from 'react-native';
import {CameraRoll }from '@react-native-camera-roll/camera-roll';
import MapView, { Marker, Polyline} from 'react-native-maps';
import {showImagePicker, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import { UriContext } from '../navigation/index';


const AddLatLongs = ({navigation,route}) => {
  const [uri, setUri] = useContext(UriContext);
  const [takentime, setTakenTime] = useState('');
  const [latlngs, setLatlngs] = useState(null);

  useEffect(() => {
    console.log("useEffect");
    },[]);

  const loadImage = () => {
    const options = {
      mediaType: 'photo',
      includeExtra:true,
    }
    launchImageLibrary(options)
    .then((response) => {
      console.log(response)
      const {assets} = response;
      const {uri, timestamp} = assets[0];
      // setImage(uri);
      setUri(uri);
      // setImage('~' + uri.substring(pathToFile.indexOf('/tmp')));
      // console.log(uri.substring(pathToFile.indexOf('/tmp')));
      setTakenTime(timestamp.split('T')[0]);
      console.log(response);
      console.log("url")
      console.log(uri)
    })
    .catch((error) => {console.log(error)});
  }

  const SubmitImage = () => {
    console.log("submit");
    axios
      .get(`/api/calendar/${route.params.user}/?search=${takentime}`)
      .then(response => {
        console.log("id___" +response.data.id);
        const {id} = response.data;
        const payload = {calendar_id:id, longitude:latlngs.longitude, latitude:latlngs.latitude, uri:uri};
        console.log(payload);
        axios.get(`/api/photo/${id}/?search=${uri}`).then(response => {
          const payload = {calendar_id:id, longitude:latlngs.longitude, latitude:latlngs.latitude, uri:uri};
          axios.put(`/api/photo/${id}`, payload).catch(error => {console.log(error)});
        }).catch(error => {
          const payload = {calendar_id:id, longitude:latlngs.longitude, latitude:latlngs.latitude, uri:uri};
          axios.post(`/api/photo/`, payload).catch(error => {console.log(error)});
        });

      axios.post(`/api/photo/`,payload).catch(error => {console.log(error)});
      }).catch(error => 
        {
          const payload = { user: route.params.user, date: takentime};
          console.log(payload);
          axios.post(`/api/calendar/`,payload).then(response => {
            const {id} = response.data;
            const payload = {calendar_id:id, longitude:latlngs.longitude, latitude:latlngs.latitude, uri:uri};
            console.log(payload);
            axios.post(`/api/photo/`,{calendar_id:id, longitude:latlngs.longitude, latitude:latlngs.latitude, uri:uri})

          }
          ).catch(error => console.log("inner:::"+error));
        });

  }
  const style = StyleSheet.create({
    button1: {
      fontFamily:"TrebuchetMS-Bold",
      fontSize:20,
      borderWidth:1, 
      backgroundColor:(route.params.theme_color == 0) ? 'gray'  : (route.params.theme_color == 1) ? '#404040' : 'lightpink',
      color:((route.params.theme_color == 0) ? '#fff'  : (route.params.theme_color == 1) ? 'gainsboro' : 'white'),
      borderRadius:1,
      overflow:true,
      buttom:"70%",
      right:"80%",
      width:"100%",
      height:"15%",
  
    },
    button2: {
      fontFamily:"TrebuchetMS-Bold",
      fontSize:20,
      borderWidth:1, 
      backgroundColor:(route.params.theme_color == 0) ? 'gray'  : (route.params.theme_color == 1) ? '#404040' : 'lightpink',
      color:((route.params.theme_color == 0) ? '#fff'  : (route.params.theme_color == 1) ? 'gainsboro' : 'white'),
      borderRadius:1,
      overflow:true,
      buttom:"70%",
      left:"140%",
      width:"100%",
      height:"15%",
  
    },
    button3: {
      fontFamily:"TrebuchetMS-Bold",
      fontSize:20,
      borderWidth:1, 
      backgroundColor:(route.params.theme_color == 0) ? 'gray'  : (route.params.theme_color == 1) ? '#404040' : 'lightpink',
      color:((route.params.theme_color == 0) ? '#fff'  : (route.params.theme_color == 1) ? 'gainsboro' : 'white'),
      borderRadius:1,
      overflow:true,
      buttom:"70%",
      right:"10%",
      width:"100%",
      height:"100%",
  
    },
    timetext:{
      fontFamily:"TrebuchetMS-Bold",
      fontSize:18,
      // borderWidth:1,
      left:"38%",
      height:"15%",
      top:"5%",
      // backgroundColor:(route.params.theme_color == 0) ? 'gray'  : (route.params.theme_color == 1) ? '#404040' : 'lightpink',
      color:((route.params.theme_color == 0) ? 'gray'  : (route.params.theme_color == 1) ? 'gainsboro' : 'white'),
      borderRadius:1,

    }
  });

  return (
      <View style={{flex:1}}>
            <View style={{height:"20%", backgroundColor:"white",alignContent:"flex-start", justifyContent:"flex-start",flexDirection:"row",shadowColor:"black",shadowRadius:10,}}>
            {/* <Image source={{uri:'file:///Users/nagashimashunya/Library/Developer/CoreSimulator/Devices/005CE2F4-6C55-4466-BC1C-80CB6082892E/data/Containers/Data/Application/932473B0-07EA-4001-AE64-573956FC6D56/tmp/F3082D4F-5C0C-45EE-9518-2522518642D4.jpg'}} style={{width:100, height:100,left: 150}}/> */}
            {/* <Image source={{uri:'~/tmp/9057117F-AE7F-4A5E-B419-BBB3120001E4.jpg'}} style={{width:100, height:100, left:150}}/> */}
                {uri ? 
                <React.Fragment>
                <Image source={{uri:uri}} style={{width:130, height:130,left:"33%",top:"3%"}}/>
                <Text style={style.timetext}>{takentime}の写真です</Text> 
                <TouchableOpacity onPress={() => {loadImage()}} style={{alignContent:"center",justifyContent:"center",marginBottom:0,buttom:"100%"}}>
                  <Text style={style.button1}>別の写真を選ぶ</Text>
                </TouchableOpacity>
                </React.Fragment>
                : <TouchableOpacity onPress={() => {loadImage()}} style={{alignContent:"center",justifyContent:"center",marginBottom:0,buttom:"100%"}}>
                  <Text style={style.button2}>写真を選ぶ</Text>
                </TouchableOpacity>
              }
                
            </View>
            <MapView
                  style={{ flex: 1, height:"80%", width:"100%" }}
                  initialRegion={{
                      latitude: 35.249245,
                      longitude: 139.686818,
                      latitudeDelta: 0.02, //小さくなるほどズーム
                      longitudeDelta: 0.02,
                  }

                }
                // onRegionChangeComplete={region => {mapRef.current.getCamera().then((cam)=> {setAltitude(cam.altitude); }); }}
                >
            <Marker 
            title={"写真の位置にセットしてください"} 
            description={""} 
            coordinate={{latitude:35.6598003,longitude:139.7023894}} 
            draggable={true} 
            onDragEnd={(e)=>{console.log(e.nativeEvent.coordinate); setLatlngs(e.nativeEvent.coordinate)}}/>
                
            </MapView>
            <View style={{position : 'absolute', right : '0%', top:'80%'}}>
                <TouchableOpacity onPress={() => {SubmitImage()}} style={{}}>
                  <Text style={style.button3}>位置確定</Text>
                </TouchableOpacity>
            </View>
      </View>
  )
}


export default AddLatLongs