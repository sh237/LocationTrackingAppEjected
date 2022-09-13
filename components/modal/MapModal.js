import React from 'react'
import { View, Text ,Button,Image} from 'react-native';

const MapModal = ({navigation,route}) => {
    return (
                <View
                    style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text>Modal Area</Text>
                    <Button onPress={()=>navigation.goBack()} title="戻る"></Button>
                    {console.log("images:"+route.params.images)}
                    {route.params.images && route.params.images.map((v,i)=>{
                        return (
                            <React.Fragment key={i}>
                              <Image  style={{ width: 200, height: 200, }} resizeMode="contain" 
                              source={{ uri: v.node.image.uri }}/>
                              </React.Fragment>
                            );
                    })}
                </View>
    );
};

export default MapModal