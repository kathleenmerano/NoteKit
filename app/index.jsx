import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Dimensions, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createFloating = (animValue, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(animValue, { toValue: 0, duration, useNativeDriver: true }),
        ])
      );
    };
    createFloating(floatAnim1, 3000).start();
    createFloating(floatAnim2, 4000).start();
  }, []);

  const floatingStyle = (anim, range = 12) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -range],
        }),
      },
    ],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdfcf7" />

      {/* Floating background elements */}
      <View style={styles.bg}>
        <Animated.View
          style={[styles.softCircle, { top: "15%", left: "10%" }, floatingStyle(floatAnim1)]}
        />
        <Animated.View
          style={[styles.softCircle, { bottom: "42%", right: "10%" }, floatingStyle(floatAnim2)]}
        />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Image source={require("../assets/images/note.png")} style={styles.image} resizeMode="contain" />

        <Text style={styles.title}>NoteKit</Text>
        <Text style={styles.subtitle}>Capture thoughts. Stay organized.</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.solidButton} onPress={() => router.push("/signup")}>
            <Text style={styles.solidText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton} onPress={() => router.push("/login")}>
            <Text style={styles.outlineText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfcf7" },

  bg: { position: "absolute", width, height },

  softCircle: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#f3e5ebff", // soft green tint
  },

  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 30 },

  image: { width: "80%", maxHeight: 260, marginBottom: 30 },

  title: { fontSize: 42, fontWeight: "700", color: "#1A1A1A", marginBottom: 5 },

  subtitle: { fontSize: 16, color: "#555", marginBottom: 50, textAlign: "center" },

  buttons: { width: "100%", marginTop: 10 },

  solidButton: {
    width: "100%",
    backgroundColor: "#845d6dff",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 15,
  },
  solidText: { fontSize: 16, fontWeight: "600", color: "#fff" },

  outlineButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#845d6dff",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  outlineText: { fontSize: 16, fontWeight: "600", color: "#845d6dff" },
});
