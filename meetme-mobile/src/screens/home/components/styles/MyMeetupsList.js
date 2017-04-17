import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    width: 300
  },
  title: {
    fontSize: 20,
    color: '$blackColor',
    fontFamily: 'catamaranLight',
  },
  button: {
    marginRight: 10
  }
});

export default styles;