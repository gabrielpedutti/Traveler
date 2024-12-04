import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import CadastroHospedagem from "../../pages/CadastroHospedagem";
import CadastroTransporte from "../../pages/CadastroTransporte";
import CadastroTurismo from "../../pages/CadastroTurismo";
import { styles } from "./styles";
import CustomTabBar from "../CustomTabBar";
import CadastroViagem from "../../pages/CadastroViagem";

const Tab = createMaterialTopTabNavigator();



const MenuTopCadastroViagem: React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} 
       tabsConfig={[
        { name: "Viagem", iconName: "travel-explore", iconLibrary: MaterialIcons },
        { name: "Transporte", iconName: "airplane", iconLibrary: Ionicons },
        { name: "Hospedagem", iconName: "bed", iconLibrary: FontAwesome },
        { name: "Turismo", iconName: "bus", iconLibrary: Ionicons },
      ]}
      />} 
      screenOptions={{
        swipeEnabled: true,
        
      }}>
        <Tab.Screen name="Viagem" component={CadastroViagem} />
        <Tab.Screen name="Transporte" component={CadastroTransporte} />
        <Tab.Screen name="Hospedagem" component={CadastroHospedagem} />
        <Tab.Screen name="Turismo" component={CadastroTurismo} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MenuTopCadastroViagem;
