import React,{useContext, useEffect, useState} from 'react'
import { TouchableOpacity, Text, View ,Image, StyleSheet, Alert, Dimensions, Modal} from 'react-native';
import {CameraRoll }from '@react-native-camera-roll/camera-roll';
import MapView, { Marker, Polyline} from 'react-native-maps';
import {showImagePicker, launchImageLibrary} from 'react-native-image-picker';
import { ThemeColorContext } from '../navigation/index';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Entypo';
// import { UriContext } from '../navigation/index';


const AddLatLongs = ({navigation,route}) => {
  const {theme_color, setThemeColor} = useContext(ThemeColorContext);
  const [fileName, setFileName] = useState(null);
  const [uri, setUri] = useState(null);
  const [takentime, setTakenTime] = useState('');
  const [latlngs, setLatlngs] = useState(null);
  var { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
      const {id, uri, timestamp} = assets[0];
      // setImage(uri);
      console.log("fileName: ");
      console.log(id);
      console.log("uri: ");
      console.log(uri);
      setFileName(id);
      setUri(uri);
      // setImage('~' + uri.substring(pathToFile.indexOf('/tmp')));
      // console.log(uri.substring(pathToFile.indexOf('/tmp')));
      setTakenTime(timestamp.split('T')[0]);
      console.log(response);
      console.log("filename")
      console.log(fileName)
    })
    .catch((error) => {console.log(error)});
  }

  const SubmitImage = () => {
    console.log("submit");
    axios
      .get(`/api/calendar/${route.params.user}/?search=${takentime}`)//カレンダーに日付が存在するかの確認
      .then(response => {
        console.log("id___" +response.data.id);
        const {id} = response.data;
        // const payload = {calendar_id:id, longitude:latlngs.longitude, latitude:latlngs.latitude, uri:uri};
        // console.log(payload);
        console.log("he");
        axios.get(`/api/photo/${id}/?search=${fileName}`).then(response => {//カレンダーに写真が存在するかの確認
          const payload = {calendar_id:id, longitude:latlngs.longitude, latitude:latlngs.latitude, filename:fileName};
          axios.put(`/api/photo/${id}`, payload).catch(error => {console.log(error)});//写真が存在する場合は更新
        }).catch(error => {
          const payload = {calendar_id:id, longitude:latlngs.longitude, latitude:latlngs.latitude, filename:fileName};
          axios.post(`/api/photo/`, payload).catch(error => {console.log(error)});//写真が存在しない場合は新規作成
        });

      // axios.post(`/api/photo/`,payload).catch(error => {console.log(error)});//カレンダーに日付が存在しない場合は新規作成
      }).catch(error => //カレンダーに日付が存在しないとき
        {
          const payload = { user: route.params.user, date: takentime};
          console.log(payload);
          axios.post(`/api/calendar/`,payload).then(response => { //カレンダーに日付を新規作成
            const {id} = response.data;
            const payload = {calendar_id:id, longitude:latlngs.longitude, latitude:latlngs.latitude, filename:fileName};
            console.log(payload);
            axios.post(`/api/photo/`,{calendar_id:id, longitude:latlngs.longitude, latitude:latlngs.latitude, filename:fileName})//カレンダーに写真を新規作成

          }
          ).catch(error => console.log("inner:::"+error));
        });

  }
  const style = StyleSheet.create({
    button1: {
      fontFamily:"TrebuchetMS-Bold",
      fontSize:20,
      borderWidth:1, 
      backgroundColor:(theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#404040' : 'lightpink',
      color:((theme_color == 0) ? '#fff'  : (theme_color == 1) ? 'gainsboro' : 'white'),
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
      backgroundColor:(theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#404040' : 'lightpink',
      color:((theme_color == 0) ? '#fff'  : (theme_color == 1) ? 'gainsboro' : 'white'),
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
      backgroundColor:(theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#404040' : 'lightpink',
      color:((theme_color == 0) ? '#fff'  : (theme_color == 1) ? 'gainsboro' : 'white'),
      borderRadius:1,
      overflow:true,
      buttom:"70%",
      right:"10%",
      width:"100%",
      height:"65%",
  
    },
    timetext:{
      fontFamily:"TrebuchetMS-Bold",
      fontSize:18,
      // borderWidth:1,
      left:"38%",
      height:"15%",
      top:"5%",
      // backgroundColor:(theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#404040' : 'lightpink',
      color:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : 'white'),
      borderRadius:1,

    }
  });

  return (
      <View style={{flex:1}}>
            <View style={{height:"20%", backgroundColor:"white",alignContent:"flex-start", justifyContent:"flex-start",flexDirection:"row",shadowColor:"black",shadowRadius:10,}}>
            {/* <Image source={{uri:'file:///Users/nagashimashunya/Library/Developer/CoreSimulator/Devices/005CE2F4-6C55-4466-BC1C-80CB6082892E/data/Containers/Data/Application/932473B0-07EA-4001-AE64-573956FC6D56/tmp/F3082D4F-5C0C-45EE-9518-2522518642D4.jpg'}} style={{width:100, height:100,left: 150}}/> */}
            {/* <Image source={{uri:'~/tmp/9057117F-AE7F-4A5E-B419-BBB3120001E4.jpg'}} style={{width:100, height:100, left:150}}/> */}
                {fileName && uri ? 
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
                      latitude: 35.6598003,
                      longitude: 139.7023894,
                      latitudeDelta: 0.01, //小さくなるほどズーム
                      longitudeDelta: 0.01,
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
                {/* <Icon name="arrow-with-circle-left" size={35} style={{top:"15%",right:"140%",fontFamily:'TrebuchetMS-Bold', color:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : 'lightpink')}} onPress={()=>{navigation.navigate("Drawer", { screen: "Calendar" ,user: route.params.user, date: route.params.date, theme_color:theme_color});}}/> */}
                <TouchableOpacity onPress={() => {SubmitImage()}} style={{}}>
                  <Text style={style.button3}>位置確定</Text>
                </TouchableOpacity>
            </View>
      </View>
  )
}


export default AddLatLongs