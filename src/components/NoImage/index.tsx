import { View } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { styles } from "./styles";

function NoImage() {
  return(
    <View style={styles.noImage}>
      <FontAwesome6 name={'image'} size={25} color='#000' style={styles.icon}/>
    </View>
  )
}

export default NoImage;