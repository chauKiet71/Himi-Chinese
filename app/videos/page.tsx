import { publicPageMetadata } from "@/lib/seo";
import { VideoLibrary } from "@/components/video-library";
import { learningVideos } from "@/lib/video-library";

export function generateMetadata() {
  return publicPageMetadata("/videos", "Học qua video", "Luyện nghe tiếng Trung theo tình huống với Himi Original và video được tuyển chọn theo trình độ.");
}

export default function VideosPage() {
  return <VideoLibrary videos={learningVideos} />;
}
