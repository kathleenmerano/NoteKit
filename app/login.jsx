import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

// Google + Facebook Auth
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as Facebook from "expo-auth-session/providers/facebook";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Email login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/notes/home"); // updated route
    } catch (err) {
      setError(err.message);
    }
  };

  // Google Login
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "<YOUR_GOOGLE_CLIENT_ID>",
  });

  // Facebook Login
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: "<YOUR_FACEBOOK_APP_ID>",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Welcome back</Text>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Error */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Sign In Button */}
      <TouchableOpacity style={styles.mainButton} onPress={handleLogin}>
        <Text style={styles.mainButtonText}>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      {/* Google */}
      <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
        <Image source={require("../assets/images/google.png")} style={styles.socialIcon} />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Facebook */}
      <TouchableOpacity style={styles.socialButton} onPress={() => fbPromptAsync()}>
        <Image source={require("../assets/images/facebook.png")} style={styles.socialIcon} />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>

      {/* Create Account */}
      <Text style={styles.footerText}>
        First time here?{" "}
        <Link href="/signup" style={styles.link}>
          Create an account
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginTop: 50 },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 15, marginVertical: 10 },
  forgotPassword: { alignSelf: "flex-end", marginVertical: 5 },
  forgotText: { color: "#7a42f4", fontSize: 14 },
  error: { color: "red", marginBottom: 10 },
  mainButton: { backgroundColor: "#000", padding: 15, borderRadius: 30, alignItems: "center", marginTop: 10 },
  mainButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  orText: { textAlign: "center", marginVertical: 15, color: "#555" },
  socialButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 30, padding: 12, marginVertical: 5 },
  socialIcon: { width: 20, height: 20, marginRight: 10 },
  socialText: { fontSize: 15, fontWeight: "500" },
  footerText: { textAlign: "center", marginTop: 20, color: "#555" },
  link: { color: "#7a42f4", fontWeight: "600" },
});
