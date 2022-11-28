import React,{useState, useEffect,useContext, useLayoutEffect} from 'react'
import {StyleSheet, View, Text, Linking,TouchableOpacity,AppState} from 'react-native';
import { Calendar,LocaleConfig } from 'react-native-calendars';
import moment from "moment";
import axios from 'axios';
import {OnLocationContext} from '../navigation/DrawerNavigation';
import Geolocation from 'react-native-geolocation-service';
import BackgroundGeolocation from "react-native-background-geolocation";
import { LogBox } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {ImageContext, AddedPhotoContext, ThemeColorContext} from '../navigation/index';
import { loadImageFromUrl } from "react-native-jsi-image"
import {CameraRoll }from '@react-native-camera-roll/camera-roll';
Icon.loadFont();

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `location` with no listeners registered.',
  'Sending `activitychange` with no listeners registered.',
]);

const INITIAL_DATE = moment().format("YYYY-MM-DD");

const CalendarDisplay = ({navigation, route}) => {
    const {theme_color, setThemeColor} = useContext(ThemeColorContext);
    const [currentDate, setCurrentDate] = useState(moment());
    const [appState, setAppState] = useState(AppState.currentState);
    const {calendarid, setCalendarid} = useContext(OnLocationContext);
    const {subscription, setSubscription } = useContext(OnLocationContext);
    const {group, setGroup} = useContext(ImageContext);
    const {addedPhoto, setAddedPhoto} = useContext(AddedPhotoContext);
    const [day, setDay] = useState(null);
    const [{key, theme}, setTheme] = useState({key: theme_color, theme: {
      'stylesheet.calendar.header': {
        header: {
          // override the default header style react-native-calendars/src/calendar/header/style.js
          backgroundColor: (theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#404040' : 'lightpink', // カレンダーのヘッダーの背景色
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 15,
          width: 366,
          right: 6,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
        monthText: {
          color: (theme_color == 0) ? 'white'  : (theme_color == 1) ? 'gainsboro' : 'white', // カレンダーのヘッダーの文字色
          fontWeight: '700',
          fontSize: 20,
          fontFamily:"TrebuchetMS-Bold",
        },
        dayHeader: {
          marginTop: 13,
          // marginBottom: 7,
          // width: 30,
          textAlign: 'center',
          fontSize: 18,
          bottom: 10,
          color:  ((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : 'white'), // 曜日の文字色
          fontFamily:"TrebuchetMS-Bold",
        },
      },
      'stylesheet.calendar.main': {
        monthView: {
          flex: 1,
          height: '100%',
          justifyContent: 'space-around',
          fontfamily:"TrebuchetMS-Bold",
        },
        week: {
          flex: 1,
          marginVertical: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          fontfamily:"TrebuchetMS-Bold",
        },
        dayContainer: {
          borderColor: '#f5f5f5', // 日付の枠線の色
          borderWidth: 1,
          // backgroundColor: 'pink',
          flex:1,
          fontfamily:"TrebuchetMS-Bold",
        },
      }
        }});
    useLayoutEffect(()=>{
      loadDayData(moment().format("YYYY-MM"));
    },[])
    // useLayoutEffect(()=>{
    //   console.lgo("")
    //   console.log(currentDate.format("YYYY-MM"));
    //   loadDayData(currentDate.format("YYYY-MM"));
    // },[currentDate])

    useEffect(() => {
      loadDayData(moment().format("YYYY-MM"));
      axios
      .get(`/api/calendar/${route.params.user}/?search=${new Date(new Date() -  new Date().getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]}`)
      .then(response => {
        console.log("id___" +response.data.id);
        const {id} = response.data;
        setCalendarid(id);
      })
      .catch(error => {
        const payload = { user: route.params.user, date: new Date(new Date() -  new Date().getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]};
        console.log(payload);
          axios.post(`/api/calendar/`,payload).then(response => {
            const {id} = response.data;
            // console.log("created calendar"+route.params.date);
            setCalendarid(id);
            console.log(id);
          }
          ).catch(error => console.log("inner:::"+error));
      });
      
}, []);


useEffect(() => {
  if(calendarid != 0 && calendarid != null){
  Geolocation.getCurrentPosition(
    position => {
      const {latitude, longitude} = position.coords;
      const payload = { calendar: calendarid, mpoint:"MULTIPOINT ("+longitude+" "+latitude+")"};
      axios.post(`/api/location/`,payload).then(response => {
        console.log("updated location");
      }).catch(error => console.log("post error:::"+error));
    },
    error => {
      console.log(error.code, error.message);
    },
    {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
  );
  BackgroundGeolocation.ready({
    distanceFilter: 100,
    stopOnTerminate: false,
    startOnBoot: true, 
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
  }, (state) => {
    console.log("- BackgroundGeolocation is ready: ");

    if (!state.enabled) {
      BackgroundGeolocation.start(function() {
        console.log("- Start success");
      });
  }});
  if(route.params.is_tracking){
    const subscription = BackgroundGeolocation.onLocation(onLocation, onError);
    setSubscription(subscription);
  }
  }
}, [calendarid]);

useEffect(()=>{
  // const routes = navigation.dangerouslyGetParent().state.routes;
  setGroup(null);
  setAddedPhoto(null);
  console.log("inside navigation change")
  setTheme({key: theme_color, theme: {
  'stylesheet.calendar.header': {
      header: {
        // override the default header style react-native-calendars/src/calendar/header/style.js
        backgroundColor: (theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#404040' : 'lightpink', // カレンダーのヘッダーの背景色
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        width: 366,
        right: 6,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      monthText: {
        color: (theme_color == 0) ? 'white'  : (theme_color == 1) ? 'gainsboro' : 'white', // カレンダーのヘッダーの文字色
        fontWeight: '700',
        fontSize: 20,
        fontFamily:"TrebuchetMS-Bold",
      },
      dayHeader: {
        marginTop: 13,
        // marginBottom: 7,
        // width: 30,
        textAlign: 'center',
        fontSize: 18,
        bottom: 10,
        color:  ((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : 'white'), // 曜日の文字色
        fontFamily:"TrebuchetMS-Bold",
      },
    },
    'stylesheet.calendar.main': {
      monthView: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-around',
        fontfamily:"TrebuchetMS-Bold",
      },
      week: {
        flex: 1,
        marginVertical: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        fontfamily:"TrebuchetMS-Bold",
      },
      dayContainer: {
        borderColor: '#f5f5f5', // 日付の枠線の色
        borderWidth: 1,
        // backgroundColor: 'pink',
        flex:1,
        fontfamily:"TrebuchetMS-Bold",
      },
    }}});},[route.params]);

const stopOnLocation = () =>{
  console.log("stopOnLocation");
  if(subscription!= null){
    subscription["remove"]();
    setSubscription(null);
  }
}
const checkOnLocation = () =>{
  console.log("subscription")
  console.log(subscription)
}

const startOnLocation = () =>{
  console.log("startOnLocation")
  if(subscription==null){
    setSubscription(BackgroundGeolocation.onLocation(onLocation, onError));
  }
}

const loadDayData = (date) => {
  // let date = moment().format("YYYY-MM");
  axios.get(`/api/calendar/month?search=${date}`).then(response => {
    let newdata = {};
    response.data.map((item) => {
      if(!(item.title == null && item.description == null)){
      newdata[item.date] = {schedule:true};
      }});
      // setDay(newdata);
      axios.get(`/api/location/month/${route.params.user}?search=${date}`).then(response => {
        response.data.map((item) => {
          if(newdata.hasOwnProperty(item.calendar.date)){
            newdata[item.calendar.date] = {schedule:true, location:true};
          }else{
            newdata[item.calendar.date] = {location:true};
          }
        })
        setDay(newdata);
      })
        
      .catch(error => console.log("location error:::"+error));

    }).catch(error => console.log("loadDayData:::"+error));
  }


const onLocation = (location) => {
  // console.log("latlngs"+latlngs);
  console.log("onlocation"+calendarid+location);
  if(calendarid!=0){
    const payload = { calendar: calendarid, mpoint:"MULTIPOINT ("+location.coords.longitude+" "+location.coords.latitude+")"};
    axios.put(`/api/location/update/${calendarid}`,payload).then(response => {
      console.log("updated location");
    }).catch(error => console.log("post error:::"+error));
  }
  }


    const onError = (error) => {
      console.warn('[location] ERROR -', error);
    }

    let getPhotos = async(date, calendarid_) => {
      let from = new Date(date);
      let to = new Date(date);
      from.setHours(from.getHours()-9);
      to.setHours(to.getHours()+15);
      // console.log("from"+from.toLocaleString())
      // console.log("to"+to.toLocaleString())
      CameraRoll.getPhotos({
        first: 30,
        assetType: 'Photos',
        groupTypes : 'All',
        fromTime:  from.valueOf(),
        toTime: to.valueOf(),   
      })
      .then(async(r) => {
        let savedPhotos = [];
        await axios.get(`/api/photo/list/${calendarid_}`).then(async(response) => {

          console.log("response");
          console.log(response.data );
          await response.data.map((item) => {
            savedPhotos.push({filename:item.filename, latitude:item.latitude, longitude:item.longitude});
          })
          console.log("PresavedPhotos");
          console.log(savedPhotos);
        }).catch(error => console.log("photo error:::"+error));
        console.log("AfsavedPhotos");
        console.log(savedPhotos);
        // let temp_photos = r.edges.filter((v) => {
        //   return v.node.hasOwnProperty("location") && v.node.location != null && v != undefined}
        //   );
        console.log("r.edges");
        let addedPhoto = [];
        let temp_photos = await r.edges.filter((v) => {
          if  (v.node.hasOwnProperty("location") && v.node.location != null && v != undefined){
            console.log("if")
            return v;
          }else{
            console.log("else")
            console.log(savedPhotos);
            let temp;
            if(savedPhotos.length > 0){
            savedPhotos.map((item) => {
              console.log(item.filename)
              console.log(v.node.image.filename)
              if("ph://"+item.filename == v.node.image.uri){
                console.log("if2")
                v.node.location = {latitude:item.latitude, longitude:item.longitude};
                console.log(v);
                temp = v;
                addedPhoto.push(v);
              }
            });
            return temp;
       }}
      });
      setAddedPhoto(addedPhoto);
      console.log("temp_photos");
      console.log(temp_photos);
      // Linking.openURL(temp_photos[0].node.image.uri);
      // Linking.openURL("photos-redirect://");
      groupByDistance(temp_photos);
      console.log("group");
      console.log(group);
      })
      .catch((err) => {
         //Error Loading Images
         console.log("error"+err);
      });
    };

    const groupByDistance = (temp_photos) => {
      if(temp_photos.length == 0 || temp_photos == undefined){
        setGroup(null);
        console.log("stopped");
        return;
      }
      
      let newGroup = [[temp_photos[0]]];
      // setGroup([[photos[0]]]);//1番はじめの画像をgroupに追加
      for (let i = 1; i < temp_photos.length; i++) {
        let j = 0;
        while(j < newGroup.length){
          // console.log("newGroup"+JSON.stringify(newGroup));
          // console.log(i,j,newGroup.length);
          if (getDistance(temp_photos[i].node.location.latitude,temp_photos[i].node.location.longitude,newGroup[j][0].node.location.latitude,newGroup[j][0].node.location.longitude) < 0.0004){//photosのi番目がgroupのj番目に含まれていたら、
            newGroup = newGroup.map((v,index) => (index == j ? v.concat([temp_photos[i]]): v));
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
      console.log("newGroup"+JSON.stringify(newGroup));
      setGroup(newGroup);
    }     
  
    const getDistance = (lat1,lon1,lat2,lon2) =>{
      return Math.sqrt( Math.pow( lat2-lat1, 2 ) + Math.pow( lon2-lon1, 2 ) ) ;
    }


    LocaleConfig.locales.jp = {
        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
      };
    LocaleConfig.defaultLocale = 'jp';
    const [selected, setSelected] = useState(INITIAL_DATE);
    const handleDayPress = (day) => {
        let date = new Date(day.dateString).toISOString().split('T')[0];
        // setSelected(date);
        // getPhotos(date);
        console.log(new Date(day.dateString).toLocaleString());
        // navigation.navigate("Map",{date:new Date(day.dateString).toISOString().split('T')[0],user:route.params.user,email:route.params.email});

      axios.get(`/api/calendar/${route.params.user}/?search=${date}`)
      .then(response => {
        const {title,id,description} = response.data;
        // setSelected(date);
        getPhotos(date,id);
        console.log("title:"+title+"description:"+description);
        navigation.navigate("BottomTab", { screen: "Schedule" ,date:date,user:route.params.user,email:route.params.email, title:title, description:description,not_created:false,theme_color:theme_color,calendar_id:id});
        // navigation.navigate("Schedule",{date:new Date(day.dateString).toISOString().split('T')[0],user:route.params.user,email:route.params.email, title:title, description:description,not_created:false});
      })
      .catch(error => { 
        // setSelected(date);
        getPhotos(date,null);
        navigation.navigate("BottomTab", { screen: "Schedule" ,date:date,user:route.params.user,email:route.params.email, title:"", description:"", not_created:true,theme_color:theme_color});
        // navigation.navigate("Schedule",{date:new Date(day.dateString).toISOString().split('T')[0],user:route.params.user,email:route.params.email, title:"", description:"", not_created:true});
      });
    }
    const  _renderArrow = (direction) => {
      if(direction === 'left') {
          return <Icon name="arrow-with-circle-left" size={30} color={(theme_color == 0) ? '#fff'  : (theme_color == 1) ? 'gainsboro' : 'white' }/>
      } else {
          return <Icon name="arrow-with-circle-right" size={30} color={(theme_color == 0) ? '#fff'  : (theme_color == 1) ? 'gainsboro' : 'white' }/>
      }
  }



  const dayTextStyle = (date, currentDate) =>
  StyleSheet.create({
    dayText: {
      fontFamily:"TrebuchetMS-Bold",
      fontSize: 20,
      borderWidth: 1,
      borderRadius: 1,
      paddingLeft: String(date.day).length == 2 ? 5 : 10,
      paddingTop: 15,
      height: "100%",
      width: "100%",
      backgroundColor: date.dateString === moment().format('YYYY-MM-DD') ? ((theme_color == 0) ? '#CCCCCC'  : (theme_color == 1) ? '#8c8c8c' : 'white') : ((theme_color == 0) ? 'transparent'  : (theme_color == 1) ? '#404040' : 'mistyrose'),
      color:  date.dateString == moment().format('YYYY-MM-DD') ?  ((theme_color == 0) ? 'snow'  : (theme_color == 1) ? 'black' : '#404040')   :      date.month !== currentDate.month() + 1 ? 'gray' :  moment(date.dateString).days() === 0 ? 'red' : moment(date.dateString).days() === 6 ? 'blue' : ((theme_color == 0) ? '#292929'  : (theme_color == 1) ? 'gainsboro' : '#505050'),
    },
  });

const styles = StyleSheet.create({
container: {
  
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:((theme_color == 0) ? 'snow'  : (theme_color == 1) ? '#292929' : 'mistyrose'),
},
calendar: {
  fontfamily:"TrebuchetMS-Bold",
  width: 370,
  height: 480,
  borderWidth: 3,
  borderColor: ((theme_color == 2) ? 'mistyrose': 'gray'),
  borderRadius: 10,
  bottom:50,
  backgroundColor: ((theme_color == 0) ? 'snow'  : (theme_color == 1) ? '#404040' : 'lightpink'),

},
header: {
  fontFamily:"TrebuchetMS-Bold",
  fontSize: 100,
},
icon1:{
  position: 'absolute',
  top:"73%",
  color:((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'ivory' : 'black'),
},
icon2:{
  position: 'absolute',
  left: 2,
  top:"73%",
  color:((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'ivory' : 'black'),
},
header_: {
  // override the default header style react-native-calendars/src/calendar/header/style.js
  backgroundColor: (theme_color == 0) ? 'gray'  : (theme_color == 1) ? '#404040' : 'lightpink', // カレンダーのヘッダーの背景色
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 15,
  width: 366,
  right: 6,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
},

});



        
    return(
    <View style={styles.container}>
      {console.log(navigation)}
        <Calendar
        key={key}
        theme={theme}
        monthFormat={"yyyy年 MM月"}
        current={INITIAL_DATE}
        renderArrow={_renderArrow}
        onPressArrowLeft={(subtractMonth) => {
          subtractMonth();
          setCurrentDate(currentDate.add(-1, 'month'));
        }}
        onPressArrowRight={(addMonth) => {
          addMonth();
          setCurrentDate(currentDate.add(1, 'month'));
        }}
        onMonthChange={(month) => {
          loadDayData(month.dateString.slice(0,8))
        }} 
        style={styles.calendar}
        onDayPress={handleDayPress}
        dayComponent={({ date }) => {
          return (
            <TouchableOpacity onPress={() => {handleDayPress(date)}} style={styles.container}>
              <Text style={dayTextStyle(date, currentDate).dayText}> {date.day}</Text>
              {day != null && day.hasOwnProperty(date.dateString) && day[date.dateString]['schedule'] && 
              <Icon name="brush" size={13} style={styles.icon1}  />}
              {day != null && day.hasOwnProperty(date.dateString) && day[date.dateString]['location'] && 
              <Icon name="location" size={13} style={styles.icon2} />}
            </TouchableOpacity>
          );
        }}
      />
      {/* <Button onPress={()=>{stopOnLocation()}} title="止める"></Button>
      <Button onPress={()=>{checkOnLocation()}} title="確認"></Button>
      <Button onPress={()=>{startOnLocation()}} title="始める"></Button> */}
      {/* <Button onPress={()=>{navigation.navigate("PasswordChange")}} title="パスワード変更"></Button>  */}
  </View>
);


};

export default CalendarDisplay