import React, { useContext, useState,useEffect} from 'react';
import { Button, View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { setGestureState } from 'react-native-reanimated/lib/reanimated2/NativeMethods';
import { ThemeColorContext } from '../../navigation/index';

const LoginOrCreateForm = (props) => {
  const {theme_color, setThemeColor} = useContext(ThemeColorContext);
    const [user, setUser] = useState({
        username: '',
        password: '',
        email: '',
      });
//   state = {
//     username: '',
//     password: '',
//     firstName: '',
//     lastName: ''
//   }
  useEffect(() => {
    setUser(user => ({...user, email: "syun864297531@gmail.com" }));
    setUser(user => ({...user, password: "admin" }));
  }, []);

  const onUsernameChange = (text)=>{ 
    setUser(user => ({...user, username: text }));
  };

  const onPasswordChange = (text) => {
    setUser(user => ({...user, password: text }));
  }

  const onEmailChange = (text)=> {
    setUser(user => ({...user, email: text }));
  }
  const handleRequest = () => {
    const endpoint = props.create ? 'register' : 'login';
    let payload;
    if (props.create) {
      payload = { username: user.username, password: user.password , email: user.email}
    }else{
      payload = { username: user.email, password: user.password }
    }
    console.log(payload);

    axios
      .post(`/auth/${endpoint}`, payload)
      .then(response => {
        const { token } = response.data;
        console.log(response.data);
        // We set the returned token as the default authorization header
        axios.defaults.headers.common.Authorization = `Token ${token}`;
        // Navigate to the home screen
        // Actions.main();
        axios.get('/auth/myself').then(response => {
          const {id, email, theme_color,is_tracking} = response.data;
          // props.navigation.navigate('Calendar', { user: id, email: email, theme_color:theme_color});
          setThemeColor(theme_color);
          props.navigation.navigate("Drawer", { screen: "Calendar" ,user: id, email: email, theme_color:theme_color, is_tracking:is_tracking});
        }).catch(
          error => {console.log(error);
          }
        );
        
      })
      .catch(error => {console.log(error);Alert.alert("メールアドレスかパスワードが間違っています");});
      
    
  }


  const renderCreateForm = () => {
    const { fieldStyle, textInputStyle3 } = style;
    if (props.create) {
      return (
          <View style={fieldStyle}>
            <TextInput
              placeholder="username"
              autoCorrect={false}
              onChangeText={(text)=>{onUsernameChange(text)}}
              style={textInputStyle3}
            />
          </View>
      );
    }
  }

  const renderButton=()=> {
    const buttonText = props.create ? '作成' : 'ログイン';

    return (
      <TouchableOpacity onPress={()=>{handleRequest()}} style={{alignItems:"center"}}>
              {props.create ? 
              <React.Fragment>
              <Text style={{fontFamily:"TrebuchetMS-Bold",fontSize:14, borderWidth:1, backgroundColor:"dodgerblue",color:"#fff",borderRadius:3,overflow:true,width:"12%",height:"17%",bottom:"120%"}}> {buttonText}</Text>
              <Text style={{fontFamily:"TrebuchetMS-Bold",fontSize:14, borderWidth:1, backgroundColor:"dodgerblue",color:"#fff",borderRadius:3,overflow:true,width:"10%",height:"17%",bottom:"100%"}} onPress={() => props.navigation.navigate("Login")}>戻る</Text>
              </React.Fragment>

              : <Text style={{fontFamily:"TrebuchetMS-Bold",fontSize:14, borderWidth:1, backgroundColor:"dodgerblue",color:"#fff",borderRadius:3,overflow:true,width:"19%",height:"23%",bottom:"160%"}}> {buttonText}</Text>
              }
      </TouchableOpacity>
    );
  }



  const renderCreateLink= ()=> {
    if (!props.create) {
      const { accountCreateTextStyle } = style;
      return (
        <React.Fragment>
        {/* <Text style={{fontFamily:"TrebuchetMS-Bold",fontSize:14,width:"100%",height:"40%",bottom:"30%",left:"40%"}}>もしくは</Text> */}
          <TouchableOpacity onPress={() => props.navigation.navigate("Register")} style={{alignItems:"center"}}>
              <Text style={{fontFamily:"TrebuchetMS-Bold",fontSize:14, borderWidth:1, backgroundColor:"dodgerblue",color:"#fff",borderRadius:3,overflow:true,width:"100%",height:"32%",bottom:"170%"}}>アカウント作成へ</Text>
        </TouchableOpacity>
          <TouchableOpacity onPress={() => {props.navigation.navigate("SendEmail")}} style={{alignItems:"center"}}>
            <Text style={{fontFamily:"TrebuchetMS-Bold",fontSize:14, borderWidth:1, backgroundColor:"dodgerblue",color:"#fff",borderRadius:3,overflow:true,width:"10%",height:"32%",bottom:"150%"}} >パスワードを忘れた場合</Text>
        </TouchableOpacity>
       </React.Fragment>
      );
    }else{

    }
  }

    const {
      formContainerStyle,
      fieldStyle,
      textInputStyle,
      buttonContainerStyle,
      accountCreateContainerStyle
    } = style;

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={formContainerStyle}>
          <View style={fieldStyle}>
            <TextInput
              placeholder="email"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(text)=>{onEmailChange(text)}}
              style={style.textInputStyle1}
            />
          </View>
          <View style={fieldStyle}>
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="password"
              onChangeText={(text)=>{onPasswordChange(text)}}
              style={style.textInputStyle2}
            />
          </View>
          {renderCreateForm()}
        </View>
        <View style={buttonContainerStyle}>
          {renderButton()}
          <View style={accountCreateContainerStyle}>
            {renderCreateLink()}
          </View>
        </View>
      </View>
    );
  }


const style = StyleSheet.create({
  formContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle1: {
    padding: 15,
    borderWidth:1,
    width:"85%",
  },
  textInputStyle2: {
    padding: 15,
    borderWidth:1,
    top: "5%",
    width:"85%",
  },
  textInputStyle3: {
    padding: 15,
    borderWidth:1,
    top:"10%",
    width:"85%",
  },
  fieldStyle: {
    flexDirection: 'row',
    justifyContent: 'center'
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


export default LoginOrCreateForm;
