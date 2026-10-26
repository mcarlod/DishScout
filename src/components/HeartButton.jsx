import { useState } from "react";
import { useSavedRecipes } from "../context/SavedRecipesContext";
import "../styles/components.css";

function HeartButton({ recipeId }) {
    const { ready, isSaved, isPending, toggleSave } = useSavedRecipes();
    const [error, setError] = useState("");

    const saved = isSaved(recipeId);
    const busy = !ready || isPending(recipeId);

    async function handleClick(e) {
        // Keep the click from reaching the card link underneath
        e.preventDefault();
        e.stopPropagation();
        if (busy) return;

        setError("");
        try {
            await toggleSave(recipeId);
        } catch (err) {
            console.error(err);
            setError(saved ? "Couldn't remove. Try again." : "Couldn't save. Try again.");
        }
    }

    return (
        <>
            <button
                type="button"
                className={saved ? "save-button saved" : "save-button"}
                onClick={handleClick}
                disabled={busy}
                aria-pressed={saved}
                aria-label={saved ? "Remove from saved recipes" : "Save recipe"}
                title={saved ? "Remove from saved" : "Save recipe"}
            >
                <svg className="heart-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
            </button>
            {error && <span className="save-error" role="alert">{error}</span>}
        </>
    );
}

export default HeartButton;
