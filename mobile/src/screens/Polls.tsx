import { Icon, useToast, VStack, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { api } from "../service/api";
import { useCallback, useState } from "react";
import { Loading } from "../components/Loading";
import { Poll, PollCard } from "../components/PollCard";
import { EmptyPollList } from "../components/EmptyPollList";

export function Polls() {
  const [isLoading, setIsLoading] = useState(true);
  const [polls, setPolls] = useState<Poll[]>([]);
  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetchPolls() {
    try {
      setIsLoading(true);
      const response = await api.get("/polls");
      setPolls(response.data.polls);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os bolões",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header title='Meus bolões' />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor='gray.500'
        pb={4}
        mb={4}
      >
        <Button
          title='BUSCAR BOLÃO POR CÒDIGO'
          leftIcon={
            <Icon as={Octicons} name='search' color='black' size='md' />
          }
          onPress={() => navigate("find")}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyPollList />}
          renderItem={({ item }) => (
            <PollCard
              onPress={() => navigate("details", { id: item.id })}
              data={item}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
        />
      )}
    </VStack>
  );
}
