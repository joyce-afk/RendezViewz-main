// Import necessary modules
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Calendar from "expo-calendar"; // Importing calendar module
import * as Localization from "expo-localization";
import getMovieDetails from "../../components/getMovieDetails";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const EventDetail = ({ route }) => {
  const { date, name, time, people } = route.params;
  const [showAllPeople, setShowAllPeople] = useState(false);
  const [showURL, setShowURL] = useState(null);
  const [all, setAll] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await supabase.from("friends").select("*");
        if (response.error) {
          throw new Error(response.error.message);
        }
        const peopleData = response.data.map((person) => ({
          label: person.user,
          value: person.id.toString(),
          photo: person.profile_pic,
        }));
        setAll(peopleData);
      } catch (error) {
        console.error("Error fetching people:", error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const showPoster = async () => {
      const movieDetails = await getMovieDetails(name);
      setShowURL(movieDetails.Poster);
    };
    showPoster();
  }, []);

  const renderPeopleCircles = () => {
    const maxPeopleToShow = 4;
    const abbreviatedPeople = showAllPeople
      ? people
      : people.slice(0, maxPeopleToShow);
    const remainingPeopleCount = people.length - maxPeopleToShow;

    const abbreviatedNames = abbreviatedPeople.map((personName, index) => {
      const personData = all.find((person) => person.label === personName);
      if (personData && personData.photo) {
        return (
          <View key={index} style={styles.personCircle}>
            <Image
              source={{ uri: personData.photo }}
              style={{ width: 45, height: 45, borderRadius: 22.5 }}
            />
            <Text style={styles.circletext}>{personName}</Text>
          </View>
        );
      } else {
        return (
          <View key={index} style={styles.personCircle}>
            <Ionicons
              name="person-circle-outline"
              size={45}
              color="rgba(255, 255, 255, 0.8)"
            />
            <Text style={styles.circletext}>{personName}</Text>
          </View>
        );
      }
    });

    if (remainingPeopleCount > 0 && !showAllPeople) {
      abbreviatedNames.push(
        <Pressable key={maxPeopleToShow} onPress={() => setShowAllPeople(true)}>
          <Text
            style={[styles.circletext1, { textDecorationLine: "underline" }]}
          >{`Show ${remainingPeopleCount} others`}</Text>
        </Pressable>
      );
    }

    return abbreviatedNames;
  };

  const addToCalendar = async () => {
    // Check for permission to access the calendar
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      // Get the default calendar ID
      const defaultCalendarId =
        Platform.OS === "ios"
          ? (await Calendar.getDefaultCalendarAsync()).id
          : (await Calendar.getCalendarsAsync()).find(
              (cal) => cal.accessLevel === "owner"
            ).id;

      // Set the time zone to the device's time zone
      const timeZone = Localization.timezone;

      // Create event object
      const eventDetails = {
        title: name,
        startDate: new Date(date + "T" + time),
        endDate: new Date(
          date +
            "T" +
            (parseInt(time.split(":")[0]) + 2) +
            ":" +
            time.split(":")[1]
        ), // Assuming event ends 2 hours later
        timeZone,
        availability: Calendar.Availability.BUSY,
        calendarId: defaultCalendarId, // Specify the calendar ID here
      };

      // Add event to calendar
      await Calendar.createEventAsync(defaultCalendarId, eventDetails)
        .then((event) => {
          // Event added successfully
          console.log("Event added to calendar:", event);
          Alert.alert("Success", "Event exported to calendar!");
        })
        .catch((error) => {
          // Error adding event
          console.error("Error adding event to calendar:", error);
        });
    } else {
      // Permission not granted
      console.log("Permission to access calendar was denied");
    }
  };

  const formatDateAndTime = (date, time) => {
    const dateTime = new Date(`${date}T${time}`);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = dateTime.getDate();
    const monthIndex = dateTime.getMonth();
    const monthName = monthNames[monthIndex];

    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const formattedDate = `${monthName} ${day}${getDaySuffix(day)}`;
    const formattedTime = dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Return JSX with bold styles for date and time
    return (
      <>
        <Text style={{ fontWeight: "normal" }}>
          {formattedDate}
          {" at "}
          {formattedTime}
        </Text>
      </>
    );
  };

  return (
    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.overall}>
          <View style={styles.posterBackgroundContainer}>
            <Image
              source={{ uri: showURL }}
              style={styles.posterBackground}
              blurRadius={5}
            />
            <View style={styles.posterContainer}>
              <Image source={{ uri: showURL }} style={styles.poster} />
            </View>
          </View>
          <View style={styles.time}>
            <Text style={styles.show}>{name}</Text>
          </View>
          <View style={styles.time}>
            <Text style={styles.date}>{formatDateAndTime(date, time)}</Text>
          </View>
          <View style={styles.peopleContainer}>{renderPeopleCircles()}</View>
          {showAllPeople ? (
            <Pressable
              style={styles.collapseButton}
              onPress={() => setShowAllPeople(false)}
            >
              <Text
                style={[styles.circletext, { textDecorationLine: "underline" }]}
              >
                Show less people
              </Text>
            </Pressable>
          ) : null}
          <Pressable style={styles.button} onPress={addToCalendar}>
            <Text style={{ color: "#000814", fontSize: 15 }}>
              Export Event to Calendar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  overall: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  time: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 0,
  },
  date: {
    fontSize: windowWidth * 0.05,
    color: "white",
  },
  show: {
    fontSize: windowWidth * 0.09,
    color: "white",
    textAlign: "center",
  },
  image: {
    height: windowHeight * 0.35,
    width: windowHeight * 0.22,
    marginBottom: windowHeight * 0.02,
    padding: windowWidth * 0.01,
  },
  posterBackgroundContainer: {
    position: "relative",
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  posterBackground: {
    position: "absolute",
    width: windowWidth,
    height: windowHeight * 0.5,
    resizeMode: "cover",
    borderRadius: 15,
  },
  posterContainer: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    overflow: "hidden",
    marginTop: 0, // Adjust as necessary
  },
  poster: {
    height: windowHeight * 0.5,
    width: windowWidth * 0.9, // Adjust width as necessary to maintain aspect ratio
    resizeMode: "contain",
  },
  peopleContainer: {
    flexDirection: "row",
    width: windowWidth * 0.8,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    flexWrap: "wrap",
  },
  personCircle: {
    margin: 2,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    backgroundColor: "transparent",
  },
  circletext: {
    fontSize: 15,
    paddingBottom: 10,
    color: "white",
    textAlign: "center",
  },
  circletext1: {
    fontSize: 15,
    marginTop: 20,
    color: "white",
    textAlign: "center",
  },
  button: {
    marginTop: windowHeight * 0.01,
    marginBottom: windowHeight * 0.04,
    paddingVertical: windowHeight * 0.02,
    paddingHorizontal: windowWidth * 0.04,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: windowWidth * 0.1,
    backgroundColor: "#858AE3",
  },
});

export default EventDetail;
