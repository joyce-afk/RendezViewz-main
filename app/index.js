import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useState, useEffect } from "react";
import supabase from "../Supabase";
import { LinearGradient } from "expo-linear-gradient";
import Post from "../components/Post";
import Poster from "../components/Poster";
import { FontAwesome, Entypo } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Page() {
  const [session, setSession] = useState(null);
  const [friendIDs, setFriendIDs] = useState(null);

  const [data, setData] = useState(null);
  const [input, setInput] = useState("");

  const [recs, setRecs] = useState([
    "Inception",
    "The Godfather",
    "Titanic",
    "The Shawshank Redemption",
    "Forrest Gump",
    "Pulp Fiction",
    "The Dark Knight",
    "Schindler's List",
    "Fight Club",
    "The Matrix",
    "The Lord of the Rings",
    "Star Wars",
    "Jurassic Park",
    "Avatar",
    "The Silence of the Lambs",
    "Breaking Bad",
    "Game of Thrones",
    "Friends",
    "Stranger Things",
    "The Crown",
    "The Office",
    "Sherlock",
    "Black Mirror",
    "The Simpsons",
    "Westworld",
    "The Mandalorian",
    "Doctor Who",
    "The Big Bang Theory",
    "Narcos",
    "The Walking Dead",
  ]);

  const handleRecordUpdated = (payload) => {
    setData((oldData) => {
      return oldData.map((item) => {
        if (item.id === payload.new.id) {
          return payload.new;
        }
        return item;
      });
    });
  };

  const handleRecordInserted = (payload) => {
    setData((oldData) => [...oldData, payload.new]);
  };

  const handleRecordDeleted = (payload) => {
    setData((oldData) => oldData.filter((item) => item.id !== payload.old.id));
  };

  const onMessageSend = async () => {
    const response = await supabase.from("posts").insert({
      user: "James Landay",
      timestamp: "now",
      text: input,
    });
  };

  useEffect(() => {
    supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        handleRecordUpdated
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        handleRecordInserted
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "posts" },
        handleRecordDeleted
      )
      .subscribe();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      const fetchRankings = async () => {
        const rankings = await supabase
          .from("rankings")
          .select("*")
          .eq("user_id", session.user.id);

        // console.log("this is the current session", session);
        console.log(
          "this is RANKINGS",
          rankings.data.map((item) => item.genres)
        );
        // filter out the current user
        // setFriendIDs(friends.data[0].friend_ids);
      };
      fetchRankings();

      const fetchFriendID = async () => {
        const friends = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id);

        // console.log("this is the current session", session);
        // console.log("this is the friend IDs", friends.data[0].friend_ids);
        // filter out the current user
        setFriendIDs(friends.data[0].friend_ids);
      };
      fetchFriendID();
    });
  }, []);

  useEffect(() => {
    if (friendIDs) {
      showPostIDs = [...friendIDs, session.user.id];
      const fetchData = async () => {
        const response = await supabase
          .from("posts")
          .select("*")
          .in("user_id", showPostIDs)
          .order("created_at", { ascending: false });
        setData(response.data);
      };
      fetchData();
    }
  }, [friendIDs]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await supabase
  //       .from("posts")
  //       .select("*")
  //       .order("created_at", { ascending: false });
  //     setData(response.data);
  //   };
  //   fetchData();
  // }, []);

  if (!data) {
    return (
      <LinearGradient
        colors={["#0e0111", "#311866"]}
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
    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.container}>
      {/* <View style={styles.composer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setInput(text)}
          value={input}
          placeholder="Write a post..."
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
        />
        <TouchableOpacity style={styles.send} onPress={onMessageSend}>
          <FontAwesome name="send" size={20} color="#BBADD3" />
        </TouchableOpacity>
      </View> */}
      <View style={styles.middle}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          horizontal={true}
        >
          {/* Content inside the horizontal ScrollView */}
          {recs.map((item) => (
            <Poster title={item} goesTo={"ShowDetails"} />
          ))}
        </ScrollView>

        <View style={styles.postList}>
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Post
                id={item.id}
                user={item.user}
                timestamp={item.created_at}
                text={item.text}
                liked={item.liked}
                imageUrl={item.show_poster_url}
                profilePic={item.profile_pic}
                action={item.action}
                comments={item.comments}
                title={item.movie_title}
                goesTo={"ShowDetails"}
              />
            )}
            keyExtractor={(item) => item.id}
            style={styles.posts}
            contentContainerStyle={{ paddingTop: 10 }}
          />
        </View>
      </View>

      <View style={styles.clapboard}>
        <Image
          source={require("../assets/Clapboard2.png")}
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
    // alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #0e0111, #311866)",
    paddingRight: 8,
    paddingLeft: 8,
  },
  middle: {
    flex: 1,
  },
  posts: {
    // marginTop: 12,
    flex: 1,
  },
  scroll: {
    // borderWidth: 1,
    flex: 3,
  },
  postList: {
    flex: 3.5,
    // borderWidth: 1,
  },
  composer: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    // borderColor: "green",
    // borderWidth: 5,
  },

  clapboard: {
    // position: "abolute",
    // bottom: windowHeight * 0.015,
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },

  input: {
    flex: 1,
    height: 30,
    paddingHorizontal: 8,
    backgroundColor: "rgba(173, 216, 230, 0.5)",
    borderRadius: 999,
  },
  send: {
    alignItems: "center",
    justifyContent: "center",
  },
});
