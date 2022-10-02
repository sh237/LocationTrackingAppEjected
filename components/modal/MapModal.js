import React,{useEffect, useContext} from 'react'
import { View, Text ,Button,Image, ScrollView} from 'react-native';

const MapModal = ({navigation,route}) => {
    useEffect(() => {
        // const timer = setTimeout(()=>onForegroundLocation(route.params.calendarid), 60 * 1000);

        // return () => clearTimeout(timer);
    },[]);
    return (
                <ScrollView contentContainerStyle={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Modal Area</Text>
                    <Button onPress={()=>navigation.goBack()} title="戻る"></Button>
                    {console.log("images:"+route.params.images)}
                    {route.params.images && route.params.images.map((v,i)=>{
                        return (
                            <React.Fragment key={i}>
                              <Image  style={{ width: 200, height: 200, }} resizeMode="contain" 
                              source={{ uri: v.node.image.uri }}/>{console.log("uri:"+v.node.image.uri)}
                              </React.Fragment>
                            );
                    })}
                </ScrollView>
    );
};

export default MapModal