import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import useTheme from "../../app-example/hooks/useTheme";
import { api } from "../../convex/_generated/api";

export default function Index() {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  const todos = useQuery(api.todos.getTodos);

  const addTodo = useMutation(api.todos.addTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const clearTodos = useMutation(api.todos.clearAllTodos);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  const [newText, setNewText] = useState("");
  const inputRef = useRef<TextInput | null>(null);

  const completedCount = useMemo(
    () => (todos ? todos.filter((t) => t.isCompleted).length : 0),
    [todos]
  );

  const handleAdd = async () => {
    const text = newText.trim();
    if (!text) return;
    try {
      await addTodo({ text });
      setNewText("");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // no-op visual error handling for now
    }
  };

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
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (e) {}
          },
        },
      ]
    );
  };

  const filteredTodos = useMemo(() => {
    if (!todos) return [];
    if (filter === "active") return todos.filter((t) => !t.isCompleted);
    if (filter === "done") return todos.filter((t) => t.isCompleted);
    return todos;
  }, [todos, filter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>
            My Todos
          </Text>
          <Text style={{ color: colors.textMuted, marginTop: 2 }}>
            {todos?.length ?? 0} total • {completedCount} done
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={toggleDarkMode}
            style={{
              backgroundColor: colors.surface,
              padding: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              marginRight: 8,
              shadowColor: colors.shadow,
              shadowOpacity: 0.08,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Feather
              name={isDarkMode ? "moon" : "sun"}
              size={18}
              color={colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleClearAll}
            style={{
              backgroundColor: colors.surface,
              padding: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: colors.shadow,
              shadowOpacity: 0.08,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Feather name="trash-2" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add input card */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          marginHorizontal: 16,
          padding: 12,
          shadowColor: colors.shadow,
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            placeholder="Add a new task..."
            placeholderTextColor={colors.textMuted}
            value={newText}
            onChangeText={setNewText}
            ref={(r) => { inputRef.current = r; }}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
            style={{
              flex: 1,
              backgroundColor: colors.backgrounds.input,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          />
          <TouchableOpacity
            onPress={handleAdd}
            style={{
              marginLeft: 10,
              backgroundColor: colors.primary,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "600" }}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, gap: 8 }}>
        {([
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'done', label: 'Done' },
        ] as const).map((f) => {
          const selected = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: selected ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.border,
              }}
            >
              <Text style={{ color: selected ? '#fff' : colors.text, fontWeight: '600' }}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      {filteredTodos && filteredTodos.length > 0 ? (
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => String(item._id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  onPress={async () => {
                    await deleteTodo({ id: item._id });
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }}
                  activeOpacity={0.9}
                  style={{
                    width: 96,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.danger,
                    borderRadius: 16,
                    marginLeft: 8,
                  }}
                >
                  <Feather name="trash-2" size={20} color="#fff" />
                  <Text style={{ color: "#fff", marginTop: 4 }}>Delete</Text>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                onPress={async () => {
                  await toggleTodo({ id: item._id });
                  Haptics.selectionAsync();
                }}
                activeOpacity={0.9}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: colors.shadow,
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 3 },
                  elevation: 2,
                }}
              >
                <Feather
                  name={item.isCompleted ? "check-circle" : "circle"}
                  size={22}
                  color={item.isCompleted ? colors.success : colors.textMuted}
                />
                <Text
                  style={{
                    marginLeft: 12,
                    color: item.isCompleted ? colors.textMuted : colors.text,
                    textDecorationLine: item.isCompleted ? "line-through" : "none",
                    fontSize: 16,
                  }}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <Feather name="inbox" size={48} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, marginTop: 12, fontSize: 16 }}>
            No tasks yet. Add your first one!
          </Text>
          <TouchableOpacity
            onPress={() => inputRef.current?.focus()}
            style={{
              marginTop: 14,
              backgroundColor: colors.primary,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Add a task</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}