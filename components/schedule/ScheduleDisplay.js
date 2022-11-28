import axios from 'axios';
import React, { useContext , useState,useEffect} from 'react';
import { Dimensions, Text, Image,StyleSheet, ScrollView,SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { ImageContext } from '../navigation/index';
import { ThemeColorContext } from '../navigation/index';

const ScheduleDisplay = ({navigation, route}) => {
  const {theme_color, setThemeColor} = useContext(ThemeColorContext);
    const [title, setTitle] = useState(route.params.title);
    const [description, setDescription] = useState(route.params.description);
    const {group, setGroup} = useContext(ImageContext);

    useEffect(() => {
      setTitle(route.params.title);
      setDescription(route.params.description);

    }
    ,[route.params.title,route.params.description]);

    useEffect(() => {
      // const timer = setTimeout(()=>onForegroundLocation(route.params.calendarid), 60 * 1000);
      // return () => clearTimeout(timer);

    }, []);
    const returnGroupLength = () => {
      let count = 0;
      group.map((v_,i_)=>{
        v_.map((v,i)=>{
          count++;
          })
      });
      return count;
    }

    const styles = StyleSheet.create({
      parent:{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor:((theme_color == 0) ? 'white'  : (theme_color == 1) ? '#292929' : 'mistyrose')
      },

      title: {
        top:20,
        fontSize: 18,
        fontFamily: 'TrebuchetMS-Bold',
        color:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : '#505050'),
      },

      title_body: {
        width: 350,
        paddingTop: 20,
        paddingBottom: 20,
        top:40,
        fontSize: 25,
        color:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : '#505050'),
        borderWidth:2,
        borderRadius:10,
        borderColor:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : '#505050'),
        overflow: "hidden",
        fontFamily: 'TrebuchetMS-Bold',
        backgroundColor:((theme_color == 0) ? 'white'  : (theme_color == 1) ? '#404040' : 'white'),
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
        color:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : '#505050'),
      },

      description_body: {
        width: 350,
        paddingTop: 10,
        paddingBottom:350,
        top: 80,
        fontSize: 20,
        color:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : '#505050'),
        borderWidth:2,
        borderColor:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : '#505050'),
        borderRadius:10,
        fontFamily: 'TrebuchetMS-Bold',
        overflow: "hidden",
        backgroundColor:((theme_color == 0) ? 'white'  : (theme_color == 1) ? '#404040' : 'white'),
      },

      icon2: {
        position:"absolute",
        bottom: 595,
        left: 215,
      },
      text: {
        top: 100,
        fontFamily: 'TrebuchetMS-Bold',
        fontSize: 18,
        color:((theme_color == 0) ? 'gray'  : (theme_color == 1) ? 'gainsboro' : '#505050'),
      },
      container: {
        flex: 1
      },

    });

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.parent} pagingEnabled={true} >
        <Text style={styles.title}>タイトル<Icon style={styles.icon1} name="edit" size={25} onPress={()=>navigation.navigate("EditModal",{user:route.params.user, date:route.params.date,title:title,description:description, text:"タイトル", not_created:route.params.not_created,theme_color:theme_color})}/></Text>
      <Text style={styles.title_body}>{title}</Text>
        <Text style={styles.description}>説明 <Icon style={styles.icon2} name="edit" size={25} onPress={()=>navigation.navigate("EditModal",{user:route.params.user, date:route.params.date ,title:title,description:description, isMultiline:true, text:"説明",not_created:route.params.not_created,theme_color:theme_color})}/></Text>
      <Text style={styles.description_body}>{description }</Text>
      {group != null && group.length > 0 && group[0][0] != undefined ?
      <Text style={styles.text}>写真枚数:{returnGroupLength()}</Text>
      : <Text style={styles.text}>写真枚数:0</Text>
      // && group.map((v_,i_)=>{
      //   return(
      //   v_.map((v,i)=>{
      //                   return (
      //                       // <React.Fragment key={i}>
      //                         <Image  style={{ width: 100, height: 100, borderColor:'pink',top:"13%"}} resizeMode="contain" 
      //                             source={{ uri: v.node.image.uri }} />
      //                         // {/* </React.Fragment> */}
      //                       );
      //                   })
      //   )
      // // })
      }
    </ScrollView>
    </SafeAreaView>
    
  )
}

export default ScheduleDisplay