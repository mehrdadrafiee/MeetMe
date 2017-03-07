import Exponent, { Components } from 'exponent';
import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from './constants/Colors';
import { HomeScreen } from './src/screens';
import { cachedFonts } from './helpers';

EStyleSheet.build(Colors);

class App extends React.Component {
  state = {
    fontLoaded: false
  }

  componentDidMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    const fontAssets = cachedFonts([
      {
        catamaran: require('./assets/fonts/Catamaran-Regular.ttf')
      },
      {
        catamaranBold: require('./assets/fonts/Catamaran-Bold.ttf')
      },
      {
        catamaranLight: require('./assets/fonts/Catamaran-Light.ttf')
      },
      {
        catamaranMedium: require('./assets/fonts/Catamaran-Medium.ttf')
      }
    ]);

    await Promise.all(fontAssets);

    this.setState({ fontLoaded: true });
  }

  render() {
    if (!this.state.fontLoaded) {
      return <Components.AppLoading />;
    }
    return <HomeScreen />;
  }
}

Exponent.registerRootComponent(App);
