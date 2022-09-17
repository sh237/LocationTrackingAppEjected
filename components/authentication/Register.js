import React, { Component } from 'react';
import { View, Text } from 'react-native';
import LoginOrCreateForm from './common/LoginOrCreateForm';

const Register = ({navigation})=>{
  
    return (
      <View style={{ flex: 1 }}>
        <LoginOrCreateForm create navigation={navigation}/>
      </View>
    );
  }

export default Register;