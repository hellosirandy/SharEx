import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ListItem, Button, Icon } from 'react-native-elements';
import { View, FlatList, RefreshControl, ActionSheetIOS, Alert } from 'react-native';
import moment from 'moment';
import { getExpense, deleteExpense } from '../../store/actions/expense';
import theme from '../../theme';

class DebtScreen extends React.PureComponent {
  state = {
    refreshing: false,
  }
  handleRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.onGetExpense();
    this.setState({ refreshing: false });
  }
  handleExpenseClick = expense => () => {
    this.props.navigation.navigate('ExpenseScreen', { expense });
  }
  handleExpenseLongPress = expenseId => () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Delete'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          /* destructive action */
          this.handleDeletePress(expenseId);
        }
      },
    );
  }
  handleDeletePress = expenseId => () => {
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
            await this.props.onDeleteExpense(expenseId);
            this.dismiss();
          },
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  }
  render() {
    const { expenseIds, expenseTable } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={expenseIds}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          renderItem={({ item }) => {
            const expense = expenseTable[item];
            const balance = expense.paid - expense.shouldPay;
            return (
              <ListItem
                onLongPress={this.handleExpenseLongPress(item)}
                containerStyle={{ paddingVertical: 8 }}
                title={expense.title}
                subtitle={`$${balance}`}
                subtitleStyle={{ color: balance > 0 ? theme.palette.blue : theme.palette.red }}
                key={expense.date}
                bottomDivider
                chevron={() => (
                  <Button
                    title={moment(expense.date).format('L')}
                    buttonStyle={{ padding: 0 }}
                    titleStyle={{ color: 'grey', fontSize: 15 }}
                    type="clear"
                    TouchableComponent={TouchableWithoutFeedback}
                    icon={
                      <Icon
                        name="chevron-right"
                        type="evilicon"
                        size={20}
                        color="grey"
                      />
                    }
                    iconRight
                  />
                )}
                onPress={this.handleExpenseClick(expense)}
              />
            );
          }}
        />
      </View>
    );
  }
}

DebtScreen.propTypes = {
  onGetExpense: PropTypes.func.isRequired,
  expenseIds: PropTypes.array.isRequired,
  expenseTable: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  onDeleteExpense: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    expenseIds: state.expense.expenseIds,
    expenseTable: state.expense.expenseTable,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetExpense: () => dispatch(getExpense()),
    onDeleteExpense: expenseId => dispatch(deleteExpense(expenseId)),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(DebtScreen);
