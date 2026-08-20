import { styled } from "nativewind";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const CreateEvent = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View>
        <Text>Holi</Text>
      </View>
    </SafeAreaView>
  );
};
export default CreateEvent;
