import { useState, useEffect } from 'react';
import { Button, FlatList, HStack, Icon, Text, useToast, VStack } from "native-base";
import { useRoute } from '@react-navigation/native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { FilePdf } from 'phosphor-react-native'
import Moment from 'moment';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { Header } from "../components/Header";
import { Orcamento } from '../components/OrcamentoCard';
import { ProdutoCard } from '../components/ProdutoCard';
import { EmptyList } from '../components/EmptyList';
import { ButtonIcon } from '../components/ButtonIcon';

interface RouteParams {
    id: string;
}

export function Details() {
    Moment.locale('ptBR');

    const [orcamento, setOrcamento] = useState<Orcamento>({} as Orcamento);

    const route = useRoute();
    
    const { id } = route.params as RouteParams;

    const { getItem } = useAsyncStorage("@orcafacil:orcamentos");

    async function getOrcamento() {
        const response = await getItem();
        const data = response ? JSON.parse(response) : [];

        const _orcamento = data.filter(orcamento => orcamento.id === id)[0];

        setOrcamento(_orcamento);

        console.log(orcamento);

    }

    const printToFile = async () => {

        const { uri } = await Print.printToFileAsync({
            html: generateHtml()
        });
        
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    }

    function generateHtml() {
        var table = '';
        for (let i in orcamento.produtosServicos) {
            const item = orcamento.produtosServicos[i];
            table = table + `
          <tr>
            <td>${item.quantidade}</td>
            <td>${item.descricao}</td>
            <td>${item.valor}</td>
            <td>${(parseInt(item.quantidade) * parseFloat(item.valor))}</td>
          </tr>
          `
        }

        var cliente = orcamento.cliente;
        var data = Moment(orcamento.data).format('DD/MM/YYYY hh:mm');

        const html = `
            <!DOCTYPE html>
            <html>

            <head>
            <style>
                .body {
                    padding: 0;
                background-color: black;
                color: #dddddd;
                }

                .table {
                color: black;
                background-color: gray;
                padding: 10px
                }

                .table table {
                font-family: arial, sans-serif;
                border-collapse: collapse;
                width: 100%;
                }


                td,
                th {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
                }

                tr:nth-child(even) {
                background-color: #dddddd;
                }
            </style>
            </head>

            <body class="body">

            <h2>Orçamento</h2>
            <div style="display: flex; flex-direction: column;">
                <span>Cliente: ${cliente}</span>
                <span>Data: ${data}</span>
            </div>

            <hr>

            <div class="table">
                <table>
                <tr>
                    <th>Qtd</th>
                    <th>Descrição</th>
                    <th>Valor Unitário</th>
                    <th>Valor Total</th>
                </tr>
                ${table}
                </table>
            </div>


            </body>

            </html>
          `;

        return html;

    }


    useEffect(() => {
        getOrcamento();
    }, [id])

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header
                title={orcamento.cliente}
                showBackButton
                onShare={() => null}
            />

            <VStack p={4} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <HStack>
                    <VStack w={80}>
                        <Text color="gray.200" fontSize="xl">Cliente: {orcamento.cliente}</Text>
                        <Text color="gray.200" fontSize="md">Data: {Moment(orcamento.data).format('DD/MM/YYYY hh:mm')}</Text>
                    </VStack>
                    <VStack mt={4}>
                        <ButtonIcon icon={FilePdf} onPress={printToFile}></ButtonIcon>
                    </VStack>
                </HStack>
            </VStack>
            <VStack>
                <FlatList
                    data={orcamento.produtosServicos}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <ProdutoCard
                            data={item}
                        />
                    )}
                    ListEmptyComponent={() => <EmptyList msg="Nenhum produto adicionado!" />}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ pb: 10 }}
                    px={5}
                />
            </VStack>



        </VStack>
    )
}