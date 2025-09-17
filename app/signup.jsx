import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
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
      router.push("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  // Google login result
  if (response?.type === "success") {
    // TODO: connect to Firebase with Google credential
    router.push("/home");
  }

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#d7b9ff", "#fff"]} style={styles.header} />

      <Text style={styles.title}>Create Account</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      {/* Google Signup */}
      <TouchableOpacity
        style={styles.socialButton}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Ionicons name="logo-google" size={20} color="red" style={{ marginRight: 10 }} />
        <Text style={styles.socialText}>Continue With Google</Text>
      </TouchableOpacity>

      {/* Facebook Signup */}
      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="facebook" size={20} color="#1877F2" style={{ marginRight: 10 }} />
        <Text style={styles.socialText}>Continue With Facebook</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Link href="/login" style={styles.link}>
          Sign in
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { height: 100, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  error: { color: "red", marginBottom: 10 },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  orText: { textAlign: "center", marginVertical: 10, color: "#999" },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    marginBottom: 15,
  },
  socialText: { fontSize: 15, fontWeight: "500" },
  loginText: { textAlign: "center", marginTop: 20, color: "#555" },
  link: { color: "#7a42f4", fontWeight: "600" },
});
