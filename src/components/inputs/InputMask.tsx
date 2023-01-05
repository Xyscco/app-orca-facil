// import { Input as NativeBaseInput,  IInputProps } from 'native-base';
import { TextInput, StyleSheet, TextInputProps } from "react-native";

import { maskCep, maskPhone, maskCurrency } from "./utils/masks";

interface InputProps extends TextInputProps {
  mask: "cep" | "phone" | "currency";
  inputMaskChange: any;
}

const InputMask: React.FC<InputProps> = ({ mask, inputMaskChange, ...rest }) => {
  function handleChange(text: string) {
    if (mask === "cep") {
      const value = maskCep(text);
      inputMaskChange(value);
    }
    if (mask === "phone") {
      const value = maskPhone(text);
      inputMaskChange(value);
    }
    if (mask === "currency") {
      const value = maskCurrency(text);
      inputMaskChange(value);
    }
  }

  return (
    <>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        onChangeText={(text) => handleChange(text)}
        {...rest}
      />
    </>
  );
};

export default InputMask;


const styles = StyleSheet.create({
  input:{
    // width: '50%',
    height: 56,
    backgroundColor: "#202024",
    color: '#8D8D99',
    borderColor: '#323238',
    borderRadius: 5,
    fontSize: 16,
    padding: 16,
    textAlign: 'left',
    marginBottom: 8
  }
});