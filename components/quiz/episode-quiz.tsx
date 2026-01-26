"use client";

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/general/utils";
import { useRouter } from "@/lib/i18n/navigation";
import { getDifficultyLabel } from "@/lib/quiz/difficulty";
import { EpisodeForQuiz } from "@/server-actions/episodes";

const DEFAULT_TIME = 30;
const ANSWER_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

// Common styles
const BACKGROUND_STYLES = {
  backgroundImage: `url('/background.jpg')`,
  backgroundPosition: "center",
  backgroundSize: "cover",
};

const GOLDEN_BUTTON_STYLES =
  "bg-linear-to-r from-yellow-400 to-orange-500 text-black font-bold hover:from-yellow-500 hover:to-orange-600";

const OUTLINE_BUTTON_STYLES =
  "border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10";

// Helper functions
const getAnswerButtonClasses = (
  isSelected: boolean,
  isCorrect: boolean,
  showExplanation: boolean,
  selectedAnswer: number | null,
  index: number,
) => {
  if (!showExplanation) {
    if (isSelected) return "bg-linear-to-r from-yellow-500/20 to-orange-500/20";
    return "bg-card";
  }

  if (isCorrect) return "bg-linear-to-r from-green-500/20 to-green-600/20";

  if (selectedAnswer === index && !isCorrect) return "bg-linear-to-r from-red-500/20 to-red-600/20";

  return "bg-card";
};

const getLetterBadgeClasses = (
  isCorrect: boolean,
  isSelectedIncorrect: boolean,
  showExplanation: boolean,
) => {
  const baseClasses =
    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 bg-gradient-to-br text-black";

  if (!showExplanation) return cn(baseClasses, "from-yellow-400 to-orange-500");
  if (isCorrect) return cn(baseClasses, "from-green-400 to-green-600");
  if (isSelectedIncorrect) return cn(baseClasses, "from-red-400 to-red-600");
  return cn(baseClasses, "from-yellow-400 to-orange-500");
};

interface EpisodeQuizProps {
  episode: EpisodeForQuiz;
  initialQuestionIndex?: number;
}

export const EpisodeQuiz = ({ episode, initialQuestionIndex = 0 }: EpisodeQuizProps) => {
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuestionIndex);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isTextAnswerCorrect, setIsTextAnswerCorrect] = useState<
    boolean | null
  >(null);

  const questions = episode.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Get difficulty percentage
  const difficultyPercentage = currentQuestion
    ? parseInt(
        getDifficultyLabel(
          currentQuestion.difficulty,
        ).replace("%", ""),
      )
    : 50;

  // Determine if question is text input type (single answer = text input)
  const isTextInputQuestion = currentQuestion?.answers.length === 1;

  // Calculate timer progress (percentage of time remaining)
  const timerProgress = (timeLeft / DEFAULT_TIME) * 100;

  // Update URL when question changes
  useEffect(() => {
    const questionNumber = currentQuestionIndex + 1;
    const basePath = `/countries/${episode.season.country.slug}/seasons/${episode.season.number}/episodes/${episode.number}/question`;
    router.replace(`${basePath}/${questionNumber}`);
  }, [currentQuestionIndex, episode.season.country.slug, episode.season.number, episode.number, router]);

  // Timer effect - just for visual effect, no actions when it ends
  useEffect(() => {
    if (showExplanation || isQuizComplete || totalQuestions === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer ends but nothing happens - just visual effect
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showExplanation, isQuizComplete, totalQuestions]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (isTextInputQuestion) {
      const correctAnswer = currentQuestion.answers[0].answerText
        .toLowerCase()
        .trim();
      const userAnswer = textAnswer.toLowerCase().trim();
      const isCorrect = correctAnswer === userAnswer;

      setIsTextAnswerCorrect(isCorrect);
      if (isCorrect) setScore((prev) => prev + 1);
    } else {
      if (selectedAnswer === null) return;

      const isCorrect = currentQuestion.answers[selectedAnswer].isCorrect;
      if (isCorrect) setScore((prev) => prev + 1);
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setTextAnswer("");
      setIsTextAnswerCorrect(null);
      setShowExplanation(false);
      setTimeLeft(DEFAULT_TIME);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleBackToEpisodes = () => {
    router.push(
      `/countries/${episode.season.country.slug}/seasons/${episode.season.number}/episodes`,
    );
  };

  const handleShare = async () => {
    const questionUrl = window.location.href;
    const shareData = {
      title: `1% Club - Question ${currentQuestionIndex + 1}`,
      text: `Can you answer this question? Only ${difficultyPercentage}% of people got it right!`,
      url: questionUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed - copy to clipboard as fallback
        if (err instanceof Error && err.name !== "AbortError") {
          await navigator.clipboard.writeText(questionUrl);
        }
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(questionUrl);
    }
  };

  const canSubmit = isTextInputQuestion
    ? textAnswer.trim().length > 0
    : selectedAnswer !== null;

  // No questions available
  if (totalQuestions === 0) {
    return (
      <div
        className="h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={BACKGROUND_STYLES}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 golden-border">
          <div className="p-8 bg-card backdrop-blur-sm rounded-xl text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">
              No Questions Available
            </h1>
            <p className="text-gray-300 mb-6">
              This episode does not have any questions yet.
            </p>
            <Button onClick={handleBackToEpisodes} className={GOLDEN_BUTTON_STYLES}>
              Back to Episodes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    const successRate = Math.round((score / totalQuestions) * 100);

    return (
      <div
        className="h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={BACKGROUND_STYLES}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 golden-border max-w-2xl w-full mx-4">
          <div className="p-12 bg-card backdrop-blur-sm rounded-xl text-center">
            <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">
              Episode Complete!
            </h1>
            <div className="mb-10">
              <p className="text-7xl font-bold text-yellow-400 mb-4">
                {score}/{totalQuestions}
              </p>
              <p className="text-gray-300 text-xl">Questions Correct</p>
            </div>

            <div className="golden-border-thin mb-10">
              <div className="p-6 bg-card rounded-lg">
                <p className="text-gray-300 mb-2">Success Rate</p>
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">
                  {successRate}%
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleBackToEpisodes}
                className={OUTLINE_BUTTON_STYLES}
              >
                Back to Episodes
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className={GOLDEN_BUTTON_STYLES}
              >
                Play Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={BACKGROUND_STYLES}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40" />

      <ScrollArea className="relative z-10 h-full w-full">
        <div className="flex flex-col max-w-7xl mx-auto">
          {/* Top Header - Question Number */}
          <div className="pt-12 pb-12 shrink-0">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-center text-yellow-400 tracking-wider uppercase" style={{ fontWeight: 950, letterSpacing: '0.05em', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              QUESTION {String(currentQuestionIndex + 1).padStart(2, '0')}
            </h1>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col items-center px-4 pb-12 space-y-6">
            {/* Question Layout - Vertical or Horizontal */}
            {currentQuestion.layout === "HORIZONTAL" && currentQuestion.questionImage ? (
              // Horizontal Layout - Text beside images
              <div className="w-full max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
                  {/* Question Text */}
                  <div className="flex-1">
                    <div className="golden-border h-full">
                      <div className="p-6 bg-card backdrop-blur-sm rounded-xl h-full flex items-center justify-center">
                        <div className="quiz-question wrap-break-word">
                          {currentQuestion.questionText}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Images */}
                  <div className="flex-1">
                    <div className="flex flex-col gap-4 h-full">
                      <div className="flex flex-col md:flex-row gap-4 flex-1">
                        {currentQuestion.questionImage.split(',').map((img, idx) => (
                          <div key={idx} className="flex-1 h-full">
                            <div className="golden-border h-full">
                              <div className="p-0 bg-card backdrop-blur-sm rounded-xl h-full min-h-75 overflow-hidden">
                                <img
                                  src={img.trim()}
                                  alt={`Question ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Extra Text for Horizontal Layout */}
                      {currentQuestion.questionExtraText && (
                        <div className="golden-border">
                          <div className="p-4 bg-card backdrop-blur-sm rounded-xl">
                            <div className="quiz-question wrap-break-word">
                              {currentQuestion.questionExtraText}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Vertical Layout (default) - Text above images
              <>
                {/* Question Text Card */}
                <div className="w-full max-w-4xl">
                  <div className="golden-border">
                    <div className="p-6 bg-card backdrop-blur-sm rounded-xl">
                      <div className="quiz-question wrap-break-word">
                        {currentQuestion.questionText}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Images Cards */}
                {currentQuestion.questionImage && (
                  <div className="w-full max-w-4xl">
                    <div className="flex flex-col md:flex-row gap-4">
                      {currentQuestion.questionImage.split(',').map((img, idx) => (
                        <div key={idx} className="flex-1">
                          <div className="golden-border h-full">
                            <div className="p-4 bg-card backdrop-blur-sm rounded-xl h-full flex items-center justify-center">
                              <img
                                src={img.trim()}
                                alt={`Question ${idx + 1}`}
                                className="w-full h-48 object-contain rounded-lg"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extra Text for Vertical Layout */}
                {currentQuestion.questionExtraText && (
                  <div className="w-full max-w-4xl">
                    <div className="golden-border">
                      <div className="p-4 bg-card backdrop-blur-sm rounded-xl">
                        <div className="quiz-question wrap-break-word">
                          {currentQuestion.questionExtraText}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Answer Section Card */}
            <div className="w-full max-w-4xl">
              <div className="golden-border">
                <div className="p-6 bg-card backdrop-blur-sm rounded-xl">
                  {isTextInputQuestion ? (
                    /* Text Input Answer */
                    <div className="space-y-4">
                      <Input
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        disabled={showExplanation}
                        className={cn(
                          "text-xl py-8 bg-card border-2 text-white placeholder:text-gray-500",
                          showExplanation && (
                            isTextAnswerCorrect
                              ? "border-green-500 bg-green-500/10"
                              : "border-red-500 bg-red-500/10"
                          ),
                          !showExplanation && "border-gray-600 focus:border-yellow-500"
                        )}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && canSubmit && !showExplanation)
                            handleSubmitAnswer();
                        }}
                      />
                      {showExplanation && (
                        <div
                          className={cn(
                            "p-4 rounded-lg border-2",
                            isTextAnswerCorrect
                              ? "bg-green-500/10 border-green-500"
                              : "bg-red-500/10 border-red-500"
                          )}
                        >
                          <p className="font-bold text-white">
                            {isTextAnswerCorrect ? "Correct!" : "Incorrect"}
                          </p>
                          <p className="text-gray-300 mt-1">
                            The correct answer is:{" "}
                            <span className="font-bold text-yellow-400">
                              {currentQuestion.answers[0].answerText}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Multiple Choice Answers */
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                      {currentQuestion.answers.map((answer, index) => {
                        const isSelected = selectedAnswer === index;
                        const isSelectedIncorrect = isSelected && !answer.isCorrect;

                        return (
                          <button
                            key={answer.id}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showExplanation}
                            className={cn(
                              "golden-border-thin transition-all transform hover:scale-105 cursor-pointer",
                              isSelected && !showExplanation && "scale-105",
                              "disabled:hover:scale-100 disabled:cursor-not-allowed",
                              answer.answerImage ? "aspect-square" : "min-h-[80px]"
                            )}
                          >
                            <div
                              className={cn(
                                "rounded-lg flex relative overflow-hidden h-full",
                                answer.answerImage ? "p-0" : "p-4 items-center gap-3",
                                getAnswerButtonClasses(
                                  isSelected,
                                  answer.isCorrect,
                                  showExplanation,
                                  selectedAnswer,
                                  index
                                )
                              )}
                            >
                              {answer.answerImage ? (
                                <>
                                  {/* Image fills the entire square */}
                                  <img
                                    src={answer.answerImage}
                                    alt={`Answer ${ANSWER_LETTERS[index]}`}
                                    className="w-full h-full object-cover"
                                  />
                                  {/* Letter Badge - Positioned absolute */}
                                  <div className="absolute top-1 left-1">
                                    <div
                                      className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-gradient-to-br text-black",
                                        !showExplanation && "from-yellow-400 to-orange-500",
                                        showExplanation && answer.isCorrect && "from-green-400 to-green-600",
                                        showExplanation && isSelectedIncorrect && "from-red-400 to-red-600",
                                        showExplanation && !answer.isCorrect && !isSelectedIncorrect && "from-yellow-400 to-orange-500"
                                      )}
                                    >
                                      {ANSWER_LETTERS[index]}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {/* Text layout with badge inline */}
                                  <div
                                    className={getLetterBadgeClasses(
                                      answer.isCorrect,
                                      isSelectedIncorrect,
                                      showExplanation
                                    )}
                                  >
                                    {ANSWER_LETTERS[index]}
                                  </div>
                                  <span className="text-white text-base font-medium flex-1 text-left wrap-break-word">
                                    {answer.answerText}
                                  </span>
                                </>
                              )}

                              {/* Incorrect Indicator Only */}
                              {showExplanation && isSelectedIncorrect && (
                                <svg
                                  className={cn(
                                    "text-red-400 absolute",
                                    answer.answerImage ? "w-6 h-6 top-1 right-1" : "w-8 h-8 right-4"
                                  )}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Linear Progress Timer */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Difficulty</span>
                      <span className="text-sm font-bold text-yellow-400">{difficultyPercentage}%</span>
                    </div>
                    <Progress
                      value={timerProgress}
                      className="h-2 bg-gray-600 [&>div]:bg-linear-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handleBackToEpisodes}
                      className={OUTLINE_BUTTON_STYLES}
                    >
                      Exit Quiz
                    </Button>
                    {!showExplanation ? (
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!canSubmit}
                        className={cn(
                          "font-bold transition-all",
                          canSubmit
                            ? GOLDEN_BUTTON_STYLES
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={handleShare}
                          className={OUTLINE_BUTTON_STYLES}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          onClick={handleNextQuestion}
                          className={GOLDEN_BUTTON_STYLES}
                        >
                          {currentQuestionIndex < totalQuestions - 1
                            ? "Next Question"
                            : "Finish Quiz"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Card */}
            {showExplanation && currentQuestion.explanation && (
              <div className="w-full max-w-4xl">
                <div className="golden-border">
                  <div className="p-6 bg-card backdrop-blur-sm rounded-xl">
                    <p className="font-bold mb-2 text-yellow-400">
                      Explanation:
                    </p>
                    <p className="text-gray-300 wrap-break-word whitespace-pre-line">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
