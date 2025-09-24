import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Google Auth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "<YOUR_EXPO_CLIENT_ID>.apps.googleusercontent.com",
    iosClientId: "<YOUR_IOS_CLIENT_ID>.apps.googleusercontent.com",
    androidClientId: "<YOUR_ANDROID_CLIENT_ID>.apps.googleusercontent.com",
    webClientId: "<YOUR_WEB_CLIENT_ID>.apps.googleusercontent.com",
  });

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/notes/home"); // updated route
    } catch (err) {
      setError(err.message);
    }
  };

  // Google login result
  if (response?.type === "success") {
    router.push("/notes/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Join NoteKit and start organizing today</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.mainButton} onPress={handleSignup}>
        <Text style={styles.mainButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>────────  or  ────────</Text>

      {/* Google Signup */}
      <TouchableOpacity
        style={styles.socialButton}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Image source={require("../assets/images/google.png")} style={styles.socialIcon} />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Facebook Signup */}
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require("../assets/images/facebook.png")} style={styles.socialIcon} />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Link href="/login" style={styles.link}>
          Sign in
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfcf7", padding: 25, justifyContent: "center" },

  title: { fontSize: 28, fontWeight: "700", color: "#1A1A1A", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },

  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    fontSize: 15,
    color: "#333",
  },

  error: { color: "red", marginBottom: 10 },

  mainButton: {
    backgroundColor: "#845d6dff",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#845d6dff",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  mainButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  orText: { textAlign: "center", marginVertical: 20, color: "#888", fontSize: 14 },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
  },
  socialIcon: { width: 20, height: 20, marginRight: 10 },
  socialText: { fontSize: 15, fontWeight: "500", color: "#333" },

  footerText: { textAlign: "center", marginTop: 25, color: "#555", fontSize: 14 },
  link: { color: "#845d6dff", fontWeight: "600" },
});
