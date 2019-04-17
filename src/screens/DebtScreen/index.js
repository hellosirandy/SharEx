import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ListItem, Button, Icon } from 'react-native-elements';
import { View, FlatList, RefreshControl } from 'react-native';
// import styles from './styles';
import moment from 'moment';
import { getExpense } from '../../store/actions/expense';
import theme from '../../theme';

class DebtScreen extends React.PureComponent {
  state = {
    refreshing: false,
  }
  componentDidMount() {
    this.props.onGetExpense();
  }
  handleRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.onGetExpense();
    this.setState({ refreshing: false });
  }
  handleExpenseClick = expense => () => {
    this.props.navigation.navigate('ExpenseScreen', { expense });
  }
  render() {
    const { expenses } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={expenses}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          renderItem={({ item }) => {
            const balance = item.paid - item.shouldPay;
            return (
              <ListItem
                containerStyle={{ paddingVertical: 8 }}
                title={item.title}
                subtitle={`$${balance}`}
                subtitleStyle={{ color: balance > 0 ? theme.palette.blue : theme.palette.red }}
                key={item.date}
                bottomDivider
                chevron={() => (
                  <Button
                    title={moment(item.date).format('L')}
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
                onPress={this.handleExpenseClick(item)}
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
  expenses: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    expenses: state.expense.expenses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetExpense: () => dispatch(getExpense()),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(DebtScreen);
