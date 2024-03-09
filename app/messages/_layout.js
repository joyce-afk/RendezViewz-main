//This is the stack that helps navigating back and forth between the different pages
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FirstScreen from "./first_screen";
import EventDetail from "./event_detail";
import AddEvent from "./add_event";
import Success from "./success";
import MyEventTabs from "./Inbox/_layout";

const Stack = createNativeStackNavigator();

export default function MessagesLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="first_screen" //authentication and top tracks page
        component={FirstScreen}
        options={{ headerShown: false }} //no header for this page
      />
      <Stack.Screen
        name="Inbox" //song detail page
        component={MyEventTabs}
        options={{
          title: "Invite Inbox",
          headerStyle: {
            backgroundColor: "#361866", // Set the background color of the header
          },
          headerTitleStyle: {
            color: "white", // Set the font color of the title
          },
          headerTintColor: "white", // Set the color of the back arrow
        }}
      />
      <Stack.Screen
        name="event_detail" //song detail page
        component={EventDetail}
        options={{
          title: "Event Details",
          headerStyle: {
            backgroundColor: "#361866", // Set the background color of the header
          },
          headerTitleStyle: {
            color: "white", // Set the font color of the title
          },
          headerTintColor: "white", // Set the color of the back arrow
        }}
      />
      <Stack.Screen
        name="add_event" //song detail page
        component={AddEvent}
        options={{
          title: "Schedule a new Watch Party!",
          headerStyle: {
            backgroundColor: "#361866", // Set the background color of the header
          },
          headerTitleStyle: {
            color: "white", // Set the font color of the title
          },
          headerTintColor: "white", // Set the color of the back arrow
        }}
      />
      <Stack.Screen
        name="success" //song detail page
        component={Success}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
