import React, { Component } from 'react';
import {
  Container,
  Content,
  Text,
  Fab,
  Icon
} from 'native-base';
import { View, Alert, Image, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-crop-picker';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';

// import redux componens
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getProfileData } from '../../helpers';
import InputItem from '../../components/InputItem';
import Button from '../../components/Button';
import Header from '../../components/Header';
import styles from './styles';

import * as actions from './actions';
import * as selectors from './selectors';

class Settings extends Component {
  state = {
    id: null
  }

  componentWillReceiveProps(prevProps) {

    if (prevProps.isLogOut !== this.props.isLogOut) {
      Actions.main();
      this.props.updateIsLogOut(false);
    }
  }

  render() {

    return (
    <Container>
      <Content>
        <ScrollView>
          <Header title="SETTINGS" />
          <Content>
            <View style={styles.section2}>
              <Button
                block
                rounded
                style={styles.button}
                onPress={() => Actions.profile()}
              >
                <Text>Edit Profile</Text>
              </Button>
              <Button
                block
                rounded
                style={styles.button}
                onPress={() => Actions.profile()}
              >
                <Text>Connect To Social Media</Text>
              </Button>
              <Button
                block
                light
                rounded
                style={styles.button}
                onPress={() => { this.props.logOut(); }}
              >
                <Text>Log Out</Text>
              </Button>
            </View>
          </Content>
        </ScrollView>
      </Content>
    </Container>
    );
  }
}

/**
 *  Map redux state to component props
 */
const mapStateToProps = createStructuredSelector({
  isLogOut: selectors.getIsLogOut()
});

export default connect(mapStateToProps, actions)(Settings);