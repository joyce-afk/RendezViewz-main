import React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import ProfilePost from "../../components/ProfilePost";
import { useNavigation } from "@react-navigation/native";
import MyTabs from "../rankings/_layout";
import Account from "../../components/Account";
import { Session } from "@supabase/supabase-js";
import { EvilIcons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Me() {
  const navigation = useNavigation();
  const [rankedNumber, setRankedNumber] = useState(null);
  const [friendNumber, setFriendNumber] = useState(null);
  const [wishlistNumber, setWishlistNumber] = useState(null);
  const [myPostData, setMyPostData] = useState(null);
  const [numbersFetched, setNumbersFetched] = useState(false);
  const [infoFetched, setInfoFetched] = useState(false);
  const [showAccountPage, setShowAccountPage] = useState(false);
  const [session, setSession] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const fetchData = async () => {
        const profileInfo = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id);
        setProfileData(profileInfo.data);
        const friendNumber = profileInfo.data[0]["friend_ids"]
          ? profileInfo.data[0]["friend_ids"].length
          : 0;
        setFriendNumber(friendNumber);

        const myPosts = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", session.user.id);
        setMyPostData(myPosts.data);

        setInfoFetched(true);
      };
      fetchData();
    });
  }, []);

  const toggleFollow = () => {
    setIsFollowed(!isFollowed);
  };

  useEffect(() => {
    const fetchNumbers = async () => {
      const rankings = await supabase
        .from("rankings")
        .select("*", { count: "exact", head: true });

      const friends = await supabase
        .from("friends")
        .select("*", { count: "exact", head: true });

      const wishlist = await supabase
        .from("wishlist")
        .select("*", { count: "exact", head: true });

      setRankedNumber(rankings.count);
      setWishlistNumber(wishlist.count);
      setNumbersFetched(true);
    };
    fetchNumbers();
  }, []);

  async function accountPage() {
    setShowAccountPage(true);
  }

  if (showAccountPage) {
    return (
      <View>
        <Account key={session.user.id} session={session} />
      </View>
    );
  }

  if (!numbersFetched || !infoFetched) {
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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0e0111", "#311866"]}
        style={[styles.container, { paddingHorizontal: 8 }]}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <Pressable onPress={accountPage} style={styles.titleBar}>
              <FontAwesome name="gear" size={24} color="white" />
            </Pressable>

            <View style={styles.centeredView}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{
                    uri: profileData[0].avatar_url,
                  }}
                  style={styles.profileImage}
                />
                <Pressable
                  style={styles.cameraIcon}
                  onPress={() => console.log("Camera icon pressed")}
                >
                  <EvilIcons name="camera" size={24} color="black" />
                </Pressable>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <Pressable
                style={styles.statsBox}
                onPress={() => navigation.navigate("rankings")}
              >
                <View style={styles.statsBox}>
                  <Text style={[styles.text, { fontSize: 18 }]}>
                    {rankedNumber}
                  </Text>
                  <Text style={[styles.text, styles.subText]}>Ranked</Text>
                </View>
              </Pressable>

              <Text style={[styles.text, { fontWeight: "400", fontSize: 28 }]}>
                {profileData[0].username}
              </Text>

              <View
                style={[
                  styles.statsBox,
                  {
                    // borderColor: "white",
                    // borderLeftWidth: 1,
                    // borderRightWidth: 1,
                  },
                ]}
              >
                <Pressable
                  style={[styles.statsBox]}
                  onPress={() => navigation.navigate("people")}
                >
                  <Text style={[styles.text, { fontSize: 18 }]}>
                    {friendNumber}
                  </Text>
                  <Text style={[styles.text, styles.subText]}>Friends</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable
              style={[styles.button, styles.followButton]}
              onPress={toggleFollow}
            >
              <Text style={[styles.text, styles.followButtonText]}>
                {isFollowed ? "Added" : "Add"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.messageButton]}
              onPress={() => console.log("Message button pressed")}
            >
              <Text style={[styles.text, styles.messageButtonText]}>
                Rankings
              </Text>
            </Pressable>
          </View>
          <Text style={[styles.subText, styles.recent]}>About</Text>
          <View style={styles.rectangleContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.rectangleText}>
                some info about me: i love horror films!
              </Text>
            </View>
            <View style={styles.centerContainer}>
              <View style={styles.rectangleLine} />
            </View>
            <View style={styles.rightContainer}>
              <View style={styles.wishlistInfo}>
                <Pressable
                  style={styles.statsBox}
                  onPress={() =>
                    navigation.navigate("rankings", { screen: "My Wishlist" })
                  }
                >
                  <Text style={[styles.text, { fontSize: 18 }]}>
                    {wishlistNumber}
                  </Text>
                  <Text style={[styles.text, styles.subText]}>Wishlist</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <View style={styles.postBar}>
              <Text style={[styles.subText, styles.recent]}>Posts</Text>
              {myPostData.map((item) => (
                <ProfilePost
                  key={item.id}
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
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderColor: "red",
    flex: 0.5,
  },
  info: {
    borderColor: "green",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBotton: 20,
  },
  followButtonText: {
    color: "#0E0111",
    fontWeight: "bold",
    fontSize: 18,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  followButton: {
    backgroundColor: "#858AE3",
    width: 120,
    marginRight: 20,
  },
  messageButton: {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "#97DFFC",
    width: 120,
    marginLeft: 20,
  },
  messageButtonText: {
    color: "#97DFFC",
    fontWeight: "bold",
    fontSize: 18,
  },
  rectangleContainer: {
    marginTop: 10,
    backgroundColor: "#97DFFC33",
    borderRadius: 40,
    paddingHorizontal: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  leftContainer: {
    flex: 2,
    justifyContent: "center",
    paddingLeft: 10,
  },
  centerContainer: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 5,
    paddingRight: 10,
  },
  rectangleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  rectangleLine: {
    width: 3,
    backgroundColor: "#858AE3",
    height: "30%",
    alignSelf: "center",
  },
  wishlistInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  postBar: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  text: {
    color: "white",
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 0.32,
  },
  linearGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  profileImageContainer: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  cameraIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 6,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 0.4,
    marginTop: 20,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
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
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
});
