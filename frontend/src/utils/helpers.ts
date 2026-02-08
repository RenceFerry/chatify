

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

export const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>, maxHeight: number) => {
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

export function cropImage(
  imageFile: File,
  cropArea: { x: number; y: number; width: number; height: number }
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Set canvas size to crop dimensions
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      // Draw the cropped portion
      ctx?.drawImage(
        img,
        cropArea.x,      // Source x
        cropArea.y,      // Source y
        cropArea.width,  // Source width
        cropArea.height, // Source height
        0,               // Destination x
        0,               // Destination y
        cropArea.width,  // Destination width
        cropArea.height  // Destination height
      );

      // Convert canvas to blob/file
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], imageFile.name, {
            type: imageFile.type,
            lastModified: Date.now()
          });
          resolve(croppedFile);
        } else {
          reject(new Error('Canvas to Blob conversion failed'));
        }
      }, imageFile.type);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(imageFile);
  });
}