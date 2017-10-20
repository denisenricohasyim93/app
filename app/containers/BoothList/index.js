import React, { Component } from 'react';
import {
  Container,
  Content,
  Button,
  Card,
  CardItem,
  Spinner,
  Body,
  Header,
  Item,
  Icon,
  Input
} from 'native-base';
import {
  View,
  Image,
  Text,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import IconFA from 'react-native-vector-icons/FontAwesome';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import strings from '../../localization';
import HeaderPoint from '../../components/Header';
import styles from './styles';
import * as selectors from './selectors';
import * as actions from './actions';
import Redeem from '../Redeem';
import AccordionView from './Accordion';
import AccordionView2 from './Accordion2';

const bgBooth1 = require('./../../../assets/images/bgbooth_1.png');
const bgBooth2 = require('./../../../assets/images/bgbooth_2.png');

class BoothList extends Component {
  state = {
    modalVisible: false,
    boothFilter: this.props.booth,
    url: 'https://api.devsummit.io/static/prospectous.pdf'
  };

  componentWillMount() {
    this.props.fetchBoothList();
    this.props.fetchHackatonList();
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps && prevProps.booth && this.props.booth !== prevProps.booth) {
      this.setState({
        boothFilter: prevProps.booth
      });
    }
  }

  setAccordion = (visible) => {
    this.setState({ accordion: visible });
  };

  setAccordion2 = (visible) => {
    this.setState({ accordion2: visible });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  getProspectusFile = () => {
    Linking.openURL(this.state.url);
  };

  handleFilter = (param) => {
    const filteredBooth = [];
    this.props.booth.map((data) => {
      if (
        data.user.first_name.toLowerCase().includes(param.toLowerCase()) ||
        data.user.last_name.toLowerCase().includes(param.toLowerCase())
      ) {
        filteredBooth.push(data);
      }
    });
    this.setState({
      boothFilter: filteredBooth
    });
  };

  setPaymentMethod = (ticketPrice) => {
    Actions.payment({ ticketPrice });
  };

  render() {
    console.log('landing here this.props boothlist hackaton ', this.props);
    const { booth } = this.props;
    return (
      <Container style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FF8B00',
            justifyContent: 'space-between'
          }}
        >
          <HeaderPoint title={strings.booth.title} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }}
          >
            <IconFA
              name="question-circle"
              onPress={() => this.setModalVisible(true)}
              style={{
                elevation: 2,
                alignSelf: 'center',
                color: '#FFF',
                fontSize: 25,
                marginRight: 20
              }}
            />
          </View>
        </View>
        <Image
source={bgBooth2}
resizeMode="cover"
style={{
          flex: 0.21,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
         }}
        >
          <Button
            style={styles.btnBooth}
            onPress={() => {
              this.setAccordion(!this.state.accordion);
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, margin: 5, textAlign: 'center' }}>
              {this.state.accordion ? 'Please select one of options' : strings.booth.register}
            </Text>
          </Button>
          <Button
            style={styles.btnBooth}
            onPress={() => {
              this.setAccordion2(!this.state.accordion2);
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16, margin: 5, textAlign: 'center' }}>
              Hackaton
            </Text>
          </Button>
        </Image>
        {this.state.accordion || this.state.accordion2 ? (
          <View style={styles.searchHeader} />
        ) : (
          <Header searchBar style={styles.searchHeader} androidStatusBarColor="#f39e21">
            <Item>
              <Icon name="ios-search" style={{ color: '#f39e21', fontSize: 30 }} />
              <Input
                style={{ fontSize: 16, alignSelf: 'center' }}
                placeholder={strings.booth.search}
                onChangeText={text => this.handleFilter(text)}
              />
            </Item>
          </Header>
        )}
        <Modal
          animationType="fade"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center' }} backgroundColor="rgba(0, 0, 0, 0.5)">
            <View style={styles.modalInfo}>
              <TouchableWithoutFeedback
                onPress={() => this.setModalVisible(!this.state.modalVisible)}
              >
                <IconFA style={styles.iconClose} name="times" />
              </TouchableWithoutFeedback>
              <Text style={{ fontSize: 20, textAlign: 'center', color: '#000' }}>
                {strings.booth.howto}
              </Text>
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 16 }}>
                  {strings.booth.info}
                  {'\n'}
                  {strings.booth.find}
                </Text>
                <View style={{ margin: 20, alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Fajar Adityo</Text>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>081252700655</Text>
                  <Text style={{ marginVertical: 12 }}>OR</Text>
                  <TouchableOpacity
                    style={styles.btnDownload}
                    onPress={() => {
                      this.getProspectusFile();
                    }}
                  >
                    <Text style={{ color: '#FFF', fontSize: 16 }}>
                      {strings.global.download}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <Text style={{ fontSize: 16 }}>{strings.booth.alreadyRegister}</Text> */}
              </View>
            </View>
          </View>
        </Modal>
        <Content>
          {this.props.isFetching ? (
            <Spinner color="#FF8B00" />
          ) : this.state.accordion ? (
            <AccordionView setPaymentMethod={this.setPaymentMethod} />
          ) : this.state.accordion2 ? (
            <View>
              {this.props.isFetching2 || this.props.isFetching2 === undefined || this.props.hackaton === undefined ? (
                <AccordionView2 setPaymentMethod={this.setPaymentMethod} />
              ) : (
                <View style={{ margin: 10}}>
                  <View style={{ alignItems: 'center'}}>
                    <Image style={styles.profilePic2} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3y6eXbmTc_9b224H656uKVPnTFGj453nxNZZQuBBGH7fS1jO4' }} />
                  </View>
                  <Text/>
                  <Text><Text style={{ fontWeight: 'bold' }}>Hackaton team name    :</Text> {this.props.hackaton.name}</Text>
                  <Text/>
                  <Text><Text style={{ fontWeight: 'bold' }}>Hackaton project name :</Text> {this.props.hackaton.project_name}</Text>
                  <Text/>
                  <Text style={{ fontWeight: 'bold' }}>Member List : </Text>
                  {/* {this.props.hackaton.user.map((item, idx) => (
                    <View key={idx}>
                      <Text>{idx + 1} . {item.first_name}</Text>
                    </View>
                  ))} */}
                  <View style={styles.content}>
                    {this.props.hackaton.user.map((data, index) => (
                      <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }} key={data.id}>
                        <View style={styles.profileSection}>
                          <Image style={styles.profilePic} source={{ uri: data.photos[0].url }} />
                          <View style={styles.nameSection}>
                            <Text style={styles.name}>
                              {data.first_name} {data.last_name}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )
              }
            </View>
          ) : (
            <View style={styles.content}>
              {this.state.boothFilter.map((data, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    Actions.boothInfo({
                      title: data.name,
                      summary: data.summary,
                      user: data.user,
                      booth_photo: data.logo_url,
                      booth_id: data.id
                    });
                  }}
                >
                  <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 10 }} key={data.id}>
                    <View style={styles.profileSection}>
                      <Image style={styles.profilePic} source={{ uri: data.logo_url }} />
                      <View style={styles.nameSection}>
                        <Text style={styles.name}>
                          {data.user.first_name} {data.user.last_name}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  booth: selectors.getListBooth(),
  isFetching: selectors.getIsFetchingBooths(),
  hackaton: selectors.getListHackaton(),
  isFetching2: selectors.getIsFetchingHackatons()
});
export default connect(mapStateToProps, actions)(BoothList);
