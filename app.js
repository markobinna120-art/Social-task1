const PRICES={
"Like":{adv:11,earn:4},"Follow":{adv:11,earn:5},"Comment":{adv:11,earn:5},"Custom Comment":{adv:50,earn:10},
"Share":{adv:11,earn:4},"Group Join":{adv:17,earn:7},"Channel Follow":{adv:17,earn:7},"Start Bot":{adv:20,earn:10},"Video View":{adv:12,earn:3},
"Website Signup":{adv:30,earn:10},"Website Vote":{adv:30,earn:7},"Website Visit":{adv:30,earn:3}
};
const APPS=[
{ id:"Facebook",icon:"📘" },{id:"Instagram",icon:"📸"},{id:"TikTok",icon:"🎵"},{id:"YouTube",icon:"▶️"},
{id:"Twitter/X",icon:"🐦"},{id:"WhatsApp",icon:"💬"},{id:"Telegram",icon:"✈️"},{id:"Website",icon:"🌐"}
];
let currentUser=null, tempCode=null, curTask=null, page=1;
function init(){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
if(!users.find(u=>u.email==='markobinna120@gmail.com')){
users.push({email:'markobinna120@gmail.com',username:'Admin Mark',password:'admin123',status:'active',av:0,pd:0,dep:100000});
localStorage.setItem('mt_users',JSON.stringify(users));
}
let appsel=document.getElementById('pApp');
APPS.forEach(a=>{ let o=document.createElement('option');o.value=a.id;o.textContent=a.icon+' '+a.id;appsel.appendChild(o)});
loadTypes(); checkLogin();
}
function loadTypes(){
let app=document.getElementById('pApp').value;
let typeSel=document.getElementById('pType'); typeSel.innerHTML='';
let opts=[];
if(app==='Website') opts=["Website Signup","Website Vote","Website Visit"];
else if(app==='WhatsApp') opts=["Group Join","Channel Follow"];
else if(app==='Telegram') opts=["Group Join","Channel Follow","Start Bot","Like","Follow"];
else opts=["Like","Follow","Comment","Custom Comment","Share","Video View","Group Join","Channel Follow"];
opts.forEach(o=>{ let el=document.createElement('option');el.value=o;el.textContent=o+' - Adv ₦'+PRICES[o].adv+' / Earn ₦'+PRICES[o].earn;typeSel.appendChild(el)});
updatePrice();
}
function checkCustom(){
let t=document.getElementById('pType').value;
document.getElementById('customBox').classList.toggle('hidden',t!=='Custom Comment');
updatePrice();
}
function updatePrice(){
let t=document.getElementById('pType').value, q=document.getElementById('pQty').value||0;
if(PRICES[t]) document.getElementById('priceInfo').textContent=`You pay ₦${PRICES[t].adv} x ${q} = ₦${PRICES[t].adv*q} | Earners get ₦${PRICES[t].earn} each`;
}
document.getElementById('pQty').addEventListener('input',updatePrice);
document.getElementById('pType').addEventListener('change',updatePrice);
function handleAuth(){
let email=document.getElementById('aEmail').value.trim().toLowerCase();
let user=document.getElementById('aUser').value.trim();
let pass=document.getElementById('aPass').value;
let codeInput=document.getElementById('aCode');
if(!email||!pass||!user) return alert('Fill all');
if(codeInput.classList.contains('hidden')){
tempCode=Math.floor(100000+Math.random()*900000);
alert('Your verification code is: '+tempCode);
codeInput.classList.remove('hidden');
document.getElementById('authBtn').textContent='Verify & Sign Up / Login';
}else{
if(codeInput.value!=tempCode) return alert('Wrong code');
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let u=users.find(x=>x.email===email);
if(u){
if(u.status==='temp'){ let until=new Date(u.until); if(new Date()<until) return alert('Your account has been disabled and will be enabled in the next 7 days'); else{ u.status='active'; } }
if(u.status==='banned') return alert('Your account has been banned');
if(u.password!==pass) return alert('Wrong password');
}else{
users.push({email,username:user,password:pass,status:'active',av:0,pd:0,dep:0});
localStorage.setItem('mt_users',JSON.stringify(users));
u=users.find(x=>x.email===email);
}
localStorage.setItem('mt_cur',email);
checkLogin();
}
}   
function checkLogin(){
let email=localStorage.getItem('mt_cur');
if(!email) return;
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let u=users.find(x=>x.email===email);
if(!u) return;
currentUser=u;
document.getElementById('auth').classList.add('hidden');
['home','tasks','post','deposit'].forEach(id=>document.getElementById(id).classList.remove('hidden'));
showPage('home');
document.getElementById('adminLink').classList.toggle('hidden',email!=='markobinna120@gmail.com');
refreshHome();
}
function showPage(p){
['home','tasks','post','deposit','admin'].forEach(x=>document.getElementById(x).classList.add('hidden'));
document.getElementById(p).classList.remove('hidden');
if(p==='home') refreshHome();
if(p==='tasks') renderTasks();
if(p==='post') { document.getElementById('postDep').textContent='₦'+currentUser.dep; }
if(p==='deposit') renderMyDeposits();
}
function toggleMenu(){ document.getElementById('sideMenu').classList.toggle('active'); }
function refreshHome(){
document.getElementById('avBal').textContent='₦'+currentUser.av;
document.getElementById('pdBal').textContent='₦'+currentUser.pd;
document.getElementById('dpBal').textContent='₦'+currentUser.dep;
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]').slice(0,3);
document.getElementById('homeTasks').innerHTML=tasks.map(t=>taskHtml(t)).join('')||'No tasks yet';
}
function taskHtml(t){
let app=APPS.find(a=>a.id===t.app);
return `<div class="task"><div class="logo">${app?app.icon:'🔗'}</div><div style="flex:1"><b>${t.name}</b><br><small>${t.app} • ${t.type} • Earn ₦${t.priceEarn}</small><br><span class="badge">${t.remaining} left</span></div><button class="btn" style="width:auto" onclick="openTask('${t.id}')">View</button></div>`;
}
function renderTasks(){
let all=JSON.parse(localStorage.getItem('mt_tasks')||'[]').filter(t=>t.remaining>0);
let start=(page-1)*10;
let slice=all.slice(start,start+10);
document.getElementById('allTasks').innerHTML=slice.map(t=>taskHtml(t)).join('')||'No tasks';
document.getElementById('prevBtn').style.display=page>1?'block':'none';
document.getElementById('nextBtn').style.display=(start+10)<all.length?'block':'none';
}
function changePage(d){ page+=d; renderTasks(); }
function submitDeposit(){
let name=document.getElementById('dName').value, amt=parseInt(document.getElementById('dAmt').value);
if(!name||!amt) return alert('Fill');
let deps=JSON.parse(localStorage.getItem('mt_deps')||'[]');
deps.push({id:Date.now(),email:currentUser.email,name,amt,status:'pending'});
localStorage.setItem('mt_deps',JSON.stringify(deps));
alert('Your deposit has successfully been made and will be reviewed and approved within 24 hours');
renderMyDeposits();
}
function renderMyDeposits(){
let deps=JSON.parse(localStorage.getItem('mt_deps')||'[]').filter(d=>d.email===currentUser.email);
document.getElementById('myDeposits').innerHTML=deps.map(d=>`<div style="padding:8px;border-bottom:1px solid #eee">₦${d.amt} - ${d.status}</div>`).join('');
}
function createTask(){
let app=document.getElementById('pApp').value, type=document.getElementById('pType').value, link=document.getElementById('pLink').value, qty=parseInt(document.getElementById('pQty').value), inst=document.getElementById('pInst').value, custom=document.getElementById('pCustom').value;
if(!link||!qty) return alert('Fill link and qty');
let price=PRICES[type]; let total=price.adv*qty;
if(currentUser.dep<total) return alert('Insufficient deposit. Need ₦'+total+' have ₦'+currentUser.dep);
currentUser.dep-=total;
updateUser(currentUser);
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');
tasks.unshift({id:'t'+Date.now(),advertiser:currentUser.email,name:app+' '+type,app,type,link,inst,custom,priceAdv:price.adv,priceEarn:price.earn,quantity:qty,remaining:qty});
localStorage.setItem('mt_tasks',JSON.stringify(tasks));
alert('Task posted and auto-approved!');
showPage('tasks'); renderTasks();
}
function openTask(id){
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]'); curTask=tasks.find(t=>t.id===id);
document.getElementById('popTitle').textContent=curTask.name;
document.getElementById('popInfo').textContent=curTask.inst+' | Earn ₦'+curTask.priceEarn;
document.getElementById('popLink').href=curTask.link;
if(curTask.type==='Custom Comment' && curTask.custom){
document.getElementById('popCustomList').innerHTML='Copy:<br>'+curTask.custom.split('\n').map(c=>`<span style="display:inline-block;background:#fff;padding:4px 8px;margin:3px;border-radius:6px;cursor:pointer" onclick="navigator.clipboard.writeText('${c.replace(/'/g,"\\'")}');alert('Copied')">${c}</span>`).join('');
}else{ document.getElementById('popCustomList').innerHTML=''; }
document.getElementById('taskPopup').style.display='flex';
}
function closePopup(id){ document.getElementById(id).style.display='none'; }
function submitProof(){
let handle=document.getElementById('popHandle').value; let file=document.getElementById('popFile').files[0];
if(!handle||!file) return alert('Enter handle and proof');
let reader=new FileReader();
reader.onload=function(e){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
proofs.push({id:'p'+Date.now(),taskId:curTask.id,earner:currentUser.email,handle,img:e.target.result,status:'pending',earn:curTask.priceEarn});
localStorage.setItem('mt_proofs',JSON.stringify(proofs));
closePopup('taskPopup');
alert('Task successfully submitted, will be reviewed and approved within 24 - 48 hours');
};
reader.readAsDataURL(file);
}
function updateUser(u){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let i=users.findIndex(x=>x.email===u.email); users[i]=u;
localStorage.setItem('mt_users',JSON.stringify(users)); currentUser=u;
}
function showAdmin(type){
let div=document.getElementById('adminContent');
if(type==='users'){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
div.innerHTML='<h4>All Users</h4>'+users.map(u=>`<div style="padding:8px;border-bottom:1px solid #eee"><b>${u.username}</b> (${u.email})<br>Av:₦${u.av} Pd:₦${u.pd} Dep:₦${u.dep} Status:${u.status}<br><button onclick="tempDel('${u.email}')">Temp 7d</button> <button onclick="permDel('${u.email}')">Ban</button> <button onclick="enableUser('${u.email}')">Enable</button></div>`).join('');
}
if(type==='allTasksAdmin'){
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');
div.innerHTML='<h4>All Tasks</h4>'+tasks.map(t=>`<div style="padding:8px;border-bottom:1px solid #eee">${t.name}<br><button onclick="delTask('${t.id}')">Delete</button></div>`).join('');
}
if(type==='proofs'){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]').filter(p=>p.status==='pending');
div.innerHTML='<h4>Pending Proofs</h4>'+proofs.map(p=>`<div style="padding:8px;border-bottom:1px solid #eee"><img src="${p.img}" style="width:100%;max-height:200px;object-fit:contain"><br>Task:${p.taskId}<br>Earner:${p.earner}<br>Handle:${p.handle}<br>₦${p.earn}<br><button onclick="approveProof('${p.id}')">Approve</button> <button onclick="rejectProof('${p.id}')">Reject</button></div>`).join('')||'No pending';
}
if(type==='depositsAdmin'){
let deps=JSON.parse(localStorage.getItem('mt_deps')||'[]').filter(d=>d.status==='pending');
div.innerHTML='<h4>Pending Deposits</h4>'+deps.map(d=>`<div style="padding:8px;border-bottom:1px solid #eee">${d.email} - ₦${d.amt} - ${d.name}<br><button onclick="approveDep('${d.id}')">Approve</button> <button onclick="rejectDep('${d.id}')">Reject</button></div>`).join('')||'No pending';
}
}
function tempDel(email){ let users=JSON.parse(localStorage.getItem('mt_users')||'[]'); let u=users.find(x=>x.email===email); u.status='temp'; u.until=new Date(Date.now()+7*24*3600*1000).toISOString(); localStorage.setItem('mt_users',JSON.stringify(users)); showAdmin('users'); }
function permDel(email){ let users=JSON.parse(localStorage.getItem('mt_users')||'[]'); let u=users.find(x=>x.email===email); u.status='banned'; localStorage.setItem('mt_users',JSON.stringify(users)); showAdmin('users'); }
function enableUser(email){ let users=JSON.parse(localStorage.getItem('mt_users')||'[]'); let u=users.find(x=>x.email===email); u.status='active'; delete u.until; localStorage.setItem('mt_users',JSON.stringify(users)); showAdmin('users'); }
function delTask(id){ let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]'); localStorage.setItem('mt_tasks',JSON.stringify(tasks.filter(t=>t.id!==id))); showAdmin('allTasksAdmin'); }
function approveProof(id){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]'); let p=proofs.find(x=>x.id===id); p.status='approved_pending';
localStorage.setItem('mt_proofs',JSON.stringify(proofs));
let users=JSON.parse(localStorage.getItem('mt_users')||'[]'); let u=users.find(x=>x.email===p.earner); u.pd+=p.earn; localStorage.setItem('mt_users',JSON.stringify(users));
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]'); let t=tasks.find(x=>x.id===p.taskId); if(t) t.remaining--; localStorage.setItem('mt_tasks',JSON.stringify(tasks));
setTimeout(()=>{ let users2=JSON.parse(localStorage.getItem('mt_users')||'[]'); let u2=users2.find(x=>x.email===p.earner); u2.pd-=p.earn; u2.av+=p.earn; localStorage.setItem('mt_users',JSON.stringify(users2)); },1000);
showAdmin('proofs');
}
function rejectProof(id){ let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]'); let p=proofs.find(x=>x.id===id); p.status='rejected'; localStorage.setItem('mt_proofs',JSON.stringify(proofs)); showAdmin('proofs'); }
function approveDep(id){
let deps=JSON.parse(localStorage.getItem('mt_deps')||'[]'); let d=deps.find(x=>x.id===id); d.status='approved';
localStorage.setItem('mt_deps',JSON.stringify(deps));
let users=JSON.parse(localStorage.getItem('mt_users')||'[]'); let u=users.find(x=>x.email===d.email); u.dep+=d.amt; localStorage.setItem('mt_users',JSON.stringify(users));
showAdmin('depositsAdmin');
}
function rejectDep(id){ let deps=JSON.parse(localStorage.getItem('mt_deps')||'[]'); let d=deps.find(x=>x.id===id); d.status='rejected'; localStorage.setItem('mt_deps',JSON.stringify(deps)); showAdmin('depositsAdmin'); }
function logout(){ localStorage.removeItem('mt_cur'); location.reload(); }
init();
