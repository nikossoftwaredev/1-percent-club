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
    question: string;
  }>;
}

const OGImage = async ({ params }: OGImageProps) => {
  const { country, season, episode, question } = await params;
  const seasonNumber = parseInt(season, 10);
  const episodeNumber = parseInt(episode, 10);
  const questionIndex = parseInt(question, 10) - 1;

  const episodeData = await getEpisodeForQuiz(
    country,
    seasonNumber,
    episodeNumber
  );
  const questionData = episodeData?.questions[questionIndex];

  const questionText = questionData?.questionText || "Can you answer this?";
  const extraText = questionData?.questionExtraText || null;
  const questionImage = questionData?.questionImage || null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
          padding: "40px 60px",
        }}
      >
        {/* Question Number Header */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 900,
            color: "#facc15",
            marginBottom: 30,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          {`QUESTION ${question.padStart(2, "0")}`}
        </div>

        {/* Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: 20,
            flex: 1,
          }}
        >
          {/* Question Text Card */}
          <div
            style={{
              display: "flex",
              width: "100%",
              maxWidth: 1000,
              padding: 3,
              background: "linear-gradient(135deg, #facc15, #f59e0b, #ea580c)",
              borderRadius: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                padding: "24px 32px",
                background: "#1a1a2e",
                borderRadius: 13,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  color: "white",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {questionText.length > 120 ? questionText.slice(0, 120) + "..." : questionText}
              </div>
            </div>
          </div>

          {/* Extra Text or Image Card */}
          {(extraText || questionImage) && (
            <div
              style={{
                display: "flex",
                width: "100%",
                maxWidth: 1000,
                padding: 3,
                background: "linear-gradient(135deg, #facc15, #f59e0b, #ea580c)",
                borderRadius: 16,
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  padding: questionImage ? 0 : "24px 32px",
                  background: "#1a1a2e",
                  borderRadius: 13,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {questionImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={questionImage.split(",")[0].trim()}
                    alt="Question"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
                {!questionImage && extraText && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      fontSize: 26,
                      color: "white",
                      textAlign: "center",
                      fontWeight: 500,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.5,
                    }}
                  >
                    {extraText.length > 200 ? extraText.slice(0, 200) + "..." : extraText}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
};

export default OGImage;
