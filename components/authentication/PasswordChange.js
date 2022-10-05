import React,{useEffect} from 'react'
import { Button, View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const PasswordChange = ({navigation,route}) => {
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const { formContainerStyle,fieldStyle, textInputStyle1,textInputStyle2 } = style;



    useEffect(() => {
        console.log(route.params.uid + " " + route.params.token);
        if(route.params.uid == null && route.params.token == null){
            navigation.navigate('Login')
        }
    }, []);
            
    const onPasswordChange = (text) => {
        setPassword(text);
    }
    const onPassword2Change = (text) => {
        setPassword2(text);
    }
    const handlePress = () => {
        if (password == password2) {
            if(password.length >= 8){
            console.log( {new_password1: password, new_password2: password2, uid: route.params.uid, token: route.params.token});
            axios
                .post(`/auth/reset/${route.params.uid}/${route.params.token}`, { new_password1: password, new_password2: password2, uid: route.params.uid, token: route.params.token })
                .then(response => {
                    console.log(response.data);
                    navigation.navigate('Login');
                })
                .catch(error => {
                    console.log(error);
                    Alert.alert("Error", "Password reset failed");
                });
            }else{
                Alert.alert("Error", "Password must be at least 8 characters");
            }
        } else {
            Alert.alert("Error", "Password does not match");
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white',justifyContent:'center',alignContent:'center' }}>
          <View style={fieldStyle}>
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="password"
              onChangeText={(text)=>{onPasswordChange(text)}}
              style={style.textInputStyle1}
            />
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="password again"
              onChangeText={(text)=>{onPassword2Change(text)}}
              style={style.textInputStyle2}
            />
          </View>
          <TouchableOpacity onPress={() => {handlePress()}} style={{alignItems:"center"}}>
              <Text style={{fontFamily:"TrebuchetMS-Bold",fontSize:14, borderWidth:1, backgroundColor:"dodgerblue",color:"#fff",borderRadius:2,overflow:true,width:"27%",height:"16%",bottom:"55%"}}>パスワード更新</Text>
        </TouchableOpacity>

          <TouchableOpacity onPress={() => {navigation.navigate("Login")}} style={{ alignItems:"center",marginTop:20}}>
              <Text style={{fontFamily:"TrebuchetMS-Bold",fontSize:14, borderWidth:1, backgroundColor:"dodgerblue",color:"#fff",borderRadius:2,overflow:true,width:"8%",height:"17%",bottom:"60%"}}>戻る</Text>
        </TouchableOpacity>
    </View>
    );
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
    textInputStyle3: {
      padding: 15,
      borderWidth:1,
      top:"10%",
      width:"85%",
    },
    fieldStyle: {
    //   flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainerStyle: {
      flex: 1,
      justifyContent: 'center',
      padding: 25
    },
    accountCreateTextStyle: {
      color: 'black'
    },
    accountCreateContainerStyle: {
      padding: 25,
      alignItems: 'center'
    }
  });
export default PasswordChange