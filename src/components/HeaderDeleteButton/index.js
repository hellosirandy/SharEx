import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { deleteExpense } from '../../store/actions/expense';
import theme from '../../theme';

class HeaderDeleteButton extends React.PureComponent {
  handleDeletePress = () => {
    Alert.alert(
      'Alert Title',
      'Are you sure you want to delete this data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await this.props.onDeleteExpense();
            this.props.navigation.pop();
          },
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  }
  render() {
    return (
      <TouchableOpacity
        style={{ padding: 8 }}
        onPress={this.handleDeletePress}
      >
        <Icon
          type="font-awesome"
          name="trash"
          size={25}
          underlayColor="transparent"
          color={theme.palette.red}
        />
      </TouchableOpacity>
    );
  }
}

HeaderDeleteButton.propTypes = {
  navigation: PropTypes.object.isRequired,
  onDeleteExpense: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, props) => {
  const { expenseId } = props;
  return {
    onDeleteExpense: () => dispatch(deleteExpense(expenseId)),
  };
};

export default compose(connect(null, mapDispatchToProps))(HeaderDeleteButton);
