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
   if(typeof w.qr==='string' && /^assets\/qr\/[a-zA-Z0-9_-]+\.png$/.test(w.qr)){
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
