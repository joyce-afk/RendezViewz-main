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
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import supabase from "../Supabase";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import getMovieDetails from "./getMovieDetails";

const LIKE_ICON_OUTLINE = require("../assets/like_regular_purple.png");
const LIKE_ICON_FILLED = require("../assets/like_solid_purple.png");

const Post = ({
  id,
  user,
  timestamp,
  text,
  liked,
  imageUrl,
  profilePic,
  action,
  comments,
  title,
  goesTo,
}) => {
  const [inputText, setInputText] = useState("");
  const [showComment, setshowComment] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const details = await getMovieDetails(title);
      setMovieDetails(details);
      setIsLoading(false);
    };
    fetchMovieDetails();
  }, [title]);

  const onLikePressed = async () => {
    const response = await supabase
      .from("posts")
      .update({ liked: !liked })
      .eq("id", id);
    console.log(response);
  };

  const onCommentSend = async () => {
    const trimmedInput = inputText.trim();

    if (trimmedInput !== "") {
      const url =
        "https://enpuyfxhpaelfcrutmcy.supabase.co/storage/v1/object/public/rendezviewz/people/me.png";
      const response = await supabase
        .from("posts")
        .update({ comments: [...comments, ["Yishu C.", inputText, url, true]] })
        .eq("id", id);
      console.log(response);
      setInputText("");
    } else {
      Alert.alert("Please enter a comment before sending.");
      setInputText("");
      return;
    }
  };

  const onDeleteComment = async (index) => {
    const response = await supabase
      .from("posts")
      .update({
        comments: [...comments.slice(0, index), ...comments.slice(index + 1)],
      })
      .eq("id", id);
    console.log(response);
  };

  const onCloseComment = async () => {
    setshowComment(false);
  };

  const onShowComment = async () => {
    setshowComment(true);
  };

  const getTimeDifference = (timestamp) => {
    const currentTime = new Date();
    const postTime = new Date(timestamp);
    const timeDifference = Math.abs(currentTime - postTime);

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "now";
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const formattedTime = getTimeDifference(timestamp);

  let imageToRender;
  if (isLoading) {
    imageToRender = (
      <ActivityIndicator
        style={styles.imageContainer}
        size="large"
        color="#0000ff"
      />
    );
  } else {
    imageToRender = (
      <Pressable
        style={styles.imageContainer}
        onPress={() =>
          navigation.navigate(goesTo, {
            details: movieDetails,
          })
        }
      >
        <Image
          source={{
            uri: movieDetails.Poster,
            name: "Preview",
          }}
          style={styles.image}
        />
      </Pressable>
    );
  }

  let contentToRender;
  if (!showComment) {
    contentToRender = (
      <View style={styles.commentSection}>
        <TouchableOpacity style={styles.closeComment} onPress={onShowComment}>
          <AntDesign name="down" size={18} color="white" />
          <Text style={styles.close}>show comments</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    contentToRender = (
      <View style={styles.commentSection}>
        <FlatList
          data={comments}
          renderItem={({ item, index }) => (
            <View style={styles.oneComment}>
              <View style={styles.leftContent}>
                <View style={styles.commentAvatar}>
                  <Image style={styles.profilePic} source={{ uri: item[2] }} />
                </View>

                <View style={styles.commentText}>
                  <Text style={styles.userName}>{item[0]}</Text>
                  <Text style={styles.comment}>{item[1]}</Text>
                </View>
              </View>

              {item[3] === "true" ? (
                <View style={styles.delete}>
                  <TouchableOpacity
                    style={styles.delete}
                    onPress={() => onDeleteComment(index)}
                  >
                    <AntDesign name="close" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}
          style={styles.flatList}
        />
        <TouchableOpacity style={styles.closeComment} onPress={onCloseComment}>
          <AntDesign name="up" size={18} color="white" />
          <Text style={styles.close}>close comments</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profile}>
            <View style={styles.profilePicContainer}>
              <View style={styles.profilePicBackground} />
              <Image style={styles.profilePic} source={{ uri: profilePic }} />
            </View>
            <View>
              <Text style={styles.username}>{user}</Text>
              <Text style={styles.formattedTime}>{formattedTime}</Text>
            </View>
          </View>
          <Text style={styles.action}>{action}</Text>
        </View>
        {/* <View style={styles.divider} /> */}

        <View style={styles.body}>
          <View style={styles.postContent}>
            <View style={styles.contentContainer}>
              <Text style={styles.content}>{text}</Text>
            </View>
          </View>

          {imageToRender}
        </View>

        <View style={styles.footer}>
          <View style={styles.commentBar}>
            <View style={styles.textInput}>
              <TextInput
                style={styles.inputText}
                value={inputText}
                onChangeText={(text) => setInputText(text)}
                placeholder={"Write a comment..."}
                placeholderTextColor="rgba(255, 255, 255, 0.8)"
                onSubmitEditing={onCommentSend}
                returnKeyType="send"
              />
              <TouchableOpacity style={styles.send} onPress={onCommentSend}>
                <FontAwesome name="send" size={18} color="#97DFFC" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onLikePressed}>
              <Image
                style={styles.heart}
                source={liked ? LIKE_ICON_FILLED : LIKE_ICON_OUTLINE}
                tintColor="#97DFFC"
              />
            </TouchableOpacity>
          </View>
          {contentToRender}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(151, 223, 252, 0.17)",
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 15,
    padding: 7,
    width: "100%",
    marginBottom: 10,
    gap: 4,
    textColor: "black",
  },
  heart: {
    width: 24,
    height: 22,
  },
  textInput: {
    // opacity: "20%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 15,
    padding: 9,
    flex: 1,
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputText: {
    width: "90%",
    color: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    flex: 1,
    // borderColor: "#361866",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  formattedTime: {
    color: "white",
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 5,
    gap: 8,
  },
  footer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  commentBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "rgba(217, 217, 217, 0.5)",
    // flex: 1,
  },
  commentSection: {
    width: "100%",
    padding: 5,
  },
  closeComment: {
    flexDirection: "row", // To display items horizontally
    justifyContent: "flex-end",
    marginTop: 4,
  },
  oneComment: {
    flexDirection: "row", // To display items horizontally
    justifyContent: "space-between",
    alignItems: "center",
    margin: 4,
  },
  leftContent: {
    flexDirection: "row",
    // alignItems: "center",
  },
  commentAvatar: {
    width: 30,
    height: 30,
    marginRight: 5,
    marginTop: 3,
  },
  commentText: {
    width: "80%",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 13,
    color: "white",
  },
  comment: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  delete: {},
  close: {
    // borderWidth: 1,
    color: "white",
    textAlign: "right",
  },
  profilePic: {
    width: "100%",
    height: "100%",
    borderRadius: 50, // Assuming it's a circle
    zIndex: 2, // Make sure it's above the background
  },
  profilePicContainer: {
    width: 45,
    height: 45,
    margin: 5,
    marginRight: 8,
    position: "relative",
  },
  profilePicBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 50, // Assuming it's a circle
    backgroundColor: "#858AE3",
    zIndex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 15,
    // fontFamily: "CaladeaRegular",
    color: "white",
  },
  imageContainer: {
    width: 60,
    height: 90,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  postContent: {
    flex: 1,
  },
  action: {
    fontStyle: "italic",
    // borderWidth: 1,
    color: "white",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    fontSize: 20,
    // textAlign: "center",
    color: "white",
  },
});
