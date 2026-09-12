"use client";
import Link from "next/link";
export default function VocabularyError({ reset }: { reset: () => void }) {
  return <main className="vsets-page"><div className="vsets-empty" role="alert"><h1>Chưa thể tải bộ từ vựng</h1><p>Kết nối đang gián đoạn. Vui lòng thử lại.</p><button className="vsets-primary" onClick={reset}>Thử lại</button><Link href="/vocabulary">Về thư viện</Link></div></main>;
}
