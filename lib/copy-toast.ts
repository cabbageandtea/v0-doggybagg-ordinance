import { toast } from "sonner"

export async function copyToClipboardWithToast(
  text: string,
  label = "Copied to clipboard"
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(label)
    return true
  } catch {
    toast.error("Failed to copy")
    return false
  }
}
