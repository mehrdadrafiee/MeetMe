import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../../constants/Colors';

import {
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.whiteColor,
    flex: 1,
    alignItems: 'center',
  },
  LoginScreenContainer: {
    flex: 1,
    width: 300,
    marginTop: 50,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40
  },
  item: {
    marginVertical: 10,
    width: 290,
  },
  textInputStyle: {
    color: Colors.blackColor
  },
  button: {
    position: 'absolute',
    color: 'red'
  },
  screenName: {
    fontSize: 20,
    paddingTop: 10
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  gray: {
    backgroundColor: '#cccccc',
  },
  pageInfo: {
    marginTop: 10
  }
});

export default styles;
