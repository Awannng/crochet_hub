import { supabase } from "./client";

// calculate how many time ago the post had been posted
export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? "" : "s"} ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return `${interval} minute${interval === 1 ? "" : "s"} ago`;

  return "just now";
};

// handles uplaod images to supabase storage and get image url back
export const uploadImage = async (file) => {
  // validate file
  if (!file) {
    alert("Please select an image");
  }
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file (JPEG, PNG, etc.)");
  }

  // Add file size validation (e.g., 5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size too large (max 5MB)");
  }

  const fileName = `images/${Date.now()}_${file.name}`;

  //upload to supabase storage
  const { data, error } = await supabase.storage
    .from("post-image")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // get public URL
  const imageURL = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/${"post-image"}/${data.path}`;

  return imageURL;
};
