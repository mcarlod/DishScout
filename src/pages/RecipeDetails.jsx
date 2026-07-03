import { useParams } from "react-router-dom";

function RecipeDetails() {
    const { id } = useParams();
    return <h1>Recipe Details Pag for recipe {id}</h1>
}

export default RecipeDetails;
