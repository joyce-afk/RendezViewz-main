import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  Modal,
  Text,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import NewFriend from "../../components/NewFriend";
import supabase from "../../Supabase";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import filter from "lodash.filter";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AddFriendPage = ({ route, navigation }) => {
  const [session, setSession] = useState(null);
  const [currentUserID, setcurrentUserID] = useState(null);
  const [friendIDs, setFriendIDs] = useState(null);

  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [entry, setEntry] = useState(null);
  const [modalValid, setModalValid] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // setcurrentUserID(session.user.id);
      console.log("currentUserID", currentUserID);

      const fetchFriendID = async () => {
        const friends = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id);
        setFriendIDs(friends.data[0].friend_ids);
      };
      fetchFriendID();
    });
  }, []);

  useEffect(() => {
    if (friendIDs) {
      // console.log("TYPE", typeof friendIDs);
      console.log("friendID", friendIDs);

      const fetchNewFreinds = async () => {
        const filterIDs = [...friendIDs, session.user.id];
        const response = await supabase
          .from("profiles")
          .select("*")
          .not("id", "in", `(${filterIDs.join(",")})`);

        // console.log("out", response.data);
        // console.log("out", response);
        // console.log("error", response.error);
        setData(response.data);
        console.log(response.data);
        setFilteredData(response.data);
      };
      fetchNewFreinds();
    }
  }, [friendIDs]);

  const onAddFriend = async (id) => {
    console.log("id to add", id);
    const updatedFriendIDs = [...friendIDs, id];
    console.log("Updated FriendIDs!", updatedFriendIDs);

    const addFriend = await supabase
      .from("profiles")
      .update({ friend_ids: updatedFriendIDs })
      .eq("id", session.user.id);

    setFriendIDs(updatedFriendIDs);
  };

  // const handleAddFriend = async () => {
  //   const findFriend = await supabase
  //     .from("profiles")
  //     .update({ friend_ids: [...friendIDs, ["Yishu C.", newFriendID]] })
  //     .eq("id", id);

  //   const addFriend = await supabase
  //     .from("profiles")
  //     .update({ friend_ids: [...friendIDs, ["Yishu C.", newFriendID]] })
  //     .eq("id", id);
  // };

  const contains = ({ username }, query) => {
    return username.toLowerCase().includes(query);
  };

  const clearSearch = () => {
    setFilteredData(data);
    setSearchQuery("");
  };

  const handleSearch = () => {
    const formattedQuery = searchQuery.toLowerCase();
    const filteredData = filter(data, ({ username }) => {
      return contains({ username }, formattedQuery);
    });
    setFilteredData(filteredData);
  };

  return (
    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.container}>
      <View style={styles.container1}>
        <View style={styles.input}></View>

        <View style={styles.searchBar}>
          <TextInput
            numberOfLines={1}
            style={{ flex: 1, color: "black", textAlign: "left" }}
            placeholder="Search by Username"
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={(query) => setSearchQuery(query)}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
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

        <View style={styles.friendList}>
          {/* <Text style={styles.title}>Add</Text> */}
          <FlatList
            data={filteredData}
            renderItem={({ item }) => (
              <View style={styles.friendbox}>
                <NewFriend
                  onAddFriend={() => onAddFriend(item.id)}
                  friendIDs={friendIDs}
                  currentUserId={currentUserID}
                  id={item.id}
                  user={item.username}
                  profilePic={item.avatar_url}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
            style={styles.posts}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {/* <Pressable
          style={styles.plusButton}
          onPress={() => {
            setModalVisible(!modalVisible);
            setEntry(null);
          }}
        > */}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #0e0111, #311866)",
    paddingTop: 10,
  },
  container1: {
    backgroundColor: "transparent",
    flex: 1,
  },
  friendbox: {
    backgroundColor: "rgba(50, 50, 50, 0.1)",
  },
  friendList: {
    backgroundColor: "transpar",
    flex: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: windowWidth * 0.13,
  },
  searchbutton: {
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  main: {
    height: windowHeight * 0.5,
    width: windowWidth,
    backgroundColor: "transparent",
    flexDirection: "column",
    width: windowWidth,
    height: windowHeight,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cal: {
    width: "100%",
    backgroundColor: "transparent",
    height: "5%",
    borderWidth: 5,
    borderColor: "green",
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
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  buttonContainer: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.05,
    right: windowWidth * 0.05,
    backgroundColor: "transparent",
  },
  plusButton: {
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  posts: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

export default AddFriendPage;
