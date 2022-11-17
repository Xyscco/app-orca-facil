import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

interface Props extends IButtonProps {
  title: string;
  type?: 'PRIMARY' | 'SECONDARY';
}

export function Button({ title, type = 'PRIMARY', ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="1/2"
      h={14}
      rounded="sm"
      fontSize="md"
      textTransform="uppercase"
      bg={type === 'SECONDARY' ? "blue.500" : "green.500"}
      _pressed={{
        bg: type === 'SECONDARY' ? "blue.600" : "green.400"
      }}
      _loading={{
        _spinner: { color: "white" }
      }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        color={type === 'SECONDARY' ? 'white' : "white"}
      >
        {title}
      </Text>
    </ButtonNativeBase >
  );
}