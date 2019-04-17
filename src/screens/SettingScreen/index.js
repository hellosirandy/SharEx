import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { ListItem, Button } from 'react-native-elements';
import styles from './styles';
import { signOut } from '../../store/actions/auth';

class SettingScreen extends React.PureComponent {
  handleSignOutPress = async () => {
    await this.props.onSignOut();
    this.props.navigation.navigate('AuthStack');
  }
  render() {
    return (
      <View>
        <ListItem
          chevron
          title="Sign Out"
          onPress={this.handleSignOutPress}
        />
      </View>
    );
  }
}

SettingScreen.propTypes = {
  onSignOut: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignOut: () => dispatch(signOut()),
  };
};

export default compose(connect(null, mapDispatchToProps))(SettingScreen);
