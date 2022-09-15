import React, { Component } from 'react';
import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';


const LoginOrCreateForm = () => {
    const [user, setUser] = userState({
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

  const onUsernameChange = (text)=>{ 
    setUser({ username: text });
  };

  const onPasswordChange = (text) => {
    setUser({ password: text });
  }

  const onEmailChange = (text)=> {
    setUser({ email: text });
  }
  const handleRequest = () => {
    const endpoint = this.props.create ? 'register' : 'login';
    const payload = { username: user.username, password: user.password } 
    
    if (this.props.create) {
      payload.email = user.email;
    }
    
    axios
      .post(`/auth/${endpoint}/`, payload)
      .then(response => {
        const { token, user_ } = response.data;
  
        // We set the returned token as the default authorization header
        axios.defaults.headers.common.Authorization = `Token ${token}`;
        
        // Navigate to the home screen
        Actions.main();
      })
      .catch(error => console.log(error));
  }


  const renderCreateForm = () => {
    const { fieldStyle, textInputStyle } = style;
    if (this.props.create) {
      return (
          <View style={fieldStyle}>
            <TextInput
              placeholder="First name"
              autoCorrect={false}
              onChangeText={onEmailChange.bind(this)}
              style={textInputStyle}
            />
          </View>
      );
    }
  }

  const renderButton=()=> {
    const buttonText = this.props.create ? 'Create' : 'Login';

    return (
      <Button title={buttonText} onPress={handleRequest.bind(this)}/>
    );
  }


  const renderCreateLink= ()=> {
    if (!this.props.create) {
      const { accountCreateTextStyle } = style;
      return (
        <Text style={accountCreateTextStyle}>
          Or 
          <Text style={{ color: 'blue' }} onPress={() => Actions.register()}>
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
              placeholder="username"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={onUsernameChange.bind(this)}
              style={textInputStyle}
            />
          </View>
          <View style={fieldStyle}>
            <TextInput
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="password"
              onChangeText={onPasswordChange.bind(this)}
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
