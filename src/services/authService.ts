import axiosInstance from '@/lib/axios';

// রেজিস্ট্রেশন
export const registerUser = async (userData: any) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

// লগইন
export const loginUser = async (credentials: any) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};