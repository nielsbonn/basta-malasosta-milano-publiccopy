const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

export const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      const maxDimension = 1600; // Maximum dimension for either width or height
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get the resized image as base64 string
      const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(img.src); // Clean up
      resolve(resizedImage);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};

export const processImage = async (file: File): Promise<string> => {
  if (file.size > MAX_FILE_SIZE) {
    return await resizeImage(file);
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const photoData = reader.result as string;
      resolve(photoData);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};