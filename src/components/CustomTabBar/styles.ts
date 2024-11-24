import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 12,
    color: "#2c88d9",
    marginTop: 5,
  },
});

export { styles };