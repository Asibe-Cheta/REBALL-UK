export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class ApiErrorHandler {
  static handleError(error: any): ApiError {
    // Handle different types of errors
    if (error instanceof Response) {
      return this.handleResponseError(error);
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: 'Network error. Please check your internet connection and try again.',
        status: 0,
        code: 'NETWORK_ERROR'
      };
    }
    
    if (error instanceof Error) {
      return {
        message: error.message || 'An unexpected error occurred.',
        code: 'UNKNOWN_ERROR'
      };
    }
    
    return {
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR'
    };
  }
  
  static async handleResponseError(response: Response): Promise<ApiError> {
    try {
      const errorData = await response.json();
      return {
        message: errorData.message || this.getDefaultMessage(response.status),
        status: response.status,
        code: errorData.code,
        details: errorData.details
      };
    } catch {
      return {
        message: this.getDefaultMessage(response.status),
        status: response.status
      };
    }
  }
  
  static getDefaultMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'You are not authorized to perform this action. Please log in and try again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This resource already exists. Please try a different value.';
      case 422:
        return 'Validation failed. Please check your input and try again.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Service temporarily unavailable. Please try again later.';
      case 503:
        return 'Service is currently unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  static getUserFriendlyMessage(error: ApiError): string {
    // Provide more specific messages for common scenarios
    if (error.code === 'NETWORK_ERROR') {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    
    if (error.code === 'VALIDATION_ERROR') {
      return 'Please check your input and try again.';
    }
    
    if (error.code === 'AUTHENTICATION_ERROR') {
      return 'Your session has expired. Please log in again.';
    }
    
    if (error.code === 'PERMISSION_ERROR') {
      return 'You do not have permission to perform this action.';
    }
    
    return error.message;
  }
  
  static shouldRetry(error: ApiError): boolean {
    // Retry for network errors and 5xx server errors
    if (error.code === 'NETWORK_ERROR') return true;
    if (error.status && error.status >= 500) return true;
    return false;
  }
  
  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, etc.
    return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
  }
}

// Convenience function for API calls with error handling
export const apiCall = async <T>(
  url: string, 
  options: RequestInit = {},
  retries: number = 3
): Promise<T> => {
  let lastError: ApiError;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        const error = await ApiErrorHandler.handleResponseError(response);
        lastError = error;
        
        if (!ApiErrorHandler.shouldRetry(error)) {
          throw error;
        }
        
        if (attempt < retries) {
          await new Promise(resolve => 
            setTimeout(resolve, ApiErrorHandler.getRetryDelay(attempt))
          );
          continue;
        }
        
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      const apiError = ApiErrorHandler.handleError(error);
      lastError = apiError;
      
      if (!ApiErrorHandler.shouldRetry(apiError)) {
        throw apiError;
      }
      
      if (attempt < retries) {
        await new Promise(resolve => 
          setTimeout(resolve, ApiErrorHandler.getRetryDelay(attempt))
        );
        continue;
      }
      
      throw apiError;
    }
  }
  
  throw lastError!;
};

// Hook for handling API errors in components
export const useApiError = () => {
  const handleApiError = (error: any, showToast?: (message: string) => void) => {
    const apiError = ApiErrorHandler.handleError(error);
    const userMessage = ApiErrorHandler.getUserFriendlyMessage(apiError);
    
    console.error('API Error:', apiError);
    
    if (showToast) {
      showToast(userMessage);
    }
    
    return apiError;
  };
  
  return { handleApiError };
}; 