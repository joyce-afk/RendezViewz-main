import React, { useState } from "react";
import {
  Alert,
  View,
  StyleSheet,
  AppState,
  SafeAreaView,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Text,
} from "react-native";
import supabase from "../../Supabase";
import { Button, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Account from "../Account";
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  const [buttonColor, setButtonColor] = useState("#858AE3");

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    // setFirstTime(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    // if (!session)
    //   Alert.alert("Please check your inbox for email verification!");
    // setLoading(false);
  }

  // if (firstTime) {
  //   return (
  //     <Account key={session.user.id} session={session} />
  //   );
  // };

  return (
    <LinearGradient
      colors={["#0e0111", "#311866"]}
      style={[styles.background, { paddingHorizontal: windowWidth * 0.1 }]}
    >
      <Text style={styles.helloText}>Hello!</Text>
      <View
        style={[styles.bottomSlideContainer, styles.bottomSlideVisible]}
      ></View>
      <SafeAreaView style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Email"
            leftIcon={{
              type: "font-awesome",
              name: "envelope",
              color: "white",
            }}
            labelStyle={{ color: "white" }}
            inputStyle={{ color: "white" }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            leftIcon={{
              type: "font-awesome",
              name: "lock",
              color: "white",
            }}
            labelStyle={{ color: "white" }}
            inputStyle={{ color: "white" }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
          />
        </View>
        <View style={[styles.buttonSpaced, styles.mt20]}>
          <TouchableHighlight
            activeOpacity={0.6} // Adjust the opacity as needed
            underlayColor="transparent" // Set the underlay color to transparent
            onPress={() => {
              setButtonColor("transparent");
              navigation.navigate("AuthSignUp");
            }}
          >
            <Button
              title="Login"
              titleStyle={{ color: "#0E0111" }}
              disabled={loading}
              onPress={() => signInWithEmail()}
              buttonStyle={{
                backgroundColor: buttonColor,
                borderRadius: windowWidth * 0.05,
                height: windowHeight * 0.07,
                paddingHorizontal: windowWidth * 0.05,
              }}
            />
          </TouchableHighlight>
        </View>
        <View style={[styles.buttonSpaced, styles.centered]}>
          <Text style={styles.signupText}>
            Need an account?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("AuthSignUp")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  helloText: {
    color: "white",
    fontSize: windowHeight * 0.08,
    position: "absolute",
    top: windowHeight * 0.12,
    left: windowWidth * 0.05,
  },
  bottomSlideContainer: {
    position: "absolute",
    bottom: -windowHeight * 0.1,
    left: 0,
    right: 0,
    backgroundColor: "rgba(151, 223, 252, 0.19)",
    borderTopLeftRadius: windowWidth * 0.1,
    borderTopRightRadius: windowWidth * 0.1,
    paddingHorizontal: windowWidth * 0.05,
    paddingVertical: windowHeight * 0.05,
  },
  bottomSlideVisible: {
    height: windowHeight * 0.7,
  },
  container: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  background: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  verticallySpaced: {
    paddingHorizontal: windowWidth * 0.1,
    paddingTop: windowHeight * 0.02,
    paddingBottom: windowHeight * 0.01,
    alignSelf: "stretch",
  },
  buttonSpaced: {
    paddingHorizontal: windowWidth * 0.1,
    paddingTop: windowHeight * 0.02,
    paddingBottom: windowHeight * 0.03,
    alignSelf: "stretch",
  },
  centered: {
    alignItems: "center",
  },
  signupText: {
    color: "white",
    fontSize: windowWidth * 0.05,
    textAlign: "center",
  },
  signupLink: {
    color: "#97DFFC",
    fontSize: windowWidth * 0.05,
    textDecorationLine: "underline",
  },
  mt20: {
    marginTop: windowHeight * 0.02,
  },
});
