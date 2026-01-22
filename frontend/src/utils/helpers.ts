

export function formatMessageTime(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>, maxHeight: number) => {
  const textarea = e.currentTarget;

  if (textarea.value === "") {
    textarea.style.height = "50px";
    return;
  }
  // Adjust textarea height based on content
  textarea.style.height = "auto";
  const scrollHeight = textarea.scrollHeight;
  if (scrollHeight > maxHeight) {
    textarea.style.height = `${maxHeight}px`;
  } else {
    textarea.style.height = `${scrollHeight}px`;
  }
}

export const generateRandomNumber = (digit: number) => {
  const min = 10 ** (digit - 1);
  const max = 10 ** digit;

  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);

  return min + (array[0] % (max - min + 1));
}

export const BACKEND_URL = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : "";