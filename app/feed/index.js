import { View, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import supabase from "../../Supabase";
import { LinearGradient } from "expo-linear-gradient";
import Post from "../../components/Post";
import { FontAwesome, Entypo } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Page() {
  const [data, setData] = useState(null);
  // const [input, setInput] = useState("");

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
    const fetchData = async () => {
      const response = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      setData(response.data);
    };
    fetchData();
  }, []);

  // const onMessageSend = async () => {
  //   const response = await supabase.from("posts").insert({
  //     user: "James Landay",
  //     timestamp: "now",
  //     text: input,
  //   });
  // };

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

      <View style={styles.postList}>
        \
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
    justifyContent: "center",
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #0e0111, #311866)",
    paddingRight: 8,
    paddingLeft: 8,
  },
  posts: {},
  postList: {
    flex: 8,
  },
  composer: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderColor: "green",
    borderWidth: 5,
  },

  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  subText: {
    fontSize: 12,
    color: "white",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  recent: {
    marginLeft: 12,
    marginTop: 5,
    marginBottom: 6,
    fontSize: 18,
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
