import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type BigButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  style?: ViewStyle;
};

export function BigButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}: BigButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, variant !== "primary" && styles.darkLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: 8,
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primary: {
    backgroundColor: "#101413",
  },
  secondary: {
    backgroundColor: "#e5eee9",
  },
  danger: {
    backgroundColor: "#f4d8d2",
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  darkLabel: {
    color: "#101413",
  },
});
