import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform as NativePlatform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { BigButton } from "../components/BigButton";
import {
  CHECK_FREQUENCIES,
  Creator,
  getCheckFrequencyLabel,
  getPlatformLabel,
  NewCreatorInput,
  CheckFrequency,
  Platform,
  PLATFORMS,
} from "../domain/creator";
import { validateCreatorInput } from "../utils/validation";

type AddCreatorScreenProps = {
  creator?: Creator;
  onBack: () => void;
  onSave: (creator: NewCreatorInput) => Promise<void>;
};

export function AddCreatorScreen({
  creator,
  onBack,
  onSave,
}: AddCreatorScreenProps) {
  const isEditing = Boolean(creator);
  const [displayName, setDisplayName] = useState(creator?.displayName ?? "");
  const [platform, setPlatform] = useState<Platform>(
    creator?.platform ?? "instagram",
  );
  const [profileUrl, setProfileUrl] = useState(creator?.profileUrl ?? "");
  const [handle, setHandle] = useState(creator?.handle ?? "");
  const [checkFrequency, setCheckFrequency] = useState<CheckFrequency>(
    creator?.checkFrequency ?? "daily",
  );
  const [errors, setErrors] = useState<{
    displayName?: string;
    profileUrl?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    const result = validateCreatorInput({
      displayName,
      profileUrl,
    });

    if (result.errors.displayName || result.errors.profileUrl) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    try {
      await onSave({
        displayName,
        platform,
        profileUrl: result.normalisedProfileUrl ?? profileUrl,
        handle,
        checkFrequency,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={NativePlatform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onBack}>
            <Text style={styles.back}>Back</Text>
          </Pressable>
          <Text style={styles.title}>
            {isEditing ? "Edit creator" : "Add creator"}
          </Text>
          <Text style={styles.subtitle}>
            {isEditing ? "Keep the route useful." : "Open what you came for."}
          </Text>
        </View>

        <View style={styles.form}>
          <Field
            error={errors.displayName}
            label="Display name"
            onChangeText={setDisplayName}
            placeholder="Mina Le"
            value={displayName}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Platform</Text>
            <View style={styles.platforms}>
              {PLATFORMS.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  key={item}
                  onPress={() => setPlatform(item)}
                  style={[
                    styles.platformOption,
                    item === platform && styles.platformOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.platformText,
                      item === platform && styles.platformTextSelected,
                    ]}
                  >
                    {getPlatformLabel(item)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Field
            autoCapitalize="none"
            error={errors.profileUrl}
            keyboardType="url"
            label="Profile URL"
            onChangeText={setProfileUrl}
            placeholder="https://instagram.com/example"
            value={profileUrl}
          />

          <Field
            autoCapitalize="none"
            label="Handle"
            onChangeText={setHandle}
            placeholder="@example"
            value={handle}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Check frequency</Text>
            <View style={styles.platforms}>
              {CHECK_FREQUENCIES.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  key={item}
                  onPress={() => setCheckFrequency(item)}
                  style={[
                    styles.platformOption,
                    item === checkFrequency && styles.platformOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.platformText,
                      item === checkFrequency && styles.platformTextSelected,
                    ]}
                  >
                    {getCheckFrequencyLabel(item)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <BigButton
            disabled={isSaving}
            label={
              isSaving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Save creator"
            }
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
  keyboardType?: "default" | "url";
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize = "sentences",
  error,
  keyboardType = "default",
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#928b80"
        style={[styles.input, error && styles.inputError]}
        value={value}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    gap: 24,
    padding: 22,
    paddingTop: 28,
  },
  header: {
    gap: 10,
  },
  back: {
    color: "#4f4a43",
    fontSize: 16,
    fontWeight: "800",
  },
  title: {
    color: "#111111",
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    color: "#5f584e",
    fontSize: 17,
  },
  form: {
    gap: 18,
  },
  field: {
    gap: 8,
  },
  label: {
    color: "#403a32",
    fontSize: 14,
    fontWeight: "800",
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#dfd8cc",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111111",
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: "#8f241b",
  },
  platforms: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  platformOption: {
    backgroundColor: "#ffffff",
    borderColor: "#dfd8cc",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  platformOptionSelected: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },
  platformText: {
    color: "#403a32",
    fontSize: 14,
    fontWeight: "700",
  },
  platformTextSelected: {
    color: "#ffffff",
  },
  error: {
    color: "#8f241b",
    fontSize: 14,
    fontWeight: "700",
  },
});
