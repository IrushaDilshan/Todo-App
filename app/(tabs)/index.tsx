import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import useTheme from "../../app-example/hooks/useTheme";
import { api } from "../../convex/_generated/api";

export default function Index() {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  const todos = useQuery(api.todos.getTodos);

  const addTodo = useMutation(api.todos.addTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const clearTodos = useMutation(api.todos.clearAllTodos);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);

  const [newText, setNewText] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

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
            } catch (e) {}
          },
        },
      ]
    );
  };

  const displayTodos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return todos ?? [];
    return (todos ?? []).filter((t) => t.text.toLowerCase().includes(q));
  }, [todos, search]);

  const startEdit = (id: string, currentText: string) => {
    setEditingId(String(id));
    setEditText(currentText);
  };

  const saveEdit = async (id: string) => {
    const text = editText.trim();
    if (!text) {
      setEditingId(null);
      setEditText("");
      return;
    }
    await updateTodo({ id: id as any, text });
    setEditingId(null);
    setEditText("");
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Delete todo?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTodo({ id: id as any }) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "bottom", "left", "right"]}>
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

      {/* Search */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          marginHorizontal: 16,
          marginTop: 10,
          paddingHorizontal: 12,
        }}
      >
        <TextInput
          placeholder="Search tasks..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          style={{
            height: 44,
            color: colors.text,
          }}
        />
      </View>

      {/* List */}
      {displayTodos && displayTodos.length > 0 ? (
        <FlatList
          data={displayTodos}
          keyExtractor={(item) => String(item._id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  onPress={() => confirmDelete(String(item._id))}
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
                onPress={() => toggleTodo({ id: item._id })}
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
                {editingId === String(item._id) ? (
                  <View style={{ flex: 1, marginLeft: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      value={editText}
                      onChangeText={setEditText}
                      autoFocus
                      style={{
                        flex: 1,
                        color: colors.text,
                        backgroundColor: colors.backgrounds.editInput,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                      }}
                    />
                    <TouchableOpacity onPress={() => saveEdit(String(item._id))} style={{ marginLeft: 8 }}>
                      <Feather name="check" size={20} color={colors.success} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setEditingId(null); setEditText(""); }} style={{ marginLeft: 8 }}>
                      <Feather name="x" size={20} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Text
                      style={{
                        marginLeft: 12,
                        color: item.isCompleted ? colors.textMuted : colors.text,
                        textDecorationLine: item.isCompleted ? "line-through" : "none",
                        fontSize: 16,
                        flex: 1,
                      }}
                    >
                      {item.text}
                    </Text>
                    <TouchableOpacity onPress={() => startEdit(String(item._id), item.text)}>
                      <Feather name="edit-2" size={18} color={colors.text} />
                    </TouchableOpacity>
                  </>
                )}
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
        </View>
      )}
    </SafeAreaView>
  );
}