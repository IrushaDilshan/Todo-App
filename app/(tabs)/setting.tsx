import { Feather } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import Constants from "expo-constants";
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../app-example/hooks/useTheme";
import { api } from "../../convex/_generated/api";

const SettingsScreen = () => {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const clearTodos = useMutation(api.todos.clearAllTodos);

  const handleClearAll = () => {
    Alert.alert(
      "Clear all tasks?",
      "This will remove all todos permanently.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearTodos({});
            } catch (e) {}
          },
        },
      ]
    );
  };

  const version = Constants.expoConfig?.version ?? "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "bottom", "left", "right"]}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        bounces
      >
        {/* Header */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>
            Settings
          </Text>
          <Text style={{ color: colors.textMuted, marginTop: 4 }}>
            Customize your Todo experience
          </Text>
        </View>

        {/* Appearance Card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 14,
            shadowColor: colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.backgrounds.input,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Feather name="moon" size={18} color={colors.text} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
                Dark Mode
              </Text>
              <Text style={{ color: colors.textMuted, marginTop: 2 }}>
                Switch between light and dark themes
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={isDarkMode ? "#ffffff" : "#ffffff"}
            />
          </View>
        </View>

        {/* Actions Card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 6,
            shadowColor: colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleClearAll}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.backgrounds.input,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Feather name="trash-2" size={18} color={colors.danger} />
            </View>
            <Text style={{ marginLeft: 12, color: colors.text, fontSize: 16 }}>
              Clear all todos
            </Text>
          </TouchableOpacity>
        </View>

        {/* About Card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 14,
            shadowColor: colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.backgrounds.input,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Feather name="info" size={18} color={colors.text} />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
                Todo App
              </Text>
              <Text style={{ color: colors.textMuted, marginTop: 2 }}>
                Version {version || "dev"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;