import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <Image
        source={require("../assets/images/note.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Headline */}
      <Text style={styles.headline}>
        <Text style={styles.highlight}>Your Creative </Text>
        Notebook
      </Text>

      <Text style={styles.subtitle}>Write freely. Think clearly.</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.outlineText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.solidButton}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.solidText}>Get started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: { width: "100%", height: 300, marginBottom: 30 },
  headline: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  highlight: { backgroundColor: "#FFD93D", color: "#1A1A1A" },
  subtitle: { fontSize: 18, fontWeight: "500", color: "#444", textAlign: "center", marginBottom: 40 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 12 },
  outlineButton: { flex: 1, borderWidth: 1, borderColor: "#000", borderRadius: 20, paddingVertical: 14, alignItems: "center" },
  outlineText: { fontSize: 16, fontWeight: "600", color: "#000" },
  solidButton: { flex: 1, backgroundColor: "#000", borderRadius: 20, paddingVertical: 14, alignItems: "center" },
  solidText: { fontSize: 16, fontWeight: "600", color: "#fff" },
}); 
