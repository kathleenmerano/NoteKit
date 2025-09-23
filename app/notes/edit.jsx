import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
      setNote(prev => ({ ...prev, updatedAt: new Date() }));
      Alert.alert("Success", "Note updated!");
      router.push("/notes/home");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "notes", id);
      await updateDoc(docRef, {
        deleted: true,
        updatedAt: serverTimestamp(),
      });
      Alert.alert("Deleted", "Note moved to Recycle Bin!");
      router.replace("/notes/home");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading note...</Text>
      </View>
    );
  }

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Edit Note</Text>
          {note?.updatedAt && (
            <Text style={styles.headerDate}>
              Last edited {formatDate(note.updatedAt)}
            </Text>
          )}
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Ionicons name="checkmark-done-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color="#c62828" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={false}
      >
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Note title..."
          placeholderTextColor="#999"
          multiline={true}
          returnKeyType="next"
          blurOnSubmit={false}
        />

        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Edit your note..."
          placeholderTextColor="#999"
          multiline={true}
          textAlignVertical="top"
          scrollEnabled={false}
          returnKeyType="default"
          blurOnSubmit={false}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#ffffff" 
  },
  loadingText: { 
    textAlign: "center", 
    fontSize: 16, 
    color: "#666", 
    marginTop: 40 
  },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    minHeight: 60,
  },
  backButton: { 
    padding: 8, 
    marginLeft: -8,
    width: 80, // Fixed width for proper centering
  },
  headerCenter: { 
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#000" 
  },
  headerDate: { 
    fontSize: 11, 
    color: "#666", 
    marginTop: 2,
    textAlign: "center",
  },
  headerActions: { 
    flexDirection: "row", 
    alignItems: "center",
    width: 80, // Same width as back button for balance
    justifyContent: "flex-end",
  },
  saveButton: { 
    padding: 8, 
    marginRight: 4, 
    backgroundColor: "#f0f8ff", 
    borderRadius: 8 
  },
  deleteButton: { 
    padding: 8, 
    marginLeft: 4, 
    borderRadius: 8 
  },

  content: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    padding: 16,
    paddingBottom: 40,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    lineHeight: 28,
    textAlignVertical: "top",
    maxHeight: 120,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    minHeight: 250,
    maxHeight: 500,
    textAlignVertical: "top",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
});