import { Heading, HStack, Text, VStack } from 'native-base';

export interface Produto {
  id: string;
  descricao: string;
  quantidade: string;
  valor: string;
}

interface Produtos {
  data: Produto;
}

export function ProdutoCard({ data }: Produtos) {
  return (
    <HStack
      w="full"
      h={20}
      bgColor="gray.800"
      borderBottomWidth={3}
      borderBottomColor="blue.500"
      justifyContent="space-between"
      alignItems="center"
      rounded="sm"
      mb={3}
      p={4}
    >
      <VStack>
        <Heading color="white" fontSize="md" fontFamily="heading">
          {data.descricao}
        </Heading>

        <Text color="gray.200" fontSize="xs">
          Quantidade: {data.quantidade} / Valor Unitário: R${data.valor}
        </Text>
        <Text color="gray.200" fontSize="xs">
          Total item: R${parseInt(data.quantidade) * parseFloat(data.valor)}
        </Text>
      </VStack>

    </HStack>
  );
}