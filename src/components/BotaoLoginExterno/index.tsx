import { ReactNode } from "react";
import { Pressable } from "react-native";

interface BotaoLoginExternoProps {
  icone: ReactNode;
  onPress: () => void;
}

function BotaoLoginExterno(props: BotaoLoginExternoProps) {
  return(
    <Pressable onPress={props.onPress}>
      {props.icone}
    </Pressable>
  )
}

export default BotaoLoginExterno;