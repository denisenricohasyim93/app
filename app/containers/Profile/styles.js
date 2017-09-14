import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)'
  },
  section1: {
    alignItems: 'center',
    padding: 10
  },
  section2: {
    flex: 2,
    justifyContent: 'flex-start',
    marginBottom: 15,
    marginRight: 12
  },
  input: {
    paddingLeft: 20
  },
  inputInfo: {
    height: 200,
    textAlignVertical: 'top'
  },
  imageProfile: {
    alignSelf: 'center',
    marginTop: -50,
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  errorInput: {
    paddingLeft: 20,
    color: '#FFFFFF'
  },
  section3: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingLeft: 16
  },
  username: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 65,
    borderWidth: 1,
    alignSelf: 'center'
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 6
  },
  buttonChangePass: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 6,
    marginBottom: 6,
    justifyContent: 'center'
  },
  changePassText: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    color: '#3366BB'
  },
  iconWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 20
  }
});

export default styles;
