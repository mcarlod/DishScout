import { Link } from "react-router-dom";
import "../styles/components.css"
import placeholderImage from "../assets/Rectangle 5.png"
import HeartButton from "./HeartButton.jsx";

const RecipeCard = ({ recipeId, image, recipeName, country, prepTime, servings }) => {
    return (
        <article className="recipe-card">
            <div className="recipe-image-wrapper">
                <img
                    src={image || placeholderImage}
                    alt={recipeName}
                    className="recipe-image"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = placeholderImage; }}
                />

                <HeartButton recipeId={recipeId} />
            </div>

            <div className="recipe-info">
                <h3 className="recipe-title">
                    {/* The link stretches over the whole card; the heart sits above it */}
                    <Link to={`/recipes/${recipeId}`} className="recipe-card-link" title={recipeName}>{recipeName}</Link>
                </h3>
                <div className="recipe-info-text">
                    {country && <span className="recipe-chip">{country}</span>}
                    {prepTime != null && (
                        <span className="recipe-chip">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                            {prepTime} min
                        </span>
                    )}
                    {servings != null && (
                        <span className="recipe-chip">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.8c1.6.8 2.6 2.5 3 5.2" /></svg>
                            {servings} servings
                        </span>
                    )}
                </div>

            </div>
        </article>
    )
}
export default RecipeCard
