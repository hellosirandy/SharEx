import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Input } from 'react-native-elements';
import styles from './styles';

const DefaultInput = ({
  placeholder, password, keyboardType, onChange, value, label, errMsg, autoFocus,
}) => {
  return (
    <Input
      placeholder={placeholder}
      secureTextEntry={password}
      keyboardType={keyboardType}
      autoCapitalize="none"
      containerStyle={styles.container}
      onChangeText={onChange}
      value={value}
      label={label}
      errorMessage={errMsg ? `*${errMsg}` : null}
      autoFocus={autoFocus}
    />
  );
};

DefaultInput.defaultProps = {
  placeholder: '',
  password: false,
  keyboardType: null,
  onChange: null,
  value: null,
  label: null,
  errMsg: null,
  autoFocus: false,
};

DefaultInput.propTypes = {
  placeholder: PropTypes.string,
  password: PropTypes.bool,
  keyboardType: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  label: PropTypes.string,
  errMsg: PropTypes.string,
  autoFocus: PropTypes.bool,
};

export default compose()(DefaultInput);
