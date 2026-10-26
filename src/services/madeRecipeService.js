import { supabase } from "./supabase.js";
import { CARD_COLUMNS } from "./recipeService.js";

// Postgres error code for a unique constraint violation
const UNIQUE_VIOLATION = "23505";

// The user ID always comes from the signed-in Supabase session, never from the UI.
// RLS also checks this on the database side.
async function getCurrentUserId() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    const userId = data.session?.user?.id;
    if (!userId) throw new Error("You need to be signed in to mark recipes as made.");
    return userId;
}

// Whether the current user has marked this recipe as made
export async function isRecipeMade(recipeId) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
        .from("made_recipes")
        .select("id")
        .eq("user_id", userId)
        .eq("recipe_id", recipeId)
        .limit(1);

    if (error) throw error;
    return data.length > 0;
}

// The current user's made recipes joined with their recipe data, most recent first
export async function getMadeRecipes() {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
        .from("made_recipes")
        .select(`created_at, recipe:recipes(${CARD_COLUMNS})`)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;

    // Show each recipe once, even if it was somehow recorded twice
    const seen = new Set();
    return data
        .map((row) => row.recipe)
        .filter((recipe) => recipe && !seen.has(recipe.id) && seen.add(recipe.id));
}

export async function markRecipeMade(recipeId) {
    const userId = await getCurrentUserId();
    const { error } = await supabase
        .from("made_recipes")
        .insert({ user_id: userId, recipe_id: recipeId });

    // Already marked (e.g. from another tab) counts as success
    if (error && error.code !== UNIQUE_VIOLATION) throw error;
}

export async function unmarkRecipeMade(recipeId) {
    const userId = await getCurrentUserId();
    const { error } = await supabase
        .from("made_recipes")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", recipeId);

    if (error) throw error;
}
