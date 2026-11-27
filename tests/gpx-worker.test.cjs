const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const source=fs.readFileSync('src/worker/gpx.worker.ts','utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText;
async function parse(string){
    const messages=[];
    const self={postMessage:m=>messages.push(m)};
    vm.runInNewContext(compiled,{self,require,exports:{},setTimeout,console});
    await self.onmessage({data:{string}});
    assert.equal(messages.length,1);
    return messages[0];
}
test('GPX track parsed using maintained XML parser',async()=>{
    const result=await parse('<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>Test track</name><trkseg><trkpt lat="40" lon="-100"><ele>100</ele><time>2026-01-01T00:00:00Z</time></trkpt><trkpt lat="40.001" lon="-100.001"><ele>110</ele><time>2026-01-01T00:00:10Z</time></trkpt></trkseg></trk></gpx>');
    assert.ifError(result.error);
    assert.equal(result.data.name,'Test track');
    assert.ok(result.data.coords.length>0);
    assert.ok(result.data.length>0);
});
test('malformed multi-root XML rejected by GPX worker',async()=>{
    const result=await parse('<gpx/><gpx/>');
    assert.ok(result.error);
    assert.equal(result.data,undefined);
});
