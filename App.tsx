/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import type { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import LoginScreen from "./src/screens/auth/login";
import { PaperProvider } from "react-native-paper";
import RegisterScreen from "./src/screens/auth/register";
import WelcomeBack from "./src/screens/auth/welcomeBack";
import ForgotPasswordScreen from "./src/screens/auth/forgotPassword";
import EmailVerificationScreen from "./src/screens/auth/emailVerification";
import ResetPasswordScreen from "./src/screens/auth/resetPassword";
import HomeScreen from "./src/screens/Home";
import BottomNavigator from "./src/component/navigation/bottomnavigator";
import AppNavigator from "./src/component/navigation/appNavigator";

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
