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
    if (!userId) throw new Error("You need to be signed in to save recipes.");
    return userId;
}

// IDs of every recipe the current user has saved
export async function getSavedRecipeIds() {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
        .from("saved_recipes")
        .select("recipe_id")
        .eq("user_id", userId);

    if (error) throw error;
    return data.map((row) => row.recipe_id);
}

// The current user's saved recipes joined with their recipe data, newest first
export async function getSavedRecipes() {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
        .from("saved_recipes")
        .select(`created_at, recipe:recipes(${CARD_COLUMNS})`)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map((row) => row.recipe).filter(Boolean);
}

export async function saveRecipe(recipeId) {
    const userId = await getCurrentUserId();
    const { error } = await supabase
        .from("saved_recipes")
        .insert({ user_id: userId, recipe_id: recipeId });

    // Already saved (e.g. from another tab) counts as success
    if (error && error.code !== UNIQUE_VIOLATION) throw error;
}

export async function unsaveRecipe(recipeId) {
    const userId = await getCurrentUserId();
    const { error } = await supabase
        .from("saved_recipes")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", recipeId);

    if (error) throw error;
}
