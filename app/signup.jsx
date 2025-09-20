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
      <Text style={styles.title}>Create Account</Text>

      {/* Name Input */}
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />

      {/* Email Input */}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

      {/* Password Input */}
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      {/* Google Signup */}
      <TouchableOpacity style={styles.socialButton} disabled={!request} onPress={() => promptAsync()}>
        <Image source={require("../assets/images/google.png")} style={styles.socialIcon} />
        <Text style={styles.socialText}>Continue With Google</Text>
      </TouchableOpacity>

      {/* Facebook Signup */}
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require("../assets/images/facebook.png")} style={styles.socialIcon} />
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
  title: { fontSize: 28, fontWeight: "bold", marginTop: 50, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 15, marginBottom: 10 },
  error: { color: "red", marginBottom: 10 },
  button: { backgroundColor: "black", padding: 15, borderRadius: 30, alignItems: "center", marginBottom: 15 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  orText: { textAlign: "center", marginVertical: 10, color: "#999" },
  socialButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", padding: 15, borderRadius: 30, justifyContent: "center", marginBottom: 15 },
  socialIcon: { width: 20, height: 20, marginRight: 10 },
  socialText: { fontSize: 15, fontWeight: "500" },
  loginText: { textAlign: "center", marginTop: 20, color: "#555" },
  link: { color: "#7a42f4", fontWeight: "600" },
});
