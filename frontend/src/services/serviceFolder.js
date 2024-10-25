import { useMutation, useQuery } from "react-query";
const API_URL = "http://127.0.0.1:9876/api";

// ******************************START**********************************//
export const useGetFolders = () => {
  return useQuery("folders", async () => {
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token
    
    const response = await fetch(`${API_URL}/get_folder`, {
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
export const useAddFolder = () => {
  return useMutation(["addFolder"], (data) =>
    fetch(`${API_URL}/add_folder`, {
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
export const useGetFolderById = (folderId) => {
  return useQuery(["folder", folderId], async () => {
    // Utilisez une clé de requête unique pour chaque ID
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token
    
    const response = await fetch(`${API_URL}/edit_folder/${folderId}`, {
      // Ajoutez l'ID au chemin de l'URL
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Vérifiez si la réponse est OK
    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération du dossier:",
        response.status,
        response.statusText
      );
      throw new Error("Erreur lors de la récupération du dossier");
    }
    
    return response.json();
  });
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useUpdateFolder = () => {
  return useMutation(["updateFolder"], ({ folderId, data }) =>
    fetch(`${API_URL}/update_folder/${folderId}`, {
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
export const useDeleteFolder = () => {
  return useMutation(
    ["deleteFolder"],
    (
      { folderId } // Correction du paramètre ici
    ) =>
      fetch(`${API_URL}/delete_folder/${folderId}`, {
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
export const useGetFoldersByMonth = () => {
  return useQuery("folders", async () => {
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token

    const response = await fetch(`${API_URL}/count_letters_by_month`, {
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
export const useGetFolders_2 = () => {
  return useQuery("folders", async () => {
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token
    
    const response = await fetch(`${API_URL}/get_folder`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération des dossiers:",
        response.status,
        response.statusText
      );
      throw new Error("Erreur lors de la récupération des dossiers");
    }
    
    const result = await response.json();
    // console.log("Résultat brut:", result);
    
    // Assurez-vous que les données sont au format attendu
    if (result && result.data && Array.isArray(result.data.courriers)) {
      return {
        success: true,
        message: "Count retrieved successfully",
        data: result.data.courriers, // Retourne uniquement le tableau des courriers
      };
    } else {
      console.error(
        "Données incorrectes ou manquantes dans la réponse de l'API"
      );
      throw new Error("Données incorrectes ou manquantes");
    }
  });
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useCountFolders = () => {
  return useQuery("countLetters", async () => {
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token
    
    const response = await fetch(`${API_URL}/count_letters`, {
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
    
    const data = await response.json();
    return { success: true, count: data.count }; // Retournez uniquement le nombre de dossiers
  });
};
// ******************************END**********************************//

// ******************************START**********************************//
export const useGetLastFolderNumber = () => {
  return useQuery("lastFolderNumber", async () => {
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token
    
    const response = await fetch(`${API_URL}/get_folder`, {
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
    
    const folders = await response.json();
    
    // Trouver le plus grand numero_bordereaux (par exemple en triant les dossiers par numero_bordereaux)
    const lastFolder = folders.reduce((prev, current) => {
      return prev.numero_bordereaux > current.numero_bordereaux
        ? prev
        : current;
    });
    
    // Retourner le dernier numero_bordereaux
    return lastFolder.numero_bordereaux;
  });
};
// ******************************END**********************************//
