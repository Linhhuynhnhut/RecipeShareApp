// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  FlatList,
  Dimensions,
  LogBox,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Layout, Text, ViewPager } from "@ui-kitten/components";

// import Carousel from "react-native-snap-carousel";
import React, { useState, useEffect } from "react";

// Sử dụng API để thao tác với Database
// Khi sử dụng database thì phải npm start bên project database
import { api } from "../api/api"; // import api
LogBox.ignoreAllLogs(true);

const slides = [
  {
    index: 0,
    image: require("../../assets/image/food0.png"),
  },
  {
    index: 1,
    image: require("../../assets/image/food1.png"),
  },
  {
    index: 2,
    image: require("../../assets/image/food2.png"),
  },
];
const Item = ({ item }) => {
  return <Image source={item.image} style={styles.imageCard} />;
};

const IntroScreen = ({ navigation, route }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setUserToken(token);
      } catch (error) {
        console.log("Cannot check user session:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [userArr, setUserArr] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / 130);
    setCurrentSlideIndex(currentIndex);
  };

  const pressStart = async () => {
    if (userToken) {
      const users = await api.getAllUsers();
      const user = users.find(
        (user) => user.mail === userToken
      );
      navigation.navigate("Home", {
        myUserId: user._id,
      }); //Nếu tồn tại thì chuyển đến Home
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <>
      <View style={styles.introView}>
        <View style={styles.imageView}>
          <FlatList
            onMomentumScrollEnd={(e) => updateCurrentSlideIndex(e)}
            pagingEnabled
            data={slides}
            renderItem={({ item }) => <Item item={item} />}
            //contentContainerStyle={{ height: height * 0.75 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            //style={{ backgroundColor: "#fff" }}
          />
          {/* <ViewPager
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index)}
          >
            <Layout style={styles.tab} level="2">
              <Item item={slides[0]} />
            </Layout>
            <Layout style={styles.tab} level="2">
              <Item item={slides[1]} />
            </Layout>
            <Layout style={styles.tab} level="2">
              <Item item={slides[2]} />
            </Layout>
          </ViewPager> */}
        </View>

        <Text style={styles.title}>Delicious Food!</Text>
        <Text style={styles.discription}>
          Create and post your recipe to everyone
        </Text>
        <Pressable style={styles.button} onPress={pressStart}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>START</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  introView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2ba35",
    width: "100%",
    height: "100%",
  },
  imageView: {
    width: 300,
    height: 300,
    flexDirection: "column",
    //backgroundColor: "#ccf",
    // padding: 0,
    bottom: 30,
    //alignItems: "center",
  },
  imageCard: {
    width: 300,
    height: 300,
    zIndex: 5,
    //left: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    top: 0,
  },
  discription: {
    fontStyle: "italic",
    top: 0,
  },
  indicatorContainer: {
    height: 50,
    justifyContent: "center",
    flexDirection: "row",
  },
  currentIndicator: {
    height: 12,
    width: 30,
    borderRadius: 10,
    backgroundColor: "#f27e35",
    marginHorizontal: 5,
  },
  indicator: {
    height: 12,
    width: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  button: {
    top: 40,
    backgroundColor: "#f27e35",
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
export default IntroScreen;
