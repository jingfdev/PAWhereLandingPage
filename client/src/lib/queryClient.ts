import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function getApiUrl(path: string): string {
  // Absolute URL passed through
  if (path.startsWith("http")) return path;

  // Ensure path starts with '/'
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // In development, allow overriding API base for local servers
  if (import.meta.env.DEV && import.meta.env.VITE_API_BASE_URL) {
    return `${import.meta.env.VITE_API_BASE_URL}${normalizedPath}`;
  }

  // In production, always use same-origin to avoid CORS/mixed-content issues
  return normalizedPath;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const apiUrl = getApiUrl(url);
  
  const headers: Record<string, string> = {};
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Add request ID for tracking and debugging mobile issues
  headers["X-Request-ID"] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Add mobile user agent detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  headers["X-Device-Type"] = isMobile ? "mobile" : "desktop";
  
  // Add a longer timeout for mobile networks (30 seconds instead of default)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  
  // Log data being sent for debugging mobile issues
  if (data) {
    console.log("[apiRequest] Sending data:", JSON.stringify(data));
    console.log("[apiRequest] Device type:", isMobile ? "mobile" : "desktop");
    console.log("[apiRequest] Data keys:", Object.keys(data as Record<string, unknown>));
  }
  
  try {
    const res = await fetch(apiUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }

    return res;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error - check your connection');
    }
    
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
