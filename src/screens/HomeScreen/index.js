import React from 'react';
import { compose } from 'recompose';
import { View, Text } from 'react-native';
import styles from './styles';

class HomeScreen extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
    );
  }
}

export default compose()(HomeScreen);
