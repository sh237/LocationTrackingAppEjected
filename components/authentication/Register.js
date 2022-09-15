import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LoginOrCreateForm from './common/LoginOrCreateForm';

const Register = ()=>{
  
    return (
      <View style={{ flex: 1 }}>
        <LoginOrCreateForm create/>
      </View>
    );
  }

export default Register;