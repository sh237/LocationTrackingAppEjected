import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import axios from 'axios';


const Home = (props) => {

  const handleRequest = () => {
    // This request will only succeed if the Authorization header
    // contains the API token
    axios
      .get('/auth/logout')
      .then(response => {
        props.navigation.navigate('Login');
        // Actions.auth()

      })
      .catch(error =>  {console.log(error);console.log(axios.defaults.headers.common.Authorization);});
  }

    const { buttonContainerStyle } = styles;
    return (
      <View style={buttonContainerStyle}>
        <Button title="Logout" onPress={()=>{handleRequest()}}/>
      </View>
    );
  }


const styles = StyleSheet.create({
  buttonContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});

export default Home;