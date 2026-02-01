"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/lib/i18n/navigation";
import { EpisodeWithQuestionCount } from "@/server-actions/episodes";

interface EpisodesManagerProps {
  countryId: string;
  seasonId: string;
  initialEpisodes: EpisodeWithQuestionCount[];
}

export const EpisodesManager = ({
  countryId,
  seasonId,
  initialEpisodes,
}: EpisodesManagerProps) => {
  if (initialEpisodes.length === 0) {
    return (
      <Card className="border-white/6">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground text-sm">
            No episodes yet. Episodes are created when you add a season.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {initialEpisodes.map((episode) => {
        const progress = episode._count.questions > 0
          ? (episode.filledQuestionsCount / episode._count.questions) * 100
          : 0;
        const isComplete = episode.filledQuestionsCount === episode._count.questions && episode._count.questions > 0;

        return (
          <Card
            key={episode.id}
            className="group border-white/6 card-glow transition-all duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-yellow-400/80">
                    {episode.number}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Episode
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    isComplete
                      ? "border-emerald-500/30 text-emerald-400 text-xs"
                      : "border-white/10 text-muted-foreground text-xs"
                  }
                >
                  {episode.filledQuestionsCount}/{episode._count.questions}
                </Badge>
              </div>

              <div className="mb-4">
                <Progress value={progress} className="h-1" />
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                asChild
              >
                <Link
                  href={`/admin/countries/${countryId}/seasons/${seasonId}/episodes/${episode.id}`}
                >
                  Manage Questions
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
