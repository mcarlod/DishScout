import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import '../styles/globals.css'

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
                    {/*recipe cards*/}
                </section>
            </main>
        </>
    );
}

export default Home;
