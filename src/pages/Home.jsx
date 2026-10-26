import { useEffect, useRef, useState } from "react";
import RecipeCard from "../components/RecipeCard.jsx";
import RecipeFilters from "../components/RecipeFilters.jsx";
import HomeHero from "../components/HomeHero.jsx";
import MoodTiles from "../components/MoodTiles.jsx";
import '../styles/globals.css'
import { getRecipes, parseListString } from "../services/recipeService.js";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";

const NO_FILTERS = { search: "", cuisine: "", tag: "" };
const SKELETON_CARDS = 6;

function timeOfDayGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

function Home() {
    const { user } = useAuth();
    // Shared profile, already loaded at sign-in, so the greeting has the name on first render
    const { ready: profileReady, profile } = useProfile();

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

    // Hero collage photos, taken once from the first unfiltered page so they don't change while searching
    const [collage, setCollage] = useState([]);
    const resultsRef = useRef(null);

    // Re-runs on first load, each "Load more", a retry, or when search/filters change
    useEffect(() => {
        let ignore = false;

        getRecipes({ page, ...filters })
            .then((result) => {
                if (ignore) return;
                setRecipes((prev) => (page === 0 ? result.recipes : [...prev, ...result.recipes]));
                setHasMore(result.hasMore);
                setTotal(result.totalCount);
                if (page === 0 && !filters.search && !filters.cuisine && !filters.tag) {
                    setCollage((prev) => (prev.length ? prev : result.recipes.map((r) => r.image).filter(Boolean).slice(0, 3)));
                }
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

    // Tapping the active quick-filter chip turns it off again
    function toggleTag(tag) {
        applyFilters({ tag: filters.tag === tag ? "" : tag });
    }

    // Mood tiles apply a filter, then bring the results into view
    function pickMood(filter) {
        applyFilters(filter);
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Profile name, then the name given at sign-up; nothing while the profile is still loading
    const displayName = profileReady
        ? profile?.name?.trim() || user?.user_metadata?.full_name?.trim() || ""
        : "";
    const greeting = displayName ? `${timeOfDayGreeting()}, ${displayName}` : timeOfDayGreeting();

    const isFiltering = Boolean(filters.search || filters.cuisine || filters.tag);
    const canClear = isFiltering || query !== "";
    const showSkeletons = loading && recipes.length === 0;

    return(
        <>
            <HomeHero
                greeting={greeting}
                query={query}
                onQueryChange={setQuery}
                onSearch={handleSearch}
                activeTag={filters.tag}
                onTagToggle={toggleTag}
                collage={collage}
            />

            {!isFiltering && <MoodTiles onPick={pickMood} />}

            <section className="results-section" ref={resultsRef} aria-labelledby="results-title">
                <div className="results-header">
                    <h2 id="results-title">{isFiltering ? "Search results" : "All recipes"}</h2>
                    {/* Hidden when loading failed, so it doesn't sit on "…" forever */}
                    {!error && (
                        <span className="count-badge" aria-live="polite">
                            {total != null && !loading
                                ? `${total.toLocaleString()} ${total === 1 ? "recipe" : "recipes"}`
                                : "…"}
                        </span>
                    )}
                    <RecipeFilters
                        cuisine={filters.cuisine}
                        tag={filters.tag}
                        onChange={applyFilters}
                        onClear={clearAll}
                        canClear={canClear}
                    />
                </div>

                <div className="recipe-cards" aria-busy={loading}>
                    {showSkeletons && Array.from({ length: SKELETON_CARDS }, (_, i) => (
                        <div key={`skeleton-${i}`} className="recipe-card recipe-card-skeleton" aria-hidden="true">
                            <div className="recipe-image-wrapper" />
                            <div className="recipe-info">
                                <span className="skeleton-line" />
                                <span className="skeleton-line short" />
                            </div>
                        </div>
                    ))}
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
                </div>

                <div className="recipes-status">
                    {error && (
                        <>
                            <p>Couldn't load recipes: {error}</p>
                            <button className="recipes-button" onClick={retry}>Try again</button>
                        </>
                    )}

                    {!loading && !error && recipes.length === 0 && (
                        <div className="empty-state">
                            <h2>No recipes found</h2>
                            {isFiltering && (
                                <>
                                    <p>Try a different search or clear your filters.</p>
                                    <button className="recipes-button" onClick={clearAll}>Clear search & filters</button>
                                </>
                            )}
                        </div>
                    )}

                    {!error && recipes.length > 0 && (hasMore || loading) && (
                        <button className="recipes-button" onClick={loadMore} disabled={loading}>
                            {loading ? "Loading…" : "Show more recipes"}
                        </button>
                    )}
                </div>
            </section>
        </>
    );
}

export default Home;
