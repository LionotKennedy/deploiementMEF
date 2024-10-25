import { useMutation, useQuery } from "react-query";
const API_URL = "http://127.0.0.1:9876/api";

// ******************************START**********************************//
export const useGetUser = () => {
  return useQuery("users", async () => {
    const token = localStorage.getItem("token");
    // console.log("Token:", token); // Debugging token

    const response = await fetch(`${API_URL}/get_user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérifiez si la réponse est OK
    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération des utilisateur:",
        response.status,
        response.statusText
      );
      throw new Error("Erreur lors de la récupération des utilisateur");
    }

    return response.json();
  });
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useGetUserById = (userId) => {
  return useQuery(["users", userId], async () => {
    // Utilisez une clé de requête unique pour chaque ID
    const token = localStorage.getItem("token");
    // console.log("Token:", token); // Debugging token

    const response = await fetch(`${API_URL}/edit_user/${userId}`, {
      // Ajoutez l'ID au chemin de l'URL
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérifiez si la réponse est OK
    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération du visa:",
        response.status,
        response.statusText
      );
      throw new Error("Erreur lors de la récupération du visa");
    }

    return response.json();
  });
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useUpdateUser = () => {
  return useMutation(["updateUser"], async ({ userId, data }) => {
    // Créer une instance de FormData
    const formData = new FormData();

    // Ajouter chaque champ à FormData
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.image) {
      formData.append("image", data.image);
    }

    // Envoyer la requête PUT
    const response = await fetch(`${API_URL}/update_user/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Authentification
        // Pas besoin de définir 'Content-Type' ici, car 'FormData' le gère automatiquement
      },
      body: formData,
    });

    // Vérifier la réponse
    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de l'utilisateur");
    }

    return response.json();
  });
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useAddUser = () => {
  return useMutation(["addUser"], (data) =>
    fetch(`${API_URL}/add_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json())
  );
};

export const useUpdatePermissionUser = () => {
  return useMutation(["updateUser"], ({ userId, data }) =>
    fetch(`${API_URL}/update_role_status/${userId}`, {
      method: "PUT",
      headers: {
        // "Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json())
  );
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useUpdateUserPassword = () => {
  return useMutation(
    ["updatePassword"],
    async ({ userId, oldPassword, newPassword }) => {
      const response = await fetch(`${API_URL}/update_password/${userId}`, {
        method: "PUT", // Utilisez PATCH ou PUT selon votre API
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour du mot de passe"
        );
      }

      return response.json();
    }
  );
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useUpdateUserEmailName = () => {
  return useMutation(["updateEmailName"], async ({ userId, name, email }) => {
    const response = await fetch(`${API_URL}/update_email__name/${userId}`, {
      method: "PUT", // Utilisez PATCH ou PUT selon votre API
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour du mot de passe"
      );
    }

    return response.json();
  });
};
// ******************************END**********************************//
