import test from 'node:test';
import assert from 'node:assert/strict';
import { publicPageMetadata, serializeJsonLd, homeSchema, breadcrumbSchema, videoSchema } from '../lib/seo.ts';

test('SEO resolves the deployment origin at call time and shares the canonical', () => {
 const previous = process.env.NEXT_PUBLIC_APP_URL;
 try {
  process.env.NEXT_PUBLIC_APP_URL = 'https://first.example';
  assert.equal(publicPageMetadata('/courses', 'Courses', 'Description').alternates.canonical, 'https://first.example/courses');
  process.env.NEXT_PUBLIC_APP_URL = 'https://second.example/';
  const meta = publicPageMetadata('/videos/demo', 'Demo', 'Description', 'https://i.ytimg.com/vi/id/hqdefault.jpg');
  assert.equal(meta.alternates.canonical, 'https://second.example/videos/demo');
  assert.equal(meta.openGraph.url, meta.alternates.canonical);
  assert.equal(meta.twitter.images[0], 'https://i.ytimg.com/vi/id/hqdefault.jpg');
  assert.equal(homeSchema()['@graph'][1].publisher['@id'], 'https://second.example/#organization');
  assert.equal(breadcrumbSchema([{name:'Home',path:'/'}]).itemListElement[0].position, 1);
 } finally { if(previous === undefined) delete process.env.NEXT_PUBLIC_APP_URL; else process.env.NEXT_PUBLIC_APP_URL=previous; }
});

test('JSON-LD cannot close the script element and preserves source content', () => {
 const data = { name: '</script><script>alert(1)</script>', text: 'Tiếng Trung 中文' };
 const output = serializeJsonLd(data);
 assert.ok(!output.includes('<'));
 assert.deepEqual(JSON.parse(output), data);
});

test('video rich-result markup requires a real source timestamp', () => {
 const video={slug:'demo',title:'Demo',summary:'Test',thumbnailUrl:'/thumb.png',youtubeId:'demo'};
 assert.equal(videoSchema(video)['@type'], 'WebPage');
 assert.equal(videoSchema({...video,uploadDate:'invalid'})['@type'], 'WebPage');
 const schema=videoSchema({...video,uploadDate:'2026-01-01T10:00:00+07:00'});
 assert.equal(schema['@type'], 'VideoObject');
 assert.equal(schema.embedUrl, 'https://www.youtube.com/embed/demo');
});
