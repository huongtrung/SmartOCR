import React, { Component } from 'react';
import { Image } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Provider } from "react-redux";
import store from "./src/reducers/Store";
import { BackHandler } from 'react-native'

import SplashScreen from "./src/screens/SplashScreen";
import InfoDocumentScreen from "./src/screens/InfoDocumentScreen";
import ChooseMethod from "./src/screens/ChooseMethod";
import ConfirmInfo from "./src/screens/ConfirmInfo";
import ChooseDocument from './src/screens/ChooseDocument';
import CameraScreen from './src/screens/CameraScreen';

const RootStack = createStackNavigator(
  {
    SplashScreen: SplashScreen,
    InfoDocumentScreen: InfoDocumentScreen,
    ChooseMethod: ChooseMethod,
    ConfirmInfo: ConfirmInfo,
    ChooseDocument: ChooseDocument,
    CameraScreen: CameraScreen,
  },
  {
    initialRouteName: 'SplashScreen',
    defaultNavigationOptions: {
      headerBackground: (
        <Image
          style={{ width: "100%", height: "100%" }}
          source={
            require("./src/img/title_bg.png")
          }
        />
      ),
      headerTitleStyle: {
        color: '#fff'
      },
      headerRight: null,
      headerLeft: null
    }
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: ''
    }
  }

  getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
      return getActiveRouteName(route);
    }
    return route.routeName;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    console.log('this.state.currentScreen', this.state.currentScreen)
    if (this.state.currentScreen == 'ChooseDocument') {
      BackHandler.exitApp()
      return true;
    }
    return false;
  }


  render() {
    return (
      <Provider store={store}>
        <AppContainer
          onNavigationStateChange={(prevState, currentState, action) => {
            this.setState({
              currentScreen: this.getActiveRouteName(currentState)
            })
          }}
        />
      </Provider>
    )
  }
}

