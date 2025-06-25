import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CadastroProvider from './src/contexts/cadastro';
import Login from './src/pages/Login';
import Cadastro from './src/pages/Cadastro';
import CadastroEndereco from './src/pages/CadastroEndereco';
import Home from './src/pages/Home';
import MenuPerfil from './src/pages/MenuPerfil';
import MenuPrincipal from './src/pages/MenuPrincipal';
import ResumoViagem from './src/pages/ResumoViagem';
import BaseCadastroViagem from './src/pages/BaseCadastroViagem';
import { RootStackParamList } from './src/types/RootStackParamList';
import Viagens from './src/pages/Viagens';
import ViagemSelecionada from './src/pages/ViagemSelecionada';
import CadastroViagem from './src/pages/CadastroViagem';
import CadastroHospedagem from './src/pages/CadastroHospedagem';
import CadastroTurismo from './src/pages/CadastroTurismo';
import CadastroTransporte from './src/pages/CadastroTransporte';
// import CadastroViagemNavigator from './src/navigation/cadastroViagemNavigator';
import Tabs from './src/navigation/tabs';
import DetalhesHospedagem from './src/pages/DetalhesHospedagem';
import DetalhesTransporte from './src/pages/DetalhesTransporte';
import DetalhesPasseio from './src/pages/DetalhesPasseio';
import CadastroDespesa from './src/pages/CadastroDespesa';
import EditarTransporte from './src/pages/EditarTransporte';
import EditarHospedagem from './src/pages/EditarHospedagem';
import EditarPasseio from './src/pages/EditarPasseio';
import EditarViagem from './src/pages/EditarViagem';
import FinanceiroViagens from './src/pages/FinanceiroViagens';
import FinanceiroViagemSelecionada from './src/pages/FinanceiroViagemSelecionada';



const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <CadastroProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Cadastro"
            component={Cadastro}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CadastroEndereco"
            component={CadastroEndereco}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MenuPerfil"
            component={MenuPerfil}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MenuPrincipal"
            component={MenuPrincipal}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ResumoViagem"
            component={ResumoViagem}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BaseCadastroViagem"
            component={BaseCadastroViagem}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Viagens"
            component={Viagens}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ViagemSelecionada"
            component={ViagemSelecionada}
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
            name="CadastroViagemNavigator"
            component={CadastroViagemNavigator}
            options={{
              headerShown: false,
            }}
          /> */}
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
          <Stack.Screen
            name="CadastroDespesa"
            component={CadastroDespesa}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetalhesHospedagem"
            component={DetalhesHospedagem}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetalhesTransporte"
            component={DetalhesTransporte}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DetalhesPasseio"
            component={DetalhesPasseio}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditarViagem"
            component={EditarViagem}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditarTransporte"
            component={EditarTransporte}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditarHospedagem"
            component={EditarHospedagem}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditarPasseio"
            component={EditarPasseio}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="FinanceiroViagens"
            component={FinanceiroViagens}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="FinanceiroViagemSelecionada"
            component={FinanceiroViagemSelecionada}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
        {/* <Tabs /> */}
      </CadastroProvider>
    </NavigationContainer>
  );
}
