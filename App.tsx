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
        </Stack.Navigator>
      </CadastroProvider>
    </NavigationContainer>
  );
}
