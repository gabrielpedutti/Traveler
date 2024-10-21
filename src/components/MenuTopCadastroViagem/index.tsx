import { View, Text, TextInput } from "react-native";

import { styles } from "./styles";
import CadastroHospedagem from "../../pages/CadastroHospedagem";
import CadastroTransporte from "../../pages/CadastroTransporte";
import CadastroTurismo from "../../pages/CadastroTurismo";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function MenuTopCadastroViagem(props) {
  return(
    <View style={{ flex: 1 }}>
      <NavigationContainer independent={true}>
        <Tab.Navigator>
          <Tab.Screen name='Cadastro Transporte' component={CadastroTransporte} />
          <Tab.Screen name='Cadastro Hospedagem' component={CadastroHospedagem} />
          <Tab.Screen name='Cadastro Turismo' component={CadastroTurismo} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  )
}

export default MenuTopCadastroViagem;

