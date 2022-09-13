import React , { Component,useState, useEffect,useRoute,useRef, useInsertionEffect } from 'react';
import { StyleSheet, Text, View ,Image, Button, Alert, Dimensions, Modal} from 'react-native';
import MapView, { Marker, Polyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {decode} from "@mapbox/polyline";
import {CameraRoll }from '@react-native-camera-roll/camera-roll';
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
      const _watchId = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          // setProba(prev => prev+1);
          // console.log(proba)
          // if(proba >= 10){
          //   setProba(prev => {prev = 0});
          //   //apiで送信
            // setLatlngs((latlngs) => ([ ...latlngs,  {latitude:latitude, longitude:longitude} ]));
          //   console.log('latlngsに値が追加されました。');
          // }

          // setLocation({latitude, longitude});
          setMarkers({latlng:{latitude:latitude, longitude:longitude},title:'walkman',description:'walkman'});
          setLatlngs((latlngs) => ([ ...latlngs,  {latitude:latitude, longitude:longitude} ]));
          // console.log(latitude, longitude);
          
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 1000,
          fastestInterval: 2000,
        },
      );
  
      return () => {
        if (_watchId) {
          Geolocation.clearWatch(_watchId);
        }
      };
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

  const selectedImagesShow = (images)=>{
    return;
  }

    
          return (
            <View style={{flex:1}}>
              <MapView
                  ref={mapRef}
                  style={{ flex: 1 }}
                  initialRegion={{
                      latitude: 35.249245,
                      longitude: 139.686818,
                      // latitude: markers.latlng.latitude,
                      // longitude: markers.latlng.longitude,
                      latitudeDelta: 0.02, //小さくなるほどズーム
                      longitudeDelta: 0.02,
                  }
                }
                onRegionChangeComplete={region => {mapRef.current.getCamera().then((cam)=> {setAltitude(cam.altitude); }); }}
                // onPanDrag={()=> {mapRef.current.getCamera().then((cam)=> {setAltitude(cam.altitude); }); }}
              >

                  {/* {photos.length > 0 && photos.map((p, i) => {
                  return (
                    <React.Fragment key={i}>
                    {(p.node.hasOwnProperty('location')&& p.node.location != null) ? (
                      <Marker title={new Date(p.node.timestamp*1000).toLocaleString()}coordinate={{latitude:p.node.location.latitude, longitude:p.node.location.longitude}} >
                      <Image  style={{ width: 50, height: 50, }} resizeMode="contain"
                      source={{ uri: p.node.image.uri }}/>
                      </Marker>) 
                    : (
                      <Marker coordinate={markers.latlng} >
                      <Image  style={{ width: 50, height: 50, }} resizeMode="contain"
                        source={{ uri: p.node.image.uri }} />
                      </Marker>)}
                      </React.Fragment>
                    );
                })} */}
                {/* <Modal
                visible={imgmodal}
                animationType={'slide'}
                onRequestClose={() => this.closeModal()}
                transparent
                >
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
                    <Button
                      onPress={() => this.closeModal()}
                      title="Close modal"
                    >
                    </Button>
                  </View>
                </Modal> */}


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
                <Button title="photosとgroupの確認" onPress={() => {console.log("photos"+photos);console.log("group"+group);}}/>
                <Button title="openModal" onPress={() => {openModal();}}/>
                {selectedimg.length > 0 && <Button title="MapModal" onPress={() => {navigation.navigate('MapModal',selectedimg)}}/>}
                <Text>{route.params.date}</Text>
                <Text>{altitude}</Text>

                
              </View>
            </View>
              
          );
}


export default MapDisplay