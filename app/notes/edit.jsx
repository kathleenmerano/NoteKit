import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";

export default function EditNote() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "notes", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setNote({ id: snapshot.id, ...data });
          setTitle(data.title);
          setContent(data.content);
        } else {
          Alert.alert("Error", "Note not found!");
          router.push("/notes/home");
        }
      } catch (err) {
        Alert.alert("Error", err.message);
      }
    };
    fetchNote();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "notes", id);
      await updateDoc(docRef, {
        title,
        content,
        updatedAt: serverTimestamp(),
      });
      Alert.alert("Success", "Note updated!");
      router.push("/notes/home");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // Soft-delete: move to Recycle Bin
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "notes", id);
      await updateDoc(docRef, {
        deleted: true, // Mark as deleted
        updatedAt: serverTimestamp(),
      });
      Alert.alert("Deleted", "Note moved to Recycle Bin!");
      router.replace("/notes/home"); // Use replace to force Home to reload listener immediately
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Loading note...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleUpdate} style={{ marginRight: 15 }}>
            <Ionicons name="checkmark-done" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        placeholder="Content"
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  headerBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 30 },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 10, flex: 1 },
  headerActions: { flexDirection: "row", alignItems: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 15, marginBottom: 15 },
  textArea: { height: 150, textAlignVertical: "top" },
});
