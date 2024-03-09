import { Tabs } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import {
  useFonts,
  ImperialScript_400Regular,
} from "@expo-google-fonts/imperial-script";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";

import "react-native-url-polyfill/auto";
import supabase from "../Supabase";
import React, { createContext, useContext, useState, useEffect } from "react";
import Auth from "../components/Auth/Auth";
import Account from "../components/Account";
import { Session } from "@supabase/supabase-js";

// const SessionContext = createContext(null);

export default function HomeLayout() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const [fontsLoaded] = useFonts({
    ImperialScript: ImperialScript_400Regular,
  });

  useEffect(() => {
    const loadFontsAndNavigate = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await fontsLoaded;
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    loadFontsAndNavigate();
  }, [fontsLoaded]);

  // Ensure the splash screen remains visible until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (session && session.user) {
    console.log("current user info!", session.user);
    console.log("current user id!", session.user.id);
    return (
      <Tabs
        screenOptions={{
          unmountOnBlur: true,
          headerTitle: "RendezViewz",
          headerStyle: {
            backgroundColor: "#311866",
            //borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: "white",
            fontFamily: "ImperialScript",
            fontSize: 30,
          },
          tabBarStyle: { backgroundColor: "#311866" },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#BBADD3",
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} redirect />
        <Tabs.Screen
          name="feed"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            tabBarLabel: "Calendar",
            tabBarIcon: ({ size, color }) => (
              <FontAwesome name="calendar-o" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="rankings"
          options={{
            tabBarLabel: "Rankings",
            tabBarIcon: ({ size, color }) => (
              <Entypo name="add-to-list" size={size + 5} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="people"
          options={{
            tabBarLabel: "People",
            tabBarIcon: ({ size, color }) => (
              <FontAwesome name="group" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="me"
          options={{
            tabBarLabel: "Me",
            tabBarIcon: ({ focused, size, color }) => (
              <Ionicons name="person-circle" size={size + 5} color={color} />
            ),
          }}
          initialParams={session}
        />
      </Tabs>
    );
  }

  return (
    <View>
      <Auth />
    </View>
  );

  return (
    <View>
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        unmountOnBlur: true,
        headerTitle: "RendezViewz",
        headerStyle: {
          backgroundColor: "#311866",
          //borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: "white",
          fontFamily: "ImperialScript",
          fontSize: 30,
        },
        tabBarStyle: { backgroundColor: "#311866" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#BBADD3",
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} redirect />
      <Tabs.Screen
        name="feed"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: "Calendar",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="calendar-o" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rankings"
        options={{
          tabBarLabel: "Rankings",
          tabBarIcon: ({ size, color }) => (
            <Entypo name="add-to-list" size={size + 5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          tabBarLabel: "People",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="group" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="me"
        options={{
          tabBarLabel: "Me",
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="person-circle" size={size + 5} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
