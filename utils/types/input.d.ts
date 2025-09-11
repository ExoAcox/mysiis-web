interface BasicInput {
    label?: string;
    className?: string;
    parentClassName?: string;
    disabled?: boolean;
    placeholder?: string;
    error?: ErrorInput;
}

type FieldError = import("react-hook-form").FieldError;
type FieldErrorsImpl = import("react-hook-form").FieldErrorsImpl;
type FieldValues = import("react-hook-form").FieldValues;
type Merge = import("react-hook-form").Merge;

type ErrorInput = FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>> | string;

type Option<Value> = { label: React.ReactNode; value: Value; data?: unknown; disabled?: boolean; loading?: boolean; className?: string };

type Size = "h1" | "h2" | "h3" | "h4" | "h5" | "caption" | "small" | "medium" | "large" | "subtitle";
type Position = "bottom left" | "bottom center" | "bottom right" | "top left" | "top center" | "top right";
