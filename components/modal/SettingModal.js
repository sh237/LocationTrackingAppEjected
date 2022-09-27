import React from 'react'
import { View, Text ,Button} from 'react-native';

const SettingModal = ({navigation,route}) => {
    return (
        // <View style={{ position:"relative",backgroundColor: '#00000099'}}>
                <View
                    style={{left: 200, justifyContent: 'center', alignItems:'center' , backgroundColor:"white", width:"50%", height:"100%" ,alignItems:"center", justifyContent:"center",backgroundColor:"white"}}
                >
                    <View
                    style={{width:"100%",height:"10.7%", bottom:332, alignItems:"center", justifyContent:"center",backgroundColor:"gray"}}>
                        <Text>top</Text>
                    </View>
                    <View>
                    <Text>Modal Area</Text>
                    <Button onPress={()=>navigation.navigate("Calendar",{user:route.params.user, date:route.params.date})} title="戻る"></Button>
                    <Button onPress={()=>navigation.navigate("Calendar",{user:route.params.user, date:route.params.date})} title="ユーザー設定"></Button>
                    </View>
                </View>
        // </View>
    );
};

export default SettingModal