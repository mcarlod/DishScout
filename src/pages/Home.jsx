import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard.jsx";
import SearchBar from '../components/SearchBar'
import RecipeFilters from "../components/RecipeFilters.jsx";
import '../styles/globals.css'
import { getRecipes, parseListString } from "../services/recipeService.js";

const NO_FILTERS = { search: "", cuisine: "", tag: "" };

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attempt, setAttempt] = useState(0);

    // `query` is what's typed; `filters` is what's actually sent to Supabase
    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState(NO_FILTERS);

    // Re-runs on first load, each "Load more", a retry, or when search/filters change
    useEffect(() => {
        let ignore = false;

        getRecipes({ page, ...filters })
            .then((result) => {
                if (ignore) return;
                setRecipes((prev) => (page === 0 ? result.recipes : [...prev, ...result.recipes]));
                setHasMore(result.hasMore);
                setTotal(result.totalCount);
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
    }, [page, attempt, filters]);

    // Search as the user types, waiting until they pause for 300ms
    useEffect(() => {
        const term = query.trim();
        if (term === filters.search) return;

        const timer = setTimeout(() => applyFilters({ search: term }), 300);
        return () => clearTimeout(timer);
    }, [query, filters.search]);

    // Any change to search or filters starts again from the first page
    function applyFilters(changes) {
        setFilters((prev) => ({ ...prev, ...changes }));
        setPage(0);
        setRecipes([]);
        setHasMore(false);
        setLoading(true);
        setError(null);
    }

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

    function handleSearch(value) {
        const term = value.trim();
        if (term !== filters.search) applyFilters({ search: term });
    }

    function clearAll() {
        setQuery("");
        applyFilters(NO_FILTERS);
    }

    const isFiltering = Boolean(filters.search || filters.cuisine || filters.tag);
    const canClear = isFiltering || query !== "";

    return(
        <>
            <h1>Hello, Jane</h1>
            <h3>What will you cook today?</h3>

            <section className="searchbar">
                <SearchBar value={query} onChange={setQuery} onSearch={handleSearch}/>
                <RecipeFilters
                    cuisine={filters.cuisine}
                    tag={filters.tag}
                    onChange={applyFilters}
                    onClear={clearAll}
                    canClear={canClear}
                />
            </section>

            <h2>
                {isFiltering
                    ? (total != null && !loading ? `${total} ${total === 1 ? "recipe" : "recipes"} found` : "Searching…")
                    : "All Recipes"}
            </h2>

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

                {!loading && !error && recipes.length === 0 && (
                    <>
                        <p>No recipes found.</p>
                        {isFiltering && (
                            <>
                                <p>Try a different search or clear your filters.</p>
                                <button className="recipes-button" onClick={clearAll}>Clear search & filters</button>
                            </>
                        )}
                    </>
                )}

                {!loading && !error && hasMore && (
                    <button className="recipes-button" onClick={loadMore}>Load more</button>
                )}
            </div>
        </>
    );
}

export default Home;
