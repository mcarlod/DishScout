import SearchBar from "./SearchBar.jsx";
import "../styles/components.css";

// Quick tag filters shown as "stickers" in the hero; each maps to an existing tag value
const QUICK_TAGS = [
    { label: "Under 30 min", tag: "Under 30 Minutes" },
    { label: "Vegetarian", tag: "Vegetarian Meals" },
    { label: "Gluten free", tag: "Gluten Free" },
    { label: "Kid friendly", tag: "Kid Friendly" },
];

function HomeHero({ greeting, query, onQueryChange, onSearch, activeTag, onTagToggle, collage }) {
    return (
        <section className="home-hero" aria-labelledby="home-hero-title">
            <div className="home-hero-content">
                <p className="home-hero-greeting">{greeting}</p>
                <h1 id="home-hero-title" className="home-hero-title">
                    Find your next <em>favourite</em> dinner.
                </h1>

                <SearchBar value={query} onChange={onQueryChange} onSearch={onSearch} />

                <div className="hero-chips" role="group" aria-label="Quick filters">
                    {QUICK_TAGS.map(({ label, tag }) => (
                        <button
                            key={tag}
                            type="button"
                            className="hero-chip"
                            aria-pressed={activeTag === tag}
                            onClick={() => onTagToggle(tag)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Decorative collage of the first few recipe photos */}
            <div className="hero-collage" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                    <span key={i} className={`hero-plate hero-plate-${i + 1}`}>
                        {collage[i] && (
                            <img
                                src={collage[i]}
                                alt=""
                                onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                            />
                        )}
                    </span>
                ))}
            </div>
        </section>
    );
}

export default HomeHero;
