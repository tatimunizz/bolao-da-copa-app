import { useCallback, useState } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { api } from "../services/api";
import { PoolCard, PollCardProps } from "../components/PoolCard";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
  const [isLoading, setIsLoading] = useState(true);
  const [polls, setPolls] = useState<PollCardProps[]>([]);

  const toast = useToast();
  const { navigate } = useNavigation();

  async function fetchPolls() {
    try {
      setIsLoading(true)
      const response = await api.get('/pools');
      setPolls(response.data.polls);
      
       
    } catch (e) {
      console.log(e);
      toast.show({
        title: 'Não foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500'
      });
      
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPolls();
  }, []));

  return(
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button 
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          title="BUSCAR BOLÃO POR CÓDIGO"
          onPress={() => navigate('find')}
        />
      </VStack>

      { isLoading ?
        <Loading /> :
        <FlatList
          data={polls}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={ item }
              onPress={() => navigate('details', { id: item.id})}
            />
          )}
          ListEmptyComponent={() => <EmptyPoolList />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          px={5}
        />
      }
      
    </VStack>
  )
}