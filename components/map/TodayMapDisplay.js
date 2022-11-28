import React , { Component,useState, useEffect,useContext,useRef, useInsertionEffect } from 'react';
import { StyleSheet, Text, View ,Image, Button, Alert, Dimensions, Modal} from 'react-native';
import MapView, { Marker, Polyline} from 'react-native-maps';
import {CameraRoll }from '@react-native-camera-roll/camera-roll';
import {  ImageContext, ThemeColorContext } from '../navigation/index';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Entypo';
// import Exif from 'react-native-exif';

const TodayMapDisplay = ({navigation,route}) => {
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
    let [calendarid, setCalendarId] = useState(0);
    let [interval_, setInterval_] = useState(10);
    const intervalRef = useRef(null);

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
      // getPhotos();
      // console.log(`/api/calendar/${route.params.user}/?search=${route.params.date}`);
      axios
      .get(`/api/calendar/${route.params.user}/?search=${route.params.date}`)
      .then(response => {
        console.log("id___" +response.data.id);
        const {id} = response.data;
        setCalendarId(id);
      })
      .catch(error => {
        const payload = { user: route.params.user, date: route.params.date};
        // console.log(payload);
          axios.post(`/api/calendar/`,payload).then(response => {
            const {id} = response.data;
            // console.log("created calendar"+route.params.date);
            setCalendarId(id);
            console.log(id);
          }
          ).catch(error => console.log("inner:::"+error));
      });
      if(mapRef != null && mapRef.current != null && group != null && group[0] != null && group[0][0] != null){
        mapRef.current.animateToRegion({latitude:group[0][0].node.location.latitude,longitude:group[0][0].node.location.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA  }, 1 * 1000);
      }
      
    }, []);

    useEffect(() => {
      // console.log("setTimeout")
      // loadLatLngs()
      // const timer = setTimeout(()=>loadLatLngs(), 60* 1000);//1分間隔
      // return () => {
      //   console.log(
      //     ' Clearing the interval and timeout',
      //   );
      //   clearTimeout(timer);
      // };
      loadLatLngs();
      intervalRef.current = setInterval(() => {
        loadLatLngs();
      }, 60000*interval_);
    }, [calendarid]);

    useEffect(() => {
      // console.log("mapref")
      // console.log(mapRef.current);
      if( latlngs != null && latlngs != [] && latlngs.length>0){
        mapRef.current.animateToRegion({latitude:latlngs[latlngs.length-1].latitude, longitude:latlngs[latlngs.length-1].longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA}, 1 * 1000);
      }
      
    }, [latlngs, mapRef]);

    const loadLatLngs = () => {
      if(calendarid!=0){
      axios.get(`/api/location/${calendarid}/`).then(response_ => {
        const coords = [];
        const {geometry} = response_.data;
        // console.log("latlngs setii");
        const {coordinates} = geometry;
        coordinates.map((v,i)=>{
        coords.push({latitude: v[1], longitude: v[0]});
      })
        // if(latlngs != null && coords.length == latlngs.length){
        //   return true;
        // }else{
      setLatlngs(coords);
        //   return false;
        // }
      }).catch(error => {
        console.log(error);
        console.log("inner error");
        });
      }
      
    }
  
  
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
                      // latitude: markers.latlng.latitude,
                      // longitude: markers.latlng.longitude,
                      latitudeDelta: 0.02, //小さくなるほどズーム
                      longitudeDelta: 0.02,
                  }
                }
                showsScale={true}
                // followsUserLocation={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
                // userLocationAnnotationTitle="Mylocation"
                showsCompass={false}
                // showsMyLocationButton={true}
                // followsUserLocation={true}
                // onRegionChangeComplete={region => {mapRef.current.getCamera().then((cam)=> {setAltitude(cam.altitude); }); }}
                // onPanDrag={()=> {mapRef.current.getCamera().then((cam)=> {setAltitude(cam.altitude); }); }}
              >

                  {group != null && (group.length > 0 && group[0][0] != undefined) && group.map((g, i) => {
                    // console.log("groupp"+group);
                    // console.log("length"+group.length)
                    console.log(group);
                    console.log("date"+new Date(g[0].node.timestamp*1000).toLocaleString());
                    console.log("date"+g[0].node.timestamp*1000);
                  return (
                    <React.Fragment key={i}>
                      <Marker title={g.length.toString()} description={g.length.toString()}coordinate={{latitude:g[0].node.location.latitude, longitude:g[0].node.location.longitude}} onPress={()=>{navigation.navigate('MapModal',{images:g})}}>
                      <Image  style={{ width: 100, height: 100, }} resizeMode="contain" 
                      source={{ uri: g[0].node.image.uri }}/>
                      </Marker>
                      </React.Fragment>
                    );
                })}

                  {/* <Marker coordinate={{latitude: 35.249245,longitude: 139.686818}}> */}

                  
                  {/* <Button title="Reload Screen" onPress={ReadPhotos} /> */}
                    {/* {markers.image && <Image source={{ uri: markers.image }} style={{ width: 100, height: 100 }} />} */}
                  {/* </Marker> */}
                  {latlngs.length > 0 && <Polyline coordinates={latlngs} strokeColor="rgba(255,0,0,0.5)" strokeWidth={5} />}
                
              </MapView>
              <View style={{position : 'absolute', right : '0%'}}>
              <Icon name="arrow-with-circle-left" size={40} style={{top:"100%",right:"850%",fontFamily:'TrebuchetMS-Bold', color:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : 'lightpink')}} onPress={()=>{navigation.navigate("Drawer", { screen: "Calendar" ,user: route.params.user, date: route.params.date, theme_color:theme_color});}}/>
              {/* <Text>{photos.length}</Text>
                <Button onPress={() => {mapRef.current.animateToRegion(latlngs[0], 1 * 1000);}} title="現在地へ" />
                <Button onPress={() => {ZoomIn();}} title="ズームイン" />
                <Button onPress={() => {ZoomOut();}} title="ズームアウト" /> */}
                {/* <Text>{latlngs.length}</Text> */}
                {/* <Button title="Move to Calendar" onPress={() => {navigation.navigate('Calendar',{theme_color:route.params.theme_color});}}/>
                <Button title="photosとgroupの確認" onPress={() => {console.log("photos"+photos);console.log("group"+group);}}/>
                <Button title="openModal" onPress={() => {openModal();}}/> */}
                {/* {selectedimg.length > 0 && <Button title="MapModal" onPress={() => {navigation.navigate('MapModal',selectedimg)}}/>} */}
                {/* <Text>{route.params.date}</Text>
                <Text>{altitude}</Text>
                <Text>{calendarid}</Text> */}

                
              </View>
            </View>
              
          );
}


export default TodayMapDisplay