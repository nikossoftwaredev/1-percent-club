import { ImageResponse } from "next/og";
import { getEpisodeForQuiz } from "@/server-actions/episodes";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface OGImageProps {
  params: Promise<{
    country: string;
    season: string;
    episode: string;
  }>;
}

const OGImage = async ({ params }: OGImageProps) => {
  const { country, season, episode } = await params;
  const seasonNumber = parseInt(season, 10);
  const episodeNumber = parseInt(episode, 10);

  const episodeData = await getEpisodeForQuiz(
    country,
    seasonNumber,
    episodeNumber
  );

  const totalQuestions = episodeData?.questions.length || 0;
  const countryName = episodeData?.season.country.name || "Quiz";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 900,
            color: "#facc15",
            marginBottom: 30,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          1% CLUB
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#9ca3af",
            marginBottom: 20,
          }}
        >
          {countryName}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 48,
            color: "white",
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          {`Season ${season} • Episode ${episode}`}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 50px",
            background: "linear-gradient(90deg, #f59e0b, #ea580c)",
            borderRadius: 50,
            fontSize: 28,
            fontWeight: 700,
            color: "black",
          }}
        >
          {`${totalQuestions} Questions • Can you make it to the 1%?`}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
};

export default OGImage;
