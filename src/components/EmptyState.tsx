import { StyleSheet, Text, View } from "react-native";

type EmptyStateProps = {
  message: string;
  title: string;
};

export function EmptyState({ message, title }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fbfcfa",
    borderColor: "#d7e0da",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 20,
  },
  title: {
    color: "#101413",
    fontSize: 21,
    fontWeight: "900",
  },
  message: {
    color: "#46514c",
    fontSize: 16,
    lineHeight: 24,
  },
});
