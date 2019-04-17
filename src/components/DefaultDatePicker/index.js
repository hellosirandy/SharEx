import React from 'react';
import { compose } from 'recompose';
import DatePicker from 'react-native-datepicker';
import theme from '../../theme';
// import styles from './styles';

const DefaultDatePicker = ({ onChange, value }) => {
  return (
    <DatePicker
      style={{ height: null }}
      date={value}
      mode="date"
      placeholder="select date"
      format="MM/DD/YYYY"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      customStyles={{
        dateTouchBody: {
          height: null,

        },
        dateInput: {
          borderWidth: 0,
          alignItems: 'flex-end',
          height: null,
        },
        dateText: {
          textAlign: 'right',
          fontSize: 17,
        },
        btnTextConfirm: {
          color: theme.palette.primary,
        },
        // ... You can check the source to find the other keys.
      }}
      showIcon={false}
      onDateChange={onChange}
    />
  );
};

DefaultDatePicker.propTypes = {
};

export default compose()(DefaultDatePicker);
