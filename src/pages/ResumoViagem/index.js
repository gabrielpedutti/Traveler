import { View, Text, Image, ScrollView } from "react-native";
import HeaderFixo from "../../components/HeaderFixo";
import ItemViagem from "../../components/ItemViagem/index";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BotaoAdicionar from "../../components/BotaoAdicionar";


import { styles } from "./styles";

function ResumoViagem(props){
  return(
    <View>
        <HeaderFixo />
        <Image
            style={styles.img}
            source={require('../../assets/RioDeJaneiro.jpeg')}
            />
        <Text style={styles.text}>Rio de Janeiro</Text>

        <View style={styles.linha}>
            <Ionicons style={styles.icone} name='airplane-outline' size={50} color='#2c88d9'/>          
            <ItemViagem destino = "Ida" data = "25/03/2025" tipoTransporte = "Voo" numeroBilhete = "AA015" tipoHospedagem = "Saída" nomeHospedagem = "Congonhas" pagina = "" />
        </View>

        <View style={styles.linha}>
            <Ionicons style={styles.icone} name='business-outline' size={50} color='#2c88d9'/>          
            <ItemViagem destino = "Copacabana" data = "26/03/2025" tipoTransporte = "Check-in" numeroBilhete = "14:00" tipoHospedagem = "Hotel" nomeHospedagem = "Copacabana Palace" pagina = "" />
        </View>

        <View style={styles.linha}>
            <Ionicons style={styles.icone} name='ticket-outline' size={50} color='#2c88d9'/>          
            <ItemViagem destino = "Bondinho" data = "27/03/2025" tipoTransporte = "Horário" numeroBilhete = "16:30" tipoHospedagem = "Local" nomeHospedagem = "Centro do Rio" pagina = "" />
        </View>


    </View>
    )
}

export default ResumoViagem;