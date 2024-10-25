import { useMutation, useQuery, useQueryClient } from "react-query";

const API_URL = "http://127.0.0.1:9876/api";

// ******************************START**********************************//
export const useGetJournals = () => {
  return useQuery("journal", async () => {
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token

    const response = await fetch(`${API_URL}/get_journal`, {
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
export const useGetJournalById = (id) => {
  return useQuery(["journal", id], async () => {
    // Utilisez une clé de requête unique pour chaque ID
    const token = localStorage.getItem("token");
    // console.log('Token:', token); // Debugging token

    const response = await fetch(`${API_URL}/edit_journal/${id}`, {
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
export const useDeleteJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => {
      const token = localStorage.getItem("token");
      // console.log('Token:', token);

      const response = await fetch(`${API_URL}/delete_journal/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(
          "Erreur lors de la suppression du dossier:",
          response.status,
          response.statusText
        );
        throw new Error("Erreur lors de la suppression du dossier");
      }

      return response.json();
    },
    onSuccess: () => {
      // Forcez l'actualisation des données après la suppression réussie
      queryClient.invalidateQueries(["journal"]);
    },
  });
};
// ******************************END**********************************//
