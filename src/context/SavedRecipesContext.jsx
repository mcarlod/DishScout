import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getSavedRecipeIds, saveRecipe, unsaveRecipe } from "../services/savedRecipeService";

const SavedRecipesContext = createContext(null);
const EMPTY = new Set();

// Shares which recipes the signed-in user has saved, so every heart on every page agrees
export function SavedRecipesProvider({ children }) {
    const { user } = useAuth();
    const userId = user?.id ?? null;

    // Remember whose IDs these are, so a different user never sees the previous user's saves
    const [loaded, setLoaded] = useState({ userId: null, ids: EMPTY });
    const [pending, setPending] = useState(EMPTY);

    useEffect(() => {
        if (!userId) return;
        let ignore = false;

        getSavedRecipeIds()
            .then((ids) => {
                if (!ignore) setLoaded({ userId, ids: new Set(ids) });
            })
            .catch((err) => {
                console.error("Couldn't load saved recipes:", err);
                if (!ignore) setLoaded({ userId, ids: EMPTY });
            });

        return () => {
            ignore = true;
        };
    }, [userId]);

    const ready = userId !== null && loaded.userId === userId;
    const savedIds = ready ? loaded.ids : EMPTY;

    // Saves or unsaves in Supabase; the heart only changes once the database confirms
    const toggleSave = useCallback(async (recipeId) => {
        const wasSaved = savedIds.has(recipeId);
        setPending((prev) => new Set(prev).add(recipeId));

        try {
            if (wasSaved) {
                await unsaveRecipe(recipeId);
            } else {
                await saveRecipe(recipeId);
            }
            setLoaded((prev) => {
                const ids = new Set(prev.ids);
                if (wasSaved) ids.delete(recipeId);
                else ids.add(recipeId);
                return { ...prev, ids };
            });
        } finally {
            setPending((prev) => {
                const next = new Set(prev);
                next.delete(recipeId);
                return next;
            });
        }
    }, [savedIds]);

    const value = {
        ready,
        isSaved: (recipeId) => savedIds.has(recipeId),
        isPending: (recipeId) => pending.has(recipeId),
        toggleSave,
    };

    return <SavedRecipesContext.Provider value={value}>{children}</SavedRecipesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSavedRecipes() {
    return useContext(SavedRecipesContext);
}
