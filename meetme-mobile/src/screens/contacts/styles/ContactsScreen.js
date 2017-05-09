import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../../../constants/Colors';

const styles = EStyleSheet.create({
  listView: {
    alignItems: 'center'
  },
  container: {
    flex: 1,
    height: 110,
    backgroundColor: Colors.whiteColor,
    borderBottomWidth: 0.5,
    borderColor: 'gainsboro',
    flexDirection: 'row'
  },
  imageContainer: {
    height: 20,
    width: 20,
    padding: 10
  },
  image: {
    flex: 1,
  },
  infoContainer: {
    flex: 3,
    marginLeft: 50
  },
  name: {
    marginTop: 10,
    fontSize: 18
  },
  address: {
    fontSize: 10
  },
  call: {
    fontSize: 12,
    color: 'gray'
  },
  textIcon: {
    fontSize: 12,
    color: 'gray'
  },
  phoneNumber: {
    color: 'dodgerblue'
  },
  location: {
    fontSize: 12,
    color: 'gray'
  },
  locationIcon: {
    fontSize: 12,
    color: 'gray'
  },
  selected: {
    flex: 1,
    marginTop: 30
  },
  selectContactIcon: {
    fontSize: 30,
    color: 'mediumseagreen'
  }
});

export default styles;
