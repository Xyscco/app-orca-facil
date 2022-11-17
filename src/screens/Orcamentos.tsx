import { useCallback, useState } from 'react'
import { VStack, useToast, FlatList } from "native-base";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { Header } from "../components/Header";
import { EmptyList } from '../components/EmptyList';
import { OrcamentoCard } from '../components/OrcamentoCard';

export function Orcamentos() {
    const [orcamentos, setOrcamentos] = useState<any[]>([]);
  
    const { getItem } = useAsyncStorage("@orcafacil:orcamentos");
    const { navigate } = useNavigation();

    const toast = useToast();

    async function carregaOrcamentos() {
        // const response = await removeItem();
        const response = await getItem();
        const data = response ? JSON.parse(response) : [];
        setOrcamentos(data);     
        
    }

    useFocusEffect(useCallback(() => {
        carregaOrcamentos();
    },[]));

    return(
        <VStack flex={1} bgColor="gray.900">
            <Header title="Orçamentos" onShare={() => {}} />
            {/* {
                isLoading ? <Loading /> : */
                <FlatList 
                mt={4}
                data={orcamentos}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <OrcamentoCard 
                        data={item}
                        onPress={() => navigate('details', { id: item.id })}
                    />
                )}
                ListEmptyComponent={() => <EmptyList msg="Nenhum orçamento criado!"/>}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ pb: 10 }}
                px={5}
                />
            /*} */}

            
        </VStack>
    )
}