import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Text } from 'react-native';

class ExpenseScreenTitle extends React.PureComponent {
  render() {
    return (
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{this.props.title}</Text>
    );
  }
}

ExpenseScreenTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => {
  const { expenseId } = props;
  const expense = state.expense.expenseTable[expenseId];
  return {
    title: expense ? expense.title : '',
  };
};

export default compose(connect(mapStateToProps))(ExpenseScreenTitle);
