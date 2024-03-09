import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";

const CustomModal = ({
  modalVisible,
  closeModal,
  handleSelectedPeople,
  plist,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [flatListData, setFlatListData] = useState([]);

  useEffect(() => {
    setFlatListData(plist);
  }, [plist]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.persona}>
        <Image source={{ uri: item.photo }} style={styles.personImage} />
        <Text style={styles.personName}>{item.label}</Text>
      </View>
      <CheckBox
        checked={selectedItems.includes(item.value)}
        onPress={() => toggleCheckbox(item.value)}
        checkedColor="purple"
      />
    </View>
  );

  const toggleCheckbox = (value) => {
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter((item) => item !== value));
    } else {
      setSelectedItems([...selectedItems, value]);
    }
  };

  const handleSearchInput = (text) => {
    setSearchInput(text); // Update temporary search input
  };

  const handleSearch = () => {
    setSearchQuery(searchInput.toLowerCase()); // Set the search query only when the search button is pressed
    const query = searchInput.toLowerCase();
    const filtered = flatListData.filter((item) => {
      const isNameMatch = item.label.toLowerCase().includes(query);
      return isNameMatch;
    });

    setFilteredData(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setFilteredData([]);
  };

  const handleConfirm = () => {
    const selectedPeople = flatListData.filter((item) =>
      selectedItems.includes(item.value)
    );
    console.log("Selected People:", selectedPeople);
    handleSelectedPeople(selectedItems);
    closeModal(); // Close the modal after printing the selected people
    // Pass selected people to the parent component
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}></View>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.searchArea}>
            <Text style={styles.selectFriendsText}>
              Select friends to join your party!
            </Text>
            <View style={styles.searchContainer}>
              <TextInput
                numberOfLines={1}
                style={{ color: "purple", textAlign: "left", width: "85%" }}
                placeholder="Search event by name"
                placeholderTextColor="gray"
                returnKeyType="search"
                value={searchInput}
                onChangeText={handleSearchInput}
                onSubmitEditing={handleSearch}
              />
              <View style={styles.buttons}>
                <Pressable style={styles.searchbutton} onPress={clearSearch}>
                  <View style={styles.searchbutton}>
                    <Entypo name="cross" size={24} color="gray" />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
          <View
            contentContainerStyle={styles.scrollViewContent}
            style={{ width: "100%", height: "65%", marginBottom: 10 }}
          >
            <FlatList
              data={searchQuery ? filteredData : flatListData}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
              style={{ width: "100%" }}
              alignSelf="center"
              extraData={searchQuery} // This line ensures re-rendering when searchQuery changes
            />
          </View>
          <Pressable onPress={handleConfirm} style={styles.closebuttoncont}>
            <Text style={styles.closeButton}>Confirm</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    height: "50%",
    width: "95%",
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    color: "white",
  },
  closebuttoncont: {
    height: "10%",
    width: "20%",
    flexDirection: "row",
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  searchArea: {
    height: "20%",
    marginBottom: 10,
  },
  searchContainer: {
    height: "50%",
    width: "85%",
    paddingLeft: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 10,
    borderColor: "purple",
    borderWidth: 2,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //borderColor: "red",
    //borderWidth: 5,
  },
  searchbutton: {
    alignItems: "center",
    justifyContent: "center",
    //borderColor: "red",
    //borderWidth: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  personImage: {
    width: 40,
    height: 40,
    //borderRadius: 25,
    marginHorizontal: 10,
  },
  personName: {
    color: "black",
  },
  persona: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  selectFriendsText: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "purple",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark background
  },
};

export default CustomModal;
