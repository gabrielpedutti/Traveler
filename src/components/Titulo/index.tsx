import { View, Text } from 'react-native';

import { styles } from './styles';

function Titulo(props) {
  return(
    <View>
      <Text style={styles.titulo}>{props.texto}</Text>
      <View style={styles.divisao}></View>
    </View>
  )
}

export default Titulo;