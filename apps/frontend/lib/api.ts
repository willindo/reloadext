// apps/frontend/lib/axios.ts
import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

api.interceptors.request.use(async (config) => {
  const url = config.url ?? '';

  // Skip token for auth routes (absolute or relative)
  if (
    url.includes('/auth/login') ||
    url.includes('/auth/register')
  ) {
    return config;
  }

  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});


export default api;
