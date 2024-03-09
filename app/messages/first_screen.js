//landing page of calendar
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { initialItems } from "./eventdata";
import { Calendar, LocaleConfig, Agenda } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import supabase from "../../Supabase";
import AddEvent from "./add_event";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function FirstScreen({ navigation }) {
  const [selected, setSelected] = useState("");
  const [items, setItems] = useState({});

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("party")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        const formattedData = {};

        // Get the current date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Loop through each day of the year
        for (let month = 0; month < 12; month++) {
          for (let day = 1; day <= 31; day++) {
            const date = new Date(currentYear, month, day)
              .toISOString()
              .split("T")[0];
            formattedData[date] = [];
          }
        }

        // Add events to the formattedData object
        data.forEach((event) => {
          const { date, show, people, time } = event;

          if (!formattedData[date]) {
            formattedData[date] = [];
          }

          formattedData[date].push({
            name: show,
            people: people,
            time: time,
            date: date,
          });
        });

        setItems(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const removeEvent = async (date, eventName) => {
    try {
      // Delete the event from Supabase
      const { error } = await supabase
        .from("party")
        .delete()
        .eq("date", date)
        .eq("show", eventName);

      if (error) {
        throw new Error(error.message);
      }

      // Update the UI after successful deletion
      const updatedItems = { ...items };
      const index = updatedItems[date].findIndex(
        (event) => event.name === eventName
      );
      if (index !== -1) {
        updatedItems[date].splice(index, 1);
        setItems(updatedItems);
      }

      Alert.alert("Success", "Event deleted successfully!");
    } catch (error) {
      Alert.alert("Error", `Failed to delete event: ${error.message}`);
    }
  };

  const doublecheck = (date, eventName) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Delete", onPress: () => removeEvent(date, eventName) },
      ],
      { cancelable: false }
    );
  };

  const renderItem = (item) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("event_detail", {
            date: item.date,
            name: item.name,
            people: item.people,
            time: item.time,
          })
        }
      >
        <View style={styles.itemContainer}>
          <View style={styles.rowcont}>
            <View style={styles.eventInfo}>
              <Text numberOfLines={1} style={{ fontSize: 17, color: "purple" }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 10, color: "gray" }}>{item.time}</Text>
              <Text
                numberOfLines={1}
                //ellipsizeMode="tail"
                style={{ fontSize: 10, color: "gray" }}
              >
                {item.people.join(", ")}
              </Text>
            </View>
            <Pressable
              onPress={() => doublecheck(item.date, item.name)}
              style={styles.removeButton}
            >
              <AntDesign name="close" size={20} color="gray" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  if (!items) {
    return (
      <LinearGradient
        colors={["#361866", "#E29292"]}
        style={[styles.container, { paddingHorizontal: 8 }]}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="purple" />
          <Text style={{ color: "white" }}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <View style={styles.main}>
        <Agenda
          style={{ width: "100%", height: "100%" }}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#602683",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#602683",
            dayTextColor: "#2d4150",
            textDisabledColor: "#c6c7c9",
            arrowColor: "#602683",
            dotColor: "#602683",
          }}
          onDayPress={(day) => {
            setSelected(day.dateString);
            console.log("selected day", day);
          }}
          items={items}
          renderItem={renderItem}
        />
        <View style={styles.buttonContainer1}>
          <Pressable
            style={styles.button1}
            onPress={() => navigation.navigate("Inbox", {})}
          >
            <Feather name="mail" size={30} color="white" />
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("add_event", {})}
          >
            <AntDesign name="pluscircle" size={50} color="#000814" />
          </Pressable>
        </View>
      </View>
      <View style={styles.clapboard}>
        <Image
          source={require("../../assets/Clapboard2.png")}
          style={{
            flex: 1,
            width: windowWidth,
            resizeMode: "stretch",
          }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  rowcont: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventInfo: {
    width: windowWidth * 0.65,
  },
  main: {
    flex: 1,
    // height: windowHeight * 0.5,
    // width: windowWidth,
    backgroundColor: "transparent",
    flexDirection: "column",
    width: windowWidth,
    height: windowHeight,
    justifyContent: "flex-end",
    alignItems: "center",
    // padding: 5,
    borderWidth: 1,
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    padding: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "start",
    flex: 1,
  },
  cal: {
    width: "100%",
    backgroundColor: "transparent",
    height: "5%",

    alignItems: "center",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  inboxtext: {
    color: "white",
    fontSize: 15,
  },
  buttonContainer: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.03,
    right: windowWidth * 0.05,
    backgroundColor: "transparent",
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 50,
    backgroundColor: "white", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  button1: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#000814", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  button2: {
    width: 100,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#602683", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer1: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.03,
    right: windowHeight * 0.1,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  buttonContainer2: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.03,
    left: windowHeight * 0.02,
    backgroundColor: "transparent",
  },
  magnify: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.019,
    right: windowHeight * 0.097,
    zIndex: 2,
  },
});
