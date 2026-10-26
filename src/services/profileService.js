import { supabase } from "./supabase.js";

const AVATAR_BUCKET = "avatars";
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
export const NAME_MAX_LENGTH = 50;

// The user ID always comes from the signed-in Supabase session, never from the UI.
// RLS also checks this on the database side.
async function getCurrentUserId() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    const userId = data.session?.user?.id;
    if (!userId) throw new Error("You need to be signed in.");
    return userId;
}

// profile_image holds a path inside the avatars bucket, e.g. "<user id>/avatar-123.png".
// A full URL (e.g. set some other way) is used as-is.
const isExternalUrl = (value) => /^https?:\/\//i.test(value);

// Turn a stored profile_image into a URL the <img> can load
export function getAvatarUrl(path) {
    if (!path) return null;
    if (isExternalUrl(path)) return path;
    return supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
}

// Only delete files this app stored in the avatars bucket
async function deleteStoredAvatar(path) {
    if (!path || isExternalUrl(path)) return;
    const { error } = await supabase.storage.from(AVATAR_BUCKET).remove([path]);
    // The profile is already updated, so a leftover file isn't worth failing over
    if (error) console.error("Couldn't delete old profile picture:", error);
}

// The signed-in user's row from public.profiles (null if it doesn't exist yet)
export async function getProfile() {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, profile_image")
        .eq("id", userId)
        .maybeSingle();

    if (error) throw error;
    return data;
}

// Update only the current user's profile row and return the saved row
async function updateProfile(changes) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
        .from("profiles")
        .update(changes)
        .eq("id", userId)
        .select("id, name, email, profile_image")
        .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Your profile record wasn't found.");
    return data;
}

export async function updateDisplayName(name) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Display name can't be empty.");
    if (trimmed.length > NAME_MAX_LENGTH) throw new Error(`Display name must be ${NAME_MAX_LENGTH} characters or fewer.`);
    return updateProfile({ name: trimmed });
}

// Uploads into the user's own folder (avatars/<user id>/...), then removes the old picture
export async function uploadAvatar(file, previousPath) {
    const ext = AVATAR_TYPES[file.type];
    if (!ext) throw new Error("Please choose a JPG, PNG, WebP or GIF image.");
    if (file.size > AVATAR_MAX_BYTES) throw new Error("Please choose an image under 2 MB.");

    const userId = await getCurrentUserId();
    // A new file name each time so browsers don't keep showing the old cached picture
    const path = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, file, { contentType: file.type });
    if (uploadError) throw uploadError;

    let profile;
    try {
        profile = await updateProfile({ profile_image: path });
    } catch (err) {
        // Don't leave an orphaned file if the profile couldn't be updated
        await deleteStoredAvatar(path);
        throw err;
    }

    await deleteStoredAvatar(previousPath);
    return profile;
}

export async function removeAvatar(currentPath) {
    const profile = await updateProfile({ profile_image: null });
    await deleteStoredAvatar(currentPath);
    return profile;
}
