(function(root){
'use strict';
const profiles=[{id:'work',name:'Trabajar',icon:'headphones',tag:'jazz',description:'Tu espacio para concentrarte',color:'#d8ef9c'},{id:'run',name:'Correr',icon:'footprints',tag:'dance',description:'Dale ritmo al camino',color:'#f4b99b'},{id:'rest',name:'Descansar',icon:'moon',tag:'ambient',description:'Baja el volumen del mundo',color:'#cbbce8'},{id:'discover',name:'Descubrir',icon:'compass',tag:'',description:'Encuentra tu próxima favorita',color:'#a9d7e5'}];
function initial(){return {version:1,profile:'work',favorites:[],schedule:[],rotation:0};}
function safeUrl(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:'';}catch{return '';}}
function validStation(s){return s&&typeof s.stationuuid==='string'&&typeof s.name==='string'&&typeof s.url_resolved==='string'&&Boolean(safeUrl(s.url_resolved));}
function validate(s){if(!s||s.version!==1||!profiles.some(p=>p.id===s.profile)||!Array.isArray(s.favorites)||!Array.isArray(s.schedule)||![0,15,30,60].includes(s.rotation))throw Error('Archivo de biblioteca no válido');
if(s.favorites.length>300||s.schedule.length>100||s.favorites.some(f=>!validStation(f)||!Array.isArray(f.profiles)||f.profiles.some(id=>!profiles.some(p=>p.id===id))))throw Error('Favoritas no válidas (máximo 300)');
if(s.rotations&&(typeof s.rotations!=='object'||Object.entries(s.rotations).some(([id,v])=>!profiles.some(p=>p.id===id)||![0,15,30,60].includes(v))))throw Error('Rotación no válida');
const ids=new Set();for(const r of s.schedule){if(!r||typeof r.id!=='string'||ids.has(r.id)||!Array.isArray(r.days)||!r.days.length||r.days.some(d=>!Number.isInteger(d)||d<0||d>6)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(r.start)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(r.end)||r.start===r.end||!profiles.some(p=>p.id===r.profile)||!s.favorites.some(f=>f.stationuuid===r.stationId))throw Error('Horario no válido');ids.add(r.id);}return s;}
function activeSlot(slots,profile,date){const day=date.getDay(),time=String(date.getHours()).padStart(2,'0')+':'+String(date.getMinutes()).padStart(2,'0');return slots.find(s=>s.profile===profile&&(s.start<s.end?s.days.includes(day)&&time>=s.start&&time<s.end:(s.days.includes(day)&&time>=s.start)||(s.days.includes((day+6)%7)&&time<s.end)))||null;}
function overlaps(a,b){if(a.profile!==b.profile)return false;const mins=t=>Number(t.slice(0,2))*60+Number(t.slice(3));const intervals=r=>r.days.flatMap(d=>{let start=d*1440+mins(r.start),end=d*1440+mins(r.end);if(end<start)end+=1440;return [[start,end],[start-10080,end-10080]];});return intervals(a).some(x=>intervals(b).some(y=>x[0]<y[1]&&y[0]<x[1]));}
root.RadioCore={safeUrl,profiles,initial,validate,validStation,activeSlot,overlaps};
if(typeof module!=='undefined')module.exports=root.RadioCore;
})(typeof window==='undefined'?globalThis:window);
