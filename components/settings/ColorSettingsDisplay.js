import React,{useContext,useEffect, useState} from 'react'
import {View,Image, Button,StyleSheet,Text} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import { ThemeColorContext } from '../navigation/index';

const ColorSettingsDisplay = ({navigation,route}) => {
  const {theme_color, setThemeColor} = useContext(ThemeColorContext);
  const [isSelected, setSelection] = useState([false,false,false]);

  const checkDisabled = (id)=>{
    return isSelected[id]
  }

  const Submit = ()=>{
    console.log(route.params)
    let theme_color_ = isSelected.indexOf(true);
    console.log(theme_color)
    if(theme_color_ != theme_color){
      payload = {id:route.params.user, theme_color:theme_color_}
      axios.patch(`/auth/update/theme`,payload).then(response => {
        setThemeColor(theme_color_);
        // navigation.navigate("Drawer", { screen: "ColorSettingsDisplay" ,date:route.params.date,user:route.params.user,email:route.params.email, title:route.params.title, description:route.params.description, theme_color:theme_color});
      }).catch(error => console.log("error"))
    }
  //axios.put(`/auth/update/${id}`,{id:id}).then(response => {
  }

  useEffect(()=>{
    let arr = [false,false,false];
    arr[theme_color] = true;
    setSelection(arr);
    },[]);


  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (theme_color == 0) ? '#fff'  : (theme_color == 1) ? '#292929' : 'mistyrose', 
    }
      ,
    checkbox1:{
      marginTop:"100%",
      marginLeft:"10%",
    },
    checkbox2:{
      marginTop:"100%",
      marginLeft:"10%",
    },
    checkbox3:{
      marginTop:"100%",
      marginLeft:"10%",
    },
    button:{
      borderRadius: 5,
      borderWidth: 4,
      color: 'lightpink',
      borderColor: ((theme_color == 0) ? 'black'  : (theme_color == 1) ? 'white' : 'white'),
    },
  });

  return (
    <View style={styles.screen}>
      <View style={{flex:1,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <View style={{flexDirection:"row",paddingBottom:"5%"}}>
        <Image style={{width: 200, height: 200}} source={require('./assets/default.png')}/>
        <CheckBox
          value={isSelected[0]}
          onValueChange={(value)=>{setSelection(isSelected.map((selected, index) => (index === 0 ? value : false)))}}
          // style={styles.checkbox}
          disabled={checkDisabled(0)}
          style={styles.checkbox1}
        />
        </View>
        <View style={{flexDirection:"row",paddingBottom:"5%"}}>
        <Image style={{width: 200, height: 200}} source={require('./assets/black.png')}/>
        <CheckBox
          value={isSelected[1]}
          onValueChange={(value)=>{setSelection(isSelected.map((selected, index) => (index === 1 ? value : false)))}}
          // style={styles.checkbox}
          disabled={checkDisabled(1)}
          style={styles.checkbox2}
        />
        </View>
        <View style={{flexDirection:"row",paddingBottom:"5%"}}>
        <Image style={{width: 200, height: 200}} source={require('./assets/pink.png')}/>
        <CheckBox
          value={isSelected[2]}
          onValueChange={(value)=>{setSelection(isSelected.map((selected, index) => (index === 2 ? value : false)))}}
          // style={styles.checkbox}
          disabled={checkDisabled(2)}
          style={styles.checkbox3}
        />
        </View>
        <View style={{flexDirection:"row",paddingBottom:"5%"}}>
          <Button title="更新" style={styles.button} onPress={()=>{Submit()}}></Button>
        </View>
      </View>
    </View>
  )
}



export default ColorSettingsDisplay