import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../../../constants/Colors';

const styles = EStyleSheet.create({
  // root: {
  //   backgroundColor: Colors.whiteColor,
  //   flex: 1
  // }
  container: {
    flex: 1,
    marginBottom: 60
  },
  title: {
    fontSize: 38,
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
  }
});

export default styles;