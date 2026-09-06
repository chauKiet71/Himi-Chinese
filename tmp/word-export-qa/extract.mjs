import fs from 'node:fs';
import { courses } from '../../lib/course-data.ts';
import { HSK_CURRICULUM } from '../../lib/hsk-curriculum.ts';
import { getHskLearningLessonContent } from '../../lib/hsk-learning-content.ts';
import { HSK_WORKBOOK_LESSONS } from '../../lib/hsk-workbook-content.ts';
import { practiceIndustries, practiceScenarios, getPracticeMeaningQuestion, getPracticeListeningStatement } from '../../lib/practice-content.ts';
import { listeningLevels, getListeningLessonWords } from '../../lib/listening-content.ts';
import { gameWords } from '../../lib/game-content.ts';
import { learningVideos } from '../../lib/video-library.ts';
import { curatedYoutubeVideoTranscripts } from '../../lib/youtube-video-transcripts.curated.ts';
import { youtubeVideoTranscripts } from '../../lib/youtube-video-transcripts.generated.ts';
import { getWritingLevels, getWritingLessons, getWritingTopic } from '../../lib/writing-content.ts';
const seeds=['office','factory','logistics','sales','restaurant','ecommerce','core-workplace','high-frequency'];
const prefixes=['office','factory','logistics','sales','restaurant','ecommerce','coreWorkplace','highFrequency'];
const bundles=[];
for(let i=0;i<seeds.length;i++) {
  const seed=await import(`../../lib/${seeds[i]}-course-seed.ts`);
  bundles.push({...courses[i],modules:seed[prefixes[i]+'Modules'],lessons:seed[prefixes[i]+'Lessons']});
}
const missing=[];
const hsk=HSK_CURRICULUM.map(level=>({...level,topics:level.topics.map(topic=>({...topic,lessons:topic.lessons.map(lesson=>{
  const content=getHskLearningLessonContent(level.id,lesson.id);
  if(!content) missing.push({level:level.id,...lesson});
  return {...lesson,content};
})}))}));
const data={courses:bundles,hsk,workbook2:HSK_WORKBOOK_LESSONS,practice:practiceIndustries.map(ind=>({...ind,lessons:practiceScenarios.filter(s=>s.industry===ind.id).map(s=>({...s,exercises:s.exercises.map(e=>({...e,meaningQuestion:getPracticeMeaningQuestion(e),listeningStatement:getPracticeListeningStatement(e,{sentenceZh:s.sentenceZh,brief:s.brief,focus:s.focus,exercises:s.exercises})}))}))})),listening:listeningLevels.map(level=>({...level,lessons:level.lessons.map(l=>({...l,words:getListeningLessonWords(level,l)}))})),games:gameWords,videos:learningVideos.map(v=>({...v,transcript:v.youtubeId?(curatedYoutubeVideoTranscripts[v.youtubeId]??youtubeVideoTranscripts[v.youtubeId]):v.transcript})),missing};
data.writing=getWritingLevels().map(level=>({...level,lessons:getWritingLessons(level.id).map(l=>getWritingTopic(level.id,l.id))}));
fs.writeFileSync(new URL('./content-complete.json',import.meta.url),JSON.stringify(data,null,2));
console.log(JSON.stringify({courses:bundles.map(c=>({title:c.title,lessons:c.lessons.length})),hsk:hsk.map(l=>({title:l.label,lessons:l.topics.flatMap(t=>t.lessons).length})),workbook2:data.workbook2.length,practice:practiceScenarios.length,listening:data.listening.reduce((n,l)=>n+l.lessons.length,0),games:data.games.length,videos:data.videos.length,missing},null,2));
