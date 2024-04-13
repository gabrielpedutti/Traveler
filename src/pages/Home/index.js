import { View, Text, Image, ScrollView } from "react-native";
import HeaderFixo from "../../components/HeaderFixo";
import ItemViagem from "../../components/ItemViagem/index";
import BotaoAdicionar from "../../components/BotaoAdicionar";

import { styles } from "./styles";

function Home(){
  return(
    <View>
      <ScrollView>
        <HeaderFixo />
        <Text style={styles.text}>Viagens</Text>

        <View style={styles.linha}>
          <Image
          style={styles.img}
          source={require('../../assets/RioDeJaneiro.jpeg')}
          />
          <ItemViagem destino = "Rio de Janeiro" data = "25/03/2025" tipoTransporte = "Voo" numeroBilhete = "AA015" tipoHospedagem = "Hotel" nomeHospedagem = "Copacabana Palace" pagina = "ResumoViagem" />
        </View>

        <View style={styles.linha}>
          <Image
          style={styles.img}
          source={require('../../assets/Curitiba.jpg')}
          />
          <ItemViagem destino = "Curitiba" data = "15/05/2025" tipoTransporte = "Voo" numeroBilhete = "AA016" tipoHospedagem = "Hotel" nomeHospedagem = "Andrade CWB Hotel" pagina = "ResumoViagem" />
        </View>

        <View style={styles.linha}>
          <Image
          style={styles.img}
          source={require('../../assets/Fortaleza.jpg')}
          />
          <ItemViagem destino = "Fortaleza" data = "07/06/2025" tipoTransporte = "Voo" numeroBilhete = "AA017" tipoHospedagem = "Hotel" nomeHospedagem = "Fortaleza Palace" pagina = "ResumoViagem" />
        </View>

        <View style={styles.linha}>
          <Image
          style={styles.img}
          source={require('../../assets/FernandoDeNoronha.jpg')}
          />
          <ItemViagem destino = "Fernando de Noronha" data = "27/07/2025" tipoTransporte = "Voo" numeroBilhete = "AA018" tipoHospedagem = "Hotel" nomeHospedagem = "Noronha Palace" pagina = "LoResumoViagemgin" />
        </View>

        <View style={styles.linha}>
          <Image
          style={styles.img}
          source={require('../../assets/Acre.jpg')}
          />
          <ItemViagem destino = "Acre" data = "03/10/2025" tipoTransporte = "Voo" numeroBilhete = "AA019" tipoHospedagem = "Hotel" nomeHospedagem = "Acre Palace" pagina = "ResumoViagem" />
        </View>

        <View style={styles.linha}>
          <Image
          style={styles.img}
          source={require('../../assets/RioDeJaneiro.jpeg')}
          />
          <ItemViagem destino = "Rio de Janeiro" data = "25/03/2025" tipoTransporte = "Voo" numeroBilhete = "AA015" tipoHospedagem = "Hotel" nomeHospedagem = "Copacabana Palace" pagina = "LogResumoViagemin" />
        </View>

        <View style={styles.linha}>
          <Image
          style={styles.img}
          source={require('../../assets/Curitiba.jpg')}
          />
          <ItemViagem destino = "Curitiba" data = "15/05/2025" tipoTransporte = "Voo" numeroBilhete = "AA016" tipoHospedagem = "Hotel" nomeHospedagem = "Andrade CWB Hotel" pagina = "ResumoViagem" />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <BotaoAdicionar />
      </View>
    </View>
  )
}

export default Home;