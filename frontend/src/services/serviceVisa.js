import { useMutation, useQuery } from "react-query";
const API_URL = "http://127.0.0.1:9876/api";

// ******************************START**********************************//
export const useGetVisa = () => {
  return useQuery("visas", async () => {
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token

    const response = await fetch(`${API_URL}/get_visa`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérifiez si la réponse est OK
    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération des visa:",
        response.status,
        response.statusText
      );
      throw new Error("Erreur lors de la récupération des visa");
    }

    return response.json();
  });
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useAddVisa = () => {
  return useMutation(["addVisa"], (data) =>
    fetch(`${API_URL}/add_visa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json())
  );
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useGetVisaById = (folderId) => {
  return useQuery(["visa", folderId], async () => {
    // Utilisez une clé de requête unique pour chaque ID
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token

    const response = await fetch(`${API_URL}/edit_visa/${folderId}`, {
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
export const useUpdateVisa = () => {
  return useMutation(["updateVisa"], ({ folderId, data }) =>
    fetch(`${API_URL}/update_visa/${folderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json())
  );
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useDeleteVisa = () => {
  return useMutation(
    ["deleteVisa"],
    (
      { folderId } // Correction du paramètre ici
    ) =>
      fetch(`${API_URL}/delete_visa/${folderId}`, {
        // Corrigez l'URL ici
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json())
  );
};
// ******************************END**********************************//
