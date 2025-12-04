import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { ThemeProvider as CustomThemeProvider } from "../app-example/hooks/useTheme";

// Create a Convex client
const convexClient = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <ConvexProvider client={convexClient}>
      <CustomThemeProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
          </Stack>
        </ThemeProvider>
      </CustomThemeProvider>
    </ConvexProvider>
  );
}
