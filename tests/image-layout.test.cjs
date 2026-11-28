const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/renderer/image-layout.ts','utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS }
}).outputText, context);
const { imageAspect, aspectHeight, expandedWidth } = context.exports;
test('landscape native proportions', () => assert.equal(aspectHeight(1200,imageAspect(1600,1000)),750));
test('portrait native proportions', () => assert.equal(aspectHeight(600,imageAspect(900,1200)),800));
test('square native proportions', () => assert.equal(aspectHeight(800,imageAspect(800,800)),800));
test('resize recalculates height', () => {const r=imageAspect(1600,1000);assert.equal(aspectHeight(800,r),500);assert.equal(aspectHeight(400,r),250);});
test('unloaded or invalid dimensions defer', () => {for(const v of [0,-1,NaN,Infinity]){assert.equal(imageAspect(v,100),undefined);assert.equal(imageAspect(100,v),undefined);assert.equal(aspectHeight(v,2),undefined);assert.equal(aspectHeight(100,v),undefined);}});
test('centered block expands within pane',()=>assert.equal(expandedWidth(300,600,50,1150),1100));
test('off-center block uses safe symmetric width',()=>assert.equal(expandedWidth(100,600,50,1150),700));
test('narrow pane limits block',()=>assert.equal(expandedWidth(100,600,200,600),400));
test('hidden or invalid pane defers',()=>{assert.equal(expandedWidth(0,0,0,0),undefined);assert.equal(expandedWidth(100,600,0,0),undefined);assert.equal(expandedWidth(NaN,600,0,1000),undefined);});
