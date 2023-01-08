import { useNavigation } from "@react-navigation/native";
import { Row, Text, Pressable } from "native-base";

export function EmptyPollList() {
  const { navigate } = useNavigation();
  return (
    <Row justifyContent='center'>
      <Text color='white' fontSize='sm' textAlign='center'>
        Você ainda não está participando de {"\n"} nenhum bolão, que tal{" "}
        <Pressable onPress={() => navigate("find")}>
          <Text
            textDecorationLine='underline'
            color='yellow.500'
            textDecoration='underline'
          >
            buscar um por código
          </Text>
        </Pressable>{" "}
        ou{" "}
        <Pressable onPress={() => navigate("new")}>
          <Text textDecorationLine='underline' color='yellow.500'>
            criar um novo
          </Text>
        </Pressable>
        ?
      </Text>
    </Row>
  );
}
