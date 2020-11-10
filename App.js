import React, { Component, useState } from "react";
import { View, Button, Alert, SafeAreaView, ScrollView } from "react-native";
import { useForm, Controller, get } from "react-hook-form";
import { Item, Input, Label } from 'native-base';
import Geolocation from '@react-native-community/geolocation';
import { Card, CardItem, Text, Body } from 'native-base';
import axios from "axios";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';


import { PermissionsAndroid } from 'react-native';

// import { Alert } from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { Header } from "react-native/Libraries/NewAppScreen";


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locationSig: null,
      locationArr: []


    };
    //Binds
    this.exampleGetData = this.exampleGetData.bind(this)
    this.ff = this.ff.bind(this)
    this.getloc = this.getloc.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.stop = this.stop.bind(this)

  }

  exampleGetData(email, password) {
    let _this = this;
    axios.post('https://ic-stage.arrowpos.com/api/login', {
      email: email,
      password: password
    })

      .then(function (response) {
        // console.log(response)
        // console.log("LOGGED IN")
        _this.setState({
          token: response.data.access_token,
          user: response.data.user,
          logged_in: true,
          service: true

        }, () => {
          _this.getloc()
          // console.log("TRACKING CORDS")
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  ff() {
    let _this = this;

    axios.post('https://ic-stage.arrowpos.com/api/driver/updategeo', {

      latitude: _this.state.locationSig.latitude,
      longitude: _this.state.locationSig.longitude,
      user_id: _this.state.user.id,
      // arrow_store_id
    },
      {
        headers: {
          Authorization: 'Bearer ' + _this.state.token
        }
      })
      .then(function (response) {
        // console.log(response)
        // _this.setState({
        //   token: response.access_token,
        //   user: response.data.user

        // }, () => {
        // })
      })
      .catch(function (error) {
        console.log(error);
      });

  }
  onSuccess(e) {

    // console.log(e.data)
    let gg = JSON.parse(e.data)
    // console.log(gg)
    this.exampleGetData(gg.email, gg.password)


  }
  stop(g) {
    // console.log(g)
    if (g == "start") {
      this.setState({
        service:true
      },()=>{
        BackgroundGeolocation.start()
      })
    } else {
      this.setState({
        service:false
      },()=>{
        // BackgroundGeolocation.removeAllListeners("stop")
        BackgroundGeolocation.stop()
      })
    }
  }





  // ++++++++++++++++++++
  componentDidMount() {

  }

  getloc() {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: null,
      httpHeaders: {
        'X-FOO': 'bar'
      },
      // customize post properties
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
        foo: 'bar' // you can also add your own properties
      }
    });



    BackgroundGeolocation.on('location', (location) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task

      // console.log(location)
      let gg = this.state.locationArr
      gg.push(location)
      this.setState({
        locationArr: gg,
        locationSig: location

      }, () => {
        // this.ff()
        // console.log("CORDS LOGGED")

      })


      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      // console.log(stationaryLocation)
      // Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      // console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      // console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      // console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      // console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
          ]), 1000);
      }
    });

    BackgroundGeolocation.on('background', () => {
      // console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      // console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('abort_requested', () => {
      // console.log('[INFO] Server responded with 285 Updates Not Required');

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      // console.log('[INFO] App needs to authorize the http requests');
    });

    // BackgroundGeolocation.checkStatus(status => {
    //   console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
    //   console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
    //   console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

    //   // you don't need to check status before start (this is just the example)
    //   if (!status.isRunning) {
    //     BackgroundGeolocation.start(); //triggers start on start event
    //   }
    // });

    // you can also just start without checking for status
    BackgroundGeolocation.start();
  }



  // ++++++++++++++++++++
  distance(lat1, lon1, lat2, lon2, unit) {
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
  render() {

    return (
      <SafeAreaView>
        <ScrollView>
          {!this.state.logged_in ?
            <View>
              <QRCodeScanner
                onRead={this.onSuccess}
                fadeIn={true}
                showMarker={true}
                bottomContent={
                  <Text>Scan Code</Text>
                }
              />
            </View>
            :
            <View>
              <View style={{flex:1, flexDirection:'row'}}>
            <Text style={{marginRight:100}}>{this.state.user.name} - Logged In</Text>
            {this.state.service ?
            <Text>Service Started</Text>
            :
            <Text>Service Stopped</Text>

            }

              </View>

            <Card>
              <CardItem header>
                <Text>Long</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    {this.state.locationSig &&
                      this.state.locationSig.longitude
                    }
                  </Text>
                  {this.state.locationArr &&
                    this.state.locationArr.map((item, i) => (
                      <Text key={i}>
                        { item.longitude}
                      </Text>
                    ))
                  }
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
                    {this.state.locationSig &&
                      this.state.locationSig.latitude

                    }
                  </Text>
                </Body>
              </CardItem>

            </Card>
            {this.state.logged_in ?
              this.state.service ?
              <Button
                title="Stop"
                onPress={() => { this.stop('stop') }} />
              :
              <Button
                title="Start"
                onPress={() => { this.stop('start') }} />
                :
                null
            }
          </View>
          }
        </ScrollView>
      </SafeAreaView>
    );
  }
}