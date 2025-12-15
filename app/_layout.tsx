import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider as CustomThemeProvider } from "../app-example/hooks/useTheme";
import useCustomTheme from "../app-example/hooks/useTheme";

// Create a Convex client
const convexClient = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <ConvexProvider client={convexClient}>
      <CustomThemeProvider>
        <ThemeProvider value={DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemedAppContainer />
          </GestureHandlerRootView>
        </ThemeProvider>
      </CustomThemeProvider>
    </ConvexProvider>
  );
}

function ThemedAppContainer() {
  const { colors } = useCustomTheme();
  return (
    <>
      <StatusBar style={colors.statusBarStyle === 'light-content' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
      </Stack>
    </>
  );
}
