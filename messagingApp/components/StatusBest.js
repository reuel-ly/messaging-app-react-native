import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { StatusBar } from "expo-status-bar";

export default function Status() {
  const [isConnected, setIsConnected] = useState(null);
  const [connectionType, setConnectionType] = useState("");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
    });

    return () => unsubscribe();
  }, []);

  const getStatusText = () => {
    if (isConnected === null) return "Checking network...";
    if (!isConnected) return "No Internet Connection";
    return `Connected (${connectionType})`;
  };

  return (
    <>
      {/* Device Status Bar */}
      <StatusBar style="light" />

      {/* Custom Status Component */}
      <View
        style={[
          styles.container,
          { backgroundColor: isConnected ? "#2ecc71" : "#e74c3c" }
        ]}
      >
        <Text style={styles.text}>{getStatusText()}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },

});