import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  SafeAreaView,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

// Replace these with your actual IDs
const IOS_CLIENT_ID =
  "996774068447-ad11scqs2vp6hsuq20fpt2dkcmormjde.apps.googleusercontent.com";
const WEB_CLIENT_ID =
  "996774068447-2f1e99492h114o7iq65cdgdh98nqvfk5.apps.googleusercontent.com";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
  forceCodeForRefreshToken: false,
});

// Define a type for the user info we want to store
interface GoogleUser {
  user: {
    email: string;
    name: string;
    photo?: string;
  };
  idToken?: string;
}

export default function App() {
  const [userInfo, setUserInfo] = useState<GoogleUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    try {
      // Check if device has Google Play Services
      await GoogleSignin.hasPlayServices();

      // Sign in and get the response
      const response = await GoogleSignin.signIn();
      console.log("Google Signin response:", response);

      /**
       * The response you showed has the shape:
       * {
       *   data: {
       *     idToken: "...",
       *     user: {
       *       email: "...",
       *       name: "...",
       *       photo: "https://..."
       *       ...
       *     }
       *   },
       *   type: "success"
       * }
       *
       * So we map it to our GoogleUser structure.
       */
      const mappedUser: GoogleUser = {
        user: {
          email: response.data.user.email,
          name: response.data.user.name,
          photo: response.data.user.photo,
        },
        idToken: response.data.idToken,
      };

      // Store mapped user in state
      setUserInfo(mappedUser);
      setError(null);
    } catch (err: unknown) {
      // Handle errors safely
      if (err instanceof Error) {
        setError(err.message);
        console.error(err);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error(err);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login to Google SignIn App</Text>

      {/* If not signed in, show the Sign In button */}
      {!userInfo && (
        <GoogleSigninButton
          style={styles.signInButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      )}

      {/* If signed in, show user details */}
      {userInfo && (
        <View style={styles.profileContainer}>
          {/* Show user's photo if available, otherwise a placeholder */}
          {userInfo.user.photo ? (
            <Image
              source={{ uri: userInfo.user.photo }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.placeholderText}>No Photo</Text>
            </View>
          )}

          <Text style={styles.profileName}>{userInfo.user.name}</Text>
          <Text style={styles.profileEmail}>{userInfo.user.email}</Text>

          <View style={styles.logoutButton}>
            <Button title="Logout" onPress={signOut} color="#841584" />
          </View>
        </View>
      )}

      {/* Display error messages if any */}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: "bold",
    color: "#333",
  },
  signInButton: {
    width: 230,
    height: 48,
  },
  profileContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  placeholderText: {
    color: "#fff",
    fontSize: 14,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  logoutButton: {
    width: "100%",
  },
  errorText: {
    marginTop: 20,
    color: "red",
  },
});
