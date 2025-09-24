// Fixed CreateNote Component with theme colors
import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function CreateNote() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      router.back();
      return;
    }

    setIsSaving(true);
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "notes"), {
        uid: user.uid,
        title: title.trim() || "Untitled",
        content: content.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        pinned: false,
      });
      router.back();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = title.trim() || content.trim();
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const currentDate = new Date().toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric",
    year: "numeric"
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fdfcf7" />

      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#845d6d" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>New Note</Text>
          <Text style={styles.headerDate}>{currentDate}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, canSave && styles.saveButtonActive]}
          onPress={handleSave}
          disabled={isSaving || !canSave}
        >
          <Ionicons 
            name={isSaving ? "hourglass-outline" : "checkmark-done-outline"} 
            size={24} 
            color={canSave ? "#845d6d" : "#ccc"} 
          />
        </TouchableOpacity>
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
          placeholder="Note title..."
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          multiline={true}
          returnKeyType="next"
          blurOnSubmit={false}
        />

        <TextInput
          style={styles.contentInput}
          placeholder="Start writing your note..."
          placeholderTextColor="#999"
          value={content}
          onChangeText={setContent}
          multiline={true}
          textAlignVertical="top"
          scrollEnabled={false}
          returnKeyType="default"
          blurOnSubmit={false}
        />
      </ScrollView>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </Text>
        {canSave && (
          <Text style={styles.statusText}>• Tap ✓ to save</Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fdfcf7" 
  },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fdfcf7",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    minHeight: 60,
  },
  backButton: { 
    padding: 8, 
    marginLeft: -8 
  },
  headerCenter: { 
    flex: 1, 
    alignItems: "center",
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
  saveButton: { 
    padding: 8, 
    marginRight: -8 
  },
  saveButtonActive: { 
    backgroundColor: "#f2e6eb", 
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
    maxHeight: 400, 
    textAlignVertical: "top",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },

  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f2f2f2",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
  },
  statusText: { 
    fontSize: 12, 
    color: "#666", 
    marginHorizontal: 4 
  },
});
