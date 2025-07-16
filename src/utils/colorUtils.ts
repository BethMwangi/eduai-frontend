/**
 * Get color classes for a subject based on subject name
 * @param subject Name of the subject
 * @returns Tailwind CSS class string for the subject
 */
export const getSubjectColor = (subject: string) => {
  switch (subject.toLowerCase()) {
    case "mathematics":
      return "bg-blue-100 text-blue-600";
    case "english":
      return "bg-purple-100 text-purple-600";
    case "science":
      return "bg-green-100 text-green-600";
    case "physics":
      return "bg-cyan-100 text-cyan-600";
    case "chemistry":
      return "bg-emerald-100 text-emerald-600";
    case "biology":
      return "bg-lime-100 text-lime-600";
    case "history":
      return "bg-amber-100 text-amber-600";
    case "geography":
      return "bg-orange-100 text-orange-600";
    case "social studies":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

/**
 * Get color classes for difficulty level
 * @param difficulty Difficulty level (Easy, Medium, Hard)
 * @returns Tailwind CSS class string for the difficulty
 */
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/**
 * Get color classes for question type
 * @param type Question type
 * @returns Tailwind CSS class string for the question type
 */
export const getQuestionTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "multiple choice":
      return "bg-indigo-100 text-indigo-700";
    case "essay":
      return "bg-pink-100 text-pink-700";
    case "short answer":
      return "bg-violet-100 text-violet-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};