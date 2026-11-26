'use strict';
const config = window.FUNDING || {platforms:[],wallets:[]};
const $ = id => document.getElementById(id);
function el(tag, cls, value) { const node = document.createElement(tag); if(cls) node.className=cls; if(value!==undefined) node.textContent=value; return node; }
function safeLink(value) { if(typeof value!=='string') return null; try {const u=new URL(value); return u.protocol==='https:' && !u.username && !u.password ? u.href : null;}catch{return null;} }
function addressOf(w) { return typeof w.address==='string' && w.address.trim() && !/\s/.test(w.address.trim()) ? w.address.trim() : null; }
function status(active) {return el('span','status'+(active?' live':''),active?'Available':'Coming soon');}
for(const p of config.platforms){
 const target=$(p.kind); if(!target || !['one-time','recurring'].includes(p.kind)) continue;
 const card=el('article','platform'), info=el('div'), side=el('div'), url=safeLink(p.url);
 info.append(el('h4','',p.name),el('p','',p.description));
 side.append(status(!!url));
 if(url){const a=el('a','','Open ↗');a.href=url;a.setAttribute('aria-label','Open '+p.name); side.append(el('div'),a);}
 card.append(info,side);target.append(card);
}
let timer;
function feedback(message){const f=$('feedback');f.textContent=message;f.hidden=false;clearTimeout(timer);timer=setTimeout(()=>f.hidden=true,3500);}
async function copy(address){try{await navigator.clipboard.writeText(address);feedback('Address copied. Verify the network before sending.');}catch{feedback('Copy unavailable. Select and copy the address manually.');}}
function render(){
 const root=$('wallets');root.replaceChildren();const query=$('search').value.trim().toLowerCase(), activeOnly=$('available').checked;
 for(const w of config.wallets){
  const address=addressOf(w);
  if(activeOnly&&!address)continue;
  if(query&&![w.symbol,w.name,w.network].join(' ').toLowerCase().includes(query))continue;
  const card=el('article','wallet'),head=el('div','wallet-head'),title=el('div','wallet-title');
  title.append(el('h3','',w.name),el('div','network',w.network));
  head.append(el('div','coin',w.symbol),title,status(!!address));card.append(head);
  if(address){
   card.append(el('code','address',address));
   const actions=el('div','wallet-actions'),btn=el('button','copy','Copy address');
   btn.type='button';btn.setAttribute('aria-label','Copy '+w.symbol+' address on '+w.network);btn.addEventListener('click',()=>copy(address));actions.append(btn);card.append(actions);
   if(typeof w.qr==='string' && /^assets\/qr\/[a-zA-Z0-9_-]+\.(?:png|svg)$/.test(w.qr)){
    const img=el('img','qr');img.src=w.qr;img.alt=w.symbol+' receiving address QR code on '+w.network;img.loading='lazy';card.append(img);
   }
   if(w.note)card.append(el('p','',w.note));
  }else card.append(el('p','','Receiving address not published yet.'));
  root.append(card);
 }
 $('empty').hidden=root.children.length!==0;
}
$('search').addEventListener('input',render);$('available').addEventListener('change',render);render();
const count=config.platforms.filter(p=>safeLink(p.url)).length+config.wallets.filter(addressOf).length;
$('summary').textContent=count?count+' channels available':'Payment channels in preparation';

/* Accessible, mutually exclusive payment tabs. */
const tabKeys=['one-time','recurring','crypto'];
const tabCounts={
 'one-time':config.platforms.filter(p=>p.kind==='one-time'&&safeLink(p.url)).length,
 'recurring':config.platforms.filter(p=>p.kind==='recurring'&&safeLink(p.url)).length,
 'crypto':config.wallets.filter(addressOf).length
};
for(const key of tabKeys){$('count-'+key).textContent=String(tabCounts[key]);}
function activatePaymentTab(key,focus=false){
 if(!tabKeys.includes(key))return;
 for(const current of tabKeys){
  const selected=current===key,tab=$('tab-'+current);
  tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
  $('panel-'+current).hidden=!selected;
 }
 const n=tabCounts[key];
 $('summary').textContent=n?n+' '+(n===1?'channel':'channels')+' available':'Payment channels in preparation';
 if(focus)$('tab-'+key).focus();
}
function paymentTabFromHash(){
 const hash=window.location.hash.slice(1);
 return tabKeys.includes(hash)?hash:null;
}
for(const [i,key] of tabKeys.entries()){
 const tab=$('tab-'+key);
 tab.addEventListener('click',()=>activatePaymentTab(key));
 tab.addEventListener('keydown',event=>{
  let target;
  if(event.key==='ArrowRight')target=tabKeys[(i+1)%tabKeys.length];
  else if(event.key==='ArrowLeft')target=tabKeys[(i+tabKeys.length-1)%tabKeys.length];
  else if(event.key==='Home')target=tabKeys[0];
  else if(event.key==='End')target=tabKeys[tabKeys.length-1];
  else return;
  event.preventDefault();activatePaymentTab(target,true);
 });
}
window.addEventListener('hashchange',()=>{const key=paymentTabFromHash();if(key){activatePaymentTab(key);$('ways').scrollIntoView();}});
activatePaymentTab(paymentTabFromHash()||tabKeys.find(k=>tabCounts[k]>0)||'one-time');
if(paymentTabFromHash())$('ways').scrollIntoView();
