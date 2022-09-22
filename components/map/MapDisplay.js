import React , { Component,useState, useEffect,useRoute,useRef, useInsertionEffect } from 'react';
import { StyleSheet, Text, View ,Image, Button, Alert, Dimensions, Modal} from 'react-native';
import MapView, { Marker, Polyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {decode} from "@mapbox/polyline";
import {CameraRoll }from '@react-native-camera-roll/camera-roll';
import axios from 'axios';
// import Exif from 'react-native-exif';

const MapDisplay = ({navigation,route}) => {
    const mapRef = useRef(null);
    // let [image, setImage] = useState('');
    let [markers, setMarkers] = useState({});
    // let [proba, setProba] = useState(0);
    let [latlngs, setLatlngs] = useState([]);
    let [photos, setPhotos] = useState({});
    let [group, setGroup] = useState([]);
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
      getPhotos();
      const nowLocal = new Date()  
      const diff = nowLocal.getTimezoneOffset() * 60 * 1000
      const plusLocal = new Date(nowLocal - diff) 
      if(route.params.date == plusLocal.toISOString().split('T')[0]){
        console.log("navigation"+navigation.getParent())
        navigation.navigate("TodayMap",{user: route.params.user, date: route.params.date});
      }
      console.log("user:"+route.params.user+"date:"+route.params.date);

      axios
      .get(`/api/calendar/${route.params.user}/?search=${route.params.date}`)
      .then(response => {
        const {id} = response.data;
        if(id){
          setCalendarId(id);
          console.log("calendar_id"+id);
          axios.get(`/api/location/${id}/`).then(response_ => {
            console.log(response_.data);
            const {geometry} = response_.data;
            const {coordinates} = geometry;
            coordinates.map((v,i)=>{
              setLatlngs(latlngs => [...latlngs, {latitude: v[1], longitude: v[0]}]);
            })}).catch(error => {console.log(error);console.log("inner error");});
        }
      })
      .catch(error => {console.log(error); console.log("outer error");setLatlngs([{latitude: 35.249245, longitude: 139.686818}]);});
      
  
    }, []);

  let getPhotos = () => {
    let from = new Date(route.params.date);
    let to = new Date(route.params.date);
    from.setHours(from.getHours()-9);
    to.setHours(to.getHours()+15);
    console.log("from"+from.toLocaleString())
    console.log("to"+to.toLocaleString())
    CameraRoll.getPhotos({
      first: 10,
      assetType: 'Photos',
      groupTypes : 'All',
      fromTime:  from.valueOf(),
      toTime: to.valueOf(),     
    })
    .then(r => {
      console.log(r.edges.filter((v) => {return v.node.hasOwnProperty("location") && v.node.location != null && v != undefined}));
      let temp_photos = r.edges.filter((v) => {return v.node.hasOwnProperty("location") && v.node.location != null && v != undefined});
      setPhotos(temp_photos);
      groupByDistance(temp_photos);
      console.log("group"+group);
    })
    .catch((err) => {
       //Error Loading Images
       console.log("error"+err);
    });
  };

  const onZoomInPress = () => {
    mapRef.current.getCamera().then((cam) => {
        cam.zoom += 1;
        mapRef.current.animateCamera(cam);
    });
};

  const groupByDistance = (temp_photos) => {
    let newGroup = [[temp_photos[0]]];
    // setGroup([[photos[0]]]);//1番はじめの画像をgroupに追加
    for (let i = 1; i < temp_photos.length; i++) {
      let j = 0;
      while(j < newGroup.length){
        // console.log("newGroup"+JSON.stringify(newGroup));
        // console.log(i,j,newGroup.length);
        if (getDistance(temp_photos[i].node.location.latitude,temp_photos[i].node.location.longitude,newGroup[j][0].node.location.latitude,newGroup[j][0].node.location.longitude) < 0.0004){//photosのi番目がgroupのj番目に含まれていたら、
          newGroup = newGroup.map((v,index) => (index == j ? v.concat([[temp_photos[i]]]): v));
          // setGroup(group.map((v,index) => (index == j ? v.concat([temp_photos[i]]): v)));
          break;
        }else if(j+1 == newGroup.length){
          newGroup = newGroup.concat([[temp_photos[i]]]);
          break;
          // setGroup(prevGroup=>[...prevGroup, [temp_photos[i]]]);
        }
        j++;
      }
    }
    // console.log("newGroup"+JSON.stringify(newGroup));
    setGroup(newGroup);
  }     

  const getDistance = (lat1,lon1,lat2,lon2) =>{
    return Math.sqrt( Math.pow( lat2-lat1, 2 ) + Math.pow( lon2-lon1, 2 ) ) ;
  }
    
          return (
            <View style={{flex:1}}>
              <MapView
                  ref={mapRef}
                  style={{ flex: 1 }}
                  initialRegion={{
                      latitude: 35.249245,
                      longitude: 139.686818,
                      // latitude: latlngs[0].latitude,
                      // longitude: latlngs[0].longitude,
                      // latitude: markers.latlng.latitude,
                      // longitude: markers.latlng.longitude,
                      latitudeDelta: 0.02, //小さくなるほどズーム
                      longitudeDelta: 0.02,
                  }
                }
                onRegionChangeComplete={region => {mapRef.current.getCamera().then((cam)=> {setAltitude(cam.altitude); }); }}
                // onPanDrag={()=> {mapRef.current.getCamera().then((cam)=> {setAltitude(cam.altitude); }); }}
              >

                  {(group.length > 0 && group[0][0] != undefined) && group.map((g, i) => {
                    // console.log("groupp"+group);
                    // console.log("length"+group.length)
                    console.log("date"+new Date(g[0].node.timestamp*1000).toLocaleString());
                    console.log("date"+g[0].node.timestamp*1000);
                  return (
                    <React.Fragment key={i}>
                      <Marker title={g.length.toString()} description={g.length.toString()}coordinate={{latitude:g[0].node.location.latitude, longitude:g[0].node.location.longitude}} onPress={()=>{navigation.navigate('MapModal',{images:g})}}>
                      <Image  style={{ width: 50, height: 50, }} resizeMode="contain" 
                      source={{ uri: g[0].node.image.uri }}/>
                      </Marker>
                      </React.Fragment>
                    );
                })}

                    <Marker 
                    coordinate={markers.latlng} 
                    title={markers.title} 
                    description={markers.description} 
                    onPress={(e) => {
                    e.stopPropagation();
                    Alert.alert("マーカーを押したよ")}} >
                      {/* <Text> */}
                      {/* {marker.image && <Image source={{ uri: marker.image }} style={{ width: 100, height: 100 }} />} */}
                      {/* </Text> */}
                    </Marker>
                  
                  <Marker coordinate={{latitude: 35.249245,longitude: 139.686818}}>

                  
                  {/* <Button title="Reload Screen" onPress={ReadPhotos} /> */}
                    {/* {markers.image && <Image source={{ uri: markers.image }} style={{ width: 100, height: 100 }} />} */}
                  </Marker>
                  {latlngs.length > 0 && <Polyline coordinates={latlngs} strokeColor="#000" strokeWidth={3} />}
                
              </MapView>
              <View style={{position : 'absolute', right : '0%'}}>
              <Text>{photos.length}</Text>
                <Button onPress={() => {mapRef.current.animateToRegion(markers.latlng, 1 * 1000);}} title="現在地へ" />
                <Button onPress={() => {ZoomIn();}} title="ズームイン" />
                <Button onPress={() => {ZoomOut();}} title="ズームアウト" />
                {/* <Text>{latlngs.length}</Text> */}
                <Button title="Move to Calendar" onPress={() => {navigation.navigate('Calendar');}}/>
                <Button title="latlngsの確認" onPress={() => {console.log("latlngs"+JSON.stringify(latlngs));}}/>
                <Button title="openModal" onPress={() => {openModal();}}/>
                {selectedimg.length > 0 && <Button title="MapModal" onPress={() => {navigation.navigate('MapModal',selectedimg)}}/>}
                <Text>{route.params.date}</Text>
                <Text>{altitude}</Text>
                
              </View>
            </View>
              
          );
}


export default MapDisplay