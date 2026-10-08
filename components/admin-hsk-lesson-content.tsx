import type { ReactNode } from "react";
import type { HskExercise, HskLessonContent, HskVocabularyAudio } from "@/lib/hsk-lesson-content";
import type { AdminHskSection } from "@/lib/admin-hsk-content";

function Audio({ audio }: { audio?: HskVocabularyAudio }) {
  return <>{audio?.normal ? <p>Audio thường <audio controls preload="none" src={audio.normal} /></p> : null}
    {audio?.slow ? <p>Audio chậm <audio controls preload="none" src={audio.slow} /></p> : null}</>;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return <section className="admin-access-group" aria-label={title}><h3>{title}</h3><div className="admin-access-list">{children}</div></section>;
}

function Questions({ exercises, title }: { exercises: HskExercise[]; title: string }) {
  return <Group title={`${title} · ${exercises.length} câu`}>
    {exercises.length ? exercises.map((item, index) => <article className="admin-access-node" key={item.id}>
      <header><strong>Câu {index + 1}: {item.instruction}</strong><span>{item.type} · {item.id}</span></header>
      <p lang="zh-CN">{item.prompt}</p>{item.pinyin ? <p>{item.pinyin}</p> : null}
      {item.speakText ? <p>Văn bản phát âm: <span lang="zh-CN">{item.speakText}</span></p> : null}
      <ol type="A">{item.options.map((option, optionIndex) => <li key={optionIndex}>{option}{option === item.answer ? " — Đáp án đúng" : ""}</li>)}</ol>
      <p>Đáp án: {item.answer ?? "Nguồn chưa có đáp án"}</p>
      {item.note ? <p>{item.note}</p> : null}
    </article>) : <p>Bài này chưa có câu hỏi trong phần này.</p>}
  </Group>;
}

export function AdminHskLessonContent({ lesson, practice, section }: {
  lesson: HskLessonContent; practice: HskExercise[]; section: AdminHskSection;
}) {
  switch (section) {
    case "vocabulary": return <Group title={`Từ vựng · ${lesson.vocabulary.length} mục`}>
      {lesson.vocabulary.map((word, index) => <article className="admin-access-node" key={word.id}>
        <header><strong>{index + 1}. <span lang="zh-CN">{word.hanzi}</span> · {word.pinyin}</strong><span>{word.wordClass} · {word.id}</span></header>
        <p>{word.meaning}</p>
        <p lang="zh-CN">{word.example}</p><p>{word.examplePinyin}</p><p>{word.translation}</p>
        <Audio audio={word.audio} />
        {word.radicals?.length ? <ul>{word.radicals.map((radical, i) => <li key={i}>{radical.glyph} · {radical.name} · {radical.strokes} nét · {radical.note}</li>)}</ul> : null}
      </article>)}
    </Group>;
    case "practice": return <Questions exercises={practice} title="Luyện tập theo từ trên trang học" />;
    case "exercises": return <Questions exercises={lesson.exercises} title="Bài tập trong nguồn" />;
    case "writing": return <Group title={`Luyện viết · ${lesson.writingCharacters.length} mục`}>
      {lesson.writingCharacters.map((word) => <article className="admin-access-node" key={word.id}>
        <header><strong lang="zh-CN">{word.hanzi}</strong><span>{word.pinyin} · {word.meaning}</span></header>
        <p>Từ: <span lang="zh-CN">{word.word}</span> · {word.id}</p>
      </article>)}
    </Group>;
    case "grammar": return <Group title={`Ngữ pháp · ${lesson.grammar.length} điểm`}>
      {lesson.grammar.length ? lesson.grammar.map((point) => <article className="admin-access-node" key={point.id}>
        <header><strong>{point.title}</strong><span>{point.formula}</span></header><p>{point.explanation}</p>
        {point.examples.map((example, index) => <div key={index}><p lang="zh-CN">{example.hanzi}</p><p>{example.pinyin}</p><p>{example.translation}</p></div>)}
      </article>) : <p>Bài này chưa có dữ liệu ngữ pháp.</p>}
    </Group>;
    case "dialogues": return <Group title={`Bài khóa và hội thoại · ${lesson.dialogues.length} bài`}>
      {lesson.dialogues.length ? lesson.dialogues.map((dialogue) => <article className="admin-access-node" key={dialogue.id}>
        <header><strong>{dialogue.title}</strong><span>{dialogue.setting}</span></header>
        {dialogue.audioUrl ? <audio controls preload="none" src={dialogue.audioUrl} /> : null}
        {dialogue.turns.map((turn, index) => <div key={index}><strong>{turn.speaker}</strong><p lang="zh-CN">{turn.hanzi}</p><p>{turn.pinyin}</p><p>{turn.translation}</p><Audio audio={turn.audio} /></div>)}
      </article>) : <p>Bài này chưa có bài khóa hoặc hội thoại.</p>}
    </Group>;
    case "pronunciation": return <Group title={`Phát âm · ${lesson.pronunciationTopics.length} mục`}>
      {lesson.pronunciationTopics.length ? <ol>{lesson.pronunciationTopics.map((item, index) => <li key={index}>{item}</li>)}</ol> : <p>Bài này chưa có chủ điểm phát âm.</p>}
    </Group>;
  }
}
