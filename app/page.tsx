import homeStylesheetHref from "./home-portal.css?url";
import { ReviewHomeStudio } from "@/components/review-home-studio";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ verified?: string }> }) {
  const params = await searchParams;

  return <>
    <link href={homeStylesheetHref} precedence="himi-home" rel="stylesheet" />
    <ReviewHomeStudio verified={params.verified === "1"} />
  </>;
}
