interface User {
  id: string;
  email: string;
  name: string;
}

const API_URL = "http://localhost:4000";

export async function validateUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.user;
}
