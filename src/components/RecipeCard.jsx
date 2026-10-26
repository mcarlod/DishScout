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
                    {country && <span>{country}</span>}
                    {prepTime != null && <span>{prepTime} min</span>}
                    {servings != null && <span>{servings} servings</span>}
                </div>

            </div>
        </article>
    )
}
export default RecipeCard
