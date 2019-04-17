import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Text, ActivityIndicator } from 'react-native';
import { EXPENSE_GETTING } from '../../store/loadingTypes';
import theme from '../../theme';

class DebtsScreenTitle extends React.PureComponent {
  render() {
    const { total, isLoading } = this.props;
    let color = 'grey';
    let titlePrefix = '';
    if (total > 0) {
      color = theme.palette.blue;
      titlePrefix = '+';
    } else if (total < 0) {
      color = theme.palette.red;
    }
    return (
      isLoading ? <ActivityIndicator /> : <Text style={{ fontWeight: 'bold', fontSize: 16, color }}>Total: {titlePrefix}{total}</Text>
    );
  }
}

DebtsScreenTitle.propTypes = {
  total: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    total: state.expense.total,
    isLoading: Boolean(state.ui.isLoading[EXPENSE_GETTING]),
  };
};

export default compose(connect(mapStateToProps))(DebtsScreenTitle);
