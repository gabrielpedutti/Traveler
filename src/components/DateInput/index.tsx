import React, { useState } from 'react';
import { View, Text, Button, Modal, Pressable, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import Input from '../InputCadastro';

interface DateInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
}

export function DateInput(props: DateInputProps): JSX.Element {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dataNascimento, setDataNascimento] = useState<string>('');

  function toggleDatePicker() {
    setShowPicker(!showPicker);
  }

  function onChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if(event.type == "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      if(Platform.OS === 'android') {
        toggleDatePicker();
        setDataNascimento(formatDate(currentDate));
        props.onChangeText(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  }

  function confirmIOSDate() {
    toggleDatePicker();
    setDataNascimento(formatDate(date));
  }

  function formatDate(date: Date) {

    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    let year = date.getFullYear().toString();

    month = month.length == 1 ? `0${month}` : month;
    day = day.length == 1 ? `0${day}` : day;

    return `${day}/${month}/${year}`;
  }

  return (
    <View>
      {showPicker && (  
        <DateTimePicker 
          mode='date'
          display='spinner'
          value={date}
          onChange={onChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
      {showPicker && Platform.OS === 'ios' && (
      <View>
        <TouchableOpacity onPress={toggleDatePicker}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={confirmIOSDate}>
          <Text>Confirmar</Text>
        </TouchableOpacity>
      </View>
      )}
      <Pressable onPress={toggleDatePicker}>
        <Input
          label={props.label}
          placeholder={props.placeholder}
          value={dataNascimento.split('T')[0]}
          onChangeText={() => {}}
          onBlur={toggleDatePicker}
          editable={false}
          onPressIn={toggleDatePicker}
        />
      </Pressable>
    </View>
  );
};