import React from 'react'
import { View, Text ,Button} from 'react-native';

const BeforeModal = ({navigation}) => {
  navigation.navigate('SettingModal');
  return (
      <View style={{ position:"relative",backgroundColor: '#00000099'}}>
      </View>
  )
}

export default BeforeModal