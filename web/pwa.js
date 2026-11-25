/* Installation and updates belong to the listening device. */
(function(){
'use strict';
if(typeof google!=='undefined'&&google.script&&google.script.run){document.getElementById('install-app').hidden=true;return;}
const install=document.getElementById('install-app'),help=document.getElementById('install-help'),status=document.getElementById('pwa-status'),update=document.getElementById('update-app');
let deferredPrompt,registration,reloading=false;
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
function connectivity(){status.textContent=navigator.onLine?'La radio necesita conexión a internet':'Sin conexión · puedes consultar tus favoritas';}
install.hidden=standalone();connectivity();addEventListener('online',connectivity);addEventListener('offline',connectivity);
addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;install.hidden=false;install.textContent='Instalar Onda';});
addEventListener('appinstalled',()=>{deferredPrompt=null;install.hidden=true;status.textContent='Onda instalada en este dispositivo';});
install.onclick=async()=>{if(!deferredPrompt){help.showModal();return;}const prompt=deferredPrompt;deferredPrompt=null;try{await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='accepted')install.hidden=true;}catch{help.showModal();}};
document.getElementById('close-install-help').onclick=()=>help.close();help.addEventListener('click',event=>{if(event.target===help)help.close();});
update.onclick=()=>{if(registration?.waiting)registration.waiting.postMessage({type:'SKIP_WAITING'});};
if('serviceWorker'in navigator&&isSecureContext){navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloading&&registration?.active&&update.dataset.requested==='true'){reloading=true;location.reload();}});update.addEventListener('click',()=>{update.dataset.requested='true';});navigator.serviceWorker.register('sw.js').then(reg=>{registration=reg;const waiting=()=>{if(reg.waiting&&navigator.serviceWorker.controller)update.hidden=false;};waiting();reg.addEventListener('updatefound',()=>{reg.installing?.addEventListener('statechange',waiting);});}).catch(()=>{status.textContent='No se pudo preparar el acceso sin conexión. La radio sigue disponible.';});}
})();
