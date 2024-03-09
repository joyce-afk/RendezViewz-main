import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MovieDetails = ({ item }) => {
  const renderWriters = () => {
    if (item.Writer === "N/A") {
      return null;
    }

    const writers = item.Writer.split(",").map((writer, index) => (
      <Text key={index} style={styles.name} numberOfLines={1}>
        {writer.trim()}
      </Text>
    ));

    return (
      <View style={styles.writerContainer}>
        <Text style={styles.castPosition}>
          {item.Writer.includes(",") ? "Writers:" : "Writer:"}
        </Text>
        <View style={styles.writerList}>{writers}</View>
      </View>
    );
  };

  const renderGenreList = () => {
    if (!item.Genre || item.Genre === "N/A") {
      return null;
    }

    const genres = item.Genre.map((genre, index) => (
      <View key={index} style={styles.genreItem}>
        {index > 0 && <Text style={styles.genreText}> • </Text>}
        <Text style={styles.genreText}>{genre.trim()}</Text>
      </View>
    ));

    return <View style={styles.genreBox}>{genres}</View>;
  };

  const renderCast = () => {
    return renderListWithEllipsis(item.Actors, "Cast:");
  };

  const renderListWithEllipsis = (list, label) => {
    if (list === "N/A") {
      return null;
    }

    const items = list.split(",").map((item, index) => (
      <Text key={index} style={styles.name} numberOfLines={1}>
        {item.trim()}
      </Text>
    ));
    return (
      <View>
        <Text style={styles.castPosition}>{label}</Text>
        <View style={styles.columnList}>{items}</View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0E0111", "#311866"]}
        style={{ flex: 1 }}
        start={[0, 0]}
        end={[1, 1]}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.posterBackgroundContainer}>
            <Image
              source={{ uri: item.Poster }}
              style={styles.posterBackground}
              blurRadius={5}
            />
            <View style={styles.posterContainer}>
              <Image source={{ uri: item.Poster }} style={styles.poster} />
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{item.Title}</Text>
              <View style={styles.genreContainer}>{renderGenreList()}</View>
            </View>
            <View style={styles.lowerBody}>
              <View style={styles.plotBox}>
                <Text style={styles.subheading}>
                  {item.Year} • {item.Rated}
                  {item.Runtime !== "N/A" &&
                    item.Runtime !== "1 min" &&
                    ` • ${item.Runtime}`}
                </Text>
                <Text style={styles.plotText}>{item.Plot}</Text>
              </View>
            </View>
            <View style={styles.peopleContainer}>
              {item.Director !== "N/A" && (
                <View style={styles.directorContainer}>
                  <Text style={styles.castPosition}> Director: </Text>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.Director}
                  </Text>
                </View>
              )}
              {renderWriters()}
              {renderCast()}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  title: {
    textAlign: "left",
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    borderColor: "white",
    marginBottom: 5,
    textAlign: "center",
  },
  genreContainer: {
    backgroundColor: "#97DFFC",
    borderRadius: 10,
    padding: 5,
    marginBottom: 13,
  },
  subheading: {
    fontSize: 18,
    color: "white",
    padding: 5,
  },
  body: {
    width: windowWidth,
    flex: 1,
    padding: 12,
  },
  upperBody: {
    flexDirection: "row",
    width: "100%",
    marginVertical: windowHeight * 0.02,
    gap: 10,
  },
  posterBackgroundContainer: {
    position: "relative",
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  posterBackground: {
    position: "absolute",
    width: windowWidth,
    height: windowHeight * 0.5,
    resizeMode: "cover",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  posterContainer: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    overflow: "hidden",
    marginTop: 0, // Adjust as necessary
  },
  poster: {
    height: windowHeight * 0.5,
    width: windowWidth * 0.9, // Adjust width as necessary to maintain aspect ratio
    resizeMode: "contain",
  },
  // buttonContainer: {
  //   position: "absolute",
  //   height: 60,
  //   aspectRatio: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   bottom: windowHeight * 0.05,
  //   right: windowWidth * 0.05,
  //   backgroundColor: "transparent",
  // },
  // plusButton: {
  //   borderRadius: 100,
  //   backgroundColor: "white",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  peopleContainer: {
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    padding: 20,
    gap: windowHeight * 0.02,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  name: {
    marginLeft: 15,
    color: "white",
    fontSize: 15,
  },
  castPosition: {
    marginLeft: 5,
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  lowerBody: {
    gap: windowHeight * 0.02,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    padding: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 10,
  },
  detailsContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  genreBox: {
    flexDirection: "row",
  },
  genreItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  genreText: {
    color: "000814",
    marginHorizontal: 5,
    fontSize: 15,
    fontWeight: "bold",
  },
  plotText: {
    marginLeft: 5,
    flexWrap: "wrap",
    color: "white",
    fontSize: 15,
  },
});

export default MovieDetails;
