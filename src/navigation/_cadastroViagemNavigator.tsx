import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CadastroViagemProvider from "../contexts/cadastroViagem";
import CadastroViagem from "../pages/CadastroViagem";
import CadastroHospedagem from "../pages/CadastroHospedagem";
import CadastroTurismo from "../pages/CadastroTurismo";
import CadastroTransporte from "../pages/CadastroTransporte";

const Stack = createNativeStackNavigator();

function CadastroViagemNavigator() {
  return(
    <CadastroViagemProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="CadastroViagem"
          component={CadastroViagem}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CadastroHospedagem"
          component={CadastroHospedagem}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CadastroTurismo"
          component={CadastroTurismo}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CadastroTransporte"
          component={CadastroTransporte}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator> 
    </CadastroViagemProvider>
  )
}

export default CadastroViagemNavigator;