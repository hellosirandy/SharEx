import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { ListItem, Input } from 'react-native-elements';
import { StackActions } from 'react-navigation';
import moment from 'moment';
import DefaultInput from '../../components/DefaultInput';
import styles from './styles';
import DefaultButton from '../../components/DefaultButton';
import { createExpense, deleteExpense } from '../../store/actions/expense';
import { EXPENSE_CREATING } from '../../store/loadingTypes';
import DefaultDatePicker from '../../components/DefaultDatePicker';
import { validateForm, validate } from '../../utils/validation';
import theme from '../../theme';

const TextInput = ({
  placeholder, onChange, keyboardType, value,
}) => {
  return (
    <View style={{ width: 150 }}>
      <Input
        placeholder={placeholder}
        inputContainerStyle={{ borderBottomWidth: 0 }}
        containerStyle={{ paddingHorizontal: 0 }}
        inputStyle={{ minHeight: 0, textAlign: 'right', fontSize: 17 }}
        onChangeText={onChange}
        keyboardType={keyboardType}
        value={value}
      />
    </View>
  );
};

TextInput.defaultProps = {
  placeholder: '',
  keyboardType: null,
  onChange: null,
  value: null,
};

TextInput.propTypes = {
  placeholder: PropTypes.string,
  keyboardType: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

class NewExpenseScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    props.navigation.setParams({ onSubmit: this.handleSubmitPress });
    const expense = props.navigation.getParam('expense');
    console.log(expense);
    const title = expense ? expense.title : '';
    const total = (expense ? expense.total : '').toString();
    const paid = (expense ? expense.paid : '').toString();
    const shouldPay = (expense ? expense.shouldPay : '').toString();
    // const { date } = expense;
    const date = expense ? expense.date : new Date().getTime();
    this.state = {
      controls: {
        title: {
          value: title,
          valid: validate(title, ['notEmpty']),
          validationRules: ['notEmpty'],
          errMsg: 'Title cannot be empty',
        },
        total: {
          value: total,
          valid: validate(total, ['notEmpty', 'isNumber']),
          validationRules: ['notEmpty', 'isNumber'],
          errMsg: 'Total must be given a number',
        },
        paid: {
          value: paid,
          valid: validate(paid, ['notEmpty', 'isNumber']),
          validationRules: ['notEmpty', 'isNumber'],
          errMsg: 'Paid must be given a number',
        },
        shouldPay: {
          value: shouldPay,
          valid: validate(shouldPay, ['notEmpty', 'isNumber']),
          validationRules: ['notEmpty', 'isNumber'],
          errMsg: 'Should pay must be given a number',
        },
        date: {
          value: moment(date).format('L'),
          // value: date ? moment(date).format('L') : moment().format('L'),
          valid: Boolean(date),
          validationRules: [],
        },
      },
      submitted: false,
    };
  }
  handleTouchablePress = () => {
    Keyboard.dismiss();
  };

  handleInputChange = key => (value) => {
    this.setState(prevState => ({
      ...prevState,
      controls: {
        ...prevState.controls,
        [key]: {
          ...prevState.controls[key],
          value,
          valid: validate(value, prevState.controls[key].validationRules),
        },
      },
    }));
  }
  handleSubmitPress = async () => {
    this.setState({ submitted: true });
    const valid = validateForm(this.state.controls, ['title', 'total', 'paid', 'shouldPay']);
    if (valid) {
      const {
        controls: {
          title, total, paid, shouldPay, date,
        },
      } = this.state;
      const expense = this.props.navigation.getParam('expense');
      const expenseId = expense ? expense.id : null;
      await this.props.onCreateExpense(
        title.value,
        Number(total.value),
        Number(paid.value),
        Number(shouldPay.value),
        new Date(date.value).getTime(),
        expenseId,
      );
      this.props.navigation.pop();
    } else {
      console.log('hihihi');
    }
  }
  handleDeletePress = expenseId => async () => {
    await this.props.onDeleteExpense(expenseId);
    this.props.navigation.pop();
  }
  render() {
    const {
      controls: {
        title, total, date, paid, shouldPay,
      }, submitted,
    } = this.state;
    const expense = this.props.navigation.getParam('expense');
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <TouchableWithoutFeedback onPress={this.handleTouchablePress}>
            <View style={styles.container}>
              {/* <React.Fragment>
                <DefaultInput
                  placeholder="title"
                  label="Title"
                  onChange={this.handleInputChange('title')}
                  value={title.value}
                  errMsg={(submitted && !title.valid) ? title.errMsg : null}
                />
                <DefaultInput
                  placeholder="You paid..."
                  label="Amount"
                  keyboardType="numeric"
                  onChange={this.handleInputChange('amount')}
                  value={amount.value}
                  errMsg={(submitted && !amount.valid) ? amount.errMsg : null}
                />
                <DefaultDatePicker onChange={this.handleInputChange('date')} value={date.value} />
                <DefaultButton title="Submit" onPress={this.handleSubmitPress} loading={this.props.isLoading} />
              </React.Fragment> */}
              <ListItem
                title="Title"
                bottomDivider
                chevron={
                  <TextInput
                    placeholder="title"
                    onChange={this.handleInputChange('title')}
                    value={title.value}
                  />}
              />
              <ListItem
                title="Total"
                bottomDivider
                chevron={
                  <TextInput
                    placeholder="total"
                    onChange={this.handleInputChange('total')}
                    value={total.value}
                    keyboardType="numeric"
                  />}
              />
              <ListItem
                title="You paid"
                bottomDivider
                chevron={
                  <TextInput
                    placeholder="you paid"
                    onChange={this.handleInputChange('paid')}
                    value={paid.value}
                    keyboardType="numeric"
                  />}
              />
              <ListItem
                title="You should pay"
                bottomDivider
                chevron={
                  <TextInput
                    placeholder="you should pay"
                    onChange={this.handleInputChange('shouldPay')}
                    value={shouldPay.value}
                    keyboardType="numeric"
                  />}
              />
              <ListItem
                title="Date"
                bottomDivider
                chevron={<DefaultDatePicker onChange={this.handleInputChange('date')} value={date.value} />}
              />
              {expense && <ListItem
                title="Delete"
                bottomDivider
                titleStyle={{ color: theme.palette.red }}
                chevron
                onPress={this.handleDeletePress(expense.id)}
              />}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

NewExpenseScreen.propTypes = {
  onCreateExpense: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  onDeleteExpense: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isLoading: Boolean(state.ui.isLoading[EXPENSE_CREATING]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateExpense: (title, total, paid, shouldPay, date, expenseId = null) =>
      dispatch(createExpense(title, total, paid, shouldPay, date, expenseId)),
    onDeleteExpense: expenseId => dispatch(deleteExpense(expenseId)),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(NewExpenseScreen);
