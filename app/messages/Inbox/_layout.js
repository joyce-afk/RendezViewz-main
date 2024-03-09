import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Events from "./first_screen";
import Pending from "./pending";

const Tab = createMaterialTopTabNavigator();

export default function MyEventTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#0E0111" },
        tabBarLabelStyle: { fontSize: 13, color: "white" },
        tabBarPressColor: { color: "#0E0111" },
        tabBarIndicatorStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="My Events" component={Events} />
      <Tab.Screen name="Pending Invites" component={Pending} />
    </Tab.Navigator>
  );
}
