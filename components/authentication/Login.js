import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LoginOrCreateForm from './common/LoginOrCreateForm';


const Login = ({navigation}) => {  
    return (
      <View style={{ flex: 1 }}>
        <LoginOrCreateForm navigation={navigation}/>
      </View>
    );
}

export default Login;