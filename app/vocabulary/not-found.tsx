import Link from "next/link";
export default function VocabularyNotFound() {
  return <main className="vsets-page"><div className="vsets-empty"><h1>Không tìm thấy bộ từ vựng</h1><p>Bộ này không tồn tại hoặc không thuộc tài khoản của bạn.</p><Link className="vsets-primary" href="/vocabulary">Về thư viện</Link></div></main>;
}
