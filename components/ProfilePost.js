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
    if (inputText !== "") {
      const url =
        "https://enpuyfxhpaelfcrutmcy.supabase.co/storage/v1/object/public/rendezviewz/people/me.png";
      const response = await supabase
        .from("posts")
        .update({ comments: [...comments, ["Yishu C.", inputText, url, true]] })
        .eq("id", id);
      console.log(response);
      setInputText("");
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

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profile}>
            <View style={styles.profilePicContainer}>
              <Image style={styles.profilePic} source={{ uri: profilePic }} />
            </View>

            <Text style={styles.username}>{user}</Text>
          </View>
          <Text style={{ color: "white" }}>{formattedTime}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.postContent}>
            <Text style={styles.action}>{action}</Text>
            <View style={styles.contentContainer}>
              <Text style={styles.content}>{text}</Text>
            </View>
          </View>
          {imageToRender}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
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
    marginRight: 7,
  },
  divider: {
    flex: 1,
    // borderColor: "#361866",
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
  },
  profilePicContainer: {
    width: 35,
    height: 35,
    margin: 5,
    marginRight: 8,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 15,
    // fontFamily: "CaladeaRegular",
    color: "white",
  },
  imageContainer: {
    flex: 0.25,
    marginBottom: 5,
  },
  image: {
    width: 60,
    height: 90,
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
