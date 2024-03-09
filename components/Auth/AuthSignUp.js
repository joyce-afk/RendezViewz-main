import React, { useState } from "react";
import {
  Alert,
  View,
  StyleSheet,
  AppState,
  SafeAreaView,
  Dimensions,
} from "react-native";
import supabase from "../../Supabase";
import { Button, Input } from "react-native-elements";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(false);

  // async function signInWithEmail() {
  //   setLoading(true);
  //   const { error } = await supabase.auth.signInWithPassword({
  //     email: email,
  //     password: password,
  //   });

  //   if (error) Alert.alert(error.message);
  //   setLoading(false);
  // }

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
      style={[styles.container, { paddingHorizontal: 40 }]}
    >
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
            leftIcon={{ type: "font-awesome", name: "lock", color: "white" }}
            labelStyle={{ color: "white" }}
            inputStyle={{ color: "white" }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
          />
        </View>
        {/* <View style={[styles.buttonSpaced, styles.mt20]}>
          <Button
            title="Sign in"
            titleStyle={{ color: "#0D0D38" }}
            disabled={loading}
            onPress={() => signInWithEmail()}
            buttonStyle={{
              backgroundColor: "#FFC300",
              borderRadius: 20,
              height: 50,
              paddingHorizontal: 20,
            }}
          />
        </View> */}
        <View style={styles.buttonSpaced}>
          <Button
            title="Sign up"
            titleStyle={{ color: "#367CBC" }}
            disabled={loading}
            onPress={() => signUpWithEmail()}
            buttonStyle={{
              backgroundColor: "transparent",
              borderColor: "#367CBC",
              borderWidth: 2,
              borderRadius: 20,
              height: 50,
              paddingHorizontal: 20,
            }}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  verticallySpaced: {
    paddingHorizontal: 40,
    paddingTop: 4,
    paddingBottom: 2,
    alignSelf: "stretch",
  },
  buttonSpaced: {
    paddingHorizontal: 40,
    paddingTop: 4,
    paddingBottom: 12,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 10,
  },
});
