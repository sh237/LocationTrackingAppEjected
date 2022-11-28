import React , { Component,useState, useEffect,useContext,useRef, useInsertionEffect } from 'react';
import { StyleSheet, Text, View ,Image, Button, Alert, Dimensions, Modal} from 'react-native';
import MapView, { Marker, Polyline} from 'react-native-maps';
import {CameraRoll }from '@react-native-camera-roll/camera-roll';
import { ThemeColorContext } from '../navigation/index';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Entypo';
import {  ImageContext } from '../navigation/index';

// import Exif from 'react-native-exif';

const MapDisplay = ({navigation,route}) => {
    const {theme_color, setThemeColor} = useContext(ThemeColorContext);
    const mapRef = useRef(null);
    // let [image, setImage] = useState('');
    let [markers, setMarkers] = useState({});
    // let [proba, setProba] = useState(0);
    let [latlngs, setLatlngs] = useState([]);
    let [photos, setPhotos] = useState({});
    let {group, setGroup} = useContext(ImageContext);
    let [imgmodal, setImgModal] = useState(false);
    let [selectedimg, setSelectedImg] = useState([]);
    let [isfirst, setIsFirst] = useState(true);
    let [calendarid, setCalendarId] = useState(null);

    var { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.01;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    const [altitude, setAltitude] = useState(0); //initiates variable zoom
    const openModal = ()=> {
      setImgModal(true);
    }
    const closeModal = ()=> {
      setImgModal(false);
    }
    const ZoomIn = async () => {
      const coords = await mapRef.current.getCamera().then((cam)=> {cam.altitude-=10000; mapRef.current.animateCamera(cam,{duration:200}); setAltitude(cam.altitude); });
      // setZoom(coords.center.zoom); // sets variable zoom the value under coords.center.zoom
    }
    const ZoomOut = async () => {
      const coords = await mapRef.current.getCamera().then((cam)=> {cam.altitude+=10000; mapRef.current.animateCamera(cam,{duration:200}); setAltitude(cam.altitude); });
      // setZoom(coords.center.zoom); // sets variable zoom the value under coords.center.zoom
    }

    useEffect(() => {
      console.log("group!!");
      console.log(group);
      // if(route.params.calendar_id == null || group == null|| group.length == 0 ){
      //   console.log("alert");
      //   Alert.alert("位置情報がありません");
      //   navigation.goBack();
      // }
      console.log("user:"+route.params.user+"date:"+route.params.date);
      axios
      .get(`/api/calendar/${route.params.user}/?search=${route.params.date}`)
      .then(response => {
        const {id} = response.data;
        if(id){
          setCalendarId(id);
          console.log("calendar_id"+id);
          axios.get(`/api/location/${id}/`).then(response_ => {
            const {geometry} = response_.data;
            const {coordinates} = geometry;
            coordinates.map((v,i)=>{
              setLatlngs(latlngs => [...latlngs, {latitude: v[1], longitude: v[0]}]);
            })}).catch(error => {console.log(error);console.log("inner error");});
        }
      })
      .catch(error => {console.log(error); console.log("outer error");setLatlngs(null);});
  
    }, []);

    useEffect(() => {
      if(group == null|| group.length == 0 ){
        console.log("alert");
        Alert.alert("位置情報がありません");
        navigation.goBack();
      }
      if(mapRef != null && mapRef.current != null && group != null && group[0] != null && group[0][0] != null){
        mapRef.current.animateToRegion({latitude:group[0][0].node.location.latitude,longitude:group[0][0].node.location.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA  }, 1 * 1000);
      }

    },[route.params]);

    useEffect(() => {
      if( latlngs != null && latlngs.length > 0){
        mapRef.current.animateToRegion({latitude:latlngs[latlngs.length-1].latitude, longitude:latlngs[latlngs.length-1].longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA}, 1 * 1000);
      }
    }, [latlngs, mapRef]);


  const onZoomInPress = () => {
    mapRef.current.getCamera().then((cam) => {
        cam.zoom += 1;
        mapRef.current.animateCamera(cam);
    });
};

          return (
            <View style={{flex:1}}>
              
              <MapView
                  ref={mapRef}
                  style={{ flex: 1 }}
                  initialRegion={{
                      // latitude: 35.249245,
                      // longitude: 139.686818,
                      // latitude: latlngs[0].latitude,
                      // longitude: latlngs[0].longitude,
                      // latitude: markers.latlng.latitude,
                      // longitude: markers.latlng.longitude,
                      latitudeDelta: 0.01, //小さくなるほどズーム
                      longitudeDelta: 0.01,
                  }
                }
                // onRegionChangeComplete={region => {mapRef.current.getCamera().then((cam)=> {setAltitude(cam.altitude); }); }}
                // onPanDrag={()=> {mapRef.current.getCamera().then((cam)=> {setAltitude(cam.altitude); }); }}
              >

                  {(group != null && group.length > 0 && group[0][0] != undefined) && group.map((g, i) => {
                    // console.log("groupp"+group);
                    // console.log("length"+group.length)
                    console.log("date"+new Date(g[0].node.timestamp*1000).toLocaleString());
                    console.log("date"+g[0].node.timestamp*1000);
                    console.log("images")
                    console.log(g);
                  return (
                    <React.Fragment key={i}>
                      <Marker title={g.length.toString()+"枚の写真"} coordinate={{latitude:g[0].node.location.latitude, longitude:g[0].node.location.longitude}} onPress={()=>{navigation.navigate('MapModal',{user:route.params.user,date:route.params.date,images:g,theme_color:theme_color})}}>
                      <Image  style={{ width: 80, height: 80, }} resizeMode="contain" 
                      source={{ uri: g[0].node.image.uri }}/>
                      </Marker>
                      </React.Fragment>
                    );
                })}

                    {/* <Marker 
                    coordinate={markers.latlng} 
                    title={markers.title} 
                    description={markers.description} 
                    onPress={(e) => {
                    e.stopPropagation();
                    Alert.alert("マーカーを押したよ")}} > */}
                      {/* <Text> */}
                      {/* {marker.image && <Image source={{ uri: marker.image }} style={{ width: 100, height: 100 }} />} */}
                      {/* </Text> */}
                    {/* </Marker> */}
                  
                  {/* <Marker coordinate={{latitude: 35.249245,longitude: 139.686818}}> */}

                  
                  {/* <Button title="Reload Screen" onPress={ReadPhotos} /> */}
                    {/* {markers.image && <Image source={{ uri: markers.image }} style={{ width: 100, height: 100 }} />} */}
                  {/* </Marker> */}
                  {latlngs != null && latlngs.length > 0 && <Polyline coordinates={latlngs} strokeColor="#000" strokeWidth={3} />}
                
              </MapView>
              <View style={{position : 'absolute', right : '0%'}}>
                <Icon name="arrow-with-circle-left" size={35} style={{top:"130%",right:"1000%",fontFamily:'TrebuchetMS-Bold', color:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : 'lightpink')}} onPress={()=>{navigation.navigate("Drawer", { screen: "Calendar" ,user: route.params.user, date: route.params.date, theme_color:theme_color});}}/>
                {/* <Text>{photos.length}</Text>
                <Button onPress={() => {mapRef.current.animateToRegion(markers.latlng, 1 * 1000);}} title="現在地へ" />
                <Button onPress={() => {ZoomIn();}} title="ズームイン" />
                <Button onPress={() => {ZoomOut();}} title="ズームアウト" />
                <Text>{latlngs.length}</Text>
                <Button title="Move to Calendar" onPress={() => {navigation.navigate('Calendar',{user:route.params.user, date:route.params.date,theme_color:route.params.theme_color});}}/>
                <Button title="latlngsの確認" onPress={() => {console.log("latlngs"+JSON.stringify(latlngs));}}/>
                <Button title="openModal" onPress={() => {openModal();}}/>
                {selectedimg.length > 0 && <Button title="MapModal" onPress={() => {navigation.navigate('MapModal',{user:route.params.user, date:route.params.date,images:selectedimg,theme_color:route.params.theme_color})}}/>}
                <Text>{route.params.date}</Text>
                <Text>{altitude}</Text> */}
                
              </View>
            </View>
              
          );
}


export default MapDisplay