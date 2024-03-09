import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Rankings from "./rankings";
import Wishlist from "./wishlist";
import RankingDetails from "./ranking_details";
import WishlistDetails from "./wishlist_details";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const RankingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Rankings"
      component={Rankings}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Ranking Details"
      component={RankingDetails}
      options={{
        headerTransparent: true,
        headerTintColor: "white",
        headerTitle: "",
        headerBackTitleVisible: false,
      }}
    />
  </Stack.Navigator>
);

const WishlistStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wishlist Details"
        component={WishlistDetails}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
        tabBarStyle: { backgroundColor: "#0E0111" },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold", color: "white" },
        tabBarIndicatorStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="My Rankings" component={RankingsStack} />
      <Tab.Screen name="My Wishlist" component={WishlistStack} />
    </Tab.Navigator>
  );
}
