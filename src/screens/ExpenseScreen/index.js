import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { View, Text, DeviceEventEmitter, Alert, ActivityIndicator } from 'react-native';
import { ListItem as RNEListItem, Overlay } from 'react-native-elements';
import styles from './styles';
import { deleteExpense } from '../../store/actions/expense';
import { EXPENSE_DELETING } from '../../store/loadingTypes';

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
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

class ExpenseScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    props.navigation.setParams({ onDeletePress: this.handleDeletePress, expense: props.expense });
    DeviceEventEmitter.addListener('Expense:FinishEdit', () => {
      props.navigation.pop();
    });
  }
  componentDidUpdate(prevProps) {
    const { expense, navigation } = this.props;
    if (expense !== prevProps.expense) {
      navigation.setParams({ onDeletePress: this.handleDeletePress, expense });
    }
  }
  handleDeletePress = () => {
    const expense = this.props.navigation.getParam('expense');
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
            await this.props.onDeleteExpense(expense.id);
            this.props.navigation.pop();
          },
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  }
  render() {
    const {
      partner, you, isDeleteLoading, expense,
    } = this.props;
    // const expense = navigation.getParam('expense');
    return Object.keys(expense).length > 0 ? (
      <View style={styles.container}>
        {isDeleteLoading &&
          <Overlay isVisible overlayBackgroundColor="transparent" overlayStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="white" />
          </Overlay>
        }
        <ListItem
          title="Total"
          amount={expense.total}
        />
        <ListItem
          title="Category"
          amount={expense.category}
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
    ) : null;
  }
}

ExpenseScreen.defaultProps = {
  expense: {},
};

ExpenseScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  partner: PropTypes.string.isRequired,
  you: PropTypes.string.isRequired,
  onDeleteExpense: PropTypes.func.isRequired,
  expense: PropTypes.object,
  isDeleteLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => {
  const { expenseId } = props.navigation.state.params;
  return {
    you: state.couple.couple.you.name,
    partner: state.couple.couple.partner.name,
    expense: state.expense.expenseTable[expenseId],
    isDeleteLoading: Boolean(state.ui.isLoading[EXPENSE_DELETING]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteExpense: expenseId => dispatch(deleteExpense(expenseId)),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(ExpenseScreen);
