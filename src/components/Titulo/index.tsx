import { View, Text } from 'react-native';

import { styles } from './styles';

interface TituloProps {
  texto: string;
}

function Titulo(props: TituloProps) {
  return(
    <View>
      <Text style={styles.titulo}>{props.texto}</Text>
      <View style={styles.divisao}></View>
    </View>
  )
}

export default Titulo;