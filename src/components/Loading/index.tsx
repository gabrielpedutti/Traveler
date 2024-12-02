import React, { useEffect, useRef } from "react";
import { Text, View, Animated } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { styles } from "./styles";

function Loading() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Configurar animação infinita de rotação
    const rotateAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000, // Duração de 1 segundo por rotação
        useNativeDriver: true, // Animação nativa para melhor desempenho
      })
    );
    rotateAnimation.start();

    return () => rotateAnimation.stop(); // Limpar animação ao desmontar
  }, []);

  // Interpolação para converter valor numérico em rotação em graus
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Girar de 0 a 360 graus
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        <AntDesign name="loading2" size={24} color="#2b88d9" />
      </Animated.View>
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
}

export default Loading;
