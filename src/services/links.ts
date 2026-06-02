import { Linking } from "react-native";

export async function openExternalUrl(url: string): Promise<void> {
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error("Cannot open URL");
  }

  await Linking.openURL(url);
}
