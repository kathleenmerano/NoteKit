// app/homepage.jsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function Homepage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);

  const colors = [
    "#fef9c3", // yellow
    "#bae6fd", // blue
    "#bbf7d0", // green
    "#fecdd3", // pink
    "#e9d5ff", // purple
    "#fcd34d", // amber
  ];

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "notes"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(list);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>NoteKit</Text>
        <TouchableOpacity
          onPress={() => {
            auth.signOut();
            router.push("/login");
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {/* Notes grid */}
      <ScrollView contentContainerStyle={styles.list}>
        {notes.length > 0 ? (
          <View style={styles.grid}>
            {notes.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: colors[index % colors.length] }]}
                onPress={() => router.push(`/notes/${item.id}`)}
              >
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text numberOfLines={4} style={styles.cardContent}>
                  {item.content}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>
            No notes yet. Tap + to create one!
          </Text>
        )}
      </ScrollView>

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/notes/create")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  appTitle: { fontSize: 24, fontWeight: "bold", color: "#7a42f4" },
  list: { padding: 10, paddingBottom: 100 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    minHeight: 120,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  cardContent: { fontSize: 13, color: "#444" },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#7a42f4",
    borderRadius: 50,
    padding: 20,
    elevation: 5,
  },
});
