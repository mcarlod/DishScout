import Navbar from '../components/Navbar'
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
            <header>
                <Navbar />
            </header>

            <main>
                <h1>Hello, User</h1>
                <h3>What will you cook today?</h3>

                <section>
                    <SearchBar onSearch={handleSearch}/>
                </section>

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

export default Home;
