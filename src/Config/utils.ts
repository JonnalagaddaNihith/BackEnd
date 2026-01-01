import { RowDataPacket } from 'mysql2';

export const base64ToBuffer = (base64String: string | null | undefined): Buffer | null => {
  try {
    if (!base64String) return null;
    
    const base64Data = base64String.includes(',') 
      ? base64String.split(',')[1] 
      : base64String;
    
    return Buffer.from(base64Data, 'base64');
  } catch (error: any) {
    console.error('❌ Error converting base64 to buffer:', error.message);
    throw new Error('Invalid base64 string provided');
  }
};

export const bufferToBase64 = (buffer: Buffer | null | undefined): string | null => {
  try {
    if (!buffer) return null;
    const base64String = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64String}`;
  } catch (error: any) {
    console.error('❌ Error converting buffer to base64:', error.message);
    return null;
  }
};

export const rowExists = (result: RowDataPacket[]): boolean => {
  return result && result.length > 0;
};

export const formatDateForDB = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  return dateObj.toISOString().slice(0, 19).replace('T', ' ');
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

// Sanitize string input to prevent SQL injection (basic)
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '');
};
