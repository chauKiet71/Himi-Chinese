export async function requestVocabularySet(url: string, method: string, body?: unknown): Promise<{ id?: string }> {
  const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Chưa thể lưu. Vui lòng thử lại.");
  return data;
}
