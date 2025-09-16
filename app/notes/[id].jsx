import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function NoteDetail() {
  const { id } = useLocalSearchParams(); // get note ID from URL okokokokokookko
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load note data
  useEffect(() => {
    const fetchNote = async () => {
      const docRef = doc(db, "notes", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setNote({ id: snapshot.id, ...data });
        setTitle(data.title);
        setContent(data.content);
      }
    };
    fetchNote();
  }, [id]);

  // Update note
  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "notes", id);
      await updateDoc(docRef, { title, content });
      Alert.alert("Success", "Note updated!");
      router.push("/home");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // Delete note
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "notes", id);
      await deleteDoc(docRef);
      Alert.alert("Deleted", "Note removed!");
      router.push("/home");
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
      <Text style={styles.header}>Edit Note</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red", marginTop: 10 }]}
        onPress={handleDelete}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  textArea: { height: 150, textAlignVertical: "top" },
  button: {
    backgroundColor: "#7a42f4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
//fdfd