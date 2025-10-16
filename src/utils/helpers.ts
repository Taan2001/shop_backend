export const isVietnamesePhoneNumber = (phoneNumber: string): boolean => {
    if (!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.length !== 10) return false;
    return /^0[35789]\d{8}$/.test(phoneNumber);
};

export const isValidEmail = (email: string): boolean => {
    if (!email || typeof email !== "string") return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
