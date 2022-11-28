import axios from 'axios';
import React,{useEffect,useState,useContext} from 'react'
import { View, Text ,TouchableWithoutFeedback,TextInput,Keyboard} from 'react-native';
import {StyleSheet} from 'react-native';
import { ThemeColorContext } from '../navigation/index';
import Icon from 'react-native-vector-icons/AntDesign';

const EditModal = ({navigation, route}) => {
    const {theme_color, setThemeColor} = useContext(ThemeColorContext);
    const [title, setTitle] = useState(route.params.title);
    const [description, setDescription] = useState(route.params.description);
    const onTitleChange = (text)=>{ 
        setTitle(text);
      };
    const onDescriptionChange = (text)=>{ 
        setDescription(text);
      };
    const onTitleSubmit = ()=>{
        if(route.params.not_created){
            const payload =  {user:route.params.user,date:route.params.date, title: title, description: ""};
            console.log(payload);
            axios.post(`/api/calendar/`,payload).then(response => {
                console.log("posted title");
                navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:title,description:"",not_created:false,theme_color:theme_color});
                }).catch(error => {
                    console.log(error);
                    navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:"",description:"",not_created:true,theme_color:theme_color});
                });
        }else{
            const payload = {user:route.params.user,date:route.params.date, title: title, description: description};
            console.log(payload);
            axios.put(`/api/calendar/${route.params.user}/?search=${route.params.date}`,payload).then(response_ => {
            console.log("updated title");
            const {title} = response_.data;
            navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:title,description:description,not_created:false,theme_color:theme_color});
            
            }).catch(error => {navigation.navigate("Schedule",{user:route.params.user, date:route.params.date, email:route.params.email,title:route.params.title,description:route.params.description,not_created:false,theme_color:theme_color});});
        }
    };
    const onDescriptionSubmit = ()=>{
        if(route.params.not_created){
            const payload =  {user:route.params.user,date:route.params.date, title: "", description: description};
            console.log(payload);
            axios.post(`/api/calendar/`,payload).then(response => {
                console.log("posted title");
                navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:"",description:description,not_created:false,theme_color:theme_color});
                }).catch(error => {
                    console.log(error);
                    navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:"",description:"",not_created:true,theme_color:theme_color});
                });
        }else{
        const payload = {user:route.params.user,date:route.params.date,title: title, description: description};
        axios.put(`/api/calendar/${route.params.user}/?search=${route.params.date}`,payload).then(response_ => {
            console.log("updated description");
            const {description} = response_.data;
            navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:title,description:description,not_created:false,theme_color:theme_color});
            
        }).catch(error => {navigation.navigate("Schedule",{user:route.params.user, date:route.params.date, email:route.params.email,title:route.params.title,description:route.params.description,not_created:false,theme_color:theme_color});});
    }
    };

    
    const styles = StyleSheet.create({
        parent:{
            flex:1, 
            alignItems: 
            'center', 
            justifyContent: 'center' },
            // backgroundColor:((theme_color == 0) ? 'white'  : (theme_color == 1) ? '#292929' : 'white')
            // ,
        screen1: {
            width:"85%",
            height:"60%", 
            backgroundColor:"white",
            alignItems:"center",
            justifyContent:"center",
            backgroundColor:((theme_color == 0) ? 'white'  : (theme_color == 1) ? '#292929' : 'lightpink')
        },
        screen2 : {
            width:"80%",
            height:"25%", 
            backgroundColor:"white",
            alignItems:"center",
            justifyContent:"center",
            backgroundColor:((theme_color == 0) ? 'white'  : (theme_color == 1) ? '#404040' : 'lightpink')
        },
        textinput1:{
            height:"70%",
            width:"90%",
            borderColor:((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'white'),
            borderWidth:2,
            borderRadius:6,
            fontSize:20,
            fontFamily: 'TrebuchetMS-Bold',
            color:((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'lightpink'),
            backgroundColor:((theme_color == 0) ? 'white'  : (theme_color == 1) ? '#404040' : 'white')
        },
        textinput2:{
            height:"30%",
            width:"90%",
            borderColor:((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'white'),
            borderWidth:2,
            borderRadius:6,
            fontSize:20,
            fontFamily: 'TrebuchetMS-Bold',
            color:((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'lightpink'),
            backgroundColor:((theme_color == 0) ? 'white'  : (theme_color == 1) ? '#404040' : 'white')
        },
        shadow: {
            width: 40,
            height: 23,
          alignSelf: "center",
          backgroundColor: "gray",
         shadowColor: "black",
         shadowOffset: {
           height: -2,
            width: -3
          },
          shadowRadius: 2,
          shadowOpacity: 0.6,
          marginTop: 70,
          borderRadius: 5,
          botton: 15,
        },
        icon1:{
            bottom:36,
            left: 152,
            color:((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'white'),
        },
        icon2: {
            bottom:36,
            left: 142,
            color:((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'white'),
    
        },
        button1: {
            paddingTop: 2,
            top: 30,
            width: 45,
            height: 28,
            color: ((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'white'),
            fontcolor: "black",
            fontSize: 20,
            fontFamily: 'TrebuchetMS-Bold',
            borderRadius: 5,
            borderWidth: 2,
            borderColor: ((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'white'),
        },
        button2: {
            paddingTop: 2,
            top: 30,
            width: 45,
            height: 28,
            color: ((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'white'),
            fontcolor: "black",
            fontSize: 20,
            fontFamily: 'TrebuchetMS-Bold',
            borderRadius: 5,
            borderWidth: 2,
            borderColor: ((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'white'),
        },
        text1: {
            bottom: 30,
            fontcolor: "black",
            color: ((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'white'),
            fontSize: 20,
            fontFamily: 'TrebuchetMS-Bold',
        },
        text2: {
            bottom: 30,
            fontcolor: "black",
            color: ((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'gainsboro' : 'white'),
            fontSize: 20,
            fontFamily: 'TrebuchetMS-Bold',
        }
    });


    useEffect(() => {
    console.log(title);
    // const timer = setTimeout(()=>onForegroundLocation(route.params.calendarid), 60 * 1000);

    // return () => clearTimeout(timer);

    },[]);

  return (
    <TouchableWithoutFeedback
  onPress={() => {
    Keyboard.dismiss()
  }}>
    <View style={styles.parent}>
    {route.params.isMultiline ? 
    (
        <View style={styles.screen1}>
            <Icon name="closesquareo" size={35} style={styles.icon1} onPress={()=>navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,theme_color:theme_color})}/>
            <Text style={styles.text1}>{route.params.text}</Text>
            <TextInput style={styles.textinput1} multiline={true} onChangeText={(text)=>{onDescriptionChange(text)}} value={description}></TextInput>
            <Text style={styles.button1} onPress={()=>onDescriptionSubmit()} >更新</Text>
        </View>
    )
        :(
        <View style={styles.screen2}>
            <Icon name="closesquareo" size={35} style={styles.icon2} onPress={()=>navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,theme_color:theme_color})}/>
            <Text style={styles.text2}>{route.params.text}</Text>
            <TextInput style={styles.textinput2} onChangeText={(text)=>{onTitleChange(text)}} value={title}></TextInput>
            <Text style={styles.button2} onPress={()=>onTitleSubmit()} >更新</Text>
        </View>
    )
    }
    </View>
    </TouchableWithoutFeedback>
    )
}
export default EditModal