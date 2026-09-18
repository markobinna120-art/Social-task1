emailjs.init("qGk8j7T1Xc9v3m2p");
const SERVICE_ID="service_4x6a8nq";
const TEMPLATE_ID="template_9b2c1d";
const ADMIN="markobinna120@gmail.com";
const APPS=[
{ id:"Facebook", logo:"facebook.png" },
{ id:"Instagram", logo:"https://cdn.simpleicons.org/instagram/E4405F" },
{ id:"TikTok", logo:"https://cdn.simpleicons.org/tiktok/000000" },
{ id:"YouTube", logo:"https://cdn.simpleicons.org/youtube/FF0000" },
{ id:"Twitter/X", logo:"https://cdn.simpleicons.org/x/000000" },
{ id:"WhatsApp", logo:"https://cdn.simpleicons.org/whatsapp/25D366" },
{ id:"Telegram", logo:"https://cdn.simpleicons.org/telegram/26A5E4" },
{ id:"Website", logo:"https://cdn.simpleicons.org/googlechrome/4285F4" }
];
const PRICES={"Like":{adv:30,earn:20},"Follow":{adv:35,earn:25},"Comment":{adv:40,earn:25},"Custom Comment":{adv:50,earn:30},"Share":{adv:40,earn:25},"Video View":{adv:35,earn:25},"Group Join":{adv:50,earn:30},"Channel Follow":{adv:50,earn:30},"Website Signup":{adv:80,earn:50},"Website Vote":{adv:60,earn:40},"Website Visit":{adv:30,earn:20},"Start Bot":{adv:50,earn:30}};
let curUser=null,curTask=null,currentPage=1,perPage=10,selectedApp="Facebook";
function init(){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
if(!users.find(u=>u.email===ADMIN)){
users.push({email:ADMIN,username:'Admin Mark',password:'Admin123',status:'active',av:0,pd:0,dep:0});
localStorage.setItem('mt_users',JSON.stringify(users));
}
let grid=document.getElementById('appGrid');
if(grid){
grid.innerHTML='';
APPS.forEach(a=>{
let d=document.createElement('div');
d.style.cssText='background:#fff;border:2px solid #eee;border-radius:14px;padding:12px;text-align:center;cursor:pointer';
d.innerHTML=`<img src="${a.logo}" style="width:45px;height:45px;border-radius:50%;object-fit:cover;background:#fff"><br><small style="font-weight:bold;font-size:11px">${a.id}</small>`;
d.onclick=()=>selectApp(a.id);
d.id='app_'+a.id;
grid.appendChild(d);
});
selectApp('Facebook');
}
checkLogin();
}
function selectApp(id){selectedApp=id;document.querySelectorAll('#appGrid div').forEach(x=>x.style.borderColor='#eee');let el=document.getElementById('app_'+id);if(el)el.style.borderColor='#0a7e07';document.getElementById('selectedAppText').textContent='Selected: '+id+' ✓';loadTypes();}
function loadTypes(){
let sel=document.getElementById('pType');if(!sel)return;sel.innerHTML='';
let opts=selectedApp==='Website'?["Website Signup","Website Vote","Website Visit"]:selectedApp==='WhatsApp'?["Group Join","Channel Follow"]:selectedApp==='Telegram'?["Group Join","Channel Follow","Start Bot","Like","Follow"]:["Like","Follow","Comment","Custom Comment","Share","Video View","Group Join","Channel Follow"];
opts.forEach(o=>{let e=document.createElement('option');e.value=o;e.textContent=o+' - Adv ₦'+PRICES[o].adv+' / Earn ₦'+PRICES[o].earn;sel.appendChild(e)});
sel.onchange=updatePrice;document.getElementById('pQty').oninput=updatePrice;updatePrice();
}
function updatePrice(){
let t=document.getElementById('pType').value;let q=parseInt(document.getElementById('pQty').value)||0;if(!PRICES[t])return;
document.getElementById('priceInfo').innerHTML=`Pay ₦${PRICES[t].adv*q} • Earn per user ₦${PRICES[t].earn} • Deposit starts ₦0 - Need ₦${PRICES[t].adv*q}`;
            }
function checkLogin(){
let email=localStorage.getItem('mt_cur');if(!email){showAuth();return;}
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');curUser=users.find(u=>u.email===email);
if(!curUser){showAuth();return;}
document.getElementById('auth').classList.add('hidden');document.getElementById('home').classList.remove('hidden');
// DEPOSIT IS 0 BY DEFAULT
if(curUser.av===undefined) curUser.av=0; if(curUser.pd===undefined) curUser.pd=0; if(curUser.dep===undefined) curUser.dep=0;
document.getElementById('avBal').textContent='₦'+(curUser.av||0);document.getElementById('pdBal').textContent='₦'+(curUser.pd||0);document.getElementById('postDep').textContent='₦'+(curUser.dep||0);
// ADMIN PANEL ONLY FOR YOU - HIDE FROM OTHERS
let adminLink=document.getElementById('adminLink');
if(curUser.email===ADMIN){
adminLink.classList.remove('hidden');adminLink.style.display='block';
}else{
adminLink.classList.add('hidden');adminLink.style.display='none';
}
loadHomeTasks();loadAllTasks();loadMyDeposits();
}
function showAuth(){document.getElementById('auth').classList.remove('hidden');document.getElementById('home').classList.add('hidden');}
function toggleMenu(){document.getElementById('sideMenu').classList.toggle('active')}
function showPage(p){['home','tasks','post','deposit','admin'].forEach(id=>{let el=document.getElementById(id);if(el)el.classList.add('hidden')});let t=document.getElementById(p);if(t)t.classList.remove('hidden');if(p==='tasks')loadAllTasks();if(p==='deposit')loadMyDeposits();if(p==='post')document.getElementById('postDep').textContent='₦'+(curUser.dep||0);}
let codeSent='',tempData={};
async function handleAuth(){
let user=document.getElementById('aUser').value.trim();let email=document.getElementById('aEmail').value.trim();let pass=document.getElementById('aPass').value.trim();let codeInput=document.getElementById('aCode');
if(!codeInput.classList.contains('hidden')){if(document.getElementById('aCode').value.trim()!==codeSent){alert('Wrong code');return;}let users=JSON.parse(localStorage.getItem('mt_users')||'[]');if(tempData.mode==='signup'){users.push({email:tempData.email,username:tempData.user,password:tempData.pass,status:'active',av:0,pd:0,dep:0});localStorage.setItem('mt_users',JSON.stringify(users));}localStorage.setItem('mt_cur',tempData.email);location.reload();return;}
if(!user||!email||!pass){alert('Fill all');return;}let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let exists=users.find(u=>u.email===email);tempData={user,email,pass};
if(exists){tempData.mode='login';if(exists.password!==pass){alert('Wrong password');return;}}else tempData.mode='signup';
codeSent=Math.floor(100000+Math.random()*900000).toString();document.getElementById('emailStatus').textContent='Sending...';
try{await emailjs.send(SERVICE_ID,TEMPLATE_ID,{to_email:email,code:codeSent,username:user});document.getElementById('emailStatus').textContent='Code sent to '+email;codeInput.classList.remove('hidden');document.getElementById('authBtn').textContent='Verify & Login';}catch(e){document.getElementById('emailStatus').textContent='Code: '+codeSent+' (email failed, use this)';codeInput.classList.remove('hidden');document.getElementById('authBtn').textContent='Verify & Login';}
}
function logout(){localStorage.removeItem('mt_cur');location.reload();}
function taskHtml(t){let app=APPS.find(a=>a.id===t.app);let img=app?`<img src="${app.logo}">`:'';return `<div class="task"><div class="logo">${img}</div><div style="flex:1"><b>${t.name}</b><br><small>${t.app} • ${t.type} • ₦${t.priceEarn}</small><br><span class="badge">${t.remaining} left</span></div><button class="btn" style="width:auto;padding:8px 16px" onclick="openTask('${t.id}')">Do Task</button></div>`;}
function getMyDoneIds(){let p=JSON.parse(localStorage.getItem('mt_proofs')||'[]');return p.filter(x=>x.user===curUser.email).map(x=>x.taskId);}
function loadHomeTasks(){let done=getMyDoneIds();let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]').filter(t=>t.remaining>0&&t.owner!==curUser.email&&!done.includes(t.id)).slice(0,6);document.getElementById('homeTasks').innerHTML=tasks.length?tasks.map(taskHtml).join(''):'No tasks - you completed all!';}
function loadAllTasks(){let done=getMyDoneIds();let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]').filter(t=>t.remaining>0&&t.owner!==curUser.email&&!done.includes(t.id));let start=(currentPage-1)*perPage;let pag=tasks.slice(start,start+perPage);document.getElementById('allTasks').innerHTML=pag.length?pag.map(taskHtml).join(''):'You have completed all tasks! 🎉 - Deleted from your feed';document.getElementById('prevBtn').disabled=currentPage===1;document.getElementById('nextBtn').disabled=start+perPage>=tasks.length;}
function changePage(d){currentPage+=d;if(currentPage<1)currentPage=1;loadAllTasks();}
function createTask(){
let type=document.getElementById('pType').value;let link=document.getElementById('pLink').value.trim();let qty=parseInt(document.getElementById('pQty').value);
if(!link||!qty){alert('Fill all');return;}let price=PRICES[type];let total=price.adv*qty;
if((curUser.dep||0)<total){alert('Insufficient deposit. Balance ₦0, Need ₦'+total+'. Go deposit!');showPage('deposit');return;}
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');
let custom=[];if(type==='Custom Comment'){let c=prompt('Enter comments separated by comma');if(c)custom=c.split(',').map(s=>s.trim()).filter(Boolean);}
let task={id:'t_'+Date.now(),name:type+' on '+selectedApp,app:selectedApp,type,link,qty,remaining:qty,priceAdv:price.adv,priceEarn:price.earn,owner:curUser.email,customComments:custom,created:Date.now()};
tasks.push(task);localStorage.setItem('mt_tasks',JSON.stringify(tasks));
curUser.dep-=total;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let idx=users.findIndex(u=>u.email===curUser.email);users[idx]=curUser;localStorage.setItem('mt_users',JSON.stringify(users));
alert('Task posted!');document.getElementById('pLink').value='';showPage('tasks');
}
function openTask(id){
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');curTask=tasks.find(t=>t.id===id);if(!curTask){alert('Not found');return;}
document.getElementById('popTitle').textContent=curTask.name;document.getElementById('popLink').href=curTask.link;
let info=document.getElementById('popInfo');info.classList.add('hidden');info.textContent='';if(curTask.app==='Website')info.textContent='Use same email as this app for signup';if(curTask.type==='Group Join')info.textContent='Join group and screenshot as proof';if(info.textContent)info.classList.remove('hidden');
document.getElementById('popCustomList').innerHTML=curTask.customComments&&curTask.customComments.length?'<b>Use:</b><br>'+curTask.customComments.join('<br>'):'';
document.getElementById('taskPopup').style.display='flex';
}
function closePopup(id){document.getElementById(id).style.display='none';}
function submitProof(){
let handle=document.getElementById('popHandle').value.trim();let file=document.getElementById('popFile').files[0];
if(!handle||!file){alert('Fill handle and proof');return;}
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');if(proofs.find(p=>p.taskId===curTask.id&&p.user===curUser.email)){alert('Already done - deleted from feed');return;}
let reader=new FileReader();reader.onload=function(e){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
proofs.push({id:'p_'+Date.now(),taskId:curTask.id,taskName:curTask.name,owner:curTask.owner,user:curUser.email,handle,proof:e.target.result,status:'pending',type:curTask.type,app:curTask.app,created:Date.now()});
localStorage.setItem('mt_proofs',JSON.stringify(proofs));
alert('Submitted! Task deleted from your feed ✅');closePopup('taskPopup');loadHomeTasks();loadAllTasks();
};reader.readAsDataURL(file);
}
function submitDeposit(){let name=document.getElementById('dName').value.trim();let amt=parseInt(document.getElementById('dAmt').value);if(!name||!amt){alert('Fill');return;}let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]');deps.push({id:'d_'+Date.now(),user:curUser.email,accountName:name,amount:amt,status:'pending',created:Date.now()});localStorage.setItem('mt_deposits',JSON.stringify(deps));alert('Sent to admin - Only markobinna120@gmail.com will approve');loadMyDeposits();}
function loadMyDeposits(){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]').filter(d=>d.user===curUser.email);document.getElementById('myDeposits').innerHTML=deps.length?deps.map(d=>`<div style="border:1px solid #eee;padding:8px;margin:5px 0;border-radius:8px">${d.accountName} - ₦${d.amount} - <b>${d.status}</b></div>`).join(''):'No deposits - Balance ₦0';}
function showAdmin(tab){
if(curUser.email!==ADMIN){alert('Access denied! Only markobinna120@gmail.com is admin');return;}
let c=document.getElementById('adminContent');
if(tab==='users'){let users=JSON.parse(localStorage.getItem('mt_users')||'[]');c.innerHTML='<h4>All Users - Deposit ₦0 default</h4>'+users.map(u=>`<div style="padding:8px;border-bottom:1px solid #eee">${u.username} - ${u.email} - Av ₦${u.av||0} Dep ₦${u.dep||0}</div>`).join('');}
if(tab==='allTasksAdmin'){let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');c.innerHTML='<h4>Tasks</h4>'+tasks.map(t=>`<div style="padding:8px;border-bottom:1px solid #eee">${t.name} - ${t.remaining}/${t.qty} - ${t.owner} <button onclick="deleteTask('${t.id}')">Delete</button></div>`).join('');}
if(tab==='proofs'){let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]').filter(p=>p.status==='pending');c.innerHTML='<h4>Pending Proofs</h4>'+(proofs.length?proofs.map(p=>`<div style="border:1px solid #eee;padding:10px;margin:8px 0"><b>${p.taskName}</b><br>${p.user} - ${p.handle}<br><img src="${p.proof}" style="width:100%;max-width:220px"><br><button class="btn-approve" onclick="approveProof('${p.id}')">Approve</button><button class="btn-reject" onclick="rejectProof('${p.id}')">Reject</button></div>`).join(''):'No pending');}
if(tab==='depositsAdmin'){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]').filter(d=>d.status==='pending');c.innerHTML='<h4>Pending Deposits - All start ₦0</h4>'+(deps.length?deps.map(d=>`<div style="border:1px solid #eee;padding:10px;margin:8px 0">${d.user} - ₦${d.amount} - ${d.accountName}<br><button class="btn-approve" onclick="approveDeposit('${d.id}')">Approve</button><button class="btn-reject" onclick="rejectDeposit('${d.id}')">Reject</button></div>`).join(''):'No pending');}
}
function approveProof(id){let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');let p=proofs.find(x=>x.id===id);if(!p)return;let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');let t=tasks.find(x=>x.id===p.taskId);if(t){t.remaining--;localStorage.setItem('mt_tasks',JSON.stringify(tasks));}let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===p.user);if(u){u.av=(u.av||0)+(t?t.priceEarn:20);localStorage.setItem('mt_users',JSON.stringify(users));}p.status='approved';localStorage.setItem('mt_proofs',JSON.stringify(proofs));alert('Approved');showAdmin('proofs');}
function rejectProof(id){let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');let p=proofs.find(x=>x.id===id);if(!p)return;p.status='rejected';localStorage.setItem('mt_proofs',JSON.stringify(proofs));alert('Rejected');showAdmin('proofs');}
function approveDeposit(id){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]');let d=deps.find(x=>x.id===id);if(!d)return;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===d.user);if(u){u.dep=(u.dep||0)+d.amount;localStorage.setItem('mt_users',JSON.stringify(users));}d.status='approved';localStorage.setItem('mt_deposits',JSON.stringify(deps));alert('Deposit approved - from ₦0 to ₦'+d.amount);showAdmin('depositsAdmin');}
function rejectDeposit(id){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]');let d=deps.find(x=>x.id===id);if(!d)return;d.status='rejected';localStorage.setItem('mt_deposits',JSON.stringify(deps));alert('Rejected');showAdmin('depositsAdmin');}
function deleteTask(id){if(!confirm('Delete?'))return;let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');tasks=tasks.filter(t=>t.id!==id);localStorage.setItem('mt_tasks',JSON.stringify(tasks));showAdmin('allTasksAdmin');}
window.onload=init;
// Web App Install
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}
