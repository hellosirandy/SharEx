import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import theme from '../../theme';

class DebtsScreenTitle extends React.PureComponent {
  render() {
    const { total } = this.props;
    let color = 'grey';
    let titlePrefix = '';
    if (total > 0) {
      color = theme.palette.blue;
      titlePrefix = '+';
    } else if (total < 0) {
      color = theme.palette.red;
    }
    return (
      <Text style={{ fontWeight: 'bold', fontSize: 16, color }}>Total: {titlePrefix}{total}</Text>
    );
  }
}

DebtsScreenTitle.propTypes = {
  total: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => {
  return {
    total: state.expense.total,
  };
};

export default compose(connect(mapStateToProps))(DebtsScreenTitle);
