import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPollList } from "../components/EmptyMyPollList";
import { Guesses } from "../components/Guesses";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { Poll } from "../components/PollCard";
import { PollHeader } from "../components/PollHeader";
import { api } from "../service/api";

interface RouteParams {
  id: string;
}

export function Details() {
  const [optionSelcted, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [pollDetails, setPollDetails] = useState<Poll>({} as Poll);
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const toast = useToast();

  async function fetchPollDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/polls/${id}`);
      setPollDetails(response.data.poll);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os detalhes do bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code,
    });
  }

  useEffect(() => {
    fetchPollDetails();
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header
        title={pollDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />
      {pollDetails._count?.participants > 0 ? (
        <VStack>
          <PollHeader data={pollDetails} />
          <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
            <Option
              onPress={() => setOptionSelected("guesses")}
              title='Seus palpites'
              isSelected={optionSelcted === "guesses"}
            />
            <Option
              onPress={() => setOptionSelected("ranking")}
              title='Ranking do grupo'
              isSelected={optionSelcted === "ranking"}
            />
          </HStack>

          <Guesses pollId={pollDetails.id} />
        </VStack>
      ) : (
        <EmptyMyPollList onShare={handleCodeShare} code={pollDetails.code} />
      )}
    </VStack>
  );
}
