//This file is the webview page for song details.
//This page is opened when clicking anywhere on the row of a song on first_screen
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
  Image,
} from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { LinearGradient } from "expo-linear-gradient";
import { pendingItems } from "../eventdata";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const Pending = ({ route, navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [flatListData, setFlatListData] = useState([]);

  const handleDelete = (key) => {
    const updatedData = flatListData.filter((data) => data.key !== key);
    setFlatListData(updatedData);

    const isDeletedInFiltered = filteredData.find((item) => item.key === key);
    if (isDeletedInFiltered) {
      const updatedFilteredData = filteredData.filter(
        (data) => data.key !== key
      );
      setFilteredData(updatedFilteredData);
    }
  };

  useEffect(() => {
    const formattedData = Object.keys(pendingItems).reduce((acc, date) => {
      const movies = pendingItems[date];
      movies.forEach((movie) => {
        acc.push({
          key: `${date}-${movie.name}`,
          invite: movie.invite,
          date: movie.date,
          time: movie.time,
          name: movie.name,
          people: movie.people,
        });
      });
      return acc;
    }, []);
    setFlatListData(formattedData);
  }, [pendingItems]);

  const handleSearchInput = (text) => {
    setSearchInput(text); // Update temporary search input
  };

  const handleSearch = () => {
    setSearchQuery(searchInput.toLowerCase()); // Set the search query only when the search button is pressed
    const query = searchInput.toLowerCase();
    const filtered = flatListData.filter((item) => {
      const isNameMatch = item.name.toLowerCase().includes(query);
      const isPersonMatch = item.people.some((person) =>
        person.toLowerCase().includes(query)
      );

      return isNameMatch || isPersonMatch;
    });

    setFilteredData(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setFilteredData([]);
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        //console.log(flatListData);
        navigation.navigate("event_detail", {
          date: item.date,
          name: item.name,
          people: item.people,
          time: item.time,
        });
      }}
    >
      <View style={styles.background}>
        <View style={styles.inside}>
          <View style={styles.inside1}>
            <Text style={styles.invitee}>{item.invite}</Text>
            <Text style={styles.textt}> cordially invites you to: </Text>
          </View>
          <View style={styles.tiempo}>
            <Text style={styles.datet}>{item.date}</Text>
            <Text style={styles.timet}>{item.time}</Text>
          </View>
          <View style={styles.tiempo1}>
            <Text numberOfLines={1} style={styles.showt}>
              {item.name}
            </Text>
            <Text numberOfLines={1} style={styles.timet}>
              (w/ {item.people.join(", ")})
            </Text>
          </View>
        </View>
        <View style={styles.accept}>
          <View style={styles.crossContainer}>
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Confirm Acceptance",
                  "Are you sure you want to say yes to this event?",

                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Accept Invite",
                      onPress: () => handleDelete(item.key),
                    },
                  ],
                  { cancelable: false }
                );
              }}
              style={styles.crossContainer}
            >
              <AntDesign name="check" size={20} color="purple" />
            </Pressable>
          </View>
          <View style={styles.crossContainer}>
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Confirm Deletion",
                  "Are you sure you want to say no to this event?",
                  [
                    {
                      text: "cancel",
                      style: "cancel",
                    },
                    {
                      text: "Decline invite",
                      onPress: () => handleDelete(item.key),
                    },
                  ],
                  { cancelable: false }
                );
              }}
              style={styles.crossContainer}
            >
              <AntDesign name="close" size={20} color="gray" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.container}>
      <View style={styles.searchArea}>
        <View style={styles.searchContainer}>
          <TextInput
            numberOfLines={1}
            style={{ color: "purple", textAlign: "left" }}
            placeholder="Search event by movie/show/people"
            placeholderTextColor="gray"
            value={searchInput}
            onChangeText={handleSearchInput}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <View style={styles.buttons}>
            <Pressable onPress={clearSearch} style={styles.searchbutton}>
              <View style={styles.searchbutton}>
                <Entypo name="cross" size={24} color="gray" />
              </View>
            </Pressable>
            <Pressable onPress={handleSearch} style={styles.searchbutton}>
              <View style={styles.searchbutton}>
                <FontAwesome
                  name="search"
                  size={18}
                  color="rgba(150, 130, 200, 1)"
                />
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      <FlatList
        data={searchQuery ? filteredData : flatListData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        width={windowWidth}
        alignSelf="center"
        extraData={searchQuery} // This line ensures re-rendering when searchQuery changes
      />
      <View style={styles.clapboard}>
        <Image
          source={require("../../../assets/Clapboard2.png")}
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
    //alignItems: "center",
    justifyContent: "center",
    //padding: 24,
    paddingTop: 15,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  accept: {
    height: windowHeight * 0.07,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    //borderColor: "red",
    //borderWidth: 5,
  },
  background: {
    height: windowHeight * 0.09,
    margin: 5,
    flexDirection: "row",
    width: windowWidth * 0.95,
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "space-between",
    //padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    alignSelf: "center",
  },
  inside: {
    flexDirection: "column",
    justifyContent: "space-between",

    width: windowWidth * 0.8,
  },
  inside1: {
    flexDirection: "row",
    justifyContent: "start",
  },
  crossContainer: {
    width: windowWidth * 0.08,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tiempo: {
    width: windowWidth * 0.33,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tiempo1: {
    width: windowWidth * 0.8,
    flexDirection: "row",
    justifyContent: "start",
  },
  timet: {
    color: "gray",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  textt: {
    color: "gray",
    fontSize: 16,
    marginLeft: 2,
  },
  invitee: {
    color: "purple",
    fontSize: 16,
  },
  datet: {
    color: "gray",
    marginRight: 5,
  },
  showt: {
    color: "purple",
    fontSize: 16,
    marginRight: 5,
  },
  showt2: {
    color: "black",
    fontSize: 16,
  },
  searchContainer: {
    height: windowHeight * 0.04,
    width: windowWidth * 0.85,
    paddingLeft: 10,
    paddingRight: 3,
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 50,
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 10,
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
  searchbutton: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: windowWidth * 0.075,
    //borderColor: "red",
    //borderWidth: 5,
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

  overall: {
    flexDirection: "column",
    alignItems: "center",
    //padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  time: {
    alignItems: "center",
    margin: 10,
  },
  date: {
    fontSize: 25,
    color: "white",
  },
  hour: {
    fontSize: 20,
    color: "white",
  },
  show: {
    fontSize: 35,
    color: "white",
    textAlign: "center",
  },
  image: {
    height: windowHeight * 0.3,
    width: windowHeight * 0.25,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 10,
  },
  peopleContainer: {
    flexDirection: "row",
    width: windowWidth * 0.8,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    flexWrap: "wrap", // This line makes the content wrap within the container
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
  circletext: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
  circletext1: {
    fontSize: 15,
    marginTop: 20,
    color: "white",
    textAlign: "center",
  },
});

export default Pending;
