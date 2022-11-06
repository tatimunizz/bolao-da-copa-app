import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { useRoute } from '@react-navigation/native'
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../services/api";
import {  PollCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";


interface RouteParams {
  id: string;
}

export function Details() {
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'hanking'>('guesses');
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState<PollCardProps>({});
  
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const toast = useToast();

  async function fetchPollDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${id}`);
      setPollDetails(response.data.poll);
      
    } catch (e) {
      console.log(e);

      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500'
      });
      
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: `Participe do meu bolão da copa!\n${pollDetails.code}`
    })
  }

  useEffect(() => {
    fetchPollDetails();
  }, [id])

  if(isLoading) {
    return (<Loading />);
  };

  
  return (
    <VStack flex={1} bgColor="gray.900">

      <Header 
        title={pollDetails.title} 
        showBackButton 
        showShareButton
        onShare={handleCodeShare}
      />

      { pollDetails._count?.participants > 0 ?
        <VStack>
          <PoolHeader data={pollDetails}/>

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="seus palpites" 
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option 
              title="Ranking do grupo" 
              isSelected={optionSelected === 'hanking'}
              onPress={() => setOptionSelected('hanking')}
            />
          </HStack>

          <Guesses poolId={pollDetails.id} code={pollDetails.code} />
        </VStack>
        : <EmptyMyPoolList code={pollDetails.code} />
      }
    </VStack>
  )
}