import Navbar from '../components/Navbar'
import RecipeCard from "../components/RecipeCard.jsx";
import pepperpot from "../assets/Rectangle 5.png"

function SavedRecipes() {
    return(
        <>
            <header>
                <Navbar />
            </header>

            <main>
                <h1>Your Saved Recipes</h1>

                <section>
                    <RecipeCard
                        image={pepperpot}
                        recipeName="Barbados Pepperpot"
                        country="Guyana"
                        prepTime={45}
                        servings={4}
                    />
                </section>
            </main>
        </>
    );
}

export default SavedRecipes;