import React, { Component } from 'react';
import { Container, Content, Text, Spinner } from 'native-base';
import {
  View,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
  Form
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-simple-toast';

// import redux componens
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getProfileData } from '../../helpers';
import strings from '../../localization';
import InputItem from '../../components/InputItem';
import Button from '../../components/Button';
import Header from '../../components/Header';
import styles from './styles';

import * as actions from './actions';
import * as selectors from './selectors';
import { PRIMARYCOLOR } from '../../constants';

class Profile extends Component {
  state = {
    id: null,
    isLoading: true,
    points: null,
    referal: null,
    disabled: null
  };
  componentWillMount() {
    getProfileData().then((profileData) => {
      if (profileData) {
        if (profileData.points === null) {
          this.props.updateFields('points', 0);
        } else {
          this.props.updateFields('points', profileData.points);
        }
        this.props.updateHaveRefered(profileData.have_refered);
        this.handleInputChange('username', profileData.username);
        this.handleInputChange('firstName', profileData.first_name);
        this.handleInputChange('lastName', profileData.last_name);
        if (profileData.role_id === 3) {
          this.handleInputChange('boothInfo', profileData.booth.summary);
        }
        if (profileData.role_id === 4) {
          this.handleInputChange('job', profileData.speaker.job);
          this.handleInputChange('summary', profileData.speaker.summary);
        }
      }
      this.setState({
        isLoading: false,
        referal: profileData.referal
      });
    });
    AsyncStorage.getItem('role_id')
      .then((roleId) => {
        const id = JSON.parse(roleId);
        this.setState({ id });
      })
      .catch(() => console.log('Error'));
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps.isProfileUpdated !== this.props.isProfileUpdated) {
      Alert.alert('Success', 'Profile has been changed');
      this.props.updateIsProfileUpdated(false);
    }

    if (prevProps.isAvatarUpdated !== this.props.isAvatarUpdated) {
      Alert.alert('Success', 'Avatar has been changed');
      this.props.updateIsAvatarUpdated(false);
    }

    if (prevProps.isCodeConfirmed !== this.props.isCodeConfirmed) {
      Alert.alert('Your code is confirmed', 'You can not redeem referal code again ');
      this.props.updateIsCodeConfirmed(false);
    }

    if (prevProps.isLogOut !== this.props.isLogOut) {
      Actions.main();
      this.props.updateIsLogOut(false);
    }
  }

  handleInputChange = (field, value) => {
    this.props.updateFields(field, value);
  };

  handleUpdateAvatar = (value) => {
    this.props.updateAvatar(value);
  };

  handleInputReferal = (value) => {
    if (value === this.state.referal) {
      Toast.show("You can't refer your own code");
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
      this.props.updateReferalCode(value);
    }
  };

  confirmReferal = () => {
    this.props.confirmReferalCode(this.props.codeReferal);
  };

  uploadImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true
    })
      .then((image) => {
        this.props.updateImage(image);
      })
      .catch(err => console.log('Error getting image from library', err));
  };

  render() {
    // destructure state
    const booth = this.state.id === 3;
    const speaker = this.state.id === 4;
    const { fields, isDisabled, avatar, errorFields, codeReferal, haveRefered } = this.props || {};
    const { firstName, lastName, username, boothInfo, job, summary, profilePic, points } =
      fields || '';
    return (
      <Container>
        <ScrollView>
          <Content>
            <View style={styles.pointsSection}>
              <Text style={styles.points}>
                <Icon name="gift" style={styles.coin} /> {points} pts
              </Text>
            </View>
            <TouchableOpacity style={styles.imageProfile} onPress={() => this.uploadImage(this)}>
              <Image source={{ uri: avatar }} style={styles.profileImage} />
            </TouchableOpacity>
            <Text style={styles.username}>{username}</Text>
            <Text style={[ styles.username, { fontSize: 13 } ]}>
              {' '}
              Your code : {this.state.referal}{' '}
            </Text>
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => {
                this.props.disabled();
              }}
            >
              <Icon name={'edit'} size={24} color={isDisabled ? '#3F51B5' : '#BDBDBD'} />
            </TouchableOpacity>
            <View style={styles.section2}>
              {/* Referal Input */}
              {haveRefered === 0 ? (
                <View
                  style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 10 }}
                >
                  <InputItem
                    style={[ styles.inputReferal, { flex: 1 } ]}
                    title={strings.profile.lastName}
                    placeholder="Referal Code"
                    disabled={!!isDisabled}
                    onChangeText={(text) => {
                      this.handleInputReferal(text);
                    }}
                    underlineColorAndroid="transparent"
                  />
                  <TouchableOpacity
                    style={styles.buttonReferal}
                    onPress={() => this.confirmReferal()}
                    disabled={this.state.disabled}
                  >
                    <Text style={styles.textReferal}>CONFIRM</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View />
              )}
              <InputItem
                itemStyle={styles.item}
                style={styles.input}
                title={strings.profile.firstName}
                placeholder={strings.profile.firstName}
                disabled={!!isDisabled}
                onChangeText={(text) => {
                  this.handleInputChange('firstName', text);
                }}
                value={firstName}
              />
              <InputItem
                itemStyle={styles.item}
                style={styles.input}
                title={strings.profile.lastName}
                placeholder={strings.profile.lastName}
                disabled={!!isDisabled}
                onChangeText={(text) => {
                  this.handleInputChange('lastName', text);
                }}
                value={lastName}
              />
              {speaker ? (
                <InputItem
                  itemStyle={styles.item}
                  style={styles.inputJob}
                  title={strings.profile.job}
                  placeholder={strings.profile.job}
                  placeholderTextColor={'#BDBDBD'}
                  disabled={!!isDisabled}
                  onChangeText={(text) => {
                    this.handleInputChange('job', text);
                  }}
                  value={job}
                  maxLength={255}
                  multiline
                />
              ) : (
                <View />
              )}
              {speaker ? (
                <InputItem
                  itemStyle={styles.item}
                  style={styles.inputInfo}
                  title={strings.profile.summary}
                  placeholder={strings.profile.summary}
                  placeholderTextColor={'#BDBDBD'}
                  disabled={!!isDisabled}
                  onChangeText={(text) => {
                    this.handleInputChange('summary', text);
                  }}
                  value={summary}
                  maxLength={255}
                  multiline
                />
              ) : (
                <View />
              )}
              {booth ? (
                <InputItem
                  itemStyle={styles.item}
                  style={styles.inputInfo}
                  title={strings.profile.boothInfo}
                  placeholder={strings.profile.boothInfo}
                  disabled={!!isDisabled}
                  onChangeText={(text) => {
                    this.handleInputChange('boothInfo', text);
                  }}
                  value={boothInfo}
                  maxLength={255}
                  multiline
                />
              ) : (
                <View />
              )}
              <Button
                transparent
                style={styles.buttonChangePass}
                onPress={() => {
                  Actions.changePassword();
                }}
              >
                <Text style={styles.changePassText}>{strings.profile.changePassword}</Text>
              </Button>
              <Button
                block
                disabled={this.props.firstName === ''}
                style={styles.button}
                onPress={() => this.props.changeProfile()}
              >
                <Text>{strings.global.save}</Text>
              </Button>
            </View>
          </Content>
        </ScrollView>
      </Container>
    );
  }
}

/**
 *  Map redux state to component props
 */
const mapStateToProps = createStructuredSelector({
  haveRefered: selectors.getHaveRefered(),
  codeReferal: selectors.getReferal(),
  fields: selectors.getFields(),
  isProfileUpdated: selectors.getIsProfileUpdated(),
  avatar: selectors.getAvatar(),
  isAvatarUpdated: selectors.getIsAvatarUpdated(),
  isDisabled: selectors.getIsDisabled(),
  isLogOut: selectors.getIsLogOut()
});

export default connect(mapStateToProps, actions)(Profile);
