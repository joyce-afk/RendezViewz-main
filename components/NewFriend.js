import { useState, useEffect } from "react";
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

// friendIDs={friendIDs}
//                 currentUserId={currentUserID}
//                   id={item.id}
//                   user={item.username}
//                   profilePic={item.avatar_url}

//id, user, profilePic, goesTo

const NewFriend = ({ onAddFriend, id, user, profilePic }) => {
  // console.log(friendIDs, id, user, profilePic);
  // const [session, setSession] = useState(null);
  // const navigation = useNavigation();
  // const [inputText, setInputText] = useState("");

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     console.log("current Session!!!", session);
  //     setSession(session);
  //   });
  // }, []);

  return (
    <Pressable
      onPress={() => {
        Alert.alert(
          "Add Friend?",
          `Do you want to add ${user} as a friend?`,

          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: onAddFriend,
            },
          ],
          { cancelable: false }
        );
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profile}>
            <View style={styles.profilePicContainer}>
              <Image style={styles.profilePic} source={{ uri: profilePic }} />
            </View>
            <Text style={styles.username}>{user}</Text>
          </View>
          {/* <Text>{timestamp}</Text> */}
        </View>
      </View>
    </Pressable>
  );
};

export default NewFriend;

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
});
