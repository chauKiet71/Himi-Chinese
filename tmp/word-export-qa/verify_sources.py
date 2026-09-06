import json
from zipfile import ZipFile
from lxml import etree
from pathlib import Path
base=Path(__file__).resolve().parents[2]
d=json.loads((Path(__file__).parent/'content-complete.json').read_text(encoding='utf-8'))
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
texts={p.name:'\n'.join(etree.fromstring(ZipFile(p).read('word/document.xml')).xpath('//w:t/text()',namespaces=ns)) for p in (base/'outputs/noi-dung-bai-hoc-word').glob('*.docx')}
count=0;errors=[]
keys={'title','summary','situation','hanzi','pinyin','meaning','example','examplePinyin','translation','speaker','pattern','explanation','formula','setting','prompt','instruction','note','speakText','wordClass','chinese','brief','context','sentenceZh','listeningText','titleZh','instructionZh','instructionVi','text','description','originalTitle','keyword','correctText'}
def check(obj,text,path):
    global count
    if isinstance(obj,dict):
        for k,v in obj.items():
            if k in keys and isinstance(v,str):
                for line in v.replace('\r','').split('\n'):
                    if line and line not in text:errors.append((path,k,line[:80]))
                count+=1
            elif isinstance(v,(dict,list)):check(v,text,path)
    elif isinstance(obj,list):
        for v in obj:check(v,text,path)
for i,c in enumerate(d['courses'],1):check(c['lessons'],texts[f'{i:02d}_{c["slug"]}.docx'],c['slug'])
for i,lev in enumerate(d['hsk'],9):check([l.get('content',{}) for t in lev['topics'] for l in t['lessons']],texts[f'{i:02d}_{lev["id"]}.docx'],lev['id'])
for key,file in [('workbook2','16_hsk-2-sach-bai-tap.docx'),('practice','17_luyen-tap-tinh-huong.docx'),('writing','19_luyen-viet.docx'),('videos','20_hoc-qua-video.docx'),('games','21_tro-choi-tu-vung.docx')]:check(d[key],texts[file],key)
check([{**x,'words':[]} for x in d['listening']],texts['18_luyen-nghe.docx'],'listening')
report={'source_fields_checked':count,'missing_fields':errors,'missing_count':len(errors)}
(Path(__file__).parent/'source-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False)[:6000])
assert not errors
