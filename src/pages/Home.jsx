import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard.jsx";
import SearchBar from '../components/SearchBar'
import '../styles/globals.css'
import { getRecipes, parseListString } from "../services/recipeService.js";

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attempt, setAttempt] = useState(0);

    // Re-runs whenever `page` changes (first load, then each "Load more") or on retry
    useEffect(() => {
        let ignore = false;

        getRecipes({ page })
            .then((result) => {
                if (ignore) return;
                setRecipes((prev) => (page === 0 ? result.recipes : [...prev, ...result.recipes]));
                setHasMore(result.hasMore);
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
    }, [page, attempt]);

    function loadMore() {
        setLoading(true);
        setError(null);
        setPage((prev) => prev + 1);
    }

    function retry() {
        setLoading(true);
        setError(null);
        // Bumping the counter re-runs the effect for the page that failed
        setAttempt((prev) => prev + 1);
    }

    function handleSearch(query) {
        console.log(query);
    }

    return(
        <>
            <h1>Hello, Jane</h1>
            <h3>What will you cook today?</h3>

            <section className="searchbar">
                <SearchBar onSearch={handleSearch}/>
            </section>

            <h2>All Recipes</h2>

            <section className="recipe-cards">
                {recipes.map((recipe) => (
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

            <div className="recipes-status">
                {loading && <p>Loading recipes…</p>}

                {error && (
                    <>
                        <p>Couldn't load recipes: {error}</p>
                        <button className="recipes-button" onClick={retry}>Try again</button>
                    </>
                )}

                {!loading && !error && recipes.length === 0 && <p>No recipes found.</p>}

                {!loading && !error && hasMore && (
                    <button className="recipes-button" onClick={loadMore}>Load more</button>
                )}
            </div>
        </>
    );
}

export default Home;
