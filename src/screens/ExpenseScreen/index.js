import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { View, Text, DeviceEventEmitter } from 'react-native';
import { ListItem as RNEListItem } from 'react-native-elements';
import styles from './styles';

const ListItem = ({ title, amount }) => {
  return (
    <RNEListItem
      title={title}
      bottomDivider
      chevron={() => (
        <Text>{amount}</Text>
      )}
    />
  );
};

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
};

class ExpenseScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('expense').title,
  });
  constructor(props) {
    super(props);
    DeviceEventEmitter.addListener('Expense:FinishEdit', () => {
      props.navigation.pop();
    });
  }
  render() {
    const { navigation, partner, you } = this.props;
    const expense = navigation.getParam('expense');
    return (
      <View style={styles.container}>
        <ListItem
          title="Total"
          amount={expense.total}
        />
        <ListItem
          title={`${you} paid`}
          amount={expense.paid}
        />
        <ListItem
          title={`${you} should pay`}
          amount={expense.shouldPay}
        />
        <ListItem
          title={`${partner} paid`}
          amount={expense.total - expense.paid}
        />
        <ListItem
          title={`${partner} should pay`}
          amount={expense.total - expense.shouldPay}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    you: state.couple.couple.you.name,
    partner: state.couple.couple.partner.name,
  };
};

ExpenseScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  partner: PropTypes.string.isRequired,
  you: PropTypes.string.isRequired,
};

export default compose(connect(mapStateToProps))(ExpenseScreen);
