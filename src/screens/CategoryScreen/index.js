import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { ListItem } from 'react-native-elements';

const categories = [
  'food',
  'grocery',
  'alcohol',
  'entertainment',
  'love',
  'life',
  'transit',
  'shopping',
  'coffee',
  'rent',
  'gift',
  'others',
];

class CategoryScreen extends React.PureComponent {
  handleItemPress = category => () => {
    this.props.navigation.getParam('onCategoryPress')(category);
    this.props.navigation.pop();
  }
  render() {
    const value = this.props.navigation.getParam('value');
    return (
      <React.Fragment>
        {categories.map(category => (
          <ListItem
            title={category}
            onPress={this.handleItemPress(category)}
            bottomDivider
            checkmark={value === category}
            key={category}
          />
        ))}
      </React.Fragment>
    );
  }
}

CategoryScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default compose()(CategoryScreen);
