"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EpisodeQuizPageProps {
  params: Promise<{ locale: string; country: string; season: string; episode: string }>;
}

const EpisodeQuizPage = ({ params }: EpisodeQuizPageProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  // TODO: Fetch episode questions from database
  const episodeData = {
    title: "Episode 1",
    country: "United Kingdom",
    season: 1,
    questions: [
      {
        id: "1",
        questionText: "If you were to spell out numbers, how far would you have to go until you would find the letter 'A'?",
        difficulty: "NINETY",
        timeLimit: 30,
        explanation: "The first time the letter 'A' appears when spelling out numbers is in 'one thousAnd'. Numbers from 1-999 don't contain the letter A.",
        answers: [
          { id: "1", text: "One Hundred", isCorrect: false },
          { id: "2", text: "One Thousand", isCorrect: true },
          { id: "3", text: "One Million", isCorrect: false },
          { id: "4", text: "Ten", isCorrect: false }
        ]
      },
      {
        id: "2",
        questionText: "What gets wetter the more it dries?",
        difficulty: "EIGHTY",
        timeLimit: 30,
        explanation: "A towel gets wetter as it dries other things or people.",
        answers: [
          { id: "1", text: "A sponge", isCorrect: false },
          { id: "2", text: "A towel", isCorrect: true },
          { id: "3", text: "Hair", isCorrect: false },
          { id: "4", text: "Clothes", isCorrect: false }
        ]
      },
      {
        id: "3",
        questionText: "How many months have 28 days?",
        difficulty: "SEVENTY",
        timeLimit: 30,
        explanation: "All 12 months have at least 28 days. February has exactly 28 days in non-leap years, but every month has 28 days or more.",
        answers: [
          { id: "1", text: "1", isCorrect: false },
          { id: "2", text: "2", isCorrect: false },
          { id: "3", text: "12", isCorrect: true },
          { id: "4", text: "6", isCorrect: false }
        ]
      }
    ]
  };

  const currentQuestion = episodeData.questions[currentQuestionIndex];
  const totalQuestions = episodeData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (showExplanation || isQuizComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showExplanation, isQuizComplete]);

  const handleTimeUp = () => {
    setShowExplanation(true);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = null;
    setUserAnswers(newAnswers);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = currentQuestion.answers[selectedAnswer].isCorrect;
    if (isCorrect) {
      setScore(score + 1);
    }

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleBackToEpisodes = async () => {
    const resolvedParams = await params;
    router.push(`/countries/${resolvedParams.country}/seasons/${resolvedParams.season}/episodes`);
  };

  const difficultyColors: Record<string, string> = {
    NINETY: "bg-green-500",
    EIGHTY: "bg-green-400",
    SEVENTY: "bg-yellow-400",
    SIXTY: "bg-yellow-500",
    FIFTY: "bg-orange-400",
    FORTY: "bg-orange-500",
    THIRTY: "bg-red-400",
    TWENTY: "bg-red-500",
    FIFTEEN: "bg-red-600",
    TEN: "bg-purple-500",
    FIVE: "bg-purple-600",
    ONE: "bg-purple-700"
  };

  const getDifficultyLabel = (difficulty: string) => {
    const percentages: Record<string, string> = {
      NINETY: "90%", EIGHTY: "80%", SEVENTY: "70%", SIXTY: "60%",
      FIFTY: "50%", FORTY: "40%", THIRTY: "30%", TWENTY: "20%",
      FIFTEEN: "15%", TEN: "10%", FIVE: "5%", ONE: "1%"
    };
    return percentages[difficulty] || difficulty;
  };

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
          <h1 className="text-2xl font-bold">{episodeData.title}</h1>
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
          <span className={`px-3 py-1 rounded-full text-white font-semibold ${difficultyColors[currentQuestion.difficulty]}`}>
            {getDifficultyLabel(currentQuestion.difficulty)} of people got this right
          </span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-mono text-lg ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
              0:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold mb-6">
          {currentQuestion.questionText}
        </h2>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={answer.id}
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedAnswer === index
                  ? showExplanation
                    ? answer.isCorrect
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                    : 'border-primary bg-primary/10'
                  : showExplanation && answer.isCorrect
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{answer.text}</span>
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

        {/* Explanation */}
        {showExplanation && (
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
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
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

export default EpisodeQuizPage;