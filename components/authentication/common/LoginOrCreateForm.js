import React, { Component, useState,useEffect} from 'react';
import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';


const LoginOrCreateForm = (props) => {
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
          const {id, email} = response.data;
          props.navigation.navigate('Calendar', { user: id, email: email});
        }).catch(error => console.log(error));
        
      })
      .catch(error => console.log(error));
      
    
  }


  const renderCreateForm = () => {
    const { fieldStyle, textInputStyle } = style;
    if (props.create) {
      return (
          <View style={fieldStyle}>
            <TextInput
              placeholder="username"
              autoCorrect={false}
              onChangeText={(text)=>{onUsernameChange(text)}}
              style={textInputStyle}
            />
          </View>
      );
    }
  }

  const renderButton=()=> {
    const buttonText = props.create ? 'Create' : 'Login';

    return (
      <Button title={buttonText} onPress={()=>{handleRequest()}}/>
    );
  }



  const renderCreateLink= ()=> {
    if (!props.create) {
      const { accountCreateTextStyle } = style;
      return (
        <Text style={accountCreateTextStyle}>
          Or 
          {/* <Text style={{ color: 'blue' }} onPress={() => Actions.register()}> */}
          <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate("Register")}>
            {' Sign-up'}
          </Text>
        </Text>
      );
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
              style={textInputStyle}
            />
          </View>
          <View style={fieldStyle}>
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="password"
              onChangeText={(text)=>{onPasswordChange(text)}}
              style={textInputStyle}
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
  textInputStyle: {
    flex: 1,
    padding: 15
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
