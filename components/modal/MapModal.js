import React,{useEffect, useContext} from 'react'
import { View, Text ,Button,Image, ScrollView} from 'react-native';

const MapModal = ({navigation,route}) => {
    useEffect(() => {
        // const timer = setTimeout(()=>onForegroundLocation(route.params.calendarid), 60 * 1000);

        // return () => clearTimeout(timer);
    },[]);
    console.log("images:");
    console.log(route.params.images);
    return (
                <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center',paddingBottom:100 }} >
                    <Text>Modal Area</Text>
                    <Button onPress={()=>navigation.goBack()} title="戻る"></Button>
                    {console.log("images:"+route.params.images)}
                    {route.params.images && route.params.images.map((v,i)=>{
                                return (
                                    <React.Fragment key={i}>
                                    <Image  style={{ width: 360, height: 400, }} resizeMode="contain" 
                                    source={{ uri: v.node.image.uri }}/>{console.log("uri:"+v.node.image.uri)}
                                    </React.Fragment>
                                    );
                                }
                )}
                </ScrollView>
    );
};

export default MapModal