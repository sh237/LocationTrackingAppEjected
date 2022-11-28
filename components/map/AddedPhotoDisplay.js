import React, { useContext, useRef,useState, useEffect}  from 'react'
import { TouchableOpacity, Text, View ,Image, Button, Alert, Dimensions, Modal} from 'react-native';
import { AddedPhotoContext,ThemeColorContext } from '../navigation/index';
import MapView, { Marker, Polyline} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios';


const AddedPhotoDisplay = ({navigation, route}) => {
    const {theme_color, setThemeColor} = useContext(ThemeColorContext);
    const mapRef = useRef(null);
    const [index, setIndex] = useState(0);
    const {addedPhoto, setAddedPhoto} = useContext(AddedPhotoContext);
    const [isDraggables, setIsDraggables] = useState([]);
    const [latlngs, setLatlngs] = useState(null);
    var { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.01;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    useEffect(() => {
        // if(route.params.calendar_id == null || addedPhoto.length == 0){
        //     Alert.alert("追加した写真がありません");
        //     navigation.goBack();
        // }

    },[]);

    useEffect(() => {
        if(addedPhoto != null){
            setIsDraggables(addedPhoto.map(() => true));
        }
    }, [addedPhoto]);

    useEffect(() => {
        if( addedPhoto == null|| addedPhoto.length == 0 ){
          console.log("alert");
          Alert.alert("追加した写真がありません");
          navigation.goBack();
        }
        console.log("addedPhoto");
        console.log(addedPhoto);
        if(mapRef != null && mapRef.current != null && addedPhoto != null && addedPhoto.length != 0){
          mapRef.current.animateToRegion({latitude:addedPhoto[0].node.location.latitude,longitude:addedPhoto[0].node.location.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA  }, 1 * 1000);
        }
      },[route.params]);


    const onDragStart = (index) => {
        console.log("onDragStart");
        console.log(index);
        setIndex(index);
        setIsDraggables(isDraggables.map((v, i) => i == index ? true : false));
    }

    const onDragEnd = (e) => {
        setLatlngs(e.nativeEvent.coordinate);

    }

    const Submit = () => {
        setIsDraggables(isDraggables.map(() => true));
        console.log(index);
        console.log(addedPhoto[index]);
        const payload = {calendar_id:route.params.calendar_id, longitude:latlngs.longitude, latitude:latlngs.latitude, filename:addedPhoto[index].node.image.uri.slice(5)};
        console.log(payload);
        axios.put(`/api/photo/${route.params.calendar_id}/?search=${addedPhoto[index].node.image.uri.slice(5)}`, payload).then(response => {
            console.log(response);
            Alert.alert("写真の位置情報を変更しました");
        }).catch(error => {
            console.log(error);
        })
    }

    return(
        <View style={{flex:1}}>
          <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={{
                  // latitude: 35.249245,
                  // longitude: 139.686818,
                  latitudeDelta: 0.02, //小さくなるほどズーム
                  longitudeDelta: 0.02,
              }
            }
            onRegionChangeComplete={region => {mapRef.current.getCamera().then((cam)=> {setAltitude(cam.altitude); }); }}
          >

              {(addedPhoto != null && addedPhoto.length > 0 && addedPhoto[0] != undefined) && addedPhoto.map((v, i) => {
                // console.log("date"+new Date(g[0].node.timestamp*1000).toLocaleString());
                // console.log("date"+g[0].node.timestamp*1000);
                console.log("isDraggables:");
                console.log(isDraggables);
                console.log("index");
                console.log(index);
                return (
                    <React.Fragment key={i}>
                    <Marker coordinate={{latitude:v.node.location.latitude, longitude:v.node.location.longitude}} onDrag={(e)=>{onDragStart(i)}} onDragEnd={(e)=>{onDragEnd(e)}} draggable={isDraggables[i]} >
                    <Image  style={{ width: 70, height: 70, }} resizeMode="contain" 
                    source={{ uri: v.node.image.uri }}/>
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
              {/* {latlngs.length > 0 && <Polyline coordinates={latlngs} strokeColor="#000" strokeWidth={3} />} */}
            
          </MapView>
          <View style={{position : 'absolute', right : '0%'}}>
            <Icon name="arrow-with-circle-left" size={40} style={{top:"70%",right:"350%",fontFamily:'TrebuchetMS-Bold', color:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : 'lightpink')}} onPress={()=>{navigation.navigate("Drawer", { screen: "Calendar" ,user: route.params.user, date: route.params.date, theme_color:theme_color});}}/>
            <TouchableOpacity onPress={() => {Submit()}} style={{}}>
                  <Text style={{fontFamily:"TrebuchetMS-Bold",
                                fontSize:20,
                                borderWidth:1, 
                                backgroundColor:(theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#404040' : 'lightpink',
                                color:((theme_color == 0) ? '#fff'  : (theme_color == 1) ? 'gainsboro' : 'white'),
                                borderRadius:1,
                                overflow:true,
                                top:"1600%",
                                right:"10%",
                                width:"100%",
                                height:"60%"}}>
                                    位置確定</Text>
            </TouchableOpacity>
          </View>
        </View>
          
      );
}

export default AddedPhotoDisplay