import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function RecycleBin() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const colors = ["#fef9c3", "#bae6fd", "#bbf7d0", "#fecdd3", "#e9d5ff", "#fcd34d"];

  useEffect(() => {
    const q = query(
      collection(db, "notes"),
      where("uid", "==", auth.currentUser.uid),
      where("deleted", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deletedNotes = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.updatedAt?.toMillis() - a.updatedAt?.toMillis());
      setNotes(deletedNotes);
    });

    return unsubscribe;
  }, []);

  const restoreNote = async (id) => {
    try {
      await updateDoc(doc(db, "notes", id), { deleted: false });
    } catch (err) {
      console.log("Error restoring note:", err.message);
    }
  };

  const deletePermanently = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (err) {
      console.log("Error deleting permanently:", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Recycle Bin</Text>
          <Text style={styles.headerSubtitle}>
            {notes.length} {notes.length === 1 ? "note" : "notes"} deleted
          </Text>
        </View>

        {/* Invisible spacer to balance the layout */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Notes */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {notes?.length > 0 ? (
          notes.map((item, index) => (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: colors[index % colors.length] }]}
            >
              <View style={styles.cardContent}>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  {item.title || "Untitled"}
                </Text>
                <Text numberOfLines={3} style={styles.cardText}>
                  {item.content}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.restoreButton]}
                  onPress={() => restoreNote(item.id)}
                >
                  <Ionicons name="arrow-undo-outline" size={18} color="#007AFF" />
                  <Text style={styles.actionText}>Restore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deletePermanently(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#ff3b30" />
                  <Text style={[styles.actionText, { color: "#ff3b30" }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No deleted notes.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#ffffff" 
  },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
  },
  backButton: { 
    padding: 8, 
    marginLeft: -8,
    width: 48, // Fixed width for centering
  },
  headerCenter: { 
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#000" 
  },
  headerSubtitle: { 
    fontSize: 12, 
    color: "#666", 
    marginTop: 2 
  },
  headerSpacer: {
    width: 48, // Same width as back button for perfect centering
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 12,
    paddingBottom: 100,
  },
  card: {
    width: "48%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    minHeight: 160,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: "space-between",
  },
  
  cardContent: {
    flex: 1,
    marginBottom: 8,
  },
  cardTitle: { 
    fontSize: 15, 
    fontWeight: "600", 
    color: "#000", 
    marginBottom: 6,
    flexWrap: "wrap",
  },
  cardText: { 
    fontSize: 12, 
    color: "#333", 
    lineHeight: 16,
    flexShrink: 1,
    flexWrap: "wrap",
    // Force text wrapping for long strings
    wordWrap: "break-word",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },
  restoreButton: { 
    backgroundColor: "#f0f8ff",
    marginRight: 3,
  },
  deleteButton: { 
    backgroundColor: "#fff5f5",
    marginLeft: 3,
  },
  actionText: { 
    fontSize: 11, 
    marginLeft: 4, 
    color: "#333",
    fontWeight: "500",
  },

  emptyText: { 
    textAlign: "center", 
    marginTop: 50, 
    fontSize: 16, 
    color: "#888",
    width: "100%",
  },
});