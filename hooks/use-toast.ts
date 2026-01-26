import { toast as sonnerToast } from "sonner";

interface ToastParams {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const useToast = () => ({
  toast: ({ title, description, variant = "default" }: ToastParams) => {
    if (variant === "destructive") sonnerToast.error(title, { description });
    else sonnerToast.success(title, { description });
  },
});