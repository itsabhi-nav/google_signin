// comps/signin.ts
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// Define the signIn function
export const signIn = async () => {
  try {
    // Ensure Google Play Services are available (Android only)
    await GoogleSignin.hasPlayServices();

    // Attempt the sign-in process
    const userInfo = await GoogleSignin.signIn();
    console.log("User Info:", userInfo);
    // You can update your app state here with the user info if needed.
  } catch (error: any) {
    if (error.code === statusCodes.IN_PROGRESS) {
      console.warn("Sign in is already in progress.");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.warn("Google Play Services not available or outdated.");
    } else {
      console.error("An error occurred during sign in:", error);
    }
  }
};
