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
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

import { PaperProvider } from "react-native-paper";
import AppNavigator from "./src/component/navigation/appNavigator";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
            }}
          >
            <PaperProvider>
              <AppNavigator />
            </PaperProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
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
