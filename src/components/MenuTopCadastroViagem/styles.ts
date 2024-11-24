import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    marginLeft: 5,
    fontSize: 14,
    color: "#2c88d9",
    fontWeight: "bold",
  },
});
