import { useMutation } from "react-query";

const API_URL = "http://127.0.0.1:9876/api"; // Assurez-vous que cette URL correspond à votre backend

// ******************************START**********************************//
export const useLogin = () => {
  return useMutation(({ email, password }) =>
    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => res.json())
  );
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useRegisterUser = () => {
  return useMutation(({ name, email, password }) =>
    fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    }).then((res) => res.json())
  );
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useGetUserProfile = (token) => {
  return useMutation(["profile", token], () =>
    fetch(`${API_URL}/profile/${token}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json())
  );
};
// ******************************END**********************************//

// ******************************START**********************************//
export const usePasswordReset = () => {
  return useMutation(({ email }) =>
    fetch(`${API_URL}/password_reset_request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then((res) => res.json())
  );
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useNewPasswordVerification = () => {
  return useMutation(({ token, newPassword }) =>
    fetch(`${API_URL}/password_reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    }).then((res) => res.json())
  );
};
// ******************************END**********************************//

// ******************************START**********************************//
export const getProfile = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Token has expired") {
        throw new Error("Token a expiré");
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du profil utilisateur:",
      error
    );
    throw new Error(error.message);
  }
};
// ******************************END**********************************//

// ******************************START**********************************//
export const logout = async (token) => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (response.ok) {
    // Si la requête réussit, on supprime le token du localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
  } else {
    console.error("Erreur lors de la déconnexion:", data.message);
  }

  return data;
};
// ******************************END**********************************//
