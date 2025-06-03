import { useEffect, useState } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

const Avatar = ({ src, alt = "Avatar", className = "avatar-img" }) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/avatar-proxy?url=${encodeURIComponent(src)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
          }
        );

        if (!response.ok) throw new Error("Failed to load avatar");

        const blob = await response.blob();
        setAvatarUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Avatar load error:", err);
      }
    };

    fetchAvatar();
  }, [src]);

  return avatarUrl ? (
    <img src={avatarUrl} alt={alt} className={className} />
  ) : (
    <div className={`${className} loading-avatar`}>Loading...</div>
  );
};

export default Avatar;
