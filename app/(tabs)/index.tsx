import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
  
    >
      <Text>Index Screen</Text>
      <Link href="/(tabs)/setting">
        <Text style={{ marginTop: 20, color: "blue" }}>Go to Settings</Text>
      </Link>
    </View>
  );
}
