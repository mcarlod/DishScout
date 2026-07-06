import "../styles/components.css"
import heart from "../assets/Heart.png"

const RecipeCard = ({ image, recipeName, country, prepTime, servings }) => {
    return (
        <article className="recipe-card">
            <div className="recipe-image-wrapper">
                <img src={image} alt={recipeName} className="recipe-image" />

                <button className="save-button">
                    <img src={heart} alt="heart-icon" className="heart-icon" />
                </button>
            </div>

            <div className="recipe-info">
                <h3 className="recipe-title">{recipeName}</h3>
                <div className="recipe-info-text">
                    <span>{country}</span>
                    <span>{prepTime} min</span>
                    <span>{servings} servings</span>
                </div>

            </div>
        </article>
    )
}
export default RecipeCard