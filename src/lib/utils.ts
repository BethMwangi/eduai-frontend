

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getDisplayName(user: {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
}) {
  const rawName =
    user.full_name ||
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    user.email?.split("@")[0] ||
    "User";

  return capitalizeWords(rawName);
}

export function getInitials(displayName: string) {
  return displayName
    .split(" ")
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
}
