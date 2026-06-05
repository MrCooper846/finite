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
import {
  buildProfileUrl,
  cleanProfileUrlForDisplay,
  getHandleHelperText,
  getHandlePlaceholder,
  isHandlePlatform,
  normaliseHandle,
} from "../utils/profileLinks";
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
  const initialPlatform = creator?.platform ?? "instagram";
  const initialHandle = normaliseHandle(
    initialPlatform,
    creator?.handle ?? creator?.profileUrl ?? "",
  );
  const initialGeneratedUrl = buildProfileUrl(initialPlatform, initialHandle);
  const initialCleanProfileUrl = creator?.profileUrl
    ? cleanProfileUrlForDisplay(creator.profileUrl)
    : "";
  const initialProfileUrl =
    creator?.profileUrl &&
    (!isHandlePlatform(initialPlatform) ||
      initialCleanProfileUrl !== initialGeneratedUrl)
      ? creator.profileUrl
      : "";
  const [displayName, setDisplayName] = useState(creator?.displayName ?? "");
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [profileUrl, setProfileUrl] = useState(initialProfileUrl);
  const [handle, setHandle] = useState(initialHandle);
  const [checkFrequency, setCheckFrequency] = useState<CheckFrequency>(
    creator?.checkFrequency ?? "daily",
  );
  const [errors, setErrors] = useState<{
    displayName?: string;
    handle?: string;
    profileUrl?: string;
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    const result = validateCreatorInput({
      displayName,
      platform,
      handle,
      profileUrl,
    });

    if (
      result.errors.displayName ||
      result.errors.handle ||
      result.errors.profileUrl
    ) {
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
        handle: result.normalisedHandle,
        checkFrequency,
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handlePlatformChange(nextPlatform: Platform) {
    setPlatform(nextPlatform);
    setHandle(normaliseHandle(nextPlatform, handle));
  }

  function handleHandleChange(value: string) {
    setHandle(normaliseHandle(platform, value));
  }

  const cleanHandle = normaliseHandle(platform, handle);
  const generatedProfileUrl = buildProfileUrl(platform, cleanHandle);
  const supportsHandle = isHandlePlatform(platform);

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
            {isEditing ? "Keep the route useful." : "Choose the route. Skip the feed."}
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
                  onPress={() => handlePlatformChange(item)}
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

          {supportsHandle ? (
            <>
              <Field
                autoCapitalize="none"
                error={errors.handle}
                helperText={getHandleHelperText(platform)}
                label="Handle"
                onChangeText={handleHandleChange}
                placeholder={getHandlePlaceholder(platform)}
                value={handle}
              />

              {generatedProfileUrl ? (
                <Text style={styles.generatedUrl}>{generatedProfileUrl}</Text>
              ) : null}

              <Field
                autoCapitalize="none"
                error={errors.profileUrl}
                helperText="Optional. Use only when Finite cannot generate the right profile URL."
                keyboardType="url"
                label="Custom profile URL"
                onChangeText={setProfileUrl}
                placeholder="Optional override"
                value={profileUrl}
              />
            </>
          ) : (
            <Field
              autoCapitalize="none"
              error={errors.profileUrl}
              helperText={getHandleHelperText(platform)}
              keyboardType="url"
              label="Profile URL"
              onChangeText={setProfileUrl}
              placeholder={getHandlePlaceholder(platform)}
              value={profileUrl}
            />
          )}

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
  helperText?: string;
  keyboardType?: "default" | "url";
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize = "sentences",
  error,
  helperText,
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
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    gap: 22,
    padding: 22,
    paddingTop: 30,
  },
  header: {
    gap: 9,
  },
  back: {
    color: "#4f4a43",
    fontSize: 16,
    fontWeight: "800",
  },
  title: {
    color: "#111111",
    fontSize: 35,
    fontWeight: "900",
    lineHeight: 40,
  },
  subtitle: {
    color: "#5f584e",
    fontSize: 17,
  },
  form: {
    gap: 17,
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
    backgroundColor: "#fffefa",
    borderColor: "#ddd6ca",
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
    backgroundColor: "#fffefa",
    borderColor: "#ddd6ca",
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
  helper: {
    color: "#6f675d",
    fontSize: 13,
    lineHeight: 18,
  },
  generatedUrl: {
    backgroundColor: "#eef4f0",
    borderColor: "#cfddd6",
    borderRadius: 8,
    borderWidth: 1,
    color: "#33443d",
    fontSize: 13,
    lineHeight: 19,
    padding: 12,
  },
});
