import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BaseCadastroViagem from "../pages/BaseCadastroViagem";
import Home from "../pages/Home";
import MenuPerfil from "../pages/MenuPerfil";

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="CadastroViagem" component={BaseCadastroViagem} />
      <Tab.Screen name="Perfil" component={MenuPerfil} />
    </Tab.Navigator>
  );
}

export default Tabs;