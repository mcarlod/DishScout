import "../styles/components.css";

// Controlled by the parent so it can be cleared along with the filters
function SearchBar({ value, onChange, onSearch }) {
    function handleSubmit(e) {
        e.preventDefault();
        onSearch(value);
    }

    return (
        <form onSubmit={handleSubmit} className="search-container" role="search">
            <div className="search-field">
                <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                    type="text"
                    placeholder="Search recipes"
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
            </div>
            <button type="submit" className="search-submit">Find recipes</button>
        </form>
    );
}

export default SearchBar;
