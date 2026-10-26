import "../styles/components.css";
import { CUISINE_OPTIONS, TAG_OPTIONS } from "../services/recipeService.js";

function RecipeFilters({ cuisine, tag, onChange, onClear, canClear }) {
    return (
        <div className="filter-row">
            <select
                className="filter-select"
                aria-label="Filter by cuisine"
                value={cuisine}
                onChange={(e) => onChange({ cuisine: e.target.value })}
            >
                <option value="">All cuisines</option>
                {CUISINE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>

            <select
                className="filter-select"
                aria-label="Filter by tag"
                value={tag}
                onChange={(e) => onChange({ tag: e.target.value })}
            >
                <option value="">All tags</option>
                {TAG_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>

            {canClear && (
                <button type="button" className="clear-filters-btn" onClick={onClear}>
                    Clear filters
                </button>
            )}
        </div>
    );
}

export default RecipeFilters;
