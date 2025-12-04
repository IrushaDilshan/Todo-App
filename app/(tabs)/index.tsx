import { useMutation, useQuery } from "convex/react";
import { Text, TouchableOpacity, View } from "react-native";
import useTheme from "../../app-example/hooks/useTheme";
import { api } from "../../convex/_generated/api";

export default function Index() {
  const { toggleDarkMode, colors } = useTheme();

  const todos = useQuery(api.todos.getTodos);

  const addTodo = useMutation(api.todos.addTodo);
  const clearTodos = useMutation(api.todos.clearAllTodos);

  return (
    <View style={{ 
      flex: 1, 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: colors.bg,
      padding: 20 
    }}>
      <Text style={{ color: colors.text, fontSize: 24, marginBottom: 20 }}>
        Todo App
      </Text>
      
      <Text style={{ color: colors.textMuted, marginBottom: 20 }}>
        Todos: {todos?.length || 0}
      </Text>

      {todos?.map((todo) => (
        <Text key={todo._id} style={{ color: colors.text, marginBottom: 5 }}>
          {todo.isCompleted ? "✓" : "○"} {todo.text}
        </Text>
      ))}
      <TouchableOpacity onPress={toggleDarkMode}>
        <Text>Toggle the mode</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => addTodo({ text: "walk the dog" })}>
        <Text>Add a new todo</Text>
      </TouchableOpacity>
            <TouchableOpacity onPress={() => addTodo({ text: "walk the dog" })}>
        <Text>Clear All  todo</Text>
      </TouchableOpacity>
    </View>
  );
}