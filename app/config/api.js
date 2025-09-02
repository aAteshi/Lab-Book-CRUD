// API Configuration
export const API_CONFIG = {
  // Development URLs
  LOCAL: "http://localhost:3000",
  NETWORK: "http://10.10.15.11:3000", // สำหรับเครือข่ายภายใน
  
  // Production URL (ถ้ามี)
  PRODUCTION: "https://your-api-domain.com",
  
  // Current API URL - เปลี่ยนตรงนี้เมื่อต้องการใช้ URL อื่น
  BASE_URL: "http://localhost:3000",
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register", 
    PROFILE: "/api/auth/profile",
    
    // Books
    BOOKS: "/api/books",
    BOOKS_BY_ID: (id) => `/api/books/${id}`,
    BOOKS_GENRES: "/api/books/genres/list",
    USER_BOOKS: "/api/books/user/my-books",
    
    // Health Check
    HEALTH: "/health"
  }
};

// Helper function to get full URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to switch API environment
export const setApiEnvironment = (env) => {
  switch (env) {
    case 'local':
      API_CONFIG.BASE_URL = API_CONFIG.LOCAL;
      break;
    case 'network':
      API_CONFIG.BASE_URL = API_CONFIG.NETWORK;
      break;
    case 'production':
      API_CONFIG.BASE_URL = API_CONFIG.PRODUCTION;
      break;
    default:
      API_CONFIG.BASE_URL = API_CONFIG.LOCAL;
  }
};
