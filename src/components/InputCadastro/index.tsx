import { View, Text, TextInput } from "react-native";

import { styles } from "./styles";

interface InputProps {
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  value: string;
  onBlur?: () => void;
  editable?: boolean;
  onPressIn?: () => void;
}

function Input(props: InputProps) {
  return(
    <View style={styles.wrapper}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          placeholder={props.placeholder}
          onChangeText={props.onChangeText}
          secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
          keyboardType={props.keyboardType ? props.keyboardType : "default"}
          value={props.value}
          editable={props.editable}
          onPressIn={props.onPressIn}
        />
      </View>
    </View>
  )
}

export default Input;