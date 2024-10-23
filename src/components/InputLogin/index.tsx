import { View, Text, TextInput } from "react-native";
import { styles } from "./styles";

interface InputProps {
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  icon: any;
  value: string;
  onBlur: () => void;
}

function Input(props: InputProps): JSX.Element {
  return(
    <View style={styles.wrapper}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          placeholder={props.placeholder}
          onChangeText={props.onChangeText}
          secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
          value={props.value}
          onBlur={props.onBlur}
        />
        <View style={styles.icon}>{props.icon}</View>
      </View>
    </View>
  )
}

export default Input;