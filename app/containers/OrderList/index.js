import React, { Component } from 'react';
import { Container, Content, List, Spinner, Button, Card, Form, Item, Input } from 'native-base';
import PropTypes from 'prop-types';
import {
  RefreshControl,
  Alert,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Modal
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ProgressBar from 'react-native-progress/Bar';
import { connect } from 'react-redux';
import Share from 'react-native-share';
import { createStructuredSelector } from 'reselect';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import strings from '../../localization';
import { getProfileData } from './../../helpers';
import OrderItem from '../../components/OrderItem';
import * as actions from './actions';
import * as selectors from './selectors';
import { PRIMARYCOLOR } from '../../constants';
import InputItem from '../../components/InputItem';

const { width } = Dimensions.get('window');

const noTicket = require('./../../../assets/images/noticket.png');

class OrderList extends Component {
  state = {
    selectedOrder: '',
    isLoading: true,
    referal: '',
    haveRefered: 0,
    referalCount: 0,
    firstName: '',
    lastName: '',
    modalVisibleConfirmation: false,
    modalMyOrders: false,
    isPaid: false,
    roleId: null
  };

  componentWillMount() {
    this.props.getOrderList();
    this.props.getCommunity();

    getProfileData()
      .then((data) => {
        console.log('profile', data);
        this.setState({
          firstName: data.first_name,
          lastName: data.last_name,
          referal: data.referal,
          haveRefered: data.have_refered,
          referalCount: data.referal_count,
          roleId: data.role_id
        });
      })
      .catch(err => console.log('Error getting data'));
  }

  componentWillReceiveProps(prevState) {
    const { isConfirming, isFetching } = this.props;
    this.setState({ isLoading: isConfirming || isFetching });
    if (prevState.orders !== this.props.orders) {
      this.setState({
        isLoading: false
      });
    }
  }

  setModalMyOrders(visible) {
    this.setState({ modalMyOrders: visible });
  }

  submitRegistration = () => {
    this.props.register(() => Actions.mainTabs());
  };

  checkEmail = (inputvalue) => {
    const pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    if (pattern.test(inputvalue)) return true;
    return false;
  };

  handleInputChange = (fields, value) => {
    this.props.updateInputFields(fields, value);
  };

  confirmPayment = (props) => {
    const idx = this.props.orders.indexOf(props);
    Alert.alert(
      strings.order.confirmPayment,
      'Confirm payment Order : '.concat(props.id),
      [
        { text: strings.global.cancel },
        {
          text: strings.global.confirm,
          onPress: () => {
            this.props.confirmPayment(props.payment.id, idx);
          }
        }
      ],
      { cancelable: false }
    );
  };

  invite = () => {
    const { firstName, lastName, referal } = this.state;

    Share.open({
      title: 'Devsummit invitation',
      message: `Check out the biggest event for programmer in 21-23 November 2017. Download the apps https://play.google.com/store/apps/details?id=io.devsummit.app.android and use ${referal} as referal code to collect points for free ticket. Cheers!`,
      subject: 'Devsummit invitation'
    });
  };

  setModalVisibleConfirmation(visible) {
    this.setState({ modalVisibleConfirmation: visible });
  }

  setConfirmEmail = () => {
    this.props.setConfirmEmail(this.props.inputFields.email, () => this.setModalVisibleConfirmation(false));
  }

  render() {
    const { orders } = this.props.orders;
    const count = this.props.redeemCount === 10;
    if (this.state.isLoading) {
      return (
        <Container>
          <Content>
            <Spinner color={PRIMARYCOLOR} />
          </Content>
        </Container>
      );
    }
    const { isConfirmEmail } = this.props;
    return (
      <Container style={styles.container}>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.props.isFetching}
              onRefresh={() => this.props.getOrderList()}
            />
          }
        >
          {!this.state.isPaid ?
            <View style={{ marginTop: 10, marginHorizontal: 10 }}>
              {this.props.redeemCount > 10 ? null : (
                this.state.roleId === 8 ? (
                  <Card>
                    <View style={styles.card}>
                      <TouchableOpacity
                        style={styles.buttonClaim}
                        disabled={!count}
                        onPress={() => this.props.submitReferal()}
                      >
                        <Icon
                          name="money"
                          style={{ fontSize: 30, color: count ? PRIMARYCOLOR : '#BDBDBD' }}
                        />
                        <Text style={{ fontSize: 18, color: count ? PRIMARYCOLOR : '#BDBDBD' }}>
                          CLAIM
                        </Text>
                      </TouchableOpacity>
                      {!isConfirmEmail ? (
                        <View />
                      ) : (
                        <View style={styles.inviteField}>
                          <Text style={styles.inviteDesc}>Invite community to get free pass!</Text>
                          <Text style={styles.counterText}>Invited people {this.props.redeemCount} of 10</Text>
                          {/* <ProgressBar
                            borderRadius={0}
                            progress={this.props.redeemCount / 10}
                            width={width * 0.5}
                            color={PRIMARYCOLOR}
                          /> */}
                          <TouchableOpacity onPress={() => this.invite()} disabled={count}>
                            <View>
                              <Text style={count ? styles.inviteDisable : styles.invite}>Invite</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </Card>
                ) : (
                  <Card>
                    <View style={styles.card}>
                      <TouchableOpacity
                        style={styles.buttonClaim}
                        disabled={!count}
                        onPress={() => this.props.submitReferal()}
                      >
                        <Icon
                          name="gift"
                          style={{ fontSize: 30, color: count ? PRIMARYCOLOR : '#BDBDBD' }}
                        />
                        <Text style={{ fontSize: 18, color: count ? PRIMARYCOLOR : '#BDBDBD' }}>
                          CLAIM
                        </Text>
                      </TouchableOpacity>
                      {!isConfirmEmail ? (
                        <View />
                      ) : (
                        <View style={styles.inviteField}>
                          <Text style={styles.inviteDesc}>Invite friends to get free pass!</Text>
                          <Text style={styles.counterText}>{this.props.redeemCount} of 10</Text>
                          <ProgressBar
                            borderRadius={0}
                            progress={this.props.redeemCount / 10}
                            width={width * 0.5}
                            color={PRIMARYCOLOR}
                          />
                          <TouchableOpacity onPress={() => this.invite()} disabled={count}>
                            <View>
                              <Text style={count ? styles.inviteDisable : styles.invite}>Invite</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </Card>
                )
              )}
            </View> :
            <View />}
          <Button
            style={{ margin: 10, backgroundColor: '#FF6F00' }}
            block
            warning
            onPress={() => Actions.myOrders()}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>My Orders ({this.props.orders.length})</Text>
          </Button>
          <View style={{ marginTop: 5 }}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalMyOrders}
              onRequestClose={() => {
                this.setModalMyOrders(!this.state.modalMyOrders);
              }}
            >
              <View style={{ marginTop: 5 }}>
                <View>
                  {this.props.orders.length > 0 ? (
                    <List>
                      {this.props.orders.map((order) => {
                        if (order.status !== 'paid') {
                          return (
                            <OrderItem
                              key={order.id}
                              order={order}
                              confirmPayment={this.confirmPayment}
                              onPress={() => {
                                Actions.orderDetail({
                                  orderId: order.id,
                                  id: order.id
                                });
                              }}
                            />
                          );
                        }
                      })}
                    </List>
                  ) : <View /> }

                </View>
              </View>
            </Modal>
          </View>
          {this.props.orders.length > 0 ? (
            <View>
              <List>
                {this.props.orders.map((order) => {
                  if (order.status === 'paid') {
                    this.state.isPaid = true;
                    return (
                      <OrderItem
                        key={order.id}
                        order={order}
                        confirmPayment={this.confirmPayment}
                        onPress={() => {
                          Actions.orderDetail({
                            orderId: order.id,
                            id: order.id
                          });
                        }}
                      />
                    );
                  }
                  return (
                    <View />
                  );
                })}
              </List>
              {!this.state.isPaid ? (
                <View style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                >
                  <Image source={noTicket} style={{ opacity: 0.7 }} />
                  <Text style={{ color: '#FF6F00' }}>You do not have any ticket</Text>
                </View>
              ) : (
                <View />
              )}
            </View>
          ) : (
            <View style={styles.artwork}>
              {!isConfirmEmail ? (
                <View>
                  <Text style={styles.artworkText}>Please confirm your email first</Text>
                  <Button
                    block
                    style={{ margin: 10 }}
                    onPress={() =>
                      this.setModalVisibleConfirmation(!this.state.modalVisibleConfirmation)}
                  >
                    <Text style={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                      Resend confirmation
                    </Text>
                  </Button>
                </View>
              ) : (
                <View />
              )}
            </View>
          )}
          <Modal
            animationType="slide"
            transparent
            visible={this.state.modalVisibleConfirmation}
            onRequestClose={() => {
              this.setModalVisibleConfirmation(!this.state.modalVisibleConfirmation);
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center' }} backgroundColor="rgba(0, 0, 0, 0.5)">
              <View style={styles.modalConfirm}>
                <TouchableWithoutFeedback
                  onPress={() => this.setModalVisibleConfirmation(false)}
                >
                  <Icon style={styles.iconClose} name="times" />
                </TouchableWithoutFeedback>
                <View style={styles.viewModalConfirm}>
                  <Icon name="envelope" style={{ fontSize: 40, color: PRIMARYCOLOR, margin: 10 }} />
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: PRIMARYCOLOR }}>
                    Resend Confirmation
                  </Text>
                </View>
                <Item>
                  <Input
                    style={{ borderBottomWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', marginHorizontal: 10 }}
                    placeholder="email"
                    placeholderTextColor="#BDBDBD"
                    onChangeText={email => this.handleInputChange('email', email)}
                  />
                </Item>
                <Button style={{ margin: 10, alignSelf: 'center', paddingHorizontal: 20, backgroundColor: PRIMARYCOLOR }} onPress={() => this.setConfirmEmail()} >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
                </Button>
              </View>
            </View>
          </Modal>
        </Content>
      </Container>
    );
  }
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  confirmPayment: PropTypes.func.isRequired,
  getOrderList: PropTypes.func.isRequired,
  isConfirming: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  getCommunity: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  orders: selectors.getOrders(),
  isFetching: selectors.getIsFetchingOrders(),
  isConfirming: selectors.getIsConfirmingPayment(),
  redeemCount: selectors.getRedeemCode(),
  redeemstatus: selectors.getReedemStatus(),
  inputFields: selectors.getInputFields(),
  isConfirmEmail: selectors.getIsConfirmEmail(),
  isConfirmingEmail: selectors.getIsConfirmingEmail(),
  community: selectors.getCommunity()
});

export default connect(mapStateToProps, actions)(OrderList);
