export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
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
  return (
    displayName
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
}

/**
 * Format time in seconds to human readable format
 * @param seconds Time in seconds
 * @returns Formatted time string (e.g., "2h 30m" or "45m")
 */
export const formatTimeSpent = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
/**
 * Format date to relative time (e.g., "2 hours ago", "3 days ago")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export const formatLastAccessed = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInMinutes < 1440)
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  return `${Math.floor(diffInMinutes / 1440)} days ago`;
};


/**
 * Format percentage with proper rounding
 * @param value Decimal value (0-1) or percentage (0-100)
 * @param isDecimal Whether the input is a decimal (0-1) or percentage (0-100)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  isDecimal: boolean = false
): string => {
  const percentage = isDecimal ? value * 100 : value;
  return `${Math.round(percentage)}%`;
};

/**
 * Truncate text to specified length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Calculate completion percentage
 * @param completed Number of completed items
 * @param total Total number of items
 * @returns Percentage (0-100)
 */
export const calculatePercentage = (
  completed: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Format large numbers with appropriate suffixes (K, M, B)
 * @param num Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

/**
 * Check if a date is today
 * @param date Date to check
 * @returns Boolean indicating if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const checkDate = typeof date === "string" ? new Date(date) : date;

  return today.toDateString() === checkDate.toDateString();
};

/**
 * Format date to readable string
 * @param date Date to format
 * @param options Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", options);
};

/**
 * Debounce function to limit function calls
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate a random ID string
 * @param length Length of the ID
 * @returns Random ID string
 */
export const generateId = (length: number = 8): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Capitalize first letter of a string
 * @param str String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert camelCase or snake_case to Title Case
 * @param str String to convert
 * @returns Title case string
 */
export const toTitleCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize first letter of each word
    .trim();
};
