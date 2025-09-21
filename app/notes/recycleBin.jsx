import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recycle Bin</Text>
      </View>

      {/* Notes */}
      <ScrollView contentContainerStyle={styles.grid}>
        {notes?.length > 0 ? (
          notes.map((item, index) => (
            <View key={item.id} style={[styles.card, { backgroundColor: colors[index % colors.length] }]}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text numberOfLines={4} style={styles.cardContent}>{item.content}</Text>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => restoreNote(item.id)}>
                  <Ionicons name="arrow-undo-outline" size={22} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deletePermanently(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No deleted notes.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  headerBar: { flexDirection: "row", alignItems: "center", paddingVertical: 30 },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 10, flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingBottom: 100 },
  card: { width: "48%", padding: 15, borderRadius: 12, marginBottom: 12, minHeight: 120, shadowColor: "#4b4646", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3, position: "relative" },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  cardContent: { fontSize: 13, color: "#444" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#888" },
});
