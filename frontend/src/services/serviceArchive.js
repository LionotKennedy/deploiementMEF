import { useMutation, useQuery } from "react-query";
const API_URL = "http://127.0.0.1:9876/api";

// ******************************START**********************************//
export const useGetGroupArchive = () => {
  return useQuery("groups", async () => {
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token

    const response = await fetch(`${API_URL}/archive/grouped`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérifiez si la réponse est OK
    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération des dossiers:",
        response.status,
        response.statusText
      );
      throw new Error("Erreur lors de la récupération des dossiers");
    }

    return response.json();
  });
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useGetArchiveByYear = (year) => {
  return useQuery(["byYear", year], async () => {
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token

    const response = await fetch(`${API_URL}/archive/year/${year}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérifiez si la réponse est OK
    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération des dossiers:",
        response.status,
        response.statusText
      );
      throw new Error("Erreur lors de la récupération des dossiers");
    }

    return response.json();
  });
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useAddArchive = () => {
  return useMutation(["addArchive"], (data) =>
    fetch(`${API_URL}/add_archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json())
  );
};

export const useGetArchiveById = (folderId) => {
  return useQuery(["archive", folderId], async () => {
    // Utilisez une clé de requête unique pour chaque ID
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token

    const response = await fetch(`${API_URL}/edit_archive/${folderId}`, {
      // Ajoutez l'ID au chemin de l'URL
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérifiez si la réponse est OK
    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération du archive:",
        response.status,
        response.statusText
      );
      throw new Error("Erreur lors de la récupération du archive");
    }

    return response.json();
  });
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useUpdateArchive = () => {
  return useMutation(["updateArchive"], ({ folderId, data }) =>
    fetch(`${API_URL}/update_archive/${folderId}`, {
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
export const useDeleteArchive = () => {
  return useMutation(
    ["deleteArchive"],
    (
      { folderId } // Correction du paramètre ici
    ) =>
      fetch(`${API_URL}/delete_archive/${folderId}`, {
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

// ******************************START**********************************//
export const getAllArchive = () => {
  return useQuery("archive", async () => {
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token

    const response = await fetch(`${API_URL}/get_archive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérifiez si la réponse est OK
    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération des dossiers:",
        response.status,
        response.statusText
      );
      throw new Error("Erreur lors de la récupération des dossiers");
    }

    return response.json();
  });
};
// ******************************END**********************************//
