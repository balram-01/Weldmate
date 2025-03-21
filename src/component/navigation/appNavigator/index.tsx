import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import ForgotPasswordScreen from '../../../screens/auth/forgotPassword';
import LoginScreen from '../../../screens/auth/login';
import ResetPasswordScreen from '../../../screens/auth/resetPassword';
import BottomNavigator from '../bottomnavigator';
import ScreenNames from '../../../utils/screenNames';
import RegisterScreen from '../../../screens/auth/register';
import WelcomeBackScreen from '../../../screens/auth/welcomeBack';
import EmailVerificationScreen from '../../../screens/auth/emailVerification';
import AllCategories from '../../../screens/allCategories';



const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Authentication Screens */}
        <Stack.Screen name={ScreenNames.WELCOME_BACK} component={WelcomeBackScreen} />
        <Stack.Screen name={ScreenNames.LOGIN} component={LoginScreen} />
        <Stack.Screen name={ScreenNames.REGISTER} component={RegisterScreen} />

        <Stack.Screen name={ScreenNames.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
        <Stack.Screen name={ScreenNames.EMAIL_VERIFICATION} component={EmailVerificationScreen} />
        <Stack.Screen name={ScreenNames.RESET_PASSWORD} component={ResetPasswordScreen} />
        <Stack.Screen name={ScreenNames.ALL_CATEGORIES} component={AllCategories} />

        {/* Main App Navigation */}
        <Stack.Screen name={ScreenNames.HOME} component={BottomNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;