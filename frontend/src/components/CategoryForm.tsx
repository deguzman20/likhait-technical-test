import {
  CSSProperties,
  FormEvent,
  ChangeEvent,
  useCallback,
  useState,
} from "react";
import { Button, TextField } from "../vibes";

interface CategoryFormProps {
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const buttonGroupStyle: CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  marginTop: "0.5rem",
};

const validateName = (name: string): string => {
  if (!name.trim()) {
    return "Category name is required";
  }

  return "";
};

export function CategoryForm({
  initialName = "",
  onSubmit,
  onCancel,
  submitLabel = "Add Category",
}: CategoryFormProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);

    if (error) {
      setError("");
    }
  };

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedName = name.trim();
      const validationError = validateName(trimmedName);

      if (validationError) {
        setError(validationError);
        return;
      }

      setError("");
      setIsSubmitting(true);

      try {
        await onSubmit(trimmedName);
      } catch {
        setError("Failed to save category");
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Name"
        type="text"
        placeholder="Enter category name"
        value={name}
        onChange={handleChange}
        error={error}
        fullWidth
        required
      />

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
