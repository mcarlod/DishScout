import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HeartButton from "../components/HeartButton.jsx";
import MadeButton from "../components/MadeButton.jsx";
import placeholderImage from "../assets/Rectangle 5.png";
import { getRecipeById, parseListString, parseTags } from "../services/recipeService.js";
import '../styles/globals.css'

function RecipeDetails() {
    const { id } = useParams();
    const recipeId = Number(id);
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        getRecipeById(recipeId)
            .then((result) => {
                if (!ignore) setRecipe(result);
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
    }, [recipeId]);

    if (loading) return <div className="recipes-status"><p>Loading recipe…</p></div>;
    if (error) return <div className="recipes-status"><p>Couldn't load recipe: {error}</p></div>;
    if (!recipe) {
        return (
            <div className="recipes-status">
                <p>Recipe not found.</p>
                <Link to="/home" className="recipes-button">Back to recipes</Link>
            </div>
        );
    }

    const cuisine = parseListString(recipe.cuisine).join(", ");
    const ingredients = parseListString(recipe.ingredients);
    const steps = parseListString(recipe.cooking_method);
    const tags = parseTags(recipe.tags);

    return (
        <article className="recipe-details">
            <Link to="/home" className="back-link">← Back to recipes</Link>

            <div className="recipe-details-image-wrapper">
                <img
                    src={recipe.image || placeholderImage}
                    alt={recipe.recipe_name}
                    className="recipe-image"
                    onError={(e) => { e.currentTarget.src = placeholderImage; }}
                />
                <HeartButton recipeId={recipe.id} />
            </div>

            <h1>{recipe.recipe_name}</h1>
            <div className="recipe-info-text recipe-details-meta">
                {cuisine && <span>{cuisine}</span>}
                {recipe.prep_time_minutes != null && <span>{recipe.prep_time_minutes} min</span>}
                {recipe.servings != null && <span>{recipe.servings} servings</span>}
            </div>

            {tags.length > 0 && (
                <ul className="recipe-tags">
                    {tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
            )}

            <MadeButton recipeId={recipe.id} />

            <div className="recipe-details-sections">
                <section className="recipe-details-panel">
                    <h2>Ingredients</h2>
                    <ul className="ingredient-list">
                        {ingredients.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </section>

                <section className="recipe-details-panel">
                    <h2>Instructions</h2>
                    <ol className="step-list">
                        {steps.map((step, index) => <li key={index}>{step}</li>)}
                    </ol>
                </section>
            </div>
        </article>
    );
}

export default RecipeDetails;
