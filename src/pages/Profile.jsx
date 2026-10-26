import { useEffect, useState } from 'react';
import photo from '../assets/12.png';
import calendar from '../assets/Calendar.png';
import '../styles/globals.css';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard.jsx';
import { getMadeRecipes } from '../services/madeRecipeService.js';
import { parseListString } from '../services/recipeService.js';

function Profile() {
    const { user } = useAuth();
    const name = user?.user_metadata?.full_name || user?.email;
    const joined = user ? new Date(user.created_at).toLocaleDateString() : "";

    const [made, setMade] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        getMadeRecipes()
            .then((result) => {
                if (!ignore) setMade(result);
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
    }, []);

    // Each distinct cuisine across made recipes counts as one explored
    const cuisinesExplored = new Set(made.flatMap((recipe) => parseListString(recipe.cuisine))).size;

    return(
        <>
            <h1>Your Profile</h1>

            {/*profile row with profile statistics*/}
            <div className="profile-overview-row">

                {/*profile personal information card*/}
                <div className="profile-card">
                    <img src={photo} alt="" className="profile-image" />
                    <div className="profile-info">
                        <h1>{name}</h1>
                        <div className="date-row">
                            <img className="calendar-icon" src={calendar} alt=""/>
                            <p>Joined on: {joined}</p>
                        </div>
                    </div>
                </div>

                {/*column of statistics*/}
                <div className="stats-column">

                    {/*recipes made card*/}
                    <div className="recipe-made-card">
                        <h1>{loading ? "–" : made.length}</h1>
                        <p>Recipes Made</p>
                    </div>

                    {/*countries explored card*/}
                    <div className="countries-explored-card">
                        <h1>{loading ? "–" : cuisinesExplored}</h1>
                        <p>Countries Explored</p>
                    </div>

                </div>
            </div>

            {/*recently made recipes*/}
            <h2>Recently Made</h2>
            <div className="recently-made">
                {loading && <p className="recently-made-status">Loading made recipes…</p>}

                {error && <p className="recently-made-status">Couldn't load made recipes: {error}</p>}

                {!loading && !error && made.length === 0 && (
                    <div className="empty-state">
                        <h2>No recipes made yet</h2>
                        <p>Tap "Mark as Made" on any recipe once you've cooked it.</p>
                    </div>
                )}

                {made.map((recipe) => (
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
        </>
    )
}

export default Profile;
