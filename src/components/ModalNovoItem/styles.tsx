import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3838386e',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  container: {
    width: '75%',
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: '#2b88d9',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    padding: 10,
    paddingStart: 20,
    borderBottomColor: '#cacaca',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});