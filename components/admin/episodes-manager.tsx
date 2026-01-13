"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            No episodes yet. Episodes are created when you add a season.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {initialEpisodes.map((episode) => (
        <Card
          key={episode.id}
          className="group hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Episode {episode.number}</h3>
              <Badge variant="outline">
                {episode._count.questions} questions
              </Badge>
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
      ))}
    </div>
  );
};
