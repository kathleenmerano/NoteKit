import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NoteKit</Text>
      <Text style={styles.subtitle}>Your smart note-taking app</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.outlineButton]}
        onPress={() => router.push("/signup")}
      >
        <Text style={[styles.buttonText, styles.outlineText]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 40 },
  button: {
    backgroundColor: "#7a42f4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    marginVertical: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#7a42f4",
  },
  outlineText: { color: "#7a42f4" },
});
