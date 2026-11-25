/* Orthographic globe: geographic selection, shared with the ordinary country filter. */
(function(root){
'use strict';
const NS='http://www.w3.org/2000/svg';
const regionNames=new Intl.DisplayNames(['es'],{type:'region'});
function countryName(code,fallback){try{return regionNames.of(code)||fallback||code;}catch{return fallback||code;}}
async function catalogCountries(){
  for(const host of ['https://de1.api.radio-browser.info','https://nl1.api.radio-browser.info','https://at1.api.radio-browser.info']){
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),7000);
    try{const response=await fetch(host+'/json/countrycodes?hidebroken=true',{signal:controller.signal});if(!response.ok)throw Error('Catálogo no disponible');const rows=await response.json();if(!Array.isArray(rows))throw Error('Catálogo no válido');return rows.filter(r=>/^[A-Z]{2}$/.test(r.name)).map(r=>({code:r.name,name:countryName(r.name),count:Number(r.stationcount)||0}));}catch{}finally{clearTimeout(timeout);}
  }throw Error('No se pudo actualizar la lista de países');
}
async function init({onSelect}){
  const $=id=>document.getElementById(id),select=$('country');
  let features=[],countries=new Map([...select.options].filter(o=>o.value).map(o=>[o.value,{code:o.value,name:o.textContent,count:null}])),selected=select.value,hovered='',rotation=[-8,-22,0],scale=179,projection,path,pointer=null,paths=[],dragged=false;
  const svg=$('world-globe'),status=$('globe-status'),list=$('country-matches');
  function updateOptions(){const value=select.value;select.replaceChildren(new Option('Todo el mundo',''));[...countries.values()].sort((a,b)=>a.name.localeCompare(b.name,'es')).forEach(c=>select.add(new Option(c.name+(c.count!==null?' · '+c.count.toLocaleString('es'):''),c.code)));select.value=countries.has(value)?value:'';}
  function results(){const query=$('country-search').value.trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');list.replaceChildren();if(!query)return;const matches=[...countries.values()].filter(c=>(c.name+' '+c.code).toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(query)).sort((a,b)=>a.name.localeCompare(b.name,'es')).slice(0,6);if(!matches.length){list.textContent='No se encuentra ese país.';return;}for(const c of matches){const b=document.createElement('button');b.type='button';b.textContent=c.name;b.onclick=()=>{$('country-search').value='';list.replaceChildren();choose(c.code,true);};list.append(b);}}
  function selection(){const c=countries.get(selected);$('world-country').textContent=c?.name||'Todo el mundo';$('world-count').textContent=c?.count!==null&&c?.count!==undefined?c.count.toLocaleString('es')+' emisoras en el catálogo':selected?'País seleccionado':'Sin filtro de país';$('world-clear').hidden=!selected;}
  function draw(){if(!projection)return;projection.rotate(rotation).scale(scale);for(const {feature,node}of paths){node.setAttribute('d',path(feature)||'');const code=feature.properties.code;node.setAttribute('fill',code&&code===selected?'#dcf399':code&&code===hovered?'#bdd595':code&&countries.has(code)?'#749b7b':'#486758');node.setAttribute('aria-pressed',String(Boolean(code&&code===selected)));}const grid=$('globe-grid').firstElementChild;if(grid)grid.setAttribute('d',path(d3.geoGraticule10())||'');for(const id of ['globe-shadow','globe-outline'])$(id).setAttribute('r',scale+(id==='globe-outline'?1:0));svg.querySelector('circle').setAttribute('r',scale);}
  function choose(code,search=true){selected=code;select.value=code;const feature=features.find(f=>f.properties.code===code);if(feature&&projection){const center=d3.geoCentroid(feature);rotation=[-center[0],-center[1],0];}selection();draw();if(search)onSelect(code);}
  select.addEventListener('change',()=>choose(select.value,true));$('country-search').addEventListener('input',results);$('world-clear').onclick=()=>choose('');
  const rotate=amount=>{rotation[0]+=amount;draw();};const zoom=amount=>{scale=Math.max(125,Math.min(330,scale+amount));draw();};$('globe-west').onclick=()=>rotate(-22);$('globe-east').onclick=()=>rotate(22);$('globe-zoom-in').onclick=()=>zoom(30);$('globe-zoom-out').onclick=()=>zoom(-30);
  svg.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')rotation[0]-=12;if(e.key==='ArrowRight')rotation[0]+=12;if(e.key==='ArrowUp')rotation[1]=Math.min(85,rotation[1]+10);if(e.key==='ArrowDown')rotation[1]=Math.max(-85,rotation[1]-10);if(e.key==='+')zoom(20);if(e.key==='-')zoom(-20);draw();});
  const point=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const matrix=svg.getScreenCTM();return matrix?p.matrixTransform(matrix.inverse()):{x:0,y:0};};
  function hit(e){if(!projection)return null;const p=point(e);if(Math.hypot(p.x-260,p.y-210)>scale)return null;const coord=projection.invert([p.x,p.y]);return coord?features.find(f=>d3.geoContains(f,coord)):null;}
  svg.addEventListener('pointerdown',e=>{if(pointer||!projection||e.button!==0)return;const p=point(e);pointer={id:e.pointerId,x:p.x,y:p.y,rotation:[...rotation]};dragged=false;svg.setPointerCapture(e.pointerId);});
  svg.addEventListener('pointermove',e=>{if(pointer&&pointer.id===e.pointerId){const p=point(e),dx=p.x-pointer.x,dy=p.y-pointer.y;if(Math.hypot(dx,dy)>5)dragged=true;if(dragged){rotation=[pointer.rotation[0]+dx*.35,Math.max(-85,Math.min(85,pointer.rotation[1]-dy*.35)),0];draw();}return;}const f=hit(e);hovered=f?.properties.code||'';$('globe-hover').textContent=f?countryName(f.properties.code,f.properties.name):'Arrastra para explorar';draw();});
  svg.addEventListener('pointerup',e=>{if(pointer?.id!==e.pointerId)return;pointer=null;if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);if(!dragged){const f=hit(e);if(f?.properties.code&&countries.has(f.properties.code))choose(f.properties.code);else if(f)status.textContent='Este territorio no tiene un código de país seleccionable. Usa el buscador.';}dragged=false;});
  svg.addEventListener('pointercancel',()=>{pointer=null;dragged=false;});svg.addEventListener('pointerleave',()=>{if(!pointer){hovered='';$('globe-hover').textContent='Arrastra para explorar';draw();}});
  // These two loads are independent: a radio API outage must not hide the map.
  const countryLoad=catalogCountries().then(rows=>{rows.forEach(c=>countries.set(c.code,c));updateOptions();selection();results();draw();}).catch(()=>{status.textContent='Catálogo de países sin actualizar. El mapa y el selector siguen disponibles.';});
  try{
    let geo=root.ONDA_COUNTRIES;
    if(!geo){const response=await fetch('data/countries.geojson');if(!response.ok)throw Error('Mapa no disponible');geo=await response.json();}
    if(!root.d3||!Array.isArray(geo.features))throw Error('Mapa no disponible');features=geo.features;
    features.forEach(f=>{const code=f.properties.code;if(code&&!countries.has(code))countries.set(code,{code,name:countryName(code,f.properties.name),count:null});});updateOptions();selection();
    projection=d3.geoOrthographic().translate([260,210]).scale(scale).rotate(rotation).clipAngle(90);path=d3.geoPath(projection);
    const grid=document.createElementNS(NS,'path');grid.setAttribute('fill','none');grid.setAttribute('stroke','#80a399');grid.setAttribute('stroke-opacity','.16');grid.setAttribute('stroke-width','.65');$('globe-grid').append(grid);
    paths=features.map(feature=>{const node=document.createElementNS(NS,'path'),code=feature.properties.code;node.setAttribute('stroke','#173e32');node.setAttribute('stroke-width','.65');node.setAttribute('vector-effect','non-scaling-stroke');node.dataset.country=code;const title=document.createElementNS(NS,'title');title.textContent=countryName(code,feature.properties.name);node.append(title);$('globe-countries').append(node);return {node,feature};});draw();status.textContent='Gira con el dedo o el ratón · + / − para acercar';
  }catch{status.textContent='No se pudo cargar el globo. Puedes seguir filtrando con la lista de países.';}
  await countryLoad;
}
root.OndaGlobe={init,countryName};
})(window);
