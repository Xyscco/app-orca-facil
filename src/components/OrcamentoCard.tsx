import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Text, VStack } from 'native-base';
import { Produto } from './ProdutoCard';
import Moment from 'moment';

export interface Orcamento {
  id: string;
    data: string;
    cliente: string;
    foneCliente: string;
    endCliente: string;
    produtosServicos: Produto[];
}

interface Orcamentos extends TouchableOpacityProps {
  data: Orcamento;
}

export function OrcamentoCard({ data, ...rest }: Orcamentos) {
  Moment.locale('ptBR');
  return (
    <TouchableOpacity {...rest}>
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
            {data.cliente}
          </Heading>

          <Text color="gray.200" fontSize="xs">
            Data Orçamento: {Moment(data.data).format('DD/MM/YYYY hh:mm')} 
          </Text>
        </VStack>

      </HStack>
    </TouchableOpacity>
  );
}