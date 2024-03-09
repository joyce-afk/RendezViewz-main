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
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";
import { useState, useEffect, useCallback, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import supabase from "../../Supabase";
import Ranking from "../../components/Ranking";
import FilterModal from "../../components/filterModal";
import FilterCell from "../../components/FilterCell";
import getMovieDetails from "../../components/getMovieDetails";
import searchByTitle from "../../components/searchByTitle";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UNDERLINE = require("../../assets/underline.png");

export default function Rankings() {
  const navigation = useNavigation();
  const flatListRef = useRef();

  const [isDuplicateEntry, setIsDuplicateEntry] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [data, setData] = useState([]);
  const [entry, setEntry] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [visibleSuggestions, setVisibleSuggestions] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectionChosen, setSelectionChosen] = useState(false);
  const [rankValue, setRankValue] = useState(5);
  const [sliderDisplayValue, setSliderDisplayValue] = useState(
    rankValue.toString()
  );
  const [modalValid, setModalValid] = useState(false);
  const [renderSwitch, flipRenderSwitch] = useState(false);

  const [session, setSession] = useState(null);
  const [rankings, setRankings] = useState(null);

  const handleRecordUpdated = (payload) => {
    // console.log(payload);
    // setFriendIDs(payload.new.friend_ids);

    setRankings((oldData) => {
      return oldData.map((item) => {
        if (item.id === payload.new.id) {
          return payload.new;
        }
        return item;
      });
    });
  };

  const handleRecordInserted = (payload) => {
    // console.log(payload.new);
    setRankings((rankings) => [...rankings, payload.new]);
  };

  const handleRecordDeleted = (payload) => {
    // console.log(payload);
    setRankings((oldData) =>
      oldData.filter((item) => item.id !== payload.old.id)
    );
  };

  useEffect(() => {
    supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rankings" },
        handleRecordUpdated
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "rankings" },
        handleRecordInserted
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "rankings" },
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

        // console.log("this is RANKINGS", rankings.data);
        setRankings(rankings.data);
        // filter out the current user
        // setFriendIDs(friends.data[0].friend_ids);

        const sortedData = rankings.data.sort((a, b) => b.rating - a.rating);
        sortedData.forEach((item, index = 0) => {
          item.index = index + 1;
        });
        // console.log("this is sortedDATA", sortedData);
        setData(sortedData);
      };
      fetchRankings();
    });
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await supabase
  //       .from("rankings")
  //       .select("*")
  //       .eq("user_id", session.user.id);
  //     const sortedData = response.data.sort((a, b) => b.rating - a.rating);

  //     sortedData.forEach((item, index = 0) => {
  //       item.index = index + 1;
  //     });

  //     setData(sortedData);
  //   };
  //   fetchData();
  // }, [renderSwitch, entry]);

  //button wil stay grey until these conitions are met
  useEffect(() => {
    if (selectionChosen && rankValue <= 10 && rankValue >= 0) {
      const isDuplicate = data.some((item) => item.title === entry);
      setIsDuplicateEntry(isDuplicate);
      setModalValid(true);
    } else {
      setIsDuplicateEntry(false);
      setModalValid(false);
    }
  }, [entry, rankValue, data]);

  // get top 10 matches to textInput
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query) {
        const results = await searchByTitle(query.trim());
        setSuggestions(results);
        setVisibleSuggestions(true); //show suggestions when user stops typing
      }
    }, 1000),
    []
  );

  // dropdown visibility
  useEffect(() => {
    if (entry && !selectionChosen) {
      setVisibleSuggestions(false);
      fetchSuggestions(entry);
    } else {
      setSuggestions([]);
    }

    return () => fetchSuggestions.cancel();
  }, [entry, fetchSuggestions]);

  const sliderDisplaySubmit = (e) => {
    const submittedValue = parseFloat(e.nativeEvent.text);
    if (!isNaN(submittedValue) && submittedValue >= 0 && submittedValue <= 10) {
      setRankValue(submittedValue);
      setSliderDisplayValue(submittedValue.toString());
    } else if (submittedValue > 10) {
      setRankValue(10);
      setSliderDisplayValue("10");
    } else if (submittedValue < 0) {
      setRankValue(0);
      setSliderDisplayValue("0");
    } else {
      // Optionally, reset to the last valid value
      setSliderDisplayValue(rankValue.toString());
    }
  };

  const handleRank = async () => {
    const movieDetails = await getMovieDetails(entry);

    closeModal();

    if (!movieDetails || movieDetails.Response === "False") {
      Alert.alert("Invalid Title", "Please enter a valid movie or show title.");
      return;
    }

    if (isDuplicateEntry) {
      Alert.alert(`${entry} is already ranked on this list.`);
      return;
    }

    newId = Date.now();

    const { data: upsertedData } = await supabase.from("rankings").upsert([
      {
        id: newId,
        title: movieDetails.Title,
        index: 0,
        url: movieDetails.Poster,
        rating: parseFloat(rankValue),
        genres: movieDetails.Genre,
        user_id: session.user.id,
      },
    ]);

    let response = await supabase
      .from("rankings")
      .select("*")
      .eq("user_id", session.user.id);
    let newSortedData = response.data.sort((a, b) => b.rating - a.rating);

    newSortedData.forEach((item, index = 0) => {
      item.index = index + 1;
    });

    // setRankings((oldData) => [...oldData, payload.new]);
    setData(newSortedData);

    // await supabase.from("rankings").upsert(sortedData);

    flipRenderSwitch(!renderSwitch);
    setRankValue(5);
  };
  //Animation for switching between slider and dropdown
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [visibleSuggestions]);

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

  //close modal
  const closeModal = () => {
    setSelectedYear("");
    setRankValue(5);
    setSliderDisplayValue("5");
    setVisibleSuggestions(false);
    setModalVisible(false);
  };

  useEffect(() => {
    console.log(`Modal visibility changed: ${modalVisible}`);
  }, [modalVisible]);

  const handleDelete = async (id, index) => {
    await supabase.from("rankings").delete().eq("id", id);

    let response = await supabase
      .from("rankings")
      .select("*")
      .eq("user_id", session.user.id);
    sortedData = response.data.sort((a, b) => b.rating - a.rating);

    sortedData.forEach((item, index = 0) => {
      item.index = index + 1;
    });
    // await supabase.from("rankings").upsert(sortedData);

    setData(sortedData);
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  //for rating slider in
  const debouncedSetRankValue = debounce((value) => {
    setRankValue(value);
  }, 100);

  //create filter list
  const createFilterList = async () => {
    let response = await supabase.from("rankings").select("*");

    const genreSet = new Set();

    response.data.forEach((item) => {
      item.genres.forEach((genre) => genreSet.add(genre));
    });

    setGenreList(Array.from(genreSet).sort());
  };

  const filterByGenres = (data) => {
    let filteredData = data;
    if (selectedGenres.length > 0) {
      filteredData = data.filter((item) =>
        item.genres.some((genre) => selectedGenres.includes(genre))
      );
    }

    filteredData.sort((a, b) => b.rating - a.rating);

    filteredData.forEach((item, index) => {
      item.index = index + 1;
    });
    return filteredData;
  };

  const removeGenre = (genreToRemove) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.filter((genre) => genre !== genreToRemove)
    );
  };

  //loading icon
  if (!data) {
    return (
      <LinearGradient
        colors={["#0e0111", "#311866"]}
        style={[styles.container, { paddingHorizontal: 8 }]}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0E0111" />
          <Text style={{ color: "white" }}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0e0111", "#311866"]}
      style={styles.container}
      onTouchStart={() => {
        Keyboard.dismiss();
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Content</Text>
              <Image style={styles.underline} source={UNDERLINE} />
              <Pressable
                style={styles.buttonCloseContainer}
                onPress={closeModal}
              >
                <View style={styles.buttonClose}>
                  <MaterialIcons name="cancel" size={30} color={"black"} />
                </View>
              </Pressable>
            </View>

            <View style={styles.questionsContainer}>
              <View style={styles.titleSelectContainer}>
                <Text style={styles.titleQuestion}> Enter Title:</Text>
                <View style={styles.titleTextBar}>
                  <TextInput
                    style={[
                      styles.titleDropdown,
                      { color: selectionChosen ? "purple" : "gray" },
                    ]}
                    placeholder="Enter a movie or show title..."
                    placeholderTextColor="gray"
                    value={
                      (entry ? entry : "") +
                      (selectedYear ? ` (${selectedYear})` : "")
                    }
                    onChangeText={(text) => {
                      setEntry(text);
                      setSelectedYear("");
                      setSelectionChosen(false);
                    }}
                  />
                  {entry && (
                    <Pressable
                      style={styles.clearButton}
                      onPress={() => {
                        setEntry("");
                        setSelectedYear("");
                        setSelectionChosen(false);
                        // Optionally reset other states as needed
                        setSuggestions([]);
                        setVisibleSuggestions(false);
                      }}
                    >
                      <MaterialIcons
                        name="cancel"
                        size={25}
                        color={"grey"}
                        style={styles.clearButton}
                      />
                    </Pressable>
                  )}
                </View>
              </View>
              <View style={styles.sharedContainer}>
                {visibleSuggestions ? (
                  suggestions.length > 0 ? (
                    <FlatList
                      data={suggestions}
                      keyExtractor={(item) => item.imdbID}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.suggestionItem}
                          onPress={() => {
                            setEntry(item.Title);
                            setSelectedYear(item.Year);
                            setSuggestions([]);
                            setVisibleSuggestions(false);
                            setSelectionChosen(true);
                          }}
                        >
                          <Image
                            source={
                              item.Poster !== "N/A"
                                ? { uri: item.Poster }
                                : require("../../assets/blankPoster.png")
                            }
                            style={styles.posterImage}
                          />
                          <View style={styles.suggestionText}>
                            <Text numberOfLines={1} style={styles.titleText}>
                              {item.Title}
                            </Text>
                            <Text style={styles.yearText}>({item.Year})</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      style={{ maxHeight: 200 }}
                    />
                  ) : entry !== null && entry.trim() !== "" ? (
                    <View style={styles.noSuggestionsContainer}>
                      <View style={styles.noSuggestionsTextContainer}>
                        <Text style={styles.noSuggestionsText}>
                          No movies or TV shows match that title.
                        </Text>
                      </View>
                    </View>
                  ) : null // Optionally handle the case when there are no suggestions and the entry is empty
                ) : (
                  <>
                    <Text style={styles.titleQuestion}>Your Rating:</Text>
                    <View style={styles.slider}>
                      <TextInput
                        style={styles.sliderDisplay}
                        keyboardType="numeric"
                        onSubmitEditing={sliderDisplaySubmit}
                        onBlur={(e) => sliderDisplaySubmit(e)}
                        returnKeyType="done"
                        onChangeText={(text) => setSliderDisplayValue(text)}
                        value={sliderDisplayValue}
                      ></TextInput>
                      <Slider
                        style={{ width: windowWidth * 0.65, height: 40 }}
                        minimumValue={0}
                        maximumValue={100} // This allows for 0-10 range with decimal points.
                        step={1}
                        minimumTrackTintColor="purple"
                        maximumTrackTintColor="grey"
                        value={rankValue * 10} // Convert the rankValue back to 0-100 scale for the slider.
                        onValueChange={(value) => {
                          const newValue = value / 10; // Convert back to 0-10 scale for rankValue.
                          debouncedSetRankValue(newValue);
                          setSliderDisplayValue(newValue.toFixed(1)); // Update display value, keep one decimal point.
                        }}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>

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
                  Update Ranking
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.filterContainer}>
        <View style={styles.genreBox}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedGenres.map((genre) => (
              <FilterCell
                key={genre}
                genre={genre}
                onPressRemove={() => removeGenre(genre)}
              />
            ))}
          </ScrollView>
        </View>
        <Pressable
          style={styles.filterButton}
          onPress={() => {
            setFilterModal(!filterModal);
            createFilterList();
          }}
        >
          <FontAwesome name="filter" size={18} color="white" />
          <Text style={{ color: "white" }}> Filters</Text>
        </Pressable>
        <FilterModal
          modalVisible={filterModal}
          setModalVisible={setFilterModal}
          genreList={genreList}
          exportGenres={setSelectedGenres}
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={filterByGenres(data)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Ranking
            index={item.index}
            title={item.title}
            coverPic={item.url}
            onDelete={() => handleDelete(item.id, item.index)}
            rating={item.rating}
            goesTo={"Ranking Details"}
          />
        )}
        style={styles.rankList}
        contentContainerStyle={{
          paddingHorizontal: windowWidth * 0.02,
          paddingBottom: 80,
        }}
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
    height: windowHeight * 0.6,
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
    borderColor: "#0E0111",
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
    color: "#0E0111",
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
    color: "#0E0111",
    marginLeft: 17,
  },
  titleTextBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingLeft: 15,
    paddingRight: 5,
    backgroundColor: "#0E0111",
    height: 60,
    borderRadius: 15,
    borderWidth: 0.5,
  },
  titleDropdown: {
    flex: 1,
    color: "#0E0111",
  },
  clearButton: {
    marginLeft: 10,
    marginRight: 0,
    padding: 0,
  },
  clearButtonText: {
    color: "darkgray",
    fontSize: 20,
  },
  sharedContainer: {
    height: 200,
    marginLeft: 10,
    width: "90%",
    gap: 30,
    justifyContent: "center",
  },
  suggestionsContainer: {
    maxHeight: 200,
    width: "80%",
    position: "absolute",
    top: "100%",
    zIndex: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  posterImage: {
    height: 60,
    width: 35,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "grey",
  },
  suggestionItem: {
    padding: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 2,
  },
  noSuggestionsContainer: {
    width: "100%",
    alignItems: "center",
  },
  noSuggestionsTextContainer: {
    justifyContent: "center",
    width: windowWidth * 0.5,
  },
  noSuggestionsText: {
    textAlign: "center",
    fontSize: 20,
    color: "gray",
  },
  slider: {
    alignItems: "center",
    gap: 10,
  },
  sliderDisplay: {
    padding: 10,
    fontSize: 28,
    color: "purple",
    borderWidth: 1,
    borderRadius: 15,
    width: windowWidth * 0.2,
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "lavender",
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
  filterContainer: {
    // backgroundColor: "#361866",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: windowHeight * 0.05,
    paddingHorizontal: windowWidth * 0.02,
  },
  filterButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    gap: 3,
    marginLeft: "auto",
    backgroundColor: "#361866",
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginVertical: 3,
    borderRadius: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
  genreBox: {
    flexDirection: "row",
    marginRight: 10,
    width: "72%",
  },
  container: {
    flex: 1,
  },
});
