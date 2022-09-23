import React from 'react'
import { View, Text ,Button} from 'react-native';

const MapModal = ({navigation}) => {
    return (
        // <View style={{ position:"relative",backgroundColor: '#00000099'}}>
                <View
                    style={{left: 200, justifyContent: 'center', alignItems:'center' , backgroundColor:"white", width:"50%", height:"100%" ,alignItems:"center", justifyContent:"center",backgroundColor:"white"}}
                >
                    <Text>Modal Area</Text>
                    <Button onPress={()=>navigation.navigate("Calendar")} title="戻る"></Button>
                </View>
        // </View>
    );
};

export default MapModal