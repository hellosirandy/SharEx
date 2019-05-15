import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { CalendarList } from 'react-native-calendars';
import moment from 'moment';
import theme from '../../theme';

class CalendarScreen extends React.PureComponent {
  handleDayPress = (day) => {
    this.props.navigation.getParam('onDayPress')(moment(day.dateString).format('L'));
    this.props.navigation.pop();
  }
  render() {
    const value = this.props.navigation.getParam('value');
    console.log(value);
    return (
      <CalendarList
        pastScrollRange={50}
        futureScrollRange={2}
        scrollEnabled
        onDayPress={this.handleDayPress}
        monthFormat="MMM yyyy"
        theme={{
          selectedDayBackgroundColor: theme.palette.primary,
          selectedDayTextColor: 'white',
          todayTextColor: theme.palette.blue,
        }}
        markedDates={{
          [moment(value).format('YYYY-MM-DD')]: {
            selected: true,
          },
        }}
      />
    );
  }
}

CalendarScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default compose()(CalendarScreen);
