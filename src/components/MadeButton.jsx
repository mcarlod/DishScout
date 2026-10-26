import { useEffect, useState } from "react";
import { isRecipeMade, markRecipeMade, unmarkRecipeMade } from "../services/madeRecipeService.js";
import "../styles/components.css";

// "Mark as Made" toggle for the recipe details page; status is loaded from Supabase
function MadeButton({ recipeId }) {
    const [made, setMade] = useState(null); // null while loading
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        isRecipeMade(recipeId)
            .then((result) => {
                if (!ignore) setMade(result);
            })
            .catch((err) => {
                console.error(err);
                if (!ignore) {
                    setMade(false);
                    setError("Couldn't check if you've made this recipe.");
                }
            });

        return () => {
            ignore = true;
        };
    }, [recipeId]);

    async function handleClick() {
        setBusy(true);
        setError("");
        try {
            if (made) {
                await unmarkRecipeMade(recipeId);
            } else {
                await markRecipeMade(recipeId);
            }
            // Only change the status once the database confirms it
            setMade(!made);
        } catch (err) {
            console.error(err);
            setError(made ? "Couldn't undo. Try again." : "Couldn't mark as made. Try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="made-row">
            <button
                type="button"
                className={made ? "made-button made" : "made-button"}
                onClick={handleClick}
                disabled={made === null || busy}
                aria-pressed={Boolean(made)}
            >
                {made ? "✓ Made" : "Mark as Made"}
            </button>
            {made && (
                <button type="button" className="made-undo" onClick={handleClick} disabled={busy}>
                    Undo
                </button>
            )}
            {error && <span className="made-error" role="alert">{error}</span>}
        </div>
    );
}

export default MadeButton;
