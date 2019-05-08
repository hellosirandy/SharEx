import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { View, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { ListItem, Input, Button, Overlay } from 'react-native-elements';
import { Header } from 'react-navigation';
import moment from 'moment';
import styles from './styles';
import { createExpense, deleteExpense, updateExpense } from '../../store/actions/expense';
import { EXPENSE_CREATING } from '../../store/loadingTypes';
import DefaultDatePicker from '../../components/DefaultDatePicker';
import { validateForm, validate } from '../../utils/validation';
import theme from '../../theme';

const TextInput = ({
  placeholder, onChange, keyboardType, value, onFocus, onBlur,
}) => {
  return (
    <View style={{ width: 150 }}>
      <Input
        placeholder={placeholder}
        inputContainerStyle={{ borderBottomWidth: 0, width: '100%' }}
        containerStyle={{ paddingHorizontal: 0 }}
        inputStyle={{ minHeight: 0, fontSize: 17 }}
        onChangeText={onChange}
        keyboardType={keyboardType}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </View>
  );
};

TextInput.defaultProps = {
  placeholder: '',
  keyboardType: null,
  onChange: null,
  value: null,
  onFocus: null,
  onBlur: null,
};

TextInput.propTypes = {
  placeholder: PropTypes.string,
  keyboardType: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

class NewExpenseScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    props.navigation.setParams({ onSubmit: this.handleSubmitPress });
    const expense = props.navigation.getParam('expense');
    const title = expense ? expense.title : '';
    const total = (expense ? expense.total : '').toString();
    const paid = (expense ? expense.paid : '').toString();
    const shouldPay = (expense ? expense.shouldPay : '').toString();
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
          valid: Boolean(date),
          validationRules: [],
        },
      },
      submitted: false,
      focusing: '',
      editMode: Boolean(expense),
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
      if (expense) {
        await this.props.onUpdateExpense({
          title: title.value,
          total: Number(total.value),
          paid: Number(paid.value),
          shouldPay: Number(shouldPay.value),
          date: new Date(date.value).getTime(),
          expenseId: expense.id,
        });
      } else {
        await this.props.onCreateExpense({
          title: title.value,
          total: Number(total.value),
          paid: Number(paid.value),
          shouldPay: Number(shouldPay.value),
          date: new Date(date.value).getTime(),
        });
      }
      this.dismiss();
    }
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
  dismiss = () => {
    if (this.state.editMode) {
      this.props.navigation.pop();
      DeviceEventEmitter.emit('Expense:FinishEdit', {});
    } else {
      this.props.navigation.pop();
    }
  }
  handleOverlayDismiss = () => {
    this.setState({ overlay: '' });
  }
  handleSetOverlay = overlay => () => {
    this.setState({ overlay });
  }
  handleInputFocus = key => () => {
    this.setState({ focusing: key });
  }
  handleSplitOrTreatPress = treat => () => {
    this.setState((prevState) => {
      const total = prevState.controls.total.value;
      const value = (treat ? total : total / 2).toString();
      return {
        ...prevState,
        controls: {
          ...prevState.controls,
          shouldPay: {
            ...prevState.controls.shouldPay,
            value,
            valid: validate(value, prevState.controls.shouldPay.validationRules),
          },
        },
      };
    });
  }
  render() {
    const {
      controls: {
        title, total, date, paid, shouldPay,
      },
      focusing,
    } = this.state;
    const { isLoading, navigation } = this.props;
    const expense = navigation.getParam('expense');
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Header.HEIGHT + 24} pointerEvents={isLoading ? 'none' : 'auto'}>
        <TouchableWithoutFeedback onPress={this.handleTouchablePress}>
          <View style={styles.container}>
            {isLoading &&
              <Overlay isVisible overlayBackgroundColor="transparent" overlayStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color="white" />
              </Overlay>
            }
            <View style={{ flex: 1 }}>
              <ListItem
                title="Title"
                bottomDivider
                rightElement={
                  <TextInput
                    placeholder="title"
                    onChange={this.handleInputChange('title')}
                    value={title.value}
                  />}
              />

              <ListItem
                title="Total"
                bottomDivider
                rightElement={
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
                rightElement={
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
                rightElement={
                  <TextInput
                    placeholder="you should pay"
                    onChange={this.handleInputChange('shouldPay')}
                    value={shouldPay.value}
                    keyboardType="numeric"
                    onFocus={this.handleInputFocus('shouldPay')}
                    onBlur={this.handleInputFocus('')}
                  />}
              />
              <ListItem
                title="Date"
                bottomDivider
                rightElement={<DefaultDatePicker onChange={this.handleInputChange('date')} value={date.value} />}
              />
              {expense && <ListItem
                title="Delete"
                bottomDivider
                titleStyle={{ color: theme.palette.red }}
                chevron
                onPress={this.handleDeletePress(expense.id)}
              />}
            </View>
            {focusing === 'shouldPay' &&
              <View style={styles.footer}>
                <Button title="split" onPress={this.handleSplitOrTreatPress(false)} containerStyle={styles.footerButton} buttonStyle={{ backgroundColor: 'transparent' }} />
                <Button title="you treat" onPress={this.handleSplitOrTreatPress(true)} containerStyle={styles.footerButton} buttonStyle={{ backgroundColor: 'transparent' }} />
              </View>
            }

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

NewExpenseScreen.propTypes = {
  onCreateExpense: PropTypes.func.isRequired,
  onUpdateExpense: PropTypes.func.isRequired,
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
    onCreateExpense: options => dispatch(createExpense(options)),
    onUpdateExpense: options => dispatch(updateExpense(options)),
    onDeleteExpense: expenseId => dispatch(deleteExpense(expenseId)),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(NewExpenseScreen);
