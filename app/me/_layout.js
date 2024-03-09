import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect } from "react";
import Profile from "./profile";
import ShowDetails from "./show_details";

const Stack = createStackNavigator();

// const YourTabComponent = ({ route }) => {
//   const { session } = route.params;
//   console.log("session in me", session);
// };

export default function Feed() {
  // useEffect(() => {
  //   const getSession = ({ route }) => {
  //     const { session } = route.params;
  //     console.log("session in profile", session);
  //   };
  //   getSession();
  // }, []);

  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowDetails"
        component={ShowDetails}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
