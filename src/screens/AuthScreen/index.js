import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { View, KeyboardAvoidingView, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import DefaultInput from '../../components/DefaultInput';
import DefaultButton from '../../components/DefaultButton';
import { signIn } from '../../store/actions/auth';
import { AUTH_SIGNIN } from '../../store/loadingTypes';

class AuthScreen extends React.PureComponent {
  state = {
    controls: {
      email: {
        value: 'sac840711@gmail.com',
      },
      password: {
        value: '',
      },
    },
  }
  handleInputChange = key => (value) => {
    this.setState(prevState => ({
      ...prevState,
      controls: {
        ...prevState.controls,
        [key]: {
          value,
        },
      },
    }));
  }
  handleSubmitPress = async () => {
    const { controls: { email, password } } = this.state;
    try {
      await this.props.onSignIn(email.value, password.value);
      this.props.navigation.navigate('AppStack');
    } catch (e) {
      console.log(e);
    }
  }
  handleTouchablePress = () => {
    Keyboard.dismiss();
  };
  render() {
    const { controls: { email, password } } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <TouchableWithoutFeedback onPress={this.handleTouchablePress}>
            <View style={styles.container}>
              <DefaultInput placeholder="email" keyboardType="email-address" onChange={this.handleInputChange('email')} value={email.value} />
              <DefaultInput placeholder="password" password onChange={this.handleInputChange('password')} value={password.value} />
              <View style={{ marginTop: 30 }}>
                <DefaultButton title="Submit" onPress={this.handleSubmitPress} loading={this.props.isLoading} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

AuthScreen.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isLoading: Boolean(state.ui.isLoading[AUTH_SIGNIN]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: (email, password) => dispatch(signIn(email, password)),
    // onSignIn: (email, password) => dispatch(completeNewPassword(email, '3r8vEb05', password)),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(AuthScreen);
