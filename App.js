import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import { Provider } from "react-redux";
import store from "./src/reducers/Store";

import SplashScreen from "./src/screens/SplashScreen";
import MainScreen from "./src/screens/MainScreen";
import NewScreen from "./src/screens/NewScreen";
import ChooseMethod from "./src/screens/ChooseMethod";
import ConfirmInfo from "./src/screens/ConfirmInfo";
import CameraScreen from './src/screens/CameraScreen';
import ChooseDocument from './src/screens/ChooseDocument';

const RootStack = createStackNavigator(
  {
    SplashScreen: SplashScreen,
    MainScreen: MainScreen,
    NewScreen: NewScreen,
    ChooseMethod: ChooseMethod,
    ConfirmInfo: ConfirmInfo,
    CameraScreen: CameraScreen,
    ChooseDocument: ChooseDocument
  },
  {
    initialRouteName: 'SplashScreen',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )
  }
}

