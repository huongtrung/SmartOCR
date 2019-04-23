import React from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";

const styles = {
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        marginTop: 20
      }
    })
  },
  horizontal: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  loading: {
    marginBottom: 10
  }
};
const LoadingView = props => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" color="#0000ff" style={styles.loading}/>
    <Text>{props.text}</Text>
  </View>
);

export default LoadingView;
