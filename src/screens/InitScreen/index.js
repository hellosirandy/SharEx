import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { checkAuthenticated } from '../../store/actions/auth';
import { getCouple } from '../../store/actions/couple';

class InitScreen extends React.PureComponent {
  componentDidMount() {
    this.checkAuthenticated();
  }
  checkAuthenticated = async () => {
    const token = await this.props.onCheckAuthenticated();
    if (token) {
      await this.props.onGetCouple();
      this.props.navigation.navigate('AppStack');
    } else {
      this.props.navigation.navigate('AuthStack');
    }
  }
  render() {
    return (
      <View />
    );
  }
}

InitScreen.propTypes = {
  onCheckAuthenticated: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  onGetCouple: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCheckAuthenticated: () => dispatch(checkAuthenticated()),
    onGetCouple: () => dispatch(getCouple()),
  };
};

export default compose(connect(null, mapDispatchToProps))(InitScreen);
