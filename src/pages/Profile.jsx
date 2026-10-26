import { useEffect, useRef, useState } from 'react';
import photo from '../assets/12.png';
import calendar from '../assets/Calendar.png';
import '../styles/globals.css';
import { useAuth } from '../context/AuthContext';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import RecipeCard from '../components/RecipeCard.jsx';
import { getMadeRecipes } from '../services/madeRecipeService.js';
import { parseListString } from '../services/recipeService.js';
import {
    NAME_MAX_LENGTH,
    getAvatarUrl,
    getProfile,
    removeAvatar,
    updateDisplayName,
    uploadAvatar,
} from '../services/profileService.js';

function Profile() {
    const { user } = useAuth();
    const { ready: savedReady, savedCount } = useSavedRecipes();
    const joined = user ? new Date(user.created_at).toLocaleDateString() : "";

    const [profile, setProfile] = useState(null);
    const [profileError, setProfileError] = useState("");

    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState("");
    const [photoBusy, setPhotoBusy] = useState(false);
    const [nameBusy, setNameBusy] = useState(false);
    const [actionError, setActionError] = useState("");
    const fileInput = useRef(null);

    const [made, setMade] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;

        getProfile()
            .then((result) => {
                if (ignore) return;
                setProfile(result);
                if (!result) setProfileError("Your profile record wasn't found.");
            })
            .catch((err) => {
                console.error(err);
                if (!ignore) setProfileError("Couldn't load your profile.");
            });

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

    const name = profile?.name || user?.user_metadata?.full_name || user?.email;
    const avatarUrl = getAvatarUrl(profile?.profile_image);

    // Each distinct cuisine across made recipes counts once, e.g. "['American', 'Mexican']" adds two
    const cuisinesExplored = new Set(made.flatMap((recipe) => parseListString(recipe.cuisine))).size;
    const madeStatsReady = !loading && !error;

    function startEditingName() {
        setNameDraft(name || "");
        setActionError("");
        setEditingName(true);
    }

    async function saveName(e) {
        e.preventDefault();
        setNameBusy(true);
        setActionError("");
        try {
            setProfile(await updateDisplayName(nameDraft));
            setEditingName(false);
        } catch (err) {
            console.error(err);
            setActionError(err.message || "Couldn't save your name. Try again.");
        } finally {
            setNameBusy(false);
        }
    }

    async function handlePhotoChosen(e) {
        const file = e.target.files?.[0];
        e.target.value = ""; // allow choosing the same file again later
        if (!file) return;

        setPhotoBusy(true);
        setActionError("");
        try {
            setProfile(await uploadAvatar(file, profile?.profile_image));
        } catch (err) {
            console.error(err);
            setActionError(err.message || "Couldn't upload your picture. Try again.");
        } finally {
            setPhotoBusy(false);
        }
    }

    async function handleRemovePhoto() {
        setPhotoBusy(true);
        setActionError("");
        try {
            setProfile(await removeAvatar(profile?.profile_image));
        } catch (err) {
            console.error(err);
            setActionError(err.message || "Couldn't remove your picture. Try again.");
        } finally {
            setPhotoBusy(false);
        }
    }

    return(
        <>
            <h1>Your Profile</h1>

            {/*profile row with profile statistics*/}
            <div className="profile-overview-row">

                {/*profile personal information card*/}
                <div className="profile-card">
                    <div className="profile-photo">
                        <img src={avatarUrl || photo} alt="" className="profile-image" />
                        <div className="profile-photo-actions">
                            <button
                                type="button"
                                className="profile-link-btn"
                                onClick={() => fileInput.current?.click()}
                                disabled={photoBusy || !profile}
                            >
                                {photoBusy ? "Saving…" : avatarUrl ? "Change photo" : "Upload photo"}
                            </button>
                            {avatarUrl && (
                                <button
                                    type="button"
                                    className="profile-link-btn"
                                    onClick={handleRemovePhoto}
                                    disabled={photoBusy}
                                >
                                    Remove
                                </button>
                            )}
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                hidden
                                onChange={handlePhotoChosen}
                            />
                        </div>
                    </div>

                    <div className="profile-info">
                        {editingName ? (
                            <form className="profile-name-form" onSubmit={saveName}>
                                <input
                                    type="text"
                                    value={nameDraft}
                                    onChange={(e) => setNameDraft(e.target.value)}
                                    maxLength={NAME_MAX_LENGTH}
                                    aria-label="Display name"
                                    autoFocus
                                    required
                                />
                                <button type="submit" className="recipes-button" disabled={nameBusy}>
                                    {nameBusy ? "Saving…" : "Save"}
                                </button>
                                <button
                                    type="button"
                                    className="profile-link-btn"
                                    onClick={() => setEditingName(false)}
                                    disabled={nameBusy}
                                >
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <div className="profile-name-row">
                                <h1>{name}</h1>
                                <button
                                    type="button"
                                    className="profile-link-btn"
                                    onClick={startEditingName}
                                    disabled={!profile}
                                >
                                    Edit name
                                </button>
                            </div>
                        )}
                        <div className="date-row">
                            <img className="calendar-icon" src={calendar} alt=""/>
                            <p>Joined on: {joined}</p>
                        </div>
                        {(actionError || profileError) && (
                            <div className="auth-error" role="alert">{actionError || profileError}</div>
                        )}
                    </div>
                </div>

                {/*column of statistics*/}
                <div className="stats-column">

                    {/*recipes made card*/}
                    <div className="recipe-made-card">
                        <h1>{madeStatsReady ? made.length : "–"}</h1>
                        <p>Recipes Made</p>
                    </div>

                    {/*saved recipes card*/}
                    <div className="stat-card">
                        <h1>{savedReady ? savedCount : "–"}</h1>
                        <p>Saved Recipes</p>
                    </div>

                    {/*cuisines explored card*/}
                    <div className="stat-card">
                        <h1>{madeStatsReady ? cuisinesExplored : "–"}</h1>
                        <p>Cuisines Explored</p>
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
