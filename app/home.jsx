import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function Homepage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Listen only to notes of the logged-in user
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/notes/${item.id}`)}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.cardContent}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/notes/create")}
      >
        <Text style={styles.addText}>＋</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          auth.signOut();
          router.push("/login");
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  cardContent: { fontSize: 14, color: "#555" },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#7a42f4",
    borderRadius: 50,
    padding: 20,
    elevation: 5,
  },
  addText: { color: "white", fontSize: 24, fontWeight: "bold" },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
  },
  logoutText: { color: "white", fontWeight: "bold" },
});
