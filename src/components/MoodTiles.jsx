import "../styles/components.css";

// Each tile applies an existing cuisine or tag filter.
// Counts are from the current recipes table; update them if the data changes.
const MOODS = [
    { title: "Quick weeknight dinners", detail: "607 recipes ready in under 30 minutes", filter: { tag: "Under 30 Minutes" }, tone: "saffron" },
    { title: "Vegetarian", detail: "473 recipes", filter: { tag: "Vegetarian Meals" }, tone: "sage" },
    { title: "Slow cooker", detail: "68 recipes", filter: { tag: "Slow Cooker Recipes" }, tone: "peach" },
    { title: "Italian", detail: "121 recipes", filter: { cuisine: "Italian" }, tone: "forest" },
    { title: "Air fryer", detail: "31 recipes", filter: { tag: "Air Fryer Recipes" }, tone: "plain" },
];

function MoodTiles({ onPick }) {
    return (
        <section className="mood-section" aria-labelledby="mood-title">
            <h2 id="mood-title">What are you in the mood for?</h2>
            <div className="mood-grid">
                {MOODS.map((mood) => (
                    <button
                        key={mood.title}
                        type="button"
                        className={`mood-tile mood-${mood.tone}`}
                        onClick={() => onPick(mood.filter)}
                    >
                        <span className="mood-title">{mood.title}</span>
                        <span className="mood-detail">{mood.detail}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}

export default MoodTiles;
