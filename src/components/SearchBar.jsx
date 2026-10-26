import "../styles/components.css";
import searchIcon from "../assets/Search.png";

// Controlled by the parent so it can be cleared along with the filters
function SearchBar({ value, onChange, onSearch }) {
    function handleSubmit(e) {
        e.preventDefault();
        onSearch(value);
    }

    return (
        <form onSubmit={handleSubmit} className="search-container" role="search">
            <img src={searchIcon} alt="search" className="search-icon"/>
            <input
                type="text"
                placeholder="Search recipe name..."
                aria-label="Search recipe name"
                value={value}
                className="search-bar"
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button
                    type="button"
                    className="search-clear"
                    aria-label="Clear search"
                    onClick={() => {
                        onChange("");
                        onSearch("");
                    }}
                >
                    ×
                </button>
            )}
        </form>
    );
}

export default SearchBar;
