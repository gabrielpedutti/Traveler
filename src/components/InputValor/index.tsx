import React, { useRef } from 'react';
import { View, Text, TextInputProps } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { TextInputMask } from 'react-native-masked-text';

import { styles } from "./styles";

interface InputValorProps {
  name: string;
  control: Control<any>;
  label?: string;
  error?: string;
  textInputProps?: TextInputProps;
}

export const InputValor: React.FC<InputValorProps> = ({ name, control, label, error, textInputProps }) => {
  // useRef para armazenar o último texto formatado válido
  const lastValidFormattedText = useRef<string>('');

  const customHandleChangeText = (onChange: (...event: any[]) => void) => (
    (formattedText: string, rawText?: string) => {
      let valueToPassToRHF = formattedText;
      if (formattedText === '' && lastValidFormattedText.current !== '') {
        valueToPassToRHF = lastValidFormattedText.current;
      } else if (formattedText !== '') {
        lastValidFormattedText.current = formattedText;
      } else {
        lastValidFormattedText.current = '';
      }
      onChange(valueToPassToRHF);
    }
  );

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.containerInput}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => {
            let stringValueForMask = '';
            if (value != null && !isNaN(Number(value))) {
              stringValueForMask = Number(value).toFixed(2);
            } else if (typeof value === 'string') {
              stringValueForMask = value;
            }
            if (stringValueForMask.length > 0) {
              lastValidFormattedText.current = stringValueForMask;
            } else if (stringValueForMask === '') {
              lastValidFormattedText.current = '';
            }
            return (
              <TextInputMask
                type={'money'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: '',
                }}
                value={stringValueForMask}
                onBlur={onBlur}
                onChangeText={customHandleChangeText(onChange)}
                style={styles.input}
                keyboardType="numeric"
                {...textInputProps}
              />
            );
          }}
        />
      </View>
    </View>
  );
};
