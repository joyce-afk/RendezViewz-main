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
import { useNavigation } from "@react-navigation/native";
import getMovieDetails from "./getMovieDetails";

const Poster = ({ title, goesTo }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  if (movieDetails) {
  }

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const details = await getMovieDetails(title);
      setMovieDetails(details);
      setIsLoading(false);
    };
    fetchMovieDetails();
  }, [title]);

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
  return imageToRender;
};

export default Poster;

const styles = StyleSheet.create({
  imageContainer: {
    // borderWidth: 1,
    // borderColor: "green",
    width: 90,
    height: 135,
    marginTop: 5,
    marginRight: 10,
  },
  image: {
    // borderWidth: 1,
    // borderColor: "blue",
    width: "100%",
    height: "100%",
  },
});
