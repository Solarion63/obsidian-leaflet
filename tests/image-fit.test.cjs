// Exercise the actual ImageMap class with a minimal Leaflet/DOM boundary.
// No Obsidian instance or private map assets required.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/map/map.ts', 'utf8');
const parsed = ts.createSourceFile('map.ts', source, ts.ScriptTarget.Latest, true);
const declaration = parsed.statements.find(s => ts.isClassDeclaration(s) && s.name?.text === 'ImageMap');
assert.ok(declaration, 'ImageMap declaration exists');
const code = ts.transpileModule(declaration.getText(parsed), {compilerOptions:{
    target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS
}}).outputText;
class BaseMap {
    constructor(renderer, options) {
        this.renderer = renderer; this.options = options;
        this.contentEl = {clientWidth: 800, clientHeight: 600, isConnected: true};
        this.zoom = {default: 1}; this.rendered = true;
        this.initialCoords = [0,0];
        this.legacyResets = 0;
    }
    createMap() {
        const owner = this;
        const events = new Map();
        const map = {
            calls: [], center: {lat:0,lng:0}, zoom: 1, events,
            on(names, fn) { for (const n of names.split(' ')) events.set(n, fn); },
            off(names, fn) { for (const n of names.split(' ')) if(events.get(n)===fn) events.delete(n); },
            invalidateSize() {},
            fitBounds(bounds, options) {
                this.calls.push({bounds, options});
                this.center = bounds.center;
                this.zoom = Math.log2(Math.min((owner.contentEl.clientWidth-2*options.padding.x)/bounds.w,(owner.contentEl.clientHeight-2*options.padding.y)/bounds.h));
                this.events.get('moveend')?.();
            },
            getCenter() { return this.center; }, getZoom() { return this.zoom; },
            project(p) { const x=p.lng??p[1],y=p.lat??p[0]; return {distanceTo(q){return Math.hypot(x-q.x,y-q.y)},x,y}; }
        };
        this.leafletInstance = map;
    }
    resetZoom() { this.legacyResets++; }
    remove() { this.removed = true; this.rendered = false; }
}
class ResizeObserver {
    constructor(callback) { this.callback=callback; }
    observe(el) { this.el=el; }
    disconnect() { this.disconnected=true; }
}
const context = {exports:{}, BaseMap, ResizeObserver, L:{CRS:{Simple:{}}, point:(x,y)=>({x,y})}};
vm.runInNewContext(code, context);
const ImageMap = context.exports.ImageMap;
function bounds(w=1200,h=1600,valid=true) { return {w,h,center:{lat:h/2,lng:w/2},isValid:()=>valid}; }
function fixture(options={}, b=bounds()) {
    const m = new ImageMap({}, {autoFit:true,fitPadding:12,...options});
    m.currentLayer = {getBounds:()=>b};
    m.renderOptions = {coords:[50,50],zoomDistance:0};
    return m;
}
function resize(m,w,h) {m.contentEl.clientWidth=w;m.contentEl.clientHeight=h;m.imageResize?.callback();}
function count(m){return m.leafletInstance.calls.length;}
function move(m,{zoom,center}) {
    if(zoom!==undefined)m.leafletInstance.zoom=zoom;
    if(center)m.leafletInstance.center=center;
    m.leafletInstance.events.get('moveend')?.();
}
test('initial fit uses actual bounds and padding once',()=>{const m=fixture();assert.equal(m.tryInitialImageFit(),true);assert.equal(count(m),1);assert.equal(m.leafletInstance.calls[0].bounds,m.currentLayer.getBounds());assert.equal(m.leafletInstance.calls[0].options.padding.x,12);assert.equal(m.tryInitialImageFit(),false);assert.equal(count(m),1);});
test('portrait and landscape use viewport dimensions',()=>{for(const b of [bounds(1200,1600),bounds(1600,1200)]){const m=fixture({},b);m.tryInitialImageFit();assert.equal(m.zoom.default,Math.log2(Math.min(776/b.w,576/b.h)));}});
test('hidden and detached viewport defers initial fit',()=>{const m=fixture();m.contentEl.isConnected=false;assert.equal(m.tryInitialImageFit(),false);m.contentEl.isConnected=true;resize(m,0,600);assert.equal(count(m),0);resize(m,800,600);assert.equal(count(m),1);});
test('unloaded and invalid image defer fit',()=>{const m=fixture();m.rendered=false;assert.equal(m.tryInitialImageFit(),false);m.rendered=true;m.currentLayer={getBounds:()=>bounds(100,100,false)};assert.equal(m.tryInitialImageFit(),false);});
test('opt-out and specialized zoom retain upstream reset',()=>{for(const options of [{autoFit:false},{zoomFeatures:true},{zoomMarkers:true}]){const m=fixture(options);assert.equal(m.tryInitialImageFit(),false);m.resetZoom();assert.equal(m.legacyResets,1);assert.equal(count(m),0);}const m=fixture();m.renderOptions.zoomDistance=10;assert.equal(m.tryInitialImageFit(),false);m.resetZoom();assert.equal(m.legacyResets,1);});
test('overview resizes and fullscreen event refits',()=>{const m=fixture();m.tryInitialImageFit();resize(m,1000,800);assert.equal(count(m),2);resize(m,1000,800);assert.equal(count(m),2);m.contentEl.clientWidth=1600;m.leafletInstance.events.get('fullscreenchange')();assert.equal(count(m),3);});
test('zoom detail survives resize until reset',()=>{const m=fixture();m.tryInitialImageFit();move(m,{zoom:m.zoom.default+1});resize(m,1000,800);assert.equal(count(m),1);m.resetZoom();assert.equal(count(m),2);resize(m,1200,900);assert.equal(count(m),3);});
test('pan detail survives resize until reset',()=>{const m=fixture();m.tryInitialImageFit();move(m,{center:{lat:1,lng:1}});resize(m,1000,800);assert.equal(count(m),1);m.resetZoom();assert.equal(count(m),2);});
test('resize-generated movement does not cancel overview',()=>{const m=fixture();m.tryInitialImageFit();m.contentEl.clientWidth=1000;move(m,{center:{lat:1,lng:1}});m.imageResize.callback();assert.equal(count(m),2);});
test('fitOnResize false still supports reset',()=>{const m=fixture({fitOnResize:false});m.tryInitialImageFit();resize(m,1000,800);assert.equal(count(m),1);m.resetZoom();assert.equal(count(m),2);});
test('reset while hidden defers fit until visible',()=>{const m=fixture();m.tryInitialImageFit();resize(m,0,0);m.resetZoom();assert.equal(count(m),1);resize(m,800,600);assert.equal(count(m),2);});
test('reset uses newly selected active image bounds',()=>{const m=fixture();m.tryInitialImageFit();const b=bounds(2000,500);m.currentLayer={getBounds:()=>b};m.resetZoom();assert.equal(m.leafletInstance.calls[1].bounds,b);});
test('invalid and excessive padding are bounded',()=>{for(const p of [-10,NaN,Infinity]){const m=fixture({fitPadding:p});m.tryInitialImageFit();assert.equal(m.leafletInstance.calls[0].options.padding.x,12);}const m=fixture({fitPadding:9999});m.tryInitialImageFit();assert.equal(m.leafletInstance.calls[0].options.padding.x,299.5);});
test('remove disconnects observers and event handlers',()=>{const m=fixture();m.tryInitialImageFit();m.remove();assert.equal(m.imageResize.disconnected,true);assert.equal(m.leafletInstance.events.size,0);assert.equal(m.removed,true);});
