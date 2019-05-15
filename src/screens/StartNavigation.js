import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon, Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import theme from '../theme';
import AuthScreen from './AuthScreen';
import InitScreen from './InitScreen';
import HomeScreen from './HomeScreen';
// import DismissableStackNavigator from './DismissableNav';
import NewExpenseScreen from './NewExpenseScreen';
import CalendarScreen from './CalendarScreen';
import CategoryScreen from './CategoryScreen';
import SettingScreen from './SettingScreen';
import DebtScreen from './DebtScreen';
import ExpenseScreen from './ExpenseScreen';
import DebtScreenTitle from '../components/DebtScreenTitle';

const HomeStack = createStackNavigator({
  HomeScreen,
}, {
  initialRouteName: 'HomeScreen',
  defaultNavigationOptions: ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => {
          navigation.navigate('NewExpenseScreen');
        }}
      >
        <Icon
          type="ionicon"
          name="ios-add-circle-outline"
          size={25}
          underlayColor="transparent"
          color={theme.palette.primary}
        />
      </TouchableOpacity>
    ),
    headerRightContainerStyle: {
      paddingRight: 10,
    },
  }),
});

const SettingStack = createStackNavigator({
  SettingScreen,
});

const DeptStack = createStackNavigator({
  DebtScreen: {
    screen: DebtScreen,
    navigationOptions: {
      headerTitle: <DebtScreenTitle />,
    },
  },
  ExpenseScreen: {
    screen: ExpenseScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <TouchableOpacity
          style={{ padding: 5 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon
            name="chevron-left"
            size={30}
            underlayColor="transparent"
            color={theme.palette.primary}
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <Button
          title="Edit"
          type="clear"
          buttonStyle={{ padding: 0 }}
          titleStyle={{ color: theme.palette.primary }}
          onPress={() => (
            navigation.navigate('NewExpenseScreen', { expense: navigation.getParam('expense'), index: navigation.getParam('index') })
          )}
        />
      ),
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    }),
  },
}, {
  headerBackTitleVisible: false,
});

const AppStack = createBottomTabNavigator({
  Home: {
    screen: HomeStack,
  },
  Debts: {
    screen: DeptStack,
  },
  Settings: {
    screen: SettingStack,
  },
}, {
  initialRouteName: 'Home',
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state;
      let iconName;
      if (routeName === 'Home') {
        iconName = 'ios-home';
      } else if (routeName === 'Debts') {
        iconName = 'logo-usd';
      } else if (routeName === 'Settings') {
        iconName = 'ios-settings';
      }
      return <Icon type="ionicon" name={iconName} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: theme.palette.primary,
    inactiveTintColor: 'lightgray',
  },
});

const NewExpenseStack = createStackNavigator({
  NewExpenseScreen: {
    screen: NewExpenseScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: (
        <Button
          title="Done"
          type="clear"
          buttonStyle={{ padding: 0 }}
          titleStyle={{ color: theme.palette.primary }}
          onPress={() => (
            navigation.getParam('onSubmit')()
          )}
        />
      ),
      headerLeftContainerStyle: {
        paddingLeft: 10,
      },
      headerRightContainerStyle: {
        paddingRight: 10,
      },
    }),
  },
  CalendarScreen,
  CategoryScreen,
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    headerLeft: (
      <Button
        title="Cancel"
        type="clear"
        buttonStyle={{ padding: 0 }}
        titleStyle={{ color: 'black' }}
        onPress={() => (
          navigation.pop()
        )}
      />
    ),
    headerLeftContainerStyle: {
      paddingLeft: 10,
    },
    headerRightContainerStyle: {
      paddingRight: 10,
    },
  }),
  mode: 'modal',
});

const ModalStack = createStackNavigator({
  AppStack,
  NewExpenseStack,
}, {
  mode: 'modal',
  headerMode: 'none',
});

const AuthStack = createStackNavigator({
  AuthScreen,
}, {
  initialRouteName: 'AuthScreen',
  defaultNavigationOptions: {
    header: null,
  },
});

export default createAppContainer(createSwitchNavigator({
  InitScreen,
  AuthStack,
  ModalStack,
}));

