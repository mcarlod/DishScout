import RecipeCard from "../components/RecipeCard.jsx";
import SearchBar from '../components/SearchBar'
import '../styles/globals.css'
import pepperpot from "../assets/Rectangle 5.png"

function Home() {
    function handleSearch(query) {
        console.log(query);
    }

    return(
        <>
            <h1>Hello, Jane</h1>
            <h3>What will you cook today?</h3>

            <section className="searchbar">
                <SearchBar onSearch={handleSearch}/>
            </section>

            <h2>All Recipes</h2>

            <section>
                <RecipeCard
                    image={pepperpot}
                    recipeName="Barbados Pepperpot"
                    country="Guyana"
                    prepTime={45}
                    servings={4}
                />
            </section>
        </>
    );
}

export default Home;
