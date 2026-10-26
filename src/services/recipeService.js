import { supabase } from "./supabase.js";

const RECIPES_PAGE_SIZE = 12;

// Only the columns the recipe cards need
export const CARD_COLUMNS = "id, recipe_name, cuisine, image, prep_time_minutes, servings";

const DETAIL_COLUMNS = `${CARD_COLUMNS}, ingredients, cooking_method, tags`;

// Some columns store Python-style list strings, e.g. "['American', 'Mexican']".
// Turn them into a JS array for display without changing the database.
// Reads each quoted item character by character, so commas or quotes inside
// an item (e.g. "1 cup (don't pack it), sifted") don't break it apart.
export function parseListString(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    const text = value.trim();
    if (!text.startsWith("[")) return [text];

    const items = [];
    let i = 1;
    while (i < text.length) {
        const quote = text[i];
        if (quote === "'" || quote === '"') {
            let item = "";
            i++;
            while (i < text.length && text[i] !== quote) {
                if (text[i] === "\\" && i + 1 < text.length) {
                    i++;
                    const esc = text[i];
                    if (esc === "x" || esc === "u") {
                        // Python escapes like \xa0 or ’
                        const len = esc === "x" ? 2 : 4;
                        item += String.fromCharCode(parseInt(text.substr(i + 1, len), 16));
                        i += len;
                    } else {
                        item += esc === "n" ? "\n" : esc === "t" ? "\t" : esc;
                    }
                } else {
                    item += text[i];
                }
                i++;
            }
            items.push(item.trim());
        }
        i++;
    }
    return items.filter(Boolean);
}

// Tags are stored as plain comma-separated text, e.g. "Dairy Free, Kid Friendly"
export function parseTags(value) {
    if (!value) return [];
    return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}

// Fetch a single recipe with everything the details page shows
export async function getRecipeById(id) {
    const { data, error } = await supabase
        .from("recipes")
        .select(DETAIL_COLUMNS)
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data;
}

// Every cuisine and tag currently in the recipes table, for the filter dropdowns.
// Update these if new values are added to the data.
export const CUISINE_OPTIONS = [
    "American", "Argentinian", "Asian", "Brazilian", "Chinese", "Cuban", "Czech", "Greek",
    "Hawaiian", "Hungarian", "Indian", "Italian", "Japanese", "Latin", "Mediterranean",
    "Mexican", "Tex Mex",
];

export const TAG_OPTIONS = [
    "Air Fryer Recipes", "Dairy Free", "Freezer Meals", "Gluten Free", "Keto Recipes",
    "Kid Friendly", "Low Carb", "Meal Prep Recipes", "Paleo", "Pressure Cooker Recipes",
    "Slow Cooker Recipes", "Under 30 Minutes", "Vegetarian Meals", "Whole 30 Recipes",
];

// Stop characters the user types (%, _, \) from acting as LIKE wildcards
function escapeLike(text) {
    return text.replace(/[\\%_]/g, (char) => `\\${char}`).replace(/\*/g, "");
}

// Fetch one page of recipes (page starts at 0), filtered on the server
export async function getRecipes({ page = 0, pageSize = RECIPES_PAGE_SIZE, search = "", cuisine = "", tag = "" } = {}) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from("recipes")
        .select(CARD_COLUMNS, { count: "exact" });

    const term = search.trim();
    if (term) query = query.ilike("recipe_name", `%${escapeLike(term)}%`);

    // cuisine looks like "['American', 'Mexican']", so match the quoted name exactly
    if (cuisine) query = query.ilike("cuisine", `%'${cuisine}'%`);

    // tags looks like "Dairy Free, Kid Friendly"
    if (tag) query = query.ilike("tags", `%${tag}%`);

    const { data, error, count } = await query
        .order("id", { ascending: true })
        .range(from, to);

    if (error) throw error;

    return {
        recipes: data,
        totalCount: count,
        hasMore: to + 1 < count,
    };
}
