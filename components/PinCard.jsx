import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PinCard({ note, onPress, onTogglePin }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Pin button */}
      <TouchableOpacity
        style={styles.pinButton}
        onPress={() => onTogglePin(note)}
      >
        <Ionicons
          name={note.pinned ? "pin" : "pin-outline"}
          size={20}
          color={note.pinned ? "#7a42f4" : "#555"}
        />
      </TouchableOpacity>

      {/* Note title & content */}
      <Text style={styles.cardTitle}>{note.title}</Text>
      <Text numberOfLines={4} style={styles.cardContent}>
        {note.content}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    minHeight: 120,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  pinButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  cardContent: { fontSize: 13, color: "#444" },
});
