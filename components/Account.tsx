import { useState, useEffect } from "react";
import supabase from "../Supabase";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Dimensions,
  TouchableHighlight,
  SafeAreaView,
} from "react-native";
import { Button, Input } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { Session } from "@supabase/supabase-js";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={["#0E0111", "#311866"]}
      style={[styles.container, { paddingHorizontal: windowWidth * 0.1 }]}
    >
      <Text style={styles.title}>Edit Account</Text>
      <SafeAreaView style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Username"
            value={username || ""}
            labelStyle={styles.textWhite}
            onChangeText={(text) => setUsername(text)}
            inputStyle={styles.textWhite}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Email"
            value={session?.user?.email}
            disabled
            labelStyle={styles.textWhite}
            inputStyle={styles.textWhite}
          />
        </View>

        <View style={[styles.buttonSpaced, styles.mt20]}>
          <TouchableHighlight
            activeOpacity={0.6} // Adjust the opacity as needed
            underlayColor="transparent" // Set the underlay color to transparent
          >
            <Button
              title={loading ? "Loading ..." : "Update"}
              onPress={() =>
                updateProfile({ username, website, avatar_url: avatarUrl })
              }
              disabled={loading}
              titleStyle={{ color: "#0E0111" }} // Change text color
              buttonStyle={{
                backgroundColor: "#858AE3", // Change background color
                borderRadius: windowWidth * 0.05,
                height: windowHeight * 0.07,
                paddingHorizontal: windowWidth * 0.05,
              }}
            />
          </TouchableHighlight>
        </View>

        <View style={styles.buttonSpaced}>
          <TouchableHighlight
            activeOpacity={0.6} // Adjust the opacity as needed
            underlayColor="transparent" // Set the underlay color to transparent
          >
            <Button
              title="Sign Out"
              onPress={() => supabase.auth.signOut()}
              titleStyle={{ color: "#97DFFC" }} // Change text color
              disabled={loading}
              buttonStyle={{
                backgroundColor: "transparent",
                borderColor: "#97DFFC", // Change outline color
                borderWidth: 2,
                borderRadius: windowWidth * 0.05,
                height: windowHeight * 0.07,
                paddingHorizontal: windowWidth * 0.05,
              }}
            />
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: windowWidth * 0.08,
    fontWeight: "bold",
    marginBottom: windowHeight * 0.04,
    marginTop: windowHeight * 0.06,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  textWhite: {
    color: "white",
  },
  verticallySpaced: {
    paddingHorizontal: windowWidth * 0.1,
    paddingTop: windowHeight * 0.005,
    paddingBottom: windowHeight * 0.01,
    alignSelf: "stretch",
  },
  buttonSpaced: {
    paddingHorizontal: windowWidth * 0.1,
    paddingTop: windowHeight * 0.005,
    paddingBottom: windowHeight * 0.015,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: windowHeight * 0.02,
  },
});
