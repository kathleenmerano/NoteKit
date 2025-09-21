import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
      <TextInput
        style={styles.input}
        placeholder="Search notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#888"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});
