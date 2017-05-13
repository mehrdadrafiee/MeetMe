import {
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  LoginScreenContainer: {
    flex: 1,
    paddingTop: 140,
    alignItems: 'center'
  },
  logoText: {
    fontSize: 40
  },
  textInputStyle: {
    height: 40,
    borderColor: 'gray',
    marginTop: 3,
    borderWidth: 0.5,
    width: 300,
    backgroundColor: '#ffffff'
  },
  screenName: {
    fontSize: 20,
    paddingTop: 10
  },
  button: {
    width: 100,
    height: 60,
    backgroundColor: 'blue'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  gray: {
    backgroundColor: '#cccccc',
  },
});

export default styles;
