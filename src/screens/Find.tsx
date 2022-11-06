import { Heading, useToast, VStack } from "native-base";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const { navigate } = useNavigation();
  const toast = useToast();

  async function handleJoinPoll() {
    try {
      setIsLoading(true);

      if(!code.trim()) {
        return toast.show({
          title: 'Informe o código',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      const response = await api.post('/pools/join', { code });
      toast.show({
        title: 'Você entrou no bolão com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      });

      setIsLoading(false);
      setCode('')
      navigate('polls');
      
    } catch (e) {
      console.log(e.response.data);
      setIsLoading(false);
      
      if(e.response?.data?.message == 'Poll not found.') {
        return toast.show({
          title: 'Bolão não encontrado!',
          placement: 'top',
          bgColor: 'red.500'
        });
      }
      if(e.response?.data?.message == 'You already joined this pool.') {
        return toast.show({
          title: 'Você já está nesse boloão!',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      toast.show({
        title: 'Não foi possível encontrar o boloão!',
        placement: 'top',
        bgColor: 'red.500'
      });
      
    } finally {
      setIsLoading(false)
    }
  }

  return(
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton/>

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Encontre um bolão através de {'\n'}
          seu código único
        </Heading>

        <Input 
          mb={2} 
          placeholder="Qual o código do bolão?" 
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button 
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPoll}
        />
      </VStack>
    </VStack>
  )
}