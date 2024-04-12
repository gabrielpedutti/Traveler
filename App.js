import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CadastroProvider from './src/contexts/cadastro';
import Login from './src/pages/Login';
import Cadastro from './src/pages/Cadastro';
import Home from './src/pages/Home';
import MenuPerfil from './src/pages/MenuPerfil';
import MenuPrincipal from './src/pages/MenuPrincipal';

const Stack = createNativeStackNavigator();

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
        </Stack.Navigator>
      </CadastroProvider>
    </NavigationContainer>
  );
}
