import { View, Text, Image } from "react-native";
import { useContext } from "react";
import Header from "../../components/Header";
import { CadastroContext } from '../../contexts/cadastro';
import Divisoria from "../../components/Divisoria";
import ItemMenu from "../../components/ItemMenu";

import { styles } from "./styles";

function MenuPerfil(){

  const { user } = useContext(CadastroContext);
  
  return(
    <View style={styles.container}>
      <Header />
      
        <View style={styles.card}>
          <View>
            <Image
            style={styles.imagem}
            source={require('../../assets/FotoPerfil.jpg')}
            />
          </View>
          <View style={styles.name}>
            <Text style={styles.text}>Olá</Text>
            <Text style={styles.text}>{user.username}!</Text> 
          </View>
        </View>

        <Divisoria />

        <View>
          <ItemMenu label="Notificações" name='notifications-circle-outline' pagina = "" />
          <Divisoria />
          <ItemMenu label="Opções" name='settings-outline' pagina = "" />
          <Divisoria />
          <ItemMenu label="Sobre" name='information-circle-outline' pagina = "" />
          <Divisoria />
          <ItemMenu label="Contato" name='mail-outline' pagina = "" />
        </View>

        <View style={styles.footer}>
        <ItemMenu label="Sair" name='log-out-outline' pagina = "" />
        </View>
    </View>
  )
}

export default MenuPerfil;