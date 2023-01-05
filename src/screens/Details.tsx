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
        var data = Moment(orcamento.data).format('DD/MM/YYYY');
        var endereco = orcamento.endCliente;
        var telefone = orcamento.foneCliente;
        var total = 0;

        orcamento.produtosServicos.forEach(produto => {
            total += (parseInt(produto.quantidade) * parseFloat(produto.valor))
        })

        const html = `
        <!DOCTYPE html>
        <html>
        
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,500;1,200&family=Oswald:wght@200;300;400;500;600;700&family=Roboto:wght@400;700&display=swap');
            .body {
              font-family: 'Roboto', sans-serif;
              color: #000;
            }
        
            .img {
              display: flex;
              justify-content: space-around;
            }
        
            .table {
              color: black;
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
        
            .total {
              height: 40px;
              display: flex;
              justify-content: flex-end;
              background-color: #dddddd;
              align-items: center;
              padding: 8px;
              font-weight: 700;
            }
        
            .money {
              color: #10b981
            }
          </style>
        </head>
        
        <body class="body">
          <div class="img">
            <img src="https://thumbs2.imgbox.com/19/52/qfsnexV8_t.png"/>
          </div>
        
          <h2>Orçamento</h2>
          <div style="display: flex; flex-direction: column;">
            <span>Cliente: ${cliente}</span>
            <span>Telefone: ${telefone}</span>
            <span>Data: ${data}</span>
            <span>Endereço: ${endereco}</span>
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
          <div class="total">
            Total: <span class="money"> R$ ${total}</span>
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
                        <Text color="gray.200" fontSize="xl">Telefone: {orcamento.foneCliente}</Text>
                        <Text color="gray.200" fontSize="md">Data: {Moment(orcamento.data).format('DD/MM/YYYY')}</Text>
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