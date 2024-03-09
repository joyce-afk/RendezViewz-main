import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import MovieDetails from "../../components/MovieDetails";
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const RankingDetails = ({ route }) => {
  const { details } = route.params;

  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <MovieDetails item={details} />
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

export default RankingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
});
