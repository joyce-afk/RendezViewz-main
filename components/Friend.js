import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { EvilIcons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import getMovieDetails from "./getMovieDetails";

const Friend = ({ id, user, profilePic, onDeleteFriend, goesTo }) => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            navigation.navigate("PeoplePage", { screen: "Friend Movies" })
          }
        >
          <View style={styles.profile}>
            <View style={styles.profilePicContainer}>
              <Image style={styles.profilePic} source={{ uri: profilePic }} />
            </View>
            <Text style={styles.username}>{user}</Text>
          </View>
        </Pressable>
        {/* <Text>{timestamp}</Text> */}
      </View>

      <Pressable style={styles.deleteButtonContainer}>
        <EvilIcons
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              "Delete Friend?",
              `Are you sure you want to remove ${user} from friends?`,

              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: onDeleteFriend,
                },
              ],
              { cancelable: false }
            );
          }}
          name="trash"
          size={25}
          color="#602683"
        />
      </Pressable>
    </View>
  );
};

export default Friend;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(225, 225, 225, 0.3)",
    borderColor: "#361866",
    //borderWidth: 0.5,
    // height: 70,
    borderRadius: 15,
    padding: 10,
    paddingLeft: 14,
    width: "100%",
    // marginBottom: 10,
    // gap: 4,
    textColor: "black",
    margin: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profilePic: {
    // width: 32,
    // height: 32,
    width: "100%",
    height: "100%",
    // marginRight: 4,
    // borderRadius: "50%",
    // borderTopRightRadius: '100%',
    // borderBottomLeftRadius: '100%'
  },
  profilePicContainer: {
    width: 45,
    height: 45,
    // margin: 5,
    marginRight: 15,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 17,
    color: "white",
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    bottom: 5,
    width: windowWidth * 0.1,
    height: "50%",
    justifyContent: "center",
  },
});
