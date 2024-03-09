import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const FilterCell = ({ genre, onPressRemove }) => {
  return (
    <View style={styles.filterCell}>
      <Pressable style={{ flexDirection: "row" }} onPress={onPressRemove}>
        <Text>{genre}</Text>

        <Text style={styles.removeText}>x</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  filterCell: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgrey",
    padding: 5,
    margin: 5,
    borderRadius: 10,
  },
  removeText: {
    marginLeft: 5,
    fontWeight: "bold",
    color: "black",
  },
});

export default FilterCell;
