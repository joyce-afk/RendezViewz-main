import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import Comment from "./components/Comment";
import supabase from "./Supabase";
import { FontAwesome } from "@expo/vector-icons";
import "react-native-url-polyfill/auto";
import Auth from "./components/Auth";
import Account from "./components/Account";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";

import * as Font from "expo-font";

export default function App() {
  const [session, setSession] = (useState < Session) | (null > null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "imperial-script": require("./assets/fonts/ImperialScript.ttf"),
      });
    }
    loadFont();
  }, []);

  return (
    <View>
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </View>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
