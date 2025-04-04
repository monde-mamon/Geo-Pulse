import { ActivityIndicator, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter, useFocusEffect } from "expo-router";
export default function App() {
  const router = useRouter();

  useFocusEffect(() => {
    setTimeout(() => {
      router.push("/map");
    }, 1500);
  }, [router]);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        style={{
          width: 400,
          height: 400,
        }}
        source={require("../../assets/lotties/splash.json")}
      />
      <View style={styles.buttonContainer}>
        <ActivityIndicator size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});
