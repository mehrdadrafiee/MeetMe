import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../../../constants/Colors';
import Dimensions from 'react-native';
const { width, height } = Dimensions;

const styles = EStyleSheet.create({
  // root: {
  //   backgroundColor: Colors.whiteColor,
  //   flex: 1
  // }
  container: {
    flex: 1
  },
  title: {
    fontSize: 18,
    backgroundColor: 'transparent'
  },
  picker: {
    width: 50,
    height: 50
  },
  button: {
    marginRight: 10
  },
  card: {
    width: 300
  },
  ActivityIndicator: {
    marginTop: 20
  },
  noNotification: {
    textAlign: 'center',
    fontSize: 16
  }
});

export default styles;
