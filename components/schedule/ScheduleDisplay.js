import axios from 'axios';
import React, { Component , useState,useEffect} from 'react';
import { View, Text, TextInput,StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import onForegroundLocation from '../function/onForegroundLocation';

const ScheduleDisplay = ({navigation, route}) => {
    const [title, setTitle] = useState(route.params.title);
    const [description, setDescription] = useState(route.params.description);
    const loadData = () =>{
        axios.get()
    }
    useEffect(() => {
      setTitle(route.params.title);
      setDescription(route.params.description);

    }
    ,[route.params.title,route.params.description]);

    useEffect(() => {
      // const timer = setTimeout(()=>onForegroundLocation(route.params.calendarid), 60 * 1000);
      // return () => clearTimeout(timer);

    }, []);


  return (
    <View style={styles.parent}>
        <Text style={styles.title}>タイトル<Icon style={styles.icon1} name="edit" size={25} onPress={()=>navigation.navigate("EditModal",{user:route.params.user, date:route.params.date,title:title,description:description, text:"タイトル", not_created:route.params.not_created,theme_color:route.params.theme_color})}/></Text>
      <Text style={styles.title_body}>{title}</Text>
        <Text style={styles.description}>説明 <Icon style={styles.icon2} name="edit" size={25} onPress={()=>navigation.navigate("EditModal",{user:route.params.user, date:route.params.date ,title:title,description:description, isMultiline:true, text:"説明",not_created:route.params.not_created,theme_color:route.params.theme_color})}/></Text>
      <Text style={styles.description_body}>{description }</Text>
      </View>
    
  )
}
const styles = StyleSheet.create({
  parent:{
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    
  },
  title: {
    top:20,
    fontSize: 18,
    fontFamily: 'TrebuchetMS-Bold',
  },
  title_body: {
    width: 350,
    paddingTop: 20,
    paddingBottom: 20,
    top:40,
    fontSize: 25,
    borderWidth:2,
    fontFamily: 'TrebuchetMS-Bold',

  },
  icon1: {
    position: "absolute",
    bottom: 715,
    left: 240
  },
  description: {
    top: 60,
    fontSize: 18,
    fontFamily: 'TrebuchetMS-Bold',
  },
  description_body: {
    width: 350,
    paddingTop: 10,
    paddingBottom:350,
    top: 80,
    fontSize: 20,
    borderWidth:2,
    fontFamily: 'TrebuchetMS-Bold',
  },
  icon2: {
    position:"absolute",
    bottom: 595,
    left: 215,
  },
});

export default ScheduleDisplay