# LocationTrackingAppEjected

"LocationTrackingAppEjected" is an application that displays and records daily route information and photos on a map by reading location information

# DEMO

You can use it by logging in, and you can select which days to display information on the calendar screen. Once a day is selected, the schedule and map for that day will be displayed, and location information and photos can be viewed.


https://user-images.githubusercontent.com/78858054/205677181-9a764ebf-63be-4759-9582-192b5e4725f9.mov




You can learn to get background location information using react-native-background-geolocation, display information using react-native-maps, and handle photo libraries using react-native-camera-roll.

# Features

You can work with Django REST Framework and even store data retrieved by react-native-background-geolocation through the API.
You can manually set the location in the app even if the photo does not have location information attached to it.

# Requirement

* @react-native-camera-roll/camera-roll ^5.0.3
* @react-native-community/checkbox ^0.5.12
* @react-native-community/cli ^9.1.3
* @react-native-community/masked-view ^0.1.11
* @react-navigation/bottom-tabs: ^6.4.0
* @react-navigation/drawer: ^6.5.0
* @react-navigation/native: ^6.0.13
* @react-navigation/stack: ^6.3.2
* @types/styled-components: ^5.1.26
* axios ^0.27.2
* deprecated-react-native-prop-types: ^2.3.0
* react-native 0.69.5
* react 18.0.0
* react-native-background-geolocation ^4.8.2
* react-native-calendars ^1.1275.0
* react-native-geolocation-service ^5.3.0
* react-native-gesture-handler ^2.7.0
* react-native-image-picker ^4.10.0
* react-native-maps ^1.3.2
* react-native-modal ^13.0.1
* react-native-reanimated ^2.10.0
* react-native-safe-area-context ^4.4.1
* react-native-screens ^3.18.0
* react-native-vector-icons ^9.2.0


# Installation

Install with package.json.

```bash
npm install
```

# Usage

The following commands are executed to make it work in the simulator.

```bash
npx react-native run-ios
```

To get started, you need to register as a user to use the application.After logging in, you can change your settings in the menu in the upper left corner of the screen, and you can add an appointment for that day by clicking on the date in the calendar. When a photo is taken, the location information is automatically read and displayed on the map.

# Note

I have not tested it on android.

# Author

* Shunya Nagashima
* Twitter : -
* Email : syun864297531@gmail.com

# License

"LocationTrackingAppEjected" is under [MIT license].

Thank you!
