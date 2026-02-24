type CensorOptions = {
  censorValues: boolean;
  keysToCensor: string[];
  maxArrayLength: number | null;
};

// Generates dummy data based on the original type
function getDummyValue(originalValue: any): any {
  if (typeof originalValue === "string") return `***${originalValue.length}***`;
  if (typeof originalValue === "number") return 9999;
  if (typeof originalValue === "boolean") return false;
  return null;
}

export function processJSON(
  data: any,
  options: CensorOptions,
  currentDepth: number = 0
): any {
  // Prevent infinite loops in self-referencing objects just in case
  if (currentDepth > 50) return data;

  if (Array.isArray(data)) {
    let result = data;
    // Truncate array if requested
    if (options.maxArrayLength !== null && data.length > options.maxArrayLength) {
      result = data.slice(0, options.maxArrayLength);
    }
    return result.map((item) => processJSON(item, options, currentDepth + 1));
  }

  if (data !== null && typeof data === "object") {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      // Determine if we need to rename the key
      const isKeyCensored = options.keysToCensor.includes(key);
      const finalKey = isKeyCensored ? `censored_key_${key.length}` : key;

      if (typeof value === "object" && value !== null) {
        result[finalKey] = processJSON(value, options, currentDepth + 1);
      } else {
        result[finalKey] = options.censorValues ? getDummyValue(value) : value;
      }
    }
    return result;
  }

  return options.censorValues ? getDummyValue(data) : data;
}