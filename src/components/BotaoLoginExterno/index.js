import { Pressable } from "react-native";

function BotaoLoginExterno(props) {
  return(
    <Pressable onPress={props.onPress}>
      {props.icone}
    </Pressable>
  )
}

export default BotaoLoginExterno;