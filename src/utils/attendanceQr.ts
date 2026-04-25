const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const asUuid = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || !UUID_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed;
};

export const extractRegistrationIdFromInput = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const directUuid = asUuid(trimmed);
  if (directUuid) {
    return directUuid;
  }

  try {
    const parsed = JSON.parse(trimmed);
    const parsedRecord = asRecord(parsed);

    if (!parsedRecord) {
      return null;
    }

    return asUuid(parsedRecord.registration_id);
  } catch {
    return null;
  }
};
