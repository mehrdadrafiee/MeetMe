// Libraries
import Exponent, { Components } from 'exponent';
import React from 'react';
import { Provider } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
// Components
import Root from './src/Root';
// Others
import Colors from './constants/Colors';
import { cachedFonts } from './helpers';
import store from './src/redux/store';

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
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

Exponent.registerRootComponent(App);
