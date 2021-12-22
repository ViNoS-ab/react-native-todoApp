import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";

export default function App() {
  const [text, onChangeText] = useState("Type your Todo ");
  const [todos, setTodos] = useState([]);

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@tasks", JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@tasks");

      // console.log('inside get promise', jsonValue, JSON.parse(jsonValue))
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (err) {
      console.log(err);
    }
  };

  const addTodo = () => {
    let id = todos[todos.length - 1]?.id || 0;
    let thisId = id * 1 + 1 + "";
    const updatedToDoArray = [...todos, { id: thisId, text }];
    setTodos(updatedToDoArray);
    storeData(updatedToDoArray);
    onChangeText("");
  };

  const remove = (id) => {
    const updatedToDoArray = todos.filter((item) => item.id !== id);
    setTodos(updatedToDoArray);
    storeData(updatedToDoArray);
  };

  useEffect(() => {
    getData().then((storedData) => {
      if (storedData.length > 0) {
        setTodos(storedData);
      }
    });
  }, []);
  //return (<View></View>)
  return (
    <View style={styles.container}>
      <Text style={{ padding: 10, fontSize: 20 }}>My Tasks</Text>
      <View style={styles.addingContainer}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />

        <Pressable onPress={addTodo} style={styles.button} disabled={!text}>
          <Text style={styles.plus}>+</Text>
        </Pressable>
      </View>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <Todo remove={() => remove(item.id)} todo={item} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const Todo = ({ todo: { id, text }, remove }) => {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.todo}>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Pressable
          onPress={() => setChecked(!checked)}
          style={[styles.checkbox, checked && styles.checkboxChecked]}
        ></Pressable>
        <Text
          style={[
            { color: "black" },
            checked && { textDecorationLine: "line-through", color: "grey" },
          ]}
        >
          {text}
        </Text>
      </View>
      <Pressable onPress={remove}>
        <Text>Delete</Text>
      </Pressable>
    </View>
  );
};

const bgColor = "#E9EAED";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: bgColor,
    //  alignItems: "center",
    //  justifyContent: 'center,
  },
  input: {
    width: "70%",
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
  },
  button: {
    borderRadius: 50,
    backgroundColor: "blue",
    width: 50,
    height: 50,
    fontSize: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  plus: {
    color: "#F1F1F1",
    fontSize: 30,
    lineHeight: 35,
  },
  addingContainer: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    paddingBottom: 10,
    backgroundColor: bgColor,
    zIndex: 1,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  todo: {
    backgroundColor: "#FFF",
    padding: 10,
    margin: 3,
    display: "flex",
    alignSelf: "center",
    width: "90%",
    borderRadius: 5,
    borderColor: "#C0C0C0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "white",
    borderColor: "black",
    marginRight: 5,
    borderWidth: 1,
  },
  checkboxChecked: {
    borderColor: "blue",
    backgroundColor: "blue",
  },
});
