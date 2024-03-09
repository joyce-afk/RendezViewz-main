import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Rankings from "./friendRankings";
import Wishlist from "./friendWishlist";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
        tabBarStyle: { backgroundColor: "#361866" },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold", color: "white" },
        tabBarIndicatorStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="Friend Rankings" component={Rankings} />
      <Tab.Screen name="Friend Wishlist" component={Wishlist} />
    </Tab.Navigator>
  );
}
