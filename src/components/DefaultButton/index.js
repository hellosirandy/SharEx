import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Button } from 'react-native-elements';
import styles from './styles';

const DefaultButton = ({ title, onPress, loading }) => {
  return (
    <Button
      containerStyle={styles.container}
      title={title}
      onPress={onPress}
      loading={loading}
    />
  );
};

DefaultButton.defaultProps = {
  title: 'Button',
  onPress: null,
  loading: false,
};

DefaultButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
};

export default compose()(DefaultButton);
