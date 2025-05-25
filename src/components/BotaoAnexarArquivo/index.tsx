import { Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { styles } from "./styles";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

interface BotaoAnexarArquivoProps {
  label: string;
  handleAttachDocument: () => void;
  handleDeletarAnexoButton: () => void;
  attachedDocumentName: string;
}

function BotaoAnexarArquivo(props: BotaoAnexarArquivoProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{props.label}</Text>
      <TouchableOpacity onPress={props.handleAttachDocument} style={styles.attachButton}>
        <MaterialCommunityIcons name={'file-document'} size={30} color='#2b88d9'/>
        <Text style={styles.attachButtonText}>Selecionar Arquivo (PDF, Imagem)</Text>
      </TouchableOpacity>
      {props.attachedDocumentName && (
        <View style={styles.attachedFileContainer}>
          <Text style={styles.attachedFileName}>Arquivo Anexado: {props.attachedDocumentName}</Text>
          <TouchableOpacity onPress={props.handleDeletarAnexoButton}><FontAwesome5Icon name="trash" size={20} color="#e75757" /></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default BotaoAnexarArquivo;