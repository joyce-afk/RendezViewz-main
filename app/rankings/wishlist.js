import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Dimensions,
  FlatList,
  Image,
  TextInput,
  Keyboard,
  LayoutAnimation,
  ScrollView,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";

import supabase from "../../Supabase";
import Ranking from "../../components/Ranking";
import getMovieDetails from "../../components/getMovieDetails";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UNDERLINE = require("../../assets/underline.png");

export default function Wishlist() {
  const navigation = useNavigation();

  const [isDuplicateEntry, setIsDuplicateEntry] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [possibleEntries, setPossibleEntries] = useState(null);
  const [entry, setEntry] = useState(null);
  const [entryPic, setEntryPic] = useState(null);
  const [rankValue, setRankValue] = useState(null);
  const [rankCount, setRankCount] = useState(null);
  const [modalValid, setModalValid] = useState(false);
  const [renderSwitch, flipRenderSwitch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await supabase.from("wishlist").select("*");
      const sortedData = response.data.sort((a, b) => a.index - b.index);

      setData(sortedData);
      setRankCount(response.data.length);
    };
    fetchData();
  }, [renderSwitch, entry]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await supabase.from("rankable").select("*");
      const sortedMovies = response.data.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });

      setPossibleEntries(sortedMovies);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (entry && rankValue) {
      const isDuplicate = data.some((item) => item.title === entry);
      setIsDuplicateEntry(isDuplicate);
      setModalValid(true);
    } else {
      setIsDuplicateEntry(false);
      setModalValid(false);
    }
  }, [entry, rankValue, data]);

  const handleRank = async () => {
    setModalVisible(!modalVisible); //close modal
    const movieDetails = await getMovieDetails(entry);

    if (!movieDetails || movieDetails.Response === "False") {
      Alert.alert("Invalid Title", "Please enter a valid movie or show title.");
      return;
    }

    if (isDuplicateEntry) {
      Alert.alert(`${entry} is already ranked on this list.`);
      return;
    }
    let newId = Date.now();
    let adjustedRank = parseInt(rankValue);

    let response = await supabase.from("wishlist").select("*");
    let sortedData = response.data.sort((a, b) => a.index - b.index);

    if (adjustedRank > rankCount + 1) {
      adjustedRank = rankCount + 1;
    } else {
      const updatedRankings = sortedData.map((item) => {
        if (item.index >= adjustedRank) {
          item.index += 1;
        }
        return item;
      });
      await supabase.from("wishlist").upsert(updatedRankings);
    }

    const { data } = await supabase.from("wishlist").upsert([
      {
        id: newId,
        title: movieDetails.Title,
        index: adjustedRank,
        url: movieDetails.Poster,
      },
    ]);
    flipRenderSwitch(!renderSwitch);
  };
  //Animation for delete
  const layoutAnimConfig = {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const handleDelete = async (id, index) => {
    await supabase.from("wishlist").delete().eq("id", id);

    let response = await supabase.from("wishlist").select("*");
    sortedData = response.data.sort((a, b) => a.index - b.index);

    const updatedRankings = sortedData.map((item) => {
      if (item.index > index) {
        item.index -= 1;
      }
      return item;
    });
    await supabase.from("wishlist").upsert(updatedRankings);

    setData(updatedRankings);
    LayoutAnimation.configureNext(layoutAnimConfig);
    setRankCount(updatedRankings.length);
  };

  return (
    <LinearGradient
      colors={["#0e0111", "#311866"]}
      style={styles.container}
      onTouchStart={() => {
        Keyboard.dismiss();
      }}
    >
      {modalVisible && (
        <BlurView
          intensity={100}
          tint={"dark"}
          style={StyleSheet.absoluteFill}
        ></BlurView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Content</Text>
              <Image style={styles.underline} source={UNDERLINE} />
              <Pressable
                style={styles.buttonCloseContainer}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <View style={styles.buttonClose}>
                  <MaterialIcons name="cancel" size={30} color={"black"} />
                </View>
              </Pressable>
            </View>

            <ScrollView style={styles.questionsContainer}>
              <View style={styles.titleSelectContainer}>
                <Text style={styles.titleQuestion}> Select Title:</Text>
                <TextInput
                  style={styles.titleDropdown}
                  placeholder="Enter a movie or show title..."
                  placeholderTextColor="gray"
                  value={entry}
                  onChangeText={(text) => {
                    setEntry(text);
                  }}
                />
              </View>
              <View style={styles.titleSelectContainer}>
                <Text style={styles.titleQuestion}> Enter Rank:</Text>
                <TextInput
                  style={styles.rankingInput}
                  keyboardType="numeric"
                  returnKeyType="done"
                  // placeholder="Enter a number"
                  onChangeText={(text) => setRankValue(text)}
                />
                <View style={styles.space}></View>
              </View>
            </ScrollView>

            <View style={styles.bottom}>
              <Pressable
                style={[
                  styles.addButton,
                  { backgroundColor: modalValid ? "#602683" : "gray" },
                ]}
                onPress={handleRank}
                disabled={!modalValid}
              >
                <Text
                  style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
                >
                  Update Wishlist
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Ranking
            index={item.index}
            title={item.title}
            coverPic={item.url}
            onDelete={() => handleDelete(item.id, item.index)}
            goesTo={"Wishlist Details"}
          />
        )}
        style={styles.rankList}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 80 }}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.plusButton}
          onPress={() => {
            setModalVisible(!modalVisible);
            setEntry(null);
          }}
        >
          <AntDesign name="pluscircle" size={60} color="#602683" />
        </Pressable>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: windowHeight * 0.2,
  },
  buttonContainer: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.05,
    right: windowWidth * 0.05,
    backgroundColor: "transparent",
  },
  plusButton: {
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: windowWidth * 0.8,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#361866",
  },
  modalHeader: {
    flexDirection: "row",
    width: windowWidth * 0.8,
    justifyContent: "space-between",
    paddingBottom: 42,
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  modalTitle: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 30,
    color: "#361866",
    textAlign: "center",
  },
  underline: {
    transform: [{ scaleX: -1 }, { rotate: "4deg" }],
    alignSelf: "center",
    position: "absolute",
    top: 45,
    left: 48,
    width: "70%",
    height: 90,
    tintColor: "#361866",
  },
  buttonCloseContainer: {
    position: "absolute",
    color: "white",
    padding: 5,
    width: 80,
    height: 50,
  },
  questionsContainer: {
    // width: "90%",
    // height: windowHeight * 0.0,
    // marginTop: 60,
    // marginBottom: windowHeight * 0.09,
    flex: 8,
    paddingTop: 10,
    paddingBottom: 10,
  },
  titleSelectContainer: {
    width: "100%",
    gap: 8,
    marginBottom: 20,
  },
  titleQuestion: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#361866",
    marginLeft: 17,
  },
  titleDropdown: {
    marginHorizontal: 20,
    paddingLeft: 15,
    backgroundColor: "lavender",
    color: "purple",
    height: 50,
    borderRadius: 15,
    borderWidth: 0.5,
  },
  space: {
    marginBottom: 90,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    color: "#602683",
    marginRight: 5,
    fontSize: 16,
    alignSelf: "center",
  },
  rankingInput: {
    marginHorizontal: 20,
    paddingLeft: 15,
    backgroundColor: "lavender",
    color: "#602683",
    height: 50,
    borderRadius: 15,
    borderWidth: 0.5,
  },
  bottom: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  addButton: {
    alignSelf: "center",
    width: 190,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: windowWidth * 0.02,
    flex: 1,
  },
});
