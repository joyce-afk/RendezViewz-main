import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import getMovieDetails from "./getMovieDetails";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Ranking = ({ index, title, coverPic, onDelete, goesTo, rating }) => {
  const navigation = useNavigation();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const details = await getMovieDetails(title);
      setMovieDetails(details);
    };

    fetchMovieDetails();
  }, [title]);

  return (
    <View style={styles.container}>
      <View style={styles.indexBox}>
        <Text style={styles.index}>{index}.</Text>
      </View>
      <Pressable
        onPress={() =>
          navigation.navigate(goesTo, {
            details: movieDetails,
          })
        }
      >
        <View style={styles.entry}>
          <View style={styles.coverPicContainer}>
            <Image style={styles.coverPic} source={{ uri: coverPic }} />
          </View>
          <View style={styles.words}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <View style={styles.subtitle}>
              <Text style={styles.rating}>{rating}/10 </Text>
              <Image
                source={require("../assets/star.png")}
                style={styles.star}
              ></Image>
            </View>
          </View>
        </View>
      </Pressable>
      <Pressable style={styles.deleteButtonContainer}>
        <EvilIcons
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              "Delete Entry?",
              `Are you sure you want to remove ${title} from this list?`,

              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: onDelete,
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

export default Ranking;

const styles = StyleSheet.create({
  container: {
    height: windowHeight * 0.1,
    flexDirection: "row",
    backgroundColor: "rgba(217, 217, 217, 0.4)",
    borderColor: "#361866",
    borderRadius: 10,
    marginVertical: windowHeight * 0.002,
    paddingVertical: 4,
    width: "100%",
  },
  index: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  indexBox: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    width: windowWidth * 0.15,
  },
  coverPic: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  coverPicContainer: {
    width: windowWidth * 0.15,
    height: "100%",
  },
  entry: {
    flexDirection: "row",
    gap: 10,
    paddingLeft: 1,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    width: windowWidth * 0.55,
  },
  subtitle: {
    flexDirection: "row",
    paddingTop: 2,
    paddingLeft: 5,
    alignItems: "center",
  },
  rating: {
    color: "lightgrey",
  },
  star: {
    width: 17,
    height: 17,
    resizeMode: "contain",
    tintColor: "purple",
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    bottom: 5,
    width: windowWidth * 0.1,
    height: "50%",
    justifyContent: "center",
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
