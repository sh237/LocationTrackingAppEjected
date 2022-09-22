import React,{useState} from 'react'
import {StyleSheet, View, Text, Button} from 'react-native';
import { Calendar,LocaleConfig } from 'react-native-calendars';
import moment from "moment";

const INITIAL_DATE = moment().format("YYYY-MM-DD");

const CalendarDisplay = ({navigation, route}) => {
    LocaleConfig.locales.jp = {
        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
      };
    LocaleConfig.defaultLocale = 'jp';
    const [selected, setSelected] = useState(INITIAL_DATE);
    const handleDayPress = (day) => {
        setSelected(day.dateString);
        console.log(new Date(day.dateString).toLocaleString());
        navigation.navigate("Map",{date:new Date(day.dateString).toISOString().split('T')[0],user:route.params.user,email:route.params.email});
        }
        
    return(
    <View style={styles.container}>
      {console.log(navigation)}
        <Calendar
        monthFormat={"yyyy年 MM月"}
        current={INITIAL_DATE}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: false,
            selectedColor: 'red',
            selectedTextColor: 'white'
          }
         }}
        style={styles.calendar}
        onDayPress={handleDayPress}
      />
        {/* <View/> */}
        <Text>DetailScreen</Text>
        <Button
        title="Log In画面に遷移する"
        onPress={() => {
            navigation.navigate('Login');
        }}
        />
        <Button
        title="Home画面に遷移する"
        onPress={() => {
            navigation.navigate('Home');
        }}
        />
        <Button
        title="Sign up画面に遷移する"
        onPress={() => {
            navigation.navigate('Register');
        }}
        />
  </View>
);
};

const styles = StyleSheet.create({
container: {
  
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  
},
calendar: {
  width: 380,
  height: 364,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 10,
},
});

export default CalendarDisplay