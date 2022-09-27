import axios from 'axios';
import React,{useEffect,useState} from 'react'
import { View, Text ,Button,TextInput} from 'react-native';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const EditModal = ({navigation, route}) => {
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
                navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:title,description:"",not_created:false});
                }).catch(error => {
                    console.log(error);
                    navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:"",description:"",not_created:true});
                });
        }else{
            const payload = {user:route.params.user,date:route.params.date, title: title, description: description};
            console.log(payload);
            axios.put(`/api/calendar/${route.params.user}/?search=${route.params.date}`,payload).then(response_ => {
            console.log("updated title");
            const {title} = response_.data;
            navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:title,description:description,not_created:false});
            
            }).catch(error => {navigation.navigate("Schedule",{user:route.params.user, date:route.params.date, email:route.params.email,title:route.params.title,description:route.params.description,not_created:false});});
        }
    };
    const onDescriptionSubmit = ()=>{
        if(route.params.not_created){
            const payload =  {user:route.params.user,date:route.params.date, title: "", description: description};
            console.log(payload);
            axios.post(`/api/calendar/`,payload).then(response => {
                console.log("posted title");
                navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:"",description:description,not_created:false});
                }).catch(error => {
                    console.log(error);
                    navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:"",description:"",not_created:true});
                });
        }else{
        const payload = {user:route.params.user,date:route.params.date,title: title, description: description};
        axios.put(`/api/calendar/${route.params.user}/?search=${route.params.date}`,payload).then(response_ => {
            console.log("updated description");
            const {description} = response_.data;
            navigation.navigate("Schedule",{user:route.params.user, date:route.params.date,title:title,description:description,not_created:false});
            
        }).catch(error => {navigation.navigate("Schedule",{user:route.params.user, date:route.params.date, email:route.params.email,title:route.params.title,description:route.params.description,not_created:false});});
    }
    };


    useEffect(() => {
    console.log(title);

    },[]);

  return (
    <View style={styles.parent}>
    {route.params.isMultiline ? 
    (
        <View style={styles.screen1}>
            <Icon name="closesquareo" size={35} style={styles.icon1} onPress={()=>navigation.navigate("Schedule",{user:route.params.user, date:route.params.date})}/>
            <Text style={styles.text1}>{route.params.text}</Text>
            <TextInput style={styles.textinput1} multiline={true} onChangeText={(text)=>{onDescriptionChange(text)}} value={description}></TextInput>
            <Text style={styles.button1} onPress={()=>onDescriptionSubmit()} >更新</Text>
        </View>
    )
        :(
        <View style={styles.screen2}>
            <Icon name="closesquareo" size={35} style={styles.icon2} onPress={()=>navigation.navigate("Schedule",{user:route.params.user, date:route.params.date})}/>
            <Text style={styles.text2}>{route.params.text}</Text>
            <TextInput style={styles.textinput2} onChangeText={(text)=>{onTitleChange(text)}} value={title}></TextInput>
            <Text style={styles.button2} onPress={()=>onTitleSubmit()} >更新</Text>
        </View>
    )
    }
    </View>
    )
}
const styles = StyleSheet.create({
    parent:{
        flex:1, 
        alignItems: 
        'center', 
        justifyContent: 'center' }
        ,
    screen1: {
        width:"85%",
        height:"60%", 
        backgroundColor:"white",
        alignItems:"center",
        justifyContent:"center"
    },
    screen2 : {
        width:"80%",
        height:"25%", 
        backgroundColor:"white",
        alignItems:"center",
        justifyContent:"center",
    },
    textinput1:{
        height:"70%",
        width:"90%",
        borderColor:"black",
        borderWidth:2,
        borderRadius:6,
        fontSize:20,
        fontFamily: 'TrebuchetMS-Bold',
    },
    textinput2:{
        height:"30%",
        width:"90%",
        borderColor:"black",
        borderWidth:2,
        borderRadius:6,
        fontSize:20,
        fontFamily: 'TrebuchetMS-Bold',
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
    },
    icon2: {
        bottom:36,
        left: 142,

    },
    button1: {
        paddingTop: 2,
        top: 30,
        width: 45,
        height: 28,
        color: "black",
        fontcolor: "black",
        fontSize: 20,
        fontFamily: 'TrebuchetMS-Bold',
        borderRadius: 5,
        borderWidth: 2,
    },
    button2: {
        paddingTop: 2,
        top: 30,
        width: 45,
        height: 28,
        color: "black",
        fontcolor: "black",
        fontSize: 20,
        fontFamily: 'TrebuchetMS-Bold',
        borderRadius: 5,
        borderWidth: 2,
    },
    text1: {
        bottom: 30,
        fontcolor: "black",
        fontSize: 20,
        fontFamily: 'TrebuchetMS-Bold',
    },
    text2: {
        bottom: 30,
        fontcolor: "black",
        fontSize: 20,
        fontFamily: 'TrebuchetMS-Bold',
    }
});
export default EditModal