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
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Sign in to continue with NoteKit</Text>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
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

      <Text style={styles.orText}>────────  or  ────────</Text>

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
  container: { flex: 1, backgroundColor: "#fdfcf7", padding: 25, justifyContent: "center" },

  title: { fontSize: 28, fontWeight: "700", color: "#1A1A1A", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 25 },

  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    fontSize: 15,
    color: "#333",
  },

  forgotPassword: { alignSelf: "flex-end", marginVertical: 6 },
  forgotText: { color: "#845d6dff", fontSize: 14, fontWeight: "500" },

  error: { color: "red", marginBottom: 10 },

  mainButton: {
    backgroundColor: "#845d6dff",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
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
