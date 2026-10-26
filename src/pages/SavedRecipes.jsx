import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard.jsx";
import { useSavedRecipes } from "../context/SavedRecipesContext";
import { getSavedRecipes } from "../services/savedRecipeService.js";
import { parseListString } from "../services/recipeService.js";
import '../styles/globals.css'

function SavedRecipes() {
    const { ready, isSaved } = useSavedRecipes();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let ignore = false;

        getSavedRecipes()
            .then((result) => {
                if (!ignore) setRecipes(result);
            })
            .catch((err) => {
                if (!ignore) setError(err.message || "Something went wrong.");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [attempt]);

    function retry() {
        setLoading(true);
        setError(null);
        setAttempt((prev) => prev + 1);
    }

    // Once a recipe is unsaved (and the database confirmed it), drop it from the list
    const visible = ready ? recipes.filter((recipe) => isSaved(recipe.id)) : recipes;
    const isEmpty = !loading && !error && visible.length === 0;

    return(
        <>
            <h1>Your Saved Recipes</h1>

            {visible.length > 0 && (
                <section className="recipe-cards">
                    {visible.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipeId={recipe.id}
                            image={recipe.image}
                            recipeName={recipe.recipe_name}
                            country={parseListString(recipe.cuisine).join(", ")}
                            prepTime={recipe.prep_time_minutes}
                            servings={recipe.servings}
                        />
                    ))}
                </section>
            )}

            <div className="recipes-status">
                {loading && <p>Loading saved recipes…</p>}

                {error && (
                    <>
                        <p>Couldn't load saved recipes: {error}</p>
                        <button className="recipes-button" onClick={retry}>Try again</button>
                    </>
                )}

                {isEmpty && (
                    <div className="empty-state">
                        <h2>No saved recipes yet</h2>
                        <p>Tap the heart on any recipe to save it here.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default SavedRecipes;
