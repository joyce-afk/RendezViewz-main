import React, { useState } from "react";
import { View, Modal, Text, Pressable, StyleSheet } from "react-native";

function FilterModal({
  modalVisible,
  setModalVisible,
  genreList,
  exportGenres,
}) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenreSelection = (genre) => {
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(genre)) {
        return prevSelectedGenres.filter(
          (selectedGenre) => selectedGenre !== genre
        );
      } else {
        return [...prevSelectedGenres, genre];
      }
    });
  };

  const applyFilters = () => {
    exportGenres(selectedGenres);
    setSelectedGenres([]);
    setModalVisible(false);
  };

  // Function to render genres in two columns
  const renderGenresInColumns = () => {
    const midIndex = Math.ceil(genreList.length / 2);
    return (
      <View style={styles.columnsContainer}>
        <View style={styles.column}>
          {genreList.slice(0, midIndex).map(renderGenre)}
        </View>
        <View style={styles.column}>
          {genreList.slice(midIndex).map(renderGenre)}
        </View>
      </View>
    );
  };

  // Function to render a single genre
  const renderGenre = (genre, index) => (
    <Pressable
      key={index}
      style={[
        styles.genreButton,
        {
          backgroundColor: selectedGenres.includes(genre)
            ? "#602683"
            : "lightgrey",
        },
      ]}
      onPress={() => toggleGenreSelection(genre)}
    >
      <Text
        style={{ color: selectedGenres.includes(genre) ? "white" : "black" }}
      >
        {genre}
      </Text>
    </Pressable>
  );

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Genre</Text>
            {renderGenresInColumns()}
            <Pressable style={styles.applyButton} onPress={applyFilters}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#602683",
    textAlign: "center",
  },
  columnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
  },
  genreButton: {
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  applyButton: {
    alignSelf: "center",
    width: 190,
    height: 50,
    borderRadius: 50,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#602683",
    borderWidth: 1,
    color: "white",
  },
});

export default FilterModal;
