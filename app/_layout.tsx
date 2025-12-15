import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider as CustomThemeProvider } from "../app-example/hooks/useTheme";

// Create a Convex client
const convexClient = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <ConvexProvider client={convexClient}>
      <CustomThemeProvider>
        <ThemeProvider value={DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
              </Stack>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </CustomThemeProvider>
    </ConvexProvider>
  );
}
