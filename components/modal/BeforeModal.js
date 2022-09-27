import React,{useEffect} from 'react'
import { View, Text ,Button} from 'react-native';

const BeforeModal = ({navigation,route}) => {
  useEffect(() => {
    navigation.navigate('SettingModal',{user: route.params.user, date: route.params.date});
  
  },[])
  
  return (
      <View style={{ position:"relative",backgroundColor: '#00000099'}}>
      </View>
  )
}

export default BeforeModal