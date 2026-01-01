"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = exports.validateRequiredFields = exports.isValidEmail = exports.formatDateForDB = exports.rowExists = exports.bufferToBase64 = exports.base64ToBuffer = void 0;
const base64ToBuffer = (base64String) => {
    try {
        if (!base64String)
            return null;
        const base64Data = base64String.includes(',')
            ? base64String.split(',')[1]
            : base64String;
        return Buffer.from(base64Data, 'base64');
    }
    catch (error) {
        console.error('❌ Error converting base64 to buffer:', error.message);
        throw new Error('Invalid base64 string provided');
    }
};
exports.base64ToBuffer = base64ToBuffer;
const bufferToBase64 = (buffer) => {
    try {
        if (!buffer)
            return null;
        const base64String = buffer.toString('base64');
        return `data:image/jpeg;base64,${base64String}`;
    }
    catch (error) {
        console.error('❌ Error converting buffer to base64:', error.message);
        return null;
    }
};
exports.bufferToBase64 = bufferToBase64;
const rowExists = (result) => {
    return result && result.length > 0;
};
exports.rowExists = rowExists;
const formatDateForDB = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date provided');
    }
    return dateObj.toISOString().slice(0, 19).replace('T', ' ');
};
exports.formatDateForDB = formatDateForDB;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const validateRequiredFields = (data, requiredFields) => {
    const missingFields = [];
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
exports.validateRequiredFields = validateRequiredFields;
// Sanitize string input to prevent SQL injection (basic)
const sanitizeInput = (input) => {
    if (typeof input !== 'string')
        return input;
    return input
        .trim()
        .replace(/[<>]/g, '');
};
exports.sanitizeInput = sanitizeInput;
