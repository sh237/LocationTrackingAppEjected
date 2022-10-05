import React,{useState} from 'react'
import { Button, View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const SendEmail = ({navigation,route}) => {
    const [email, setEmail] = useState('');
    const onEmailChange = (text) => {
        setEmail(text);
    }
    const handlePress = () => {
        axios.
            post('/auth/password/reset', { email: email })
            .then(response => {
                console.log(response.data);
                Alert.alert("Emailを送りました。");
            }).catch(error => {
                console.log(error);
                Alert.alert("Error", "Email not sent");
            });
    }
    const { formContainerStyle,fieldStyle, textInputStyle1,textInputStyle2 } = style;

  return (
        <View style={{ flex: 1, backgroundColor: 'white',justifyContent:'center',alignContent:'center' }}>
          <View style={fieldStyle}>
            <TextInput
              placeholder="email"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(text)=>{onEmailChange(text)}}
              style={style.textInputStyle1}
            />
          </View>
          <TouchableOpacity onPress={() => {handlePress()}} style={{alignItems:"center"}}>
              <Text style={{fontFamily:"TrebuchetMS-Bold",fontSize:14, borderWidth:1, backgroundColor:"dodgerblue",color:"#fff",borderRadius:2,overflow:true,width:"27%",height:"16%",bottom:"30%"}}>メールを送る</Text>
        </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate("Login")}} style={{ alignItems:"center",marginTop:20}}>
              <Text style={{fontFamily:"TrebuchetMS-Bold",fontSize:14, borderWidth:1, backgroundColor:"dodgerblue",color:"#fff",borderRadius:2,overflow:true,width:"8%",height:"17%",bottom:"60%"}}>戻る</Text>
        </TouchableOpacity>
    </View>
  )
}
const style = StyleSheet.create({
    formContainerStyle: {
      flex: 1,
    //   flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInputStyle1: {
      padding: 15,
      borderWidth:1,
      width:"85%",
      bottom: "100%",
    },
    textInputStyle2: {
      padding: 15,
      borderWidth:1,
      width:"85%",
      bottom: "90%",
    },
    fieldStyle: {
    //   flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
export default SendEmail