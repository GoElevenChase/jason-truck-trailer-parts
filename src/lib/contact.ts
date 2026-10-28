export interface Inquiry {
  name: string;
  email: string;
  service: string;
  message: string;
  website: string;
}

export function validateInquiry(input: Inquiry): string | null {
  if (input.website.trim()) return "We could not validate this request. Please email us directly.";
  if (input.name.trim().length < 2 || input.name.length > 120) return "Please enter your name (2–120 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || input.email.length > 254) return "Please enter a valid email address.";
  if (input.service.length > 120) return "Please choose a service from the list.";
  if (input.message.trim().length < 10 || input.message.length > 4000) return "Tell us a little more (10–4,000 characters).";
  return null;
}

export function buildEmailDraft(recipient: string, input: Inquiry): string {
  const error = validateInquiry(input);
  if (error) throw new Error(error);
  const subject = `Project inquiry: ${input.service || "Let's talk"}`;
  const body = `Name: ${input.name.trim()}\nEmail: ${input.email.trim()}\nInterested in: ${input.service || "Let's discuss"}\n\n${input.message.trim()}`;
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function isAcceptedResponse(value: unknown): value is { ok: true } {
  return typeof value === "object" && value !== null && "ok" in value && value.ok === true;
}
