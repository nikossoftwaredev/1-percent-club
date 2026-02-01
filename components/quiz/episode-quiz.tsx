"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Share2, RotateCcw, ArrowRight, LogOut, CheckCircle, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/general/utils";
import { useRouter } from "@/lib/i18n/navigation";
import { getDifficultyLabel, ANSWER_LETTERS } from "@/lib/quiz/difficulty";
import { EpisodeForQuiz } from "@/server-actions/episodes";

const DEFAULT_TIME = 30;

const BACKGROUND_STYLES = {
  backgroundImage: `url('/background.jpg')`,
  backgroundPosition: "center",
  backgroundSize: "cover",
};

const GOLDEN_BUTTON_STYLES =
  "bg-linear-to-r from-yellow-400 to-orange-500 text-black font-bold hover:from-yellow-500 hover:to-orange-600";

const OUTLINE_BUTTON_STYLES =
  "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10";

const getAnswerButtonClasses = (
  isSelected: boolean,
  isCorrect: boolean,
  showExplanation: boolean,
  selectedAnswer: number | null,
  index: number,
) => {
  if (!showExplanation) {
    if (isSelected) return "bg-linear-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
    return "bg-card";
  }

  if (isCorrect) return "bg-linear-to-r from-green-500/15 to-green-600/15 border-green-500/30";

  if (selectedAnswer === index && !isCorrect) return "bg-linear-to-r from-red-500/15 to-red-600/15 border-red-500/30";

  return "bg-card opacity-50";
};

interface EpisodeQuizProps {
  episode: EpisodeForQuiz;
  initialQuestionIndex?: number;
}

export const EpisodeQuiz = ({ episode, initialQuestionIndex = 0 }: EpisodeQuizProps) => {
  const router = useRouter();
  const locale = useLocale();

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

  const difficultyPercentage = currentQuestion
    ? parseInt(
        getDifficultyLabel(
          currentQuestion.difficulty,
        ).replace("%", ""),
      )
    : 50;

  const isTextInputQuestion = currentQuestion?.answers.length === 1;
  const timerProgress = (timeLeft / DEFAULT_TIME) * 100;

  useEffect(() => {
    const questionOrderInShow = currentQuestion?.orderInShow ?? currentQuestionIndex + 1;
    const basePath = `/${locale}/countries/${episode.season.country.slug}/seasons/${episode.season.number}/episodes/${episode.number}/question`;
    window.history.replaceState(null, "", `${basePath}/${questionOrderInShow}`);
  }, [currentQuestionIndex, currentQuestion?.orderInShow, episode.season.country.slug, episode.season.number, episode.number, locale]);

  useEffect(() => {
    if (showExplanation || isQuizComplete || totalQuestions === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
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
    const questionNumber = currentQuestion?.orderInShow ?? currentQuestionIndex + 1;
    const shareData = {
      title: `1% Club - Question ${questionNumber}`,
      text: `Can you answer this question? Only ${difficultyPercentage}% of people got it right!`,
      url: questionUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          await navigator.clipboard.writeText(questionUrl);
        }
      }
    } else {
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="noise-overlay absolute inset-0" />
        <div className="relative z-10 golden-border">
          <div className="p-10 bg-card backdrop-blur-sm rounded-xl text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">
              No Questions Available
            </h1>
            <p className="text-muted-foreground mb-6 text-sm">
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

  // Quiz Complete
  if (isQuizComplete) {
    const successRate = Math.round((score / totalQuestions) * 100);

    return (
      <div
        className="h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={BACKGROUND_STYLES}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="noise-overlay absolute inset-0" />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-yellow-500/5 blur-[100px]" />

        <div className="relative z-10 golden-border max-w-lg w-full mx-4">
          <div className="p-10 md:p-14 bg-card backdrop-blur-sm rounded-xl text-center">
            {/* Trophy icon */}
            <div className="inline-flex p-4 rounded-full bg-linear-to-br from-yellow-400/10 to-orange-500/10 border border-yellow-500/20 mb-6">
              <Trophy className="h-8 w-8 text-yellow-400" />
            </div>

            <h1 className="golden-shimmer text-3xl md:text-4xl font-black mb-2">
              Episode Complete
            </h1>

            <div className="h-px bg-linear-to-r from-transparent via-yellow-500/20 to-transparent my-8" />

            {/* Score */}
            <div className="mb-8">
              <p className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-yellow-400 to-orange-500 mb-2">
                {score}/{totalQuestions}
              </p>
              <p className="text-sm text-muted-foreground tracking-wide">Questions Correct</p>
            </div>

            {/* Success Rate */}
            <div className="golden-border-thin mb-10">
              <div className="py-5 px-6 bg-card rounded-lg">
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
                  Success Rate
                </p>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">
                  {successRate}%
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleBackToEpisodes}
                className={OUTLINE_BUTTON_STYLES}
              >
                <LogOut className="h-4 w-4" />
                Episodes
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className={OUTLINE_BUTTON_STYLES}
              >
                <RotateCcw className="h-4 w-4" />
                Replay
              </Button>
              <Button
                onClick={() => router.push(
                  `/countries/${episode.season.country.slug}/seasons/${episode.season.number}/episodes/${episode.number + 1}`
                )}
                className={GOLDEN_BUTTON_STYLES}
              >
                Next Episode
                <ArrowRight className="h-4 w-4" />
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
      <div className="absolute inset-0 bg-black/50" />
      <div className="noise-overlay absolute inset-0" />

      <ScrollArea className="relative z-10 h-full w-full">
        <div className="flex flex-col max-w-7xl mx-auto">
          {/* Question Header */}
          <div className="pt-8 pb-6 shrink-0 text-center">
            {/* Difficulty indicator */}
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-500/50 mb-2">
              {difficultyPercentage}% can answer this
            </p>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black text-center text-transparent bg-clip-text bg-linear-to-b from-yellow-400 to-orange-500 tracking-wider uppercase"
              style={{ fontWeight: 950, letterSpacing: '0.05em' }}
            >
              QUESTION {String(currentQuestion?.orderInShow ?? currentQuestionIndex + 1).padStart(2, '0')}
            </h1>
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    idx === currentQuestionIndex ? "w-6 bg-yellow-400" : "w-1.5 bg-white/15",
                    idx < currentQuestionIndex && "w-1.5 bg-yellow-400/40",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col items-center px-4 pb-12 space-y-5">
            {/* Question Layout - Vertical or Horizontal */}
            {currentQuestion.layout === "HORIZONTAL" && currentQuestion.questionImage ? (
              <div className="w-full max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
                  <div className="flex-1">
                    <div className="golden-border h-full">
                      <div className="p-6 bg-card backdrop-blur-sm rounded-xl h-full flex items-center justify-center">
                        <div className="quiz-question wrap-break-word">
                          {currentQuestion.questionText}
                        </div>
                      </div>
                    </div>
                  </div>

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
              <>
                <div className="w-full max-w-4xl">
                  <div className="golden-border">
                    <div className="p-6 bg-card backdrop-blur-sm rounded-xl">
                      <div className="quiz-question wrap-break-word">
                        {currentQuestion.questionText}
                      </div>
                    </div>
                  </div>
                </div>

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
                            "p-4 rounded-xl border",
                            isTextAnswerCorrect
                              ? "bg-green-500/10 border-green-500/30"
                              : "bg-red-500/10 border-red-500/30"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {isTextAnswerCorrect && <CheckCircle className="h-4 w-4 text-green-400" />}
                            <p className="font-bold text-foreground text-sm">
                              {isTextAnswerCorrect ? "Correct!" : "Incorrect"}
                            </p>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            The correct answer is:{" "}
                            <span className="font-bold text-yellow-400">
                              {currentQuestion.answers[0].answerText}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
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
                              "answer-card golden-border-thin cursor-pointer min-h-20",
                              isSelected && !showExplanation && "scale-[1.03]",
                              "disabled:cursor-not-allowed",
                            )}
                          >
                            <div
                              className={cn(
                                "rounded-lg flex relative overflow-hidden h-full items-center justify-center transition-colors",
                                answer.answerImage ? "p-0" : "p-4 pl-14",
                                getAnswerButtonClasses(
                                  isSelected,
                                  answer.isCorrect,
                                  showExplanation,
                                  selectedAnswer,
                                  index
                                )
                              )}
                            >
                              {/* Letter Badge */}
                              <div className="absolute top-2 left-2 z-10">
                                <div
                                  className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm shadow-lg transition-colors",
                                    !showExplanation && "bg-black/80 text-white",
                                    showExplanation && answer.isCorrect && "bg-green-500 text-black",
                                    showExplanation && isSelectedIncorrect && "bg-red-500 text-white",
                                    showExplanation && !answer.isCorrect && !isSelectedIncorrect && "bg-black/80 text-white/50"
                                  )}
                                >
                                  {ANSWER_LETTERS[index]}
                                </div>
                              </div>

                              {answer.answerImage ? (
                                <>
                                  <img
                                    src={answer.answerImage}
                                    alt={`Answer ${ANSWER_LETTERS[index]}`}
                                    className="w-full h-full object-contain"
                                  />
                                  <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/30" />
                                </>
                              ) : (
                                <span className="text-white text-base font-medium flex-1 text-left wrap-break-word">
                                  {answer.answerText}
                                </span>
                              )}

                              {/* Correct check */}
                              {showExplanation && answer.isCorrect && (
                                <div className="absolute top-2 right-2 z-10">
                                  <CheckCircle className="h-5 w-5 text-green-400 drop-shadow-lg" />
                                </div>
                              )}

                              {/* Incorrect X */}
                              {showExplanation && isSelectedIncorrect && (
                                <svg
                                  className="text-red-500 absolute w-6 h-6 top-2.5 right-2.5 drop-shadow-lg z-10"
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

                  {/* Difficulty / Timer bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground tracking-wide">
                        Q{currentQuestionIndex + 1}/{totalQuestions}
                      </span>
                      <span className="text-xs font-bold text-yellow-400">{difficultyPercentage}%</span>
                    </div>
                    <Progress
                      value={timerProgress}
                      className="h-1.5 bg-white/5 [&>div]:bg-linear-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBackToEpisodes}
                        className={OUTLINE_BUTTON_STYLES}
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Exit
                      </Button>
                      {showExplanation && (
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={handleShare}
                          className={OUTLINE_BUTTON_STYLES}
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
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
                      <Button
                        onClick={handleNextQuestion}
                        className={GOLDEN_BUTTON_STYLES}
                      >
                        {currentQuestionIndex < totalQuestions - 1
                          ? "Next Question"
                          : "Finish Quiz"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
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
                    <p className="font-bold mb-3 text-yellow-400 text-sm tracking-wide uppercase">
                      Explanation
                    </p>
                    <div className="h-px bg-linear-to-r from-yellow-500/20 to-transparent mb-3" />
                    <p className="text-muted-foreground wrap-break-word whitespace-pre-line leading-relaxed">
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
