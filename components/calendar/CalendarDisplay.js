import React,{useState, useEffect,useContext} from 'react'
import {StyleSheet, View, Text, Button,TouchableOpacity,AppState} from 'react-native';
import { Calendar,LocaleConfig } from 'react-native-calendars';
import moment from "moment";
import axios from 'axios';
import {Moment} from 'moment';
import {OnLocationContext} from '../navigation/DrawerNavigation';
import Geolocation from 'react-native-geolocation-service';
import BackgroundGeolocation from "react-native-background-geolocation";
import onForegroundLocation from '../function/onForegroundLocation';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
const INITIAL_DATE = moment().format("YYYY-MM-DD");

const CalendarDisplay = ({navigation, route}) => {
    const [currentDate, setCurrentDate] = useState(moment());
    const [appState, setAppState] = useState(AppState.currentState);
    const [calendarid, setCalendarid] = useState(0);
    const {subscription, setSubscription } = useContext(OnLocationContext);

    // let subscription = null;
    // const handleAppStateChange = (nextAppState) => {
    //   // if(subscription != null){
    //   //   subscription.remove();
    //   //   setSubscription(null);
    //   // }

    //   console.log('app State: ' + appState+' next app State: '+nextAppState);
    //   if (appState != nextAppState) {
    //     if(nextAppState.match(/inactive|background/) && appState === 'active'){
    //       console.log(
    //         'App State: ' +
    //         'App has come to the background!'
    //       );
    //       // alert(
    //       //   'App State: ' +
    //       //   'App has come to the background!'
    //       // );
    //       console.log("back"+subscription)
    //       if(subscription == null){
    //         subscription = BackgroundGeolocation.onLocation(onLocation, onError);
    //       }
    //     }
    //     console.log("set")

    //     // alert('App State: ' + nextAppState);
    //     if (nextAppState === "active") {
    //       console.log(
    //         'App State: ' +
    //         'App has come to the foreground!'
    //       );
    //       // if(subscription != null){
    //       //   subscription.remove();
    //         // setSubscription(null);
    //       // }


    //       console.log("fore"+subscription);
    //     }
    //     setAppState(nextAppState);
    //   }
    // };

    useEffect(() => {
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
    distanceFilter: 500,
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
  const subscription = BackgroundGeolocation.onLocation(onLocation, onError);
  setSubscription(subscription);
  
}
}, [calendarid]);

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


    LocaleConfig.locales.jp = {
        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
      };
    LocaleConfig.defaultLocale = 'jp';
    const [selected, setSelected] = useState(INITIAL_DATE);
    const handleDayPress = (day) => {
        setSelected(day.dateString);
        console.log(new Date(day.dateString).toLocaleString());
        // navigation.navigate("Map",{date:new Date(day.dateString).toISOString().split('T')[0],user:route.params.user,email:route.params.email});

        axios.get(`/api/calendar/${route.params.user}/?search=${day.dateString}`)
      .then(response => {
        const {title,description} = response.data;
        console.log("title:"+title+"description:"+description);
        navigation.navigate("BottomTab", { screen: "Schedule" ,date:new Date(day.dateString).toISOString().split('T')[0],user:route.params.user,email:route.params.email, title:title, description:description,not_created:false,theme_color:route.params.theme_color});
        // navigation.navigate("Schedule",{date:new Date(day.dateString).toISOString().split('T')[0],user:route.params.user,email:route.params.email, title:title, description:description,not_created:false});
      })
      .catch(error => { 
        navigation.navigate("BottomTab", { screen: "Schedule" ,date:new Date(day.dateString).toISOString().split('T')[0],user:route.params.user,email:route.params.email, title:"", description:"", not_created:true,theme_color:route.params.theme_color});
        // navigation.navigate("Schedule",{date:new Date(day.dateString).toISOString().split('T')[0],user:route.params.user,email:route.params.email, title:"", description:"", not_created:true});
      });
    }
        
    return(
    <View style={styles.container}>
      {console.log(navigation)}
        <Calendar
        monthFormat={"yyyy年 MM月"}
        current={INITIAL_DATE}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: false,
            selectedColor: 'red',
            selectedTextColor: 'white'
          }
         }}
        onPressArrowLeft={(subtractMonth) => {
          subtractMonth();
          setCurrentDate(currentDate.add(-1, 'month'));
        }}
        onPressArrowRight={(addMonth) => {
          addMonth();
          setCurrentDate(currentDate.add(1, 'month'));
        }}
        theme={theme}
        style={styles.calendar}
        onDayPress={handleDayPress}
        dayComponent={({ date }) => {
          return (
            <TouchableOpacity onPress={() => {handleDayPress(date)}} style={styles.button}>
              <Text style={dayTextStyle(date, currentDate).dayText}> {date.day}</Text>
            </TouchableOpacity>
          );
        }}
      />
      {/* <Button onPress={()=>{stopOnLocation()}} title="止める"></Button>
      <Button onPress={()=>{checkOnLocation()}} title="確認"></Button>
      <Button onPress={()=>{startOnLocation()}} title="始める"></Button> */}
  </View>
);
};
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
      backgroundColor: date.dateString === moment().format('YYYY-MM-DD') ? '#CCCCCC' : 'transparent',
      color: date.month !== currentDate.month() + 1 ? 'gray' :  moment(date.dateString).days() === 0 ? 'red' : moment(date.dateString).days() === 6 ? 'blue' : 'black',
    },
  });

const styles = StyleSheet.create({
container: {
  
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
calendar: {
  fontfamily:"TrebuchetMS-Bold",
  width: 370,
  height: 470,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 10,
  bottom:50,
},
header: {
  fontFamily:"TrebuchetMS-Bold",
  fontSize: 100,
},
});

theme = {
  'stylesheet.calendar.header': {
      header: {
        // override the default header style react-native-calendars/src/calendar/header/style.js
        backgroundColor: 'gray', // set the backgroundColor for header
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        width: 370,
        right: 6,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      monthText: {
        color: '#fff',
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
        color: 'gray',
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
        borderColor: '#f5f5f5',
        borderWidth: 1,
        // backgroundColor: 'pink',
        flex:1,
        fontfamily:"TrebuchetMS-Bold",
      },
    },
  }

export default CalendarDisplay