import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";


export default function RootLayout() {
  return (
  <ThemeProvider value={DefaultTheme}>
    <Stack screenOptions={{ headerShown: false } }>
      <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
    </Stack>
  </ThemeProvider>
  );
}
