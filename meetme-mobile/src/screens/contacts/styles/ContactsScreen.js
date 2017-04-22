import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../../../constants/Colors';

const styles = EStyleSheet.create({
  searchBar: {
    paddingLeft: 30,
    fontSize: 22,
    height: 10,
    flex: .1,
    borderWidth: 9,
    borderColor: 'darkgray'
  },
  listView: {
    alignItems: 'center'
  },
  container: {
    flex: 1,
    height: 50,
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
    flex: 1
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 30
  },
  title: {
    marginTop: 10,
    fontSize: 10
  },
  address: {
    fontSize: 10
  },
  call: {
    fontSize: 8,
    color: 'gray'
  },
  emailIcon: {
    fontSize: 8,
    color: 'gray'
  },
  location: {
    fontSize: 8,
    color: 'gray'
  },
  locationIcon: {
    fontSize: 8,
    color: 'gray'
  }
});

export default styles;