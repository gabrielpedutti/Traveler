import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

type TabConfig = {
  name: string; // Nome da rota
  iconName: string; // Nome do ícone
  iconLibrary: any; // Biblioteca de ícones (importada)
};

type CustomTabBarProps = {
  state: any; // Estado das rotas do navegador
  descriptors: any; // Descritores das rotas
  navigation: any; // Funções de navegação
  tabsConfig: TabConfig[]; // Configuração dinâmica das abas
};

function CustomTabBar({ state, descriptors, navigation, tabsConfig }: CustomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused: boolean = state.index === index;

        // Encontrar a configuração correspondente ao nome da rota
        const tabConfig = tabsConfig.find((tab) => tab.name === route.name);

        const onPress = () => {
          const emitEvent = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !emitEvent.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            {/* Ícone */}
            {tabConfig && (
              <tabConfig.iconLibrary
                name={tabConfig.iconName}
                size={24}
                color={isFocused ? "#2c88d9" : "#888"}
              />
            )}
            {/* Nome da Aba Apenas se Estiver Selecionada */}
            {isFocused && <Text style={styles.tabLabel}>{route.name}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


export default CustomTabBar;