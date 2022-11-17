import { useState } from 'react'
import { VStack, useToast, HStack, Button as ButtonNative, FlatList } from "native-base";
import { Modal } from "native-base";
import uuid from 'react-native-uuid';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { InputNumber } from '../components/inputs/InputNumber';
import { InputMoney } from '../components/inputs/InputMoney';
import { ProdutoCard, Produto } from '../components/ProdutoCard';
import { EmptyList } from '../components/EmptyList';

export function New() {

    const [descricao, setDescricao] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valor, setValor] = useState('');
    const [cliente, setCliente] = useState('');
    const [foneCliente, setFoneCliente] = useState('');
    const [endCliente, setEndCliente] = useState('');

    const [produtosServicos, setProdutosServicos] = useState<Produto[]>([] as Produto[]);

    const [isLoading, setIsLoading] = useState(false);
    const [isFinalizarOrcamento, setIsFinalizarOrcamento] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { setItem, getItem } = useAsyncStorage("@orcafacil:orcamentos");

    const toast = useToast();

    async function addProdutoServico() {
        if (descricao.trim() === '') {
            return feedBackToast('Informe a descrição do produto', true);
        }

        if (quantidade.trim() === '') {
            return feedBackToast('Informe a quantidade', true);
        }

        if (valor.trim() === '') {
            return feedBackToast('Informe o valor', true);
        }

        try {
            setIsLoading(true);
            setShowModal(false);

            let prodServico: Produto = {
                id: uuid.v4().toString(),
                descricao,
                quantidade,
                valor
            }

            setProdutosServicos([...produtosServicos, prodServico])

            feedBackToast('Produto/serviço adicionado!', false);

            setDescricao('');
            setQuantidade('');
            setValor('');

        } catch (error) {
            console.log(error);
            feedBackToast('Erro ao adicionar produto/serviço', true);
        } finally {
            setIsLoading(false);
        }

    }

    function finalizarOrcamento() {
        setIsFinalizarOrcamento(true);
        setShowModal(true);

    }

    function fecharModal() {
        setIsFinalizarOrcamento(false);
        setShowModal(false);
    }

    async function salvar() {
        if (isFinalizarOrcamento) {
            setIsLoading(true);

            if (cliente.trim() === '') {
                setIsLoading(false);
                return feedBackToast('Informe o cliente', true);
            }

            let _orcamentoFinalizado = {
                id: uuid.v4(),
                data: new Date(),
                cliente,
                foneCliente,
                endCliente,
                produtosServicos: produtosServicos
            }

            try {

                const response = await getItem();
                const previousData = response ? JSON.parse(response) : [];

                const data = [...previousData, _orcamentoFinalizado]

                await setItem(JSON.stringify(data));

                // const _response = await getItem();

                // console.log(JSON.parse(_response));

                setProdutosServicos([] as Produto[]);
                setCliente("");
                setFoneCliente("");
                setEndCliente("");

                feedBackToast("Orçamento salvo", false);
            } catch (error) {
                console.log(error);
                feedBackToast("Erro ao salvar", true);
            } finally {
                setIsLoading(false);
                fecharModal();
            }
        } else {
            addProdutoServico();
        }
    }

    function feedBackToast(msg: string, isError: boolean) {
        toast.show({
            title: msg,
            placement: 'top',
            bgColor: isError ? 'red.500' : 'green.500'
        });
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar novo orçamento" onShare={() => null} />



            <HStack mt={8} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4} space={2}>

                <Button
                    title="ADICIONAR PRODUTO"
                    onPress={() => setShowModal(true)}
                // isLoading={isLoading}
                />

                <Button
                    title="FINALIZAR"
                    onPress={() => finalizarOrcamento()}
                    type="SECONDARY"
                    // isLoading={isLoading}
                    disabled={produtosServicos.length === 0}
                />

            </HStack>

            <FlatList
                data={produtosServicos}
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

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Informar produto</Modal.Header>
                    <Modal.Body>

                        {!isFinalizarOrcamento ?
                            <>
                                <Input
                                    mb={2}
                                    placeholder="Nome do produto/serviço"
                                    onChangeText={setDescricao}
                                    value={descricao}
                                />

                                <HStack mx={1} space={2} justifyContent="center" >
                                    <InputNumber
                                        w="50%"
                                        mb={2}
                                        placeholder="Quantidade"
                                        onChangeText={setQuantidade}
                                        value={quantidade}
                                    />

                                    <InputMoney
                                        w="50%"
                                        mb={2}
                                        placeholder="Valor"
                                        onChangeText={setValor}
                                        value={valor}
                                    />
                                </HStack>
                            </>
                            :
                            <>
                                <Input
                                    mb={2}
                                    placeholder="Cliente"
                                    onChangeText={setCliente}
                                    value={cliente}
                                />

                                <Input
                                    mb={2}
                                    placeholder="Telefone"
                                    onChangeText={setFoneCliente}
                                    value={foneCliente}
                                />

                                <Input
                                    mb={2}
                                    placeholder="Endereço"
                                    onChangeText={setEndCliente}
                                    value={endCliente}
                                />
                            </>}


                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonNative.Group space={2}>
                            <ButtonNative variant="ghost" colorScheme="blueGray" onPress={() => {
                                fecharModal();
                            }}>
                                Cancelar
                            </ButtonNative>
                            <ButtonNative onPress={salvar} isLoading={isLoading}>
                                Salvar
                            </ButtonNative>
                        </ButtonNative.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>



        </VStack >
    )
}