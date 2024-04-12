import { View, Text, TextInput } from "react-native";

import { styles } from "./styles";

function Input(props) {
  return(
    <View style={styles.wrapper}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          placeholder={props.placeholder}
          onChangeText={props.onChangeText}
          secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
        />
      </View>
    </View>
  )
}

export default Input;