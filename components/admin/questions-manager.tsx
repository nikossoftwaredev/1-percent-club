"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Minus, Eye } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUpload } from "@/components/ui/image-upload";
import { cn } from "@/lib/general/utils";
import type { DifficultyLevel, QuestionLayout } from "@prisma/client";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  DIFFICULTY_ORDER,
  ANSWER_LETTERS,
} from "@/lib/quiz/difficulty";
import { QuestionWithAnswers, updateQuestion } from "@/server-actions/questions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AnswerType = "select" | "text";
type AnswerContentType = "text" | "image";

interface AnswerFormItem {
  text: string;
  image: string;
  isCorrect: boolean;
}

interface QuestionFormData {
  questionText: string;
  questionImage: string;
  questionExtraText: string;
  layout: QuestionLayout;
  explanation: string;
  answerType: AnswerType;
  answerContentType: AnswerContentType;
  answers: AnswerFormItem[];
  correctTextAnswer: string; // For text input type questions
}

const createEmptyAnswers = (count: number = 4): AnswerFormItem[] => {
  return Array.from({ length: count }, () => ({
    text: "",
    image: "",
    isCorrect: false,
  }));
};

const initialFormData: QuestionFormData = {
  questionText: "",
  questionImage: "",
  questionExtraText: "",
  layout: "VERTICAL" as QuestionLayout,
  explanation: "",
  answerType: "text",
  answerContentType: "text",
  answers: [],
  correctTextAnswer: "",
};

interface QuestionsManagerProps {
  countryId: string;
  seasonId: string;
  episodeId: string;
  initialQuestions: QuestionWithAnswers[];
  quizUrl?: string;
}

export const QuestionsManager = ({
  countryId,
  seasonId,
  episodeId,
  initialQuestions,
  quizUrl,
}: QuestionsManagerProps) => {
  const [questions, setQuestions] = useState<QuestionWithAnswers[]>(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionWithAnswers | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>(initialFormData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedQuestion(null);
    setFormData(initialFormData);
  };

  const handleFormChange = <K extends keyof QuestionFormData>(
    field: K,
    value: QuestionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnswerTypeChange = (type: AnswerType) => {
    setFormData((prev) => ({
      ...prev,
      answerType: type,
      answers: type === "select" ? createEmptyAnswers(4) : [],
      correctTextAnswer: type === "text" ? prev.correctTextAnswer : "",
    }));
  };

  const handleAnswerContentTypeChange = (contentType: AnswerContentType) => {
    setFormData((prev) => ({
      ...prev,
      answerContentType: contentType,
    }));
  };

  const handleAnswerTextChange = (index: number, text: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.map((a, i) => (i === index ? { ...a, text } : a)),
    }));
  };

  const handleAnswerImageChange = (index: number, image: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.map((a, i) => (i === index ? { ...a, image } : a)),
    }));
  };

  const handleCorrectAnswerChange = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.map((a, i) => ({ ...a, isCorrect: i === index })),
    }));
  };

  const addAnswer = () => {
    if (formData.answers.length >= 8) return;
    setFormData((prev) => ({
      ...prev,
      answers: [...prev.answers, { text: "", image: "", isCorrect: false }],
    }));
  };

  const removeAnswer = (index: number) => {
    if (formData.answers.length <= 2) return;
    setFormData((prev) => {
      const newAnswers = prev.answers.filter((_, i) => i !== index);
      if (!newAnswers.some((a) => a.isCorrect) && newAnswers.length > 0) {
        newAnswers[0].isCorrect = true;
      }
      return { ...prev, answers: newAnswers };
    });
  };

  const buildAnswers = () => {
    if (formData.answerType === "select") {
      return formData.answers.map((a, i) => ({
        answerText: formData.answerContentType === "text" ? a.text : "",
        answerImage: formData.answerContentType === "image" ? a.image : null,
        isCorrect: a.isCorrect,
        orderIndex: i,
      }));
    }
    if (formData.correctTextAnswer) {
      return [{
        answerText: formData.correctTextAnswer,
        answerImage: null,
        isCorrect: true,
        orderIndex: 0
      }];
    }
    return [];
  };

  const handleSave = () => {
    if (!selectedQuestion) return;
    startTransition(async () => {
      const answers = buildAnswers();

      await updateQuestion(
        {
          id: selectedQuestion.id,
          questionText: formData.questionText,
          questionImage: formData.questionImage || null,
          questionExtraText: formData.questionExtraText || null,
          layout: formData.layout,
          explanation: formData.explanation,
          answers,
        },
        episodeId,
        seasonId,
        countryId
      );

      // Update local state
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === selectedQuestion.id
            ? {
                ...q,
                questionText: formData.questionText,
                questionImage: formData.questionImage || null,
                questionExtraText: formData.questionExtraText || null,
                explanation: formData.explanation,
                answers: answers.map((a, i) => ({
                  ...q.answers[i],
                  id: q.answers[i]?.id || `new-${i}`,
                  questionId: q.id,
                  answerText: a.answerText,
                  answerImage: a.answerImage,
                  isCorrect: a.isCorrect,
                  orderIndex: a.orderIndex,
                  createdAt: q.answers[i]?.createdAt || new Date(),
                  updatedAt: new Date(),
                })),
              }
            : q
        )
      );
      closeDialog();
    });
  };

  const openEditDialog = (question: QuestionWithAnswers) => {
    setSelectedQuestion(question);

    const hasImageAnswers = question.answers.some((a) => a.answerImage);
    const answerContentType: AnswerContentType = hasImageAnswers ? "image" : "text";

    // Check if this is a text input question (single answer that's correct)
    const isTextInputType = question.answers.length === 1 && question.answers[0].isCorrect;
    const correctTextAnswer = isTextInputType ? question.answers[0].answerText : "";

    setFormData({
      questionText: question.questionText,
      questionImage: question.questionImage || "",
      questionExtraText: question.questionExtraText || "",
      layout: (question.layout || "VERTICAL") as QuestionLayout,
      explanation: question.explanation,
      answerType: isTextInputType ? "text" : "select",
      answerContentType,
      answers: question.answers.length > 0 && !isTextInputType
        ? question.answers.map((a) => ({
            text: a.answerText,
            image: a.answerImage || "",
            isCorrect: a.isCorrect,
          }))
        : createEmptyAnswers(4),
      correctTextAnswer,
    });
    setIsDialogOpen(true);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    const aIndex = DIFFICULTY_ORDER.indexOf(a.difficulty as DifficultyLevel);
    const bIndex = DIFFICULTY_ORDER.indexOf(b.difficulty as DifficultyLevel);
    return aIndex - bIndex;
  });

  // Get question position in quiz order (by orderInShow)
  const getQuizPosition = (questionId: string): number => {
    const quizOrder = [...questions].sort((a, b) =>
      (a.orderInShow ?? 0) - (b.orderInShow ?? 0)
    );
    return quizOrder.findIndex(q => q.id === questionId) + 1;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Questions ({questions.length}/15)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-20">Difficulty</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedQuestions.map((question, index) => {
                const isEmpty = !question.questionText.trim();
                const difficulty = question.difficulty as DifficultyLevel;
                return (
                  <TableRow
                    key={question.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openEditDialog(question)}
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-white font-medium",
                          DIFFICULTY_COLORS[difficulty]
                        )}
                      >
                        {DIFFICULTY_LABELS[difficulty]}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-medium",
                        isEmpty && "text-muted-foreground italic"
                      )}
                    >
                      {isEmpty ? "Not filled yet" : truncateText(question.questionText)}
                    </TableCell>
                    <TableCell>
                      {isEmpty ? (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Empty
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs bg-green-500">
                          Filled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {quizUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              href={`${quizUrl}?question=${getQuizPosition(question.id)}`}
                              target="_blank"
                            >
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(question);
                          }}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={() => closeDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Edit Question
              {selectedQuestion && (
                <Badge
                  className={cn(
                    "text-white font-medium",
                    DIFFICULTY_COLORS[selectedQuestion.difficulty as DifficultyLevel]
                  )}
                >
                  {DIFFICULTY_LABELS[selectedQuestion.difficulty as DifficultyLevel]}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Fill in the question details for this difficulty level.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Question Text */}
            <div className="grid gap-2">
              <Label htmlFor="questionText">Question</Label>
              <Textarea
                id="questionText"
                value={formData.questionText}
                onChange={(e) => handleFormChange("questionText", e.target.value)}
                placeholder="Enter the question..."
                rows={3}
                disabled={isPending}
              />
            </div>

            {/* Question Image & Extra Text */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Question Image (optional)</Label>
                <ImageUpload
                  value={formData.questionImage}
                  onChange={(url) => handleFormChange("questionImage", url)}
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="questionExtraText">Extra Text (optional)</Label>
                <Textarea
                  id="questionExtraText"
                  value={formData.questionExtraText}
                  onChange={(e) => handleFormChange("questionExtraText", e.target.value)}
                  placeholder="Additional text to display with the question..."
                  rows={3}
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Layout */}
            {(formData.questionImage || formData.questionExtraText) && (
              <div className="grid gap-2">
                <Label>Layout</Label>
                <Select
                  value={formData.layout}
                  onValueChange={(value) => handleFormChange("layout", value as QuestionLayout)}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VERTICAL">
                      Vertical - Question text above image(s)
                    </SelectItem>
                    <SelectItem value="HORIZONTAL">
                      Horizontal - Question text beside image(s)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Answer Type */}
            <div className="grid gap-2">
              <Label>Answer Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.answerType === "select" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAnswerTypeChange("select")}
                  disabled={isPending}
                >
                  Multiple Choice
                </Button>
                <Button
                  type="button"
                  variant={formData.answerType === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAnswerTypeChange("text")}
                  disabled={isPending}
                >
                  Text Input
                </Button>
              </div>
            </div>

            {/* Text Input Answer */}
            {formData.answerType === "text" && (
              <div className="grid gap-2">
                <Label htmlFor="correctTextAnswer">Correct Answer</Label>
                <Input
                  id="correctTextAnswer"
                  value={formData.correctTextAnswer}
                  onChange={(e) => handleFormChange("correctTextAnswer", e.target.value)}
                  placeholder="Enter the correct answer..."
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                  The player will need to type this exact answer (case-insensitive)
                </p>
              </div>
            )}

            {/* Answers Section */}
            {formData.answerType === "select" && (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Answers</Label>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant={formData.answerContentType === "text" ? "default" : "outline"}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => handleAnswerContentTypeChange("text")}
                      disabled={isPending}
                    >
                      Text
                    </Button>
                    <Button
                      type="button"
                      variant={formData.answerContentType === "image" ? "default" : "outline"}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => handleAnswerContentTypeChange("image")}
                      disabled={isPending}
                    >
                      Image
                    </Button>
                  </div>
                </div>
                <RadioGroup
                  value={String(formData.answers.findIndex((a) => a.isCorrect))}
                  onValueChange={(value) => handleCorrectAnswerChange(parseInt(value))}
                >
                  <div className="space-y-3">
                    {formData.answers.map((answer, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-md border p-3"
                      >
                        <RadioGroupItem
                          value={String(index)}
                          id={`answer-${index}`}
                          disabled={isPending}
                        />
                        <Label
                          htmlFor={`answer-${index}`}
                          className="font-medium w-6 shrink-0"
                        >
                          {ANSWER_LETTERS[index]}
                        </Label>
                        {formData.answerContentType === "text" ? (
                          <Input
                            value={answer.text}
                            onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                            placeholder={`Answer ${ANSWER_LETTERS[index]} text`}
                            className="flex-1"
                            disabled={isPending}
                          />
                        ) : (
                          <ImageUpload
                            value={answer.image}
                            onChange={(url) => handleAnswerImageChange(index, url)}
                            disabled={isPending}
                          />
                        )}
                        {answer.isCorrect && (
                          <Badge variant="default" className="bg-green-500 shrink-0">
                            Correct
                          </Badge>
                        )}
                        {formData.answers.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 cursor-pointer"
                            onClick={() => removeAnswer(index)}
                            disabled={isPending}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                {formData.answers.length < 8 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAnswer}
                    className="mt-2"
                    disabled={isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>
            )}

            {/* Explanation */}
            <div className="grid gap-2">
              <Label htmlFor="explanation">Explanation</Label>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => handleFormChange("explanation", e.target.value)}
                placeholder="Explain why the correct answer is correct..."
                rows={3}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
