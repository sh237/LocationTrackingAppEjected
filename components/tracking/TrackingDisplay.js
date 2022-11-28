import React, {useState, useEffect} from 'react';
import {View,Text} from 'react-native';
import Geolocation from 'react-native-geolocation-service';


const WatchLocation = ({navigation}) => {
  const [location, setLocation] = useState({});

  useEffect(() => {
    const _watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        // console.log(latitude, longitude);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      },
    );

    return () => {
      if (_watchId) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, []);

  return (
    <View>
      {location ? (
        <>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Latitude: {location.longitude}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default WatchLocation;