# API Usage Guide

This document provides guidelines for making API calls in the SkillSwap application to ensure consistent token handling and error management.

## Recommended Approach

Always use the `apiClient` utility for all API calls. This ensures:

1. Authentication tokens are automatically attached to all requests
2. Consistent error handling
3. Type safety
4. Proper response parsing

## How to Use the API Client

```typescript
import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';

// Example GET request with query parameters
async function fetchUserSkills(userId: string) {
  try {
    const skills = await apiClient.get(
      API_ENDPOINTS.users.skills(userId),
      {
        params: {
          limit: 10,
          page: 1
        }
      }
    );
    return skills;
  } catch (error) {
    console.error('Error fetching user skills:', error);
    throw error;
  }
}

// Example POST request with data
async function createSkill(skillData) {
  try {
    const newSkill = await apiClient.post(
      API_ENDPOINTS.skills.create,
      skillData
    );
    return newSkill;
  } catch (error) {
    console.error('Error creating skill:', error);
    throw error;
  }
}

// Example PUT request
async function updateSkill(skillId, skillData) {
  try {
    const updatedSkill = await apiClient.put(
      API_ENDPOINTS.skills.update(skillId),
      skillData
    );
    return updatedSkill;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
}

// Example DELETE request
async function deleteSkill(skillId) {
  try {
    await apiClient.delete(API_ENDPOINTS.skills.delete(skillId));
    return true;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
}
```

## Benefits of Using the API Client

1. **Automatic Token Handling**: The client automatically attaches the latest authentication token to every request.
2. **Consistent Error Handling**: All API errors are processed in a consistent way.
3. **Type Safety**: The client provides TypeScript type safety for request and response data.
4. **DRY Code**: Eliminates repetitive code for token handling and error processing.

## For Direct Fetch Calls (Not Recommended)

If you must use the native `fetch` API directly (not recommended), use the `createAuthenticatedRequest` helper:

```typescript
import { createAuthenticatedRequest } from '@/lib/apiClient';

async function customFetch() {
  const request = await createAuthenticatedRequest('https://api.example.com/data', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Custom-Header': 'value'
    }
  });
  
  const response = await fetch(request);
  return response.json();
}
```

## Error Handling

The API client throws standardized error objects with the following properties:

- `message`: Human-readable error message
- `status`: HTTP status code (if available)
- `data`: Original error response data from the server

Always wrap API calls in try/catch blocks and handle errors appropriately.