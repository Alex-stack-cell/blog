import { SchemaPath, validate } from '@angular/forms/signals';

interface LengthRule {
  length: number;
  message: string;
}

interface TrimmedTextRules {
  required: string;
  min?: LengthRule;
  max?: LengthRule;
}

export function trimmedText(path: SchemaPath<string>, rules: TrimmedTextRules): void {
  validate(path, ({ value }) => {
    const length = value().trim().length;
    if (length === 0) {
      return { kind: 'required', message: rules.required };
    }
    if (rules.min && length < rules.min.length) {
      return { kind: 'minLength', message: rules.min.message };
    }
    if (rules.max && length > rules.max.length) {
      return { kind: 'maxLength', message: rules.max.message };
    }
    return undefined;
  });
}
