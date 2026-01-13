"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DifficultyLevel } from "@/lib/db";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/quiz/difficulty";
import { EpisodeForQuiz } from "@/server-actions/episodes";

const DEFAULT_TIME = 30;

interface EpisodeQuizProps {
  episode: EpisodeForQuiz;
}

export const EpisodeQuiz = ({ episode }: EpisodeQuizProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isTextAnswerCorrect, setIsTextAnswerCorrect] = useState<boolean | null>(null);

  const questions = episode.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Determine if question is text input type (single answer = text input)
  const isTextInputQuestion = currentQuestion?.answers.length === 1;

  const handleTimeUp = useCallback(() => {
    setShowExplanation(true);
    if (isTextInputQuestion) {
      setIsTextAnswerCorrect(false);
    }
  }, [isTextInputQuestion]);

  // Timer effect
  useEffect(() => {
    if (showExplanation || isQuizComplete || totalQuestions === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return DEFAULT_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showExplanation, isQuizComplete, handleTimeUp, totalQuestions]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (isTextInputQuestion) {
      // Text input question - compare answer (case insensitive)
      const correctAnswer = currentQuestion.answers[0].answerText.toLowerCase().trim();
      const userAnswer = textAnswer.toLowerCase().trim();
      const isCorrect = correctAnswer === userAnswer;

      setIsTextAnswerCorrect(isCorrect);
      if (isCorrect) setScore((prev) => prev + 1);
    } else {
      // Multiple choice question
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
    router.push(`/countries/${episode.season.country.slug}/seasons/${episode.season.number}/episodes`);
  };

  const getAnswerButtonStyle = (index: number, isCorrect: boolean): string => {
    const isSelected = selectedAnswer === index;

    if (isSelected && showExplanation) {
      if (isCorrect) return "border-green-500 bg-green-500/10";
      return "border-red-500 bg-red-500/10";
    }

    if (isSelected) return "border-primary bg-primary/10";

    if (showExplanation && isCorrect) return "border-green-500 bg-green-500/10";

    return "border-border hover:border-primary/50";
  };

  const getTextInputStyle = (): string => {
    if (!showExplanation) return "";
    if (isTextAnswerCorrect) return "border-green-500 bg-green-500/10";
    return "border-red-500 bg-red-500/10";
  };

  const canSubmit = isTextInputQuestion ? textAnswer.trim().length > 0 : selectedAnswer !== null;

  // No questions available
  if (totalQuestions === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">No Questions Available</h1>
          <p className="text-muted-foreground mb-6">
            This episode doesn&apos;t have any questions yet.
          </p>
          <Button onClick={handleBackToEpisodes}>
            Back to Episodes
          </Button>
        </Card>
      </div>
    );
  }

  if (isQuizComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Episode Complete!</h1>
          <div className="mb-8">
            <p className="text-5xl font-bold text-primary mb-2">
              {score}/{totalQuestions}
            </p>
            <p className="text-muted-foreground">Questions Correct</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-semibold">
                {Math.round((score / totalQuestions) * 100)}%
              </p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleBackToEpisodes}>
              Back to Episodes
            </Button>
            <Button onClick={() => window.location.reload()}>
              Play Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {episode.season.country.name} - S{episode.season.number} E{episode.number}
          </h1>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6 mb-6">
        {/* Difficulty Badge & Timer */}
        <div className="flex justify-between items-center mb-6">
          <span className={`px-3 py-1 rounded-full text-white font-semibold ${getDifficultyColor(currentQuestion.difficulty as DifficultyLevel)}`}>
            {getDifficultyLabel(currentQuestion.difficulty as DifficultyLevel)} of people got this right
          </span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-mono text-lg ${timeLeft <= 10 ? "text-red-500" : ""}`}>
              0:{timeLeft.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Question Image */}
        {currentQuestion.questionImage && (
          <div className="mb-6">
            <img
              src={currentQuestion.questionImage}
              alt="Question"
              className="max-h-64 mx-auto rounded-lg"
            />
          </div>
        )}

        {/* Question */}
        <h2 className="text-xl font-semibold mb-6">
          {currentQuestion.questionText}
        </h2>

        {/* Answer Section */}
        {isTextInputQuestion ? (
          /* Text Input Answer */
          <div className="space-y-4">
            <Input
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Type your answer..."
              disabled={showExplanation}
              className={`text-lg py-6 ${getTextInputStyle()}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit && !showExplanation) {
                  handleSubmitAnswer();
                }
              }}
            />
            {showExplanation && (
              <div className={`p-4 rounded-lg ${isTextAnswerCorrect ? "bg-green-500/10 border border-green-500" : "bg-red-500/10 border border-red-500"}`}>
                <p className="font-semibold">
                  {isTextAnswerCorrect ? "Correct!" : "Incorrect"}
                </p>
                <p className="text-sm mt-1">
                  The correct answer is: <span className="font-semibold">{currentQuestion.answers[0].answerText}</span>
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Multiple Choice Answers */
          <div className="space-y-3">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border transition-all ${getAnswerButtonStyle(index, answer.isCorrect)}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {answer.answerImage ? (
                    <img
                      src={answer.answerImage}
                      alt={`Answer ${String.fromCharCode(65 + index)}`}
                      className="h-16 rounded"
                    />
                  ) : (
                    <span>{answer.answerText}</span>
                  )}
                  {showExplanation && answer.isCorrect && (
                    <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {showExplanation && selectedAnswer === index && !answer.isCorrect && (
                    <svg className="w-5 h-5 text-red-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="font-semibold mb-2">Explanation:</p>
            <p className="text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBackToEpisodes}
          >
            Exit Quiz
          </Button>
          {!showExplanation ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!canSubmit}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          )}
        </div>
      </Card>

      {/* Score Tracker */}
      <div className="text-center text-sm text-muted-foreground">
        Current Score: {score}/{currentQuestionIndex + (showExplanation ? 1 : 0)}
      </div>
    </div>
  );
};
