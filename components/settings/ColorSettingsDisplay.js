import React,{useEffect, useState} from 'react'
import {View,Text, Button,StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';

const ColorSettingsDisplay = ({navigation,route}) => {
  const [isSelected, setSelection] = useState([false,false,false]);

  const checkDisabled = (id)=>{
    return isSelected[id]
  }

  const Submit = ()=>{
    console.log(route.params)
    let theme_color = isSelected.indexOf(true);
    console.log(theme_color)
    if(theme_color != route.params.theme_color){
      payload = {id:route.params.user, theme_color:theme_color}
      axios.patch(`/auth/update/theme`,payload).then(response => {
      }).catch(error => console.log("error"))
    }
  //axios.put(`/auth/update/${id}`,{id:id}).then(response => {
  }

  useEffect(()=>{
    let arr = [false,false,false];
    arr[route.params.theme_color] = true;
    setSelection(arr);
    },[]);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{flexDirection:"row"}}>
      
      <CheckBox
          value={isSelected[0]}
          onValueChange={(value)=>{setSelection(isSelected.map((selected, index) => (index === 0 ? value : false)))}}
          // style={styles.checkbox}
          disabled={checkDisabled(0)}
          style={styles.checkbox1}
        />
      <CheckBox
          value={isSelected[1]}
          onValueChange={(value)=>{setSelection(isSelected.map((selected, index) => (index === 1 ? value : false)))}}
          // style={styles.checkbox}
          disabled={checkDisabled(1)}
          style={styles.checkbox2}
        />
      <CheckBox
          value={isSelected[2]}
          onValueChange={(value)=>{setSelection(isSelected.map((selected, index) => (index === 2 ? value : false)))}}
          // style={styles.checkbox}
          disabled={checkDisabled(2)}
          style={styles.checkbox3}
        />
        </View>
        <View style={{flexDirection:"row"}}>
          <Button title="更新" onPress={()=>{Submit()}}></Button>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  checkbox1:{
    right:"250%"
  },
  checkbox2:{
    
  },
  checkbox3:{
    left:"250%"
  },
});


export default ColorSettingsDisplay