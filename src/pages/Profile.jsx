import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/globals.css';
import { useAuth } from '../context/AuthContext';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import { useProfile } from '../context/ProfileContext';
import RecipeCard from '../components/RecipeCard.jsx';
import { getMadeRecipes } from '../services/madeRecipeService.js';
import { parseListString } from '../services/recipeService.js';
import {
    NAME_MAX_LENGTH,
    getAvatarUrl,
    removeAvatar,
    updateDisplayName,
    uploadAvatar,
} from '../services/profileService.js';

function Profile() {
    const { user } = useAuth();
    const { ready: savedReady, savedCount } = useSavedRecipes();
    const joined = user
        ? new Date(user.created_at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
        : "";

    // Shared profile (loaded once per user), so the name and photo show instantly
    const { ready: profileReady, profile, error: profileLoadError, setProfile } = useProfile();
    const profileError = !profileReady
        ? ""
        : profileLoadError
            ? "Couldn't load your profile."
            : profile ? "" : "Your profile record wasn't found.";

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
    // Shown in place of a photo, e.g. "Jane Doe" -> "JD"
    const initials = (name || "").split(/\s+/).filter(Boolean).slice(0, 2)
        .map((word) => word[0].toUpperCase()).join("") || "?";

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
            {/*profile header panel*/}
            <section className="profile-hero" aria-label="Your profile">
                <div className="profile-avatar-block">
                    <div className="profile-avatar">
                        {avatarUrl
                            ? <img src={avatarUrl} alt="Your profile photo" className="profile-image" />
                            : <span className="profile-initials" aria-hidden="true">{initials}</span>}
                        <button
                            type="button"
                            className="profile-photo-btn"
                            aria-label={avatarUrl ? "Change profile photo" : "Upload profile photo"}
                            title={avatarUrl ? "Change photo" : "Upload photo"}
                            onClick={() => fileInput.current?.click()}
                            disabled={photoBusy || !profile}
                        >
                            {photoBusy
                                ? <span className="profile-photo-spinner" aria-hidden="true" />
                                : (
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                                        <circle cx="12" cy="13" r="3.5" />
                                    </svg>
                                )}
                        </button>
                    </div>
                    {avatarUrl && (
                        <button
                            type="button"
                            className="profile-text-btn"
                            onClick={handleRemovePhoto}
                            disabled={photoBusy}
                        >
                            Remove photo
                        </button>
                    )}
                    <span className="profile-photo-hint">JPG, PNG, WebP or GIF · max 2 MB</span>
                    <input
                        ref={fileInput}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        hidden
                        onChange={handlePhotoChosen}
                    />
                </div>

                <div className="profile-details">
                    <p className="profile-eyebrow">Your profile</p>
                    {editingName ? (
                        <form className="profile-name-form" onSubmit={saveName}>
                            <label className="profile-name-label" htmlFor="display-name">Display name</label>
                            <input
                                id="display-name"
                                type="text"
                                value={nameDraft}
                                onChange={(e) => setNameDraft(e.target.value)}
                                maxLength={NAME_MAX_LENGTH}
                                autoFocus
                                required
                            />
                            <div className="profile-name-actions">
                                <button type="submit" className="profile-save-btn" disabled={nameBusy}>
                                    {nameBusy ? "Saving…" : "Save"}
                                </button>
                                <button
                                    type="button"
                                    className="profile-cancel-btn"
                                    onClick={() => setEditingName(false)}
                                    disabled={nameBusy}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-name-row">
                            <h1>{name}</h1>
                            <button
                                type="button"
                                className="profile-edit-btn"
                                aria-label="Edit name"
                                title="Edit name"
                                onClick={startEditingName}
                                disabled={!profile}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M4 20h4L19 9l-4-4L4 16z" />
                                    <path d="M14 6l4 4" />
                                </svg>
                            </button>
                        </div>
                    )}
                    {joined && (
                        <p className="profile-joined">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="3" y="5" width="18" height="16" rx="2" />
                                <path d="M3 10h18M8 3v4M16 3v4" />
                            </svg>
                            Joined {joined}
                        </p>
                    )}
                    {(actionError || profileError) && (
                        <div className="auth-error" role="alert">{actionError || profileError}</div>
                    )}
                </div>
            </section>

            {/*statistics, overlapping the bottom of the header panel*/}
            <section className="stats-row" aria-label="Your cooking stats">
                <div className="stat-tile stat-made">
                    <span className="stat-number">{madeStatsReady ? made.length : "–"}</span>
                    <span className="stat-label">Recipes made</span>
                </div>
                <div className="stat-tile stat-saved">
                    <span className="stat-number">{savedReady ? savedCount : "–"}</span>
                    <span className="stat-label">Saved recipes</span>
                </div>
                <div className="stat-tile stat-cuisines">
                    <span className="stat-number">{madeStatsReady ? cuisinesExplored : "–"}</span>
                    <span className="stat-label">Cuisines explored</span>
                </div>
            </section>

            {/*recently made recipes, in the same grid as Home*/}
            <section className="recent-section" aria-labelledby="recent-title">
                <div className="results-header">
                    <h2 id="recent-title">Recently made</h2>
                    {madeStatsReady && (
                        <span className="count-badge">{made.length} {made.length === 1 ? "recipe" : "recipes"}</span>
                    )}
                    <Link to="/home" className="recent-browse-link">Browse more recipes →</Link>
                </div>

                {loading && <p className="recipes-status">Loading made recipes…</p>}

                {error && <p className="recipes-status">Couldn't load made recipes: {error}</p>}

                {!loading && !error && made.length === 0 && (
                    <div className="empty-state profile-empty">
                        <h2>No recipes made yet</h2>
                        <p>Tap "Mark as Made" on any recipe once you've cooked it.</p>
                        <Link to="/home" className="recipes-button">Browse recipes</Link>
                    </div>
                )}

                {made.length > 0 && (
                    <div className="recipe-cards">
                        {made.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipeId={recipe.id}
                                image={recipe.image}
                                recipeName={recipe.recipe_name}
                                country={parseListString(recipe.cuisine).join(", ")}
                                prepTime={recipe.prep_time_minutes}
                                servings={recipe.servings}
                                badge="Made"
                            />
                        ))}
                        <Link to="/home" className="cook-new-tile">
                            <span className="cook-new-plus" aria-hidden="true">+</span>
                            <span className="cook-new-title">Cook something new</span>
                            <span className="cook-new-text">Mark a recipe as made and it shows up here</span>
                        </Link>
                    </div>
                )}
            </section>
        </>
    )
}

export default Profile;
