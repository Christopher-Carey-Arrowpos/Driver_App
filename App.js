import React, { useState } from "react";
import { View, Button, Alert } from "react-native";
import { useForm, Controller, get } from "react-hook-form";
import { Item, Input, Label } from 'native-base';
import Geolocation from '@react-native-community/geolocation';
import { Card, CardItem, Text, Body } from 'native-base';

import { PermissionsAndroid } from 'react-native';


export default function App() {



  const [location, setLocation] = useState(null)




  const { control, handleSubmit, errors } = useForm();
  function onSubmit(data) {
    console.log("asdfdsa")
    Geolocation.watchPosition(
      position => {
        const location = JSON.stringify(position);
        console.log(location)
        setLocation(position)
        console.log(location)
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );




    // requestLocationPermission()
    // getlocation()
  }


  // async function requestLocationPermission() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         'title': 'Location Permission',
  //         'message': 'This App needs access to your location ' +
  //           'so we can know where you are.'
  //       }
  //     )
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log("You can use locations ")
  //       getlocation()
  //     } else {
  //       console.log("Location permission denied")
  //     }
  //   } catch (err) {
  //     console.warn(err)
  //   }
  // }

  function getlocation(){
    console.log("asdfdsa")
    Geolocation.watchPosition(
      position => {
        const location = JSON.stringify(position);
        console.log(location)
        setLocation(position)
        console.log(location)
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }


  function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  return (
    <View>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              // style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          </Item>
        )}
        name="email"
        // rules={{ required: true }}
        defaultValue=""
      />
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              // style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          </Item>
        )}
        name="password"
        defaultValue=""
      />
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      <Card>
        <CardItem header>
          <Text>Long</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Text>
              {location &&
                location.coords.longitude
              }
            </Text>
          </Body>
        </CardItem>

      </Card>
      <Card>
        <CardItem header>
          <Text>Lat</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Text>
              {location &&
                location.coords.latitude

              }
            </Text>
          </Body>
        </CardItem>

      </Card>
    </View>
  );
}