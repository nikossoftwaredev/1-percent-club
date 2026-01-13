import { DifficultyLevel } from "@/lib/db";

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  NINETY: "90%",
  EIGHTY: "80%",
  SEVENTY: "70%",
  SIXTY: "60%",
  FIFTY: "50%",
  FORTYFIVE: "45%",
  FORTY: "40%",
  THIRTYFIVE: "35%",
  THIRTY: "30%",
  TWENTYFIVE: "25%",
  TWENTY: "20%",
  FIFTEEN: "15%",
  TEN: "10%",
  FIVE: "5%",
  ONE: "1%",
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  NINETY: "bg-green-500",
  EIGHTY: "bg-green-400",
  SEVENTY: "bg-lime-500",
  SIXTY: "bg-yellow-500",
  FIFTY: "bg-amber-500",
  FORTYFIVE: "bg-orange-400",
  FORTY: "bg-orange-500",
  THIRTYFIVE: "bg-red-400",
  THIRTY: "bg-red-500",
  TWENTYFIVE: "bg-rose-500",
  TWENTY: "bg-pink-500",
  FIFTEEN: "bg-fuchsia-500",
  TEN: "bg-purple-500",
  FIVE: "bg-violet-500",
  ONE: "bg-indigo-500",
};

// Standard 15-question difficulty order for 1% Club episodes
export const DIFFICULTY_ORDER: DifficultyLevel[] = [
  "NINETY",
  "EIGHTY",
  "SEVENTY",
  "SIXTY",
  "FIFTY",
  "FORTYFIVE",
  "FORTY",
  "THIRTYFIVE",
  "THIRTY",
  "TWENTYFIVE",
  "TWENTY",
  "FIFTEEN",
  "TEN",
  "FIVE",
  "ONE",
];

export const ANSWER_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const getDifficultyLabel = (difficulty: DifficultyLevel): string =>
  DIFFICULTY_LABELS[difficulty] ?? difficulty;

export const getDifficultyColor = (difficulty: DifficultyLevel): string =>
  DIFFICULTY_COLORS[difficulty] ?? "bg-gray-500";
