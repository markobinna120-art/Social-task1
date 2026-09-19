emailjs.init("eOnK3qvUFiw89dhdV");
const SERVICE_ID="service_147bn6m";
const TEMPLATE_ID="template_kndbrqg";
const ADMIN="markobinna120@gmail.com";
const APPS=[
{ id:"Facebook", logo:"https://cdn.simpleicons.org/facebook/1877F2" },
{ id:"Instagram", logo:"https://cdn.simpleicons.org/instagram/E4405F" },
{ id:"TikTok", logo:"https://cdn.simpleicons.org/tiktok/000000" },
{ id:"YouTube", logo:"https://cdn.simpleicons.org/youtube/FF0000" },
{ id:"Twitter/X", logo:"https://cdn.simpleicons.org/x/000000" },
{ id:"WhatsApp", logo:"https://cdn.simpleicons.org/whatsapp/25D366" },
{ id:"Telegram", logo:"https://cdn.simpleicons.org/telegram/26A5E4" },
{ id:"Website", logo:"https://cdn.simpleicons.org/googlechrome/4285F4" }
];
const PRICES={
"Like a post":{adv:30,earn:20},"Like a video":{adv:30,earn:20},"Watch a video":{adv:35,earn:25},"View a video":{adv:35,earn:25},
"Comment on a video":{adv:40,earn:25},"Custom comment":{adv:50,earn:30},
"Share a post":{adv:40,earn:25},"Join a group":{adv:50,earn:30},
"Follow a channel":{adv:50,earn:30},"Start a telegram bot":{adv:50,earn:30},
"Website Signup":{adv:80,earn:50},"Website Vote":{adv:60,earn:40},"Website Visit":{adv:30,earn:20}
};
let curUser=null,curTask=null,currentPage=1,perPage=10,selectedApp="Facebook";
let authMode='signin';
function genRefCode(email){return email.split('@')[0].replace(/[^a-z0-9]/gi,'').toLowerCase() + Math.floor(100+Math.random()*900);}
function init(){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
if(!users.find(u=>u.email===ADMIN)){
users.push({email:ADMIN,username:'Admin Mark',password:'Admin123',status:'active',av:0,pd:0,dep:0,refCode:'admin120',referredBy:null,refEarn:0,hasWithdrawn:false});
localStorage.setItem('mt_users',JSON.stringify(users));
}
users.forEach(u=>{if(!u.refCode)u.refCode=genRefCode(u.email); if(u.refEarn===undefined)u.refEarn=0; if(u.hasWithdrawn===undefined)u.hasWithdrawn=false;});
localStorage.setItem('mt_users',JSON.stringify(users));
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
let urlParams=new URLSearchParams(window.location.search);
let ref=urlParams.get('ref');
if(ref){let refInput=document.getElementById('aRef'); if(refInput){refInput.value=ref; setAuthMode('signup');}}
setAuthMode('signin');
checkLogin();
}
function setAuthMode(mode){
authMode=mode;
let tabIn=document.getElementById('tabSignIn'); let tabUp=document.getElementById('tabSignUp');
let userInput=document.getElementById('aUser'); let authBtn=document.getElementById('authBtn');
let switchBtn=document.getElementById('switchBtn'); let codeInput=document.getElementById('aCode'); let refInput=document.getElementById('aRef');
if(mode==='signin'){
tabIn.className='active'; tabUp.className='inactive';
userInput.classList.add('hidden'); codeInput.classList.add('hidden'); refInput.classList.add('hidden');
authBtn.textContent='Sign In - No Code'; switchBtn.textContent="Don't have account? Sign Up";
}else{
tabIn.className='inactive'; tabUp.className='active';
userInput.classList.remove('hidden'); refInput.classList.remove('hidden');
authBtn.textContent='Sign Up - Send Code To Your Email'; switchBtn.textContent="Already have account? Sign In";
}
document.getElementById('emailStatus').textContent='';
}
function toggleAuthMode(){setAuthMode(authMode==='signin'?'signup':'signin');}
function selectApp(id){selectedApp=id;document.querySelectorAll('#appGrid div').forEach(x=>x.style.borderColor='#eee');let el=document.getElementById('app_'+id);if(el)el.style.borderColor='#0a7e07';document.getElementById('selectedAppText').textContent='Selected: '+id+' ✓';loadTypes();}
function loadTypes(){
let sel=document.getElementById('pType');if(!sel)return;sel.innerHTML='';
let opts=[];
if(selectedApp==='YouTube'){opts=["Like a post","Watch a video","Comment on a video","Custom comment","Share a post"];}
else if(selectedApp==='Facebook'){opts=["Like a video","View a video","Comment on a video","Custom comment","Share a post","Join a group"];}
else if(selectedApp==='Instagram'){opts=["Like a video","View a video","Comment on a video","Custom comment","Share a post"];}
else if(selectedApp==='TikTok' || selectedApp==='Twitter/X'){opts=["Like a video","View a video","Comment on a video","Custom comment","Share a post"];}
else if(selectedApp==='WhatsApp'){opts=["Join a group","Follow a channel"];}
else if(selectedApp==='Telegram'){opts=["Join a group","Follow a channel","Start a telegram bot"];}
else if(selectedApp==='Website'){opts=["Website Signup","Website Vote","Website Visit"];}
opts.forEach(o=>{
let e=document.createElement('option');e.value=o;
let p=PRICES[o]?PRICES[o].adv:30;
e.textContent=o+' - Price: ₦'+p;
sel.appendChild(e);
});
sel.onchange=updatePrice;document.getElementById('pQty').oninput=updatePrice;updatePrice();
}
function updatePrice(){
let t=document.getElementById('pType').value;let q=parseInt(document.getElementById('pQty').value)||0;if(!PRICES[t])return;
document.getElementById('priceInfo').innerHTML=`You will pay: <b>₦${PRICES[t].adv*q}</b> for ${q} units of ${t} on ${selectedApp}`;
  }
function checkLogin(){
let email=localStorage.getItem('mt_cur');if(!email){showAuth();return;}
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');curUser=users.find(u=>u.email===email);
if(!curUser){showAuth();return;}
if(curUser.status && curUser.status!=='active'){alert('Account suspended');localStorage.removeItem('mt_cur');showAuth();return;}
document.getElementById('auth').classList.add('hidden');document.getElementById('home').classList.remove('hidden');
if(curUser.av===undefined) curUser.av=0; if(curUser.pd===undefined) curUser.pd=0; if(curUser.dep===undefined) curUser.dep=0; if(!curUser.refCode) curUser.refCode=genRefCode(curUser.email); if(curUser.refEarn===undefined) curUser.refEarn=0;
document.getElementById('avBal').textContent='₦'+(curUser.av||0);document.getElementById('pdBal').textContent='₦'+(curUser.pd||0);document.getElementById('postDep').textContent='₦'+(curUser.dep||0);
let adminLink=document.getElementById('adminLink');
if(curUser.email===ADMIN){adminLink.classList.remove('hidden');adminLink.style.display='block';}else{adminLink.classList.add('hidden');adminLink.style.display='none';}
loadHomeTasks();loadAllTasks();loadMyDeposits();loadReferral();loadWithdrawPage();
}
function showAuth(){document.getElementById('auth').classList.remove('hidden');document.getElementById('home').classList.add('hidden');}
function toggleMenu(){document.getElementById('sideMenu').classList.toggle('active')}
function showPage(p){['home','tasks','post','deposit','admin','referral','withdraw'].forEach(id=>{let el=document.getElementById(id);if(el)el.classList.add('hidden')});let t=document.getElementById(p);if(t)t.classList.remove('hidden');if(p==='tasks')loadAllTasks();if(p==='deposit')loadMyDeposits();if(p==='post')document.getElementById('postDep').textContent='₦'+(curUser.dep||0);if(p==='referral')loadReferral();if(p==='withdraw')loadWithdrawPage();}
let codeSent='',tempData={};
async function handleAuth(){
let user=document.getElementById('aUser').value.trim();let email=document.getElementById('aEmail').value.trim();let pass=document.getElementById('aPass').value.trim();let codeInput=document.getElementById('aCode');let refCodeInput=document.getElementById('aRef').value.trim().toLowerCase();
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let exists=users.find(u=>u.email===email);
if(authMode==='signin'){
if(!email||!pass){alert('Fill email and password');return;}
if(!exists){alert('Account not found - Sign Up first');setAuthMode('signup');return;}
if(exists.password!==pass){alert('Wrong password');return;}
if(exists.status && exists.status!=='active'){alert('Account suspended');return;}
localStorage.setItem('mt_cur',email); location.reload(); return;
}
if(authMode==='signup'){
if(codeInput.classList.contains('hidden')){
if(!user||!email||!pass){alert('Fill username, email, password');return;}
if(exists){alert('Email exists - Sign In');setAuthMode('signin');return;}
let referredByUser=null;
if(refCodeInput){
referredByUser=users.find(u=>u.refCode.toLowerCase()===refCodeInput);
if(!referredByUser){alert('Invalid referral code');return;}
if(referredByUser.email===email){alert('Cannot refer yourself');return;}
}
tempData={user,email,pass,refCode:refCodeInput,referredBy:referredByUser?referredByUser.email:null,mode:'signup'};
codeSent=Math.floor(100000+Math.random()*900000).toString();
document.getElementById('emailStatus').textContent='Sending code to YOUR email: '+email+'...';
try{
await emailjs.send(SERVICE_ID,TEMPLATE_ID,{to_email:email,code:codeSent,username:user});
document.getElementById('emailStatus').textContent='Code sent to '+email;
codeInput.classList.remove('hidden');
document.getElementById('authBtn').textContent='Verify Code & Create Account';
}catch(e){
document.getElementById('emailStatus').textContent='Code: '+codeSent+' (Use this)';
codeInput.classList.remove('hidden');
document.getElementById('authBtn').textContent='Verify Code & Create Account';
}
}else{
if(document.getElementById('aCode').value.trim()!==codeSent){alert('Wrong code');return;}
let newRef=genRefCode(tempData.email);
users.push({email:tempData.email,username:tempData.user,password:tempData.pass,status:'active',av:0,pd:0,dep:0,refCode:newRef,referredBy:tempData.referredBy,refEarn:0,hasWithdrawn:false,firstWithdrawalDone:false});
localStorage.setItem('mt_users',JSON.stringify(users));
localStorage.setItem('mt_cur',tempData.email);
alert('Account created! You will earn 10% from first withdrawal ✅');
location.reload();
}
}
}
function logout(){localStorage.removeItem('mt_cur');location.reload();}
function taskHtml(t){let app=APPS.find(a=>a.id===t.app);let img=app?`<img src="${app.logo}">`:'';return `<div class="task"><div class="logo">${img}</div><div style="flex:1"><b>${t.name}</b><br><small>${t.app} • ${t.type}</small><br><span class="badge">${t.remaining} left</span></div><button class="btn" style="width:auto;padding:8px 16px" onclick="openTask('${t.id}')">Do Task</button></div>`;}
function getMyDoneIds(){let p=JSON.parse(localStorage.getItem('mt_proofs')||'[]');return p.filter(x=>x.user===curUser.email).map(x=>x.taskId);}
function loadHomeTasks(){let done=getMyDoneIds();let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]').filter(t=>t.remaining>0&&t.owner!==curUser.email&&!done.includes(t.id)).slice(0,6);document.getElementById('homeTasks').innerHTML=tasks.length?tasks.map(taskHtml).join(''):'There are no available tasks';}
function loadAllTasks(){let done=getMyDoneIds();let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]').filter(t=>t.remaining>0&&t.owner!==curUser.email&&!done.includes(t.id));let start=(currentPage-1)*perPage;let pag=tasks.slice(start,start+perPage);document.getElementById('allTasks').innerHTML=pag.length?pag.map(taskHtml).join(''):'There are no available tasks';document.getElementById('prevBtn').disabled=currentPage===1;document.getElementById('nextBtn').disabled=start+perPage>=tasks.length;}
function changePage(d){currentPage+=d;if(currentPage<1)currentPage=1;loadAllTasks();}
function createTask(){
let type=document.getElementById('pType').value;let link=document.getElementById('pLink').value.trim();let qty=parseInt(document.getElementById('pQty').value);
if(!link||!qty){alert('Fill all fields');return;}
let price=PRICES[type];let total=price.adv*qty;
let myBal=curUser.dep||0;
if(myBal<total){
document.getElementById('lowBalText').innerHTML=`Need ₦${total} for ${qty} x ${type}<br>Bal: ₦${myBal} - Short: ₦${total-myBal}`;
document.getElementById('lowBalPopup').style.display='flex';
return;
}
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');
let custom=[];if(type==='Custom comment'){let c=prompt('Enter custom comments separated by comma');if(c)custom=c.split(',').map(s=>s.trim()).filter(Boolean);}
let task={id:'t_'+Date.now(),name:type+' on '+selectedApp,app:selectedApp,type,link,qty,remaining:qty,priceAdv:price.adv,priceEarn:price.earn,owner:curUser.email,customComments:custom,created:Date.now()};
tasks.push(task);localStorage.setItem('mt_tasks',JSON.stringify(tasks));
curUser.dep-=total;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let idx=users.findIndex(u=>u.email===curUser.email);users[idx]=curUser;localStorage.setItem('mt_users',JSON.stringify(users));
alert('Task posted! ✅');document.getElementById('pLink').value='';showPage('tasks');
}
function goToDepositFromLowBal(){closePopup('lowBalPopup');showPage('deposit');}
function openTask(id){let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');curTask=tasks.find(t=>t.id===id);if(!curTask){alert('Not found');return;}document.getElementById('popTitle').textContent=curTask.name;document.getElementById('popLink').href=curTask.link;let info=document.getElementById('popInfo');info.classList.add('hidden');info.textContent='';if(curTask.app==='Website')info.textContent='Use same email as this app for signup';if(curTask.type==='Join a group')info.textContent='Join group and screenshot as proof';if(info.textContent)info.classList.remove('hidden');document.getElementById('popCustomList').innerHTML=curTask.customComments&&curTask.customComments.length?'<b>Use:</b><br>'+curTask.customComments.join('<br>'):'';
document.getElementById('taskPopup').style.display='flex';}
function closePopup(id){document.getElementById(id).style.display='none';}
function submitProof(){
let handle=document.getElementById('popHandle').value.trim();let file=document.getElementById('popFile').files[0];
if(!handle||!file){alert('Fill handle and proof');return;}
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
if(proofs.find(p=>p.taskId===curTask.id&&p.user===curUser.email)){alert('Already done');return;}
let reader=new FileReader();
reader.onload=function(e){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');
proofs.push({id:'p_'+Date.now(),taskId:curTask.id,taskName:curTask.name,owner:curTask.owner,user:curUser.email,handle,proof:e.target.result,status:'pending',type:curTask.type,app:curTask.app,created:Date.now()});
localStorage.setItem('mt_proofs',JSON.stringify(proofs));
closePopup('taskPopup');
document.getElementById('successPopup').style.display='flex';
loadHomeTasks();loadAllTasks();
};
reader.readAsDataURL(file);
}
function loadReferral(){
if(!curUser) return;
let baseUrl=window.location.origin+window.location.pathname;
let link=baseUrl+'?ref='+curUser.refCode;
document.getElementById('myRefCode').textContent=curUser.refCode;
document.getElementById('myRefLink').textContent=link;
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let myRefs=users.filter(u=>u.referredBy===curUser.email);
document.getElementById('refCount').textContent=myRefs.length;
document.getElementById('refEarn').textContent='₦'+(curUser.refEarn||0);
document.getElementById('myReferralsList').innerHTML=myRefs.length?myRefs.map(u=>`<div style="border:1px solid #eee;padding:8px;margin:5px 0;border-radius:8px"><b>${u.username}</b> - ${u.email}<br><small>${u.hasWithdrawn?'Has withdrawn - You earned 10%':'No withdrawal yet'}</small></div>`).join(''):'No referrals yet - You will earn 10% from first withdrawal';
}
function copyRef(){let link=document.getElementById('myRefLink').textContent; navigator.clipboard.writeText(link).then(()=>alert('Referral link copied!'));}

function loadWithdrawPage(){
if(!curUser) return;
document.getElementById('wAvBal').textContent='₦'+(curUser.av||0);
document.getElementById('wPdBal').textContent='₦'+(curUser.pd||0);
document.getElementById('wInfo').innerHTML=`Min: ₦300 | Charge: ₦20 ONLY for withdrawal | You get: Amount - ₦20`;
let withdrawals=JSON.parse(localStorage.getItem('mt_withdrawals')||'[]').filter(w=>w.user===curUser.email);
document.getElementById('myWithdrawals').innerHTML=withdrawals.length?withdrawals.map(w=>`<div style="border:1px solid #eee;padding:8px;margin:5px 0;border-radius:8px">₦${w.amount} (Charge ₦20 → Net ₦${w.net}) - ${w.bank}<br><b>${w.status}</b></div>`).join(''):'No withdrawals';
}
function requestWithdraw(){
let accName=document.getElementById('wAccName').value.trim();
let accNum=document.getElementById('wAccNum').value.trim();
let bank=document.getElementById('wBank').value.trim();
let amt=parseInt(document.getElementById('wAmt').value);
if(!accName||!accNum||!bank||!amt){alert('Fill all');return;}
if(amt<300){alert('Minimum withdrawal is ₦300');return;}
if((curUser.av||0)<amt){alert('Insufficient Available. Pending ₦'+(curUser.pd||0)+' needs admin approval');return;}
let withdrawals=JSON.parse(localStorage.getItem('mt_withdrawals')||'[]');
withdrawals.push({id:'w_'+Date.now(),user:curUser.email,accName,accNum,bank,amount:amt,charge:20,net:amt-20,status:'pending',created:Date.now(),firstOfUser:curUser.hasWithdrawn?false:true});
localStorage.setItem('mt_withdrawals',JSON.stringify(withdrawals));
curUser.av-=amt;
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let idx=users.findIndex(u=>u.email===curUser.email);users[idx]=curUser;localStorage.setItem('mt_users',JSON.stringify(users));
alert('Withdrawal requested! Charge ₦20 ONLY for withdrawal. Net ₦'+(amt-20));
loadWithdrawPage(); checkLogin();
}
function submitDeposit(){let name=document.getElementById('dName').value.trim();let amt=parseInt(document.getElementById('dAmt').value);if(!name||!amt){alert('Fill');return;}let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]');deps.push({id:'d_'+Date.now(),user:curUser.email,accountName:name,amount:amt,status:'pending',created:Date.now()});localStorage.setItem('mt_deposits',JSON.stringify(deps));alert('Sent to admin');loadMyDeposits();}
function loadMyDeposits(){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]').filter(d=>d.user===curUser.email);document.getElementById('myDeposits').innerHTML=deps.length?deps.map(d=>`<div style="border:1px solid #eee;padding:8px;margin:5px 0;border-radius:8px">${d.accountName} - ₦${d.amount} - <b>${d.status}</b></div>`).join(''):'No deposits'; if(document.getElementById('depBalText'))document.getElementById('depBalText').textContent='₦'+(curUser.dep||0);}
function showAdmin(tab){
if(curUser.email!==ADMIN){alert('Only admin');return;}
let c=document.getElementById('adminContent');
if(tab==='users'){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
c.innerHTML='<h4>Users</h4>'+users.map(u=>`<div style="padding:12px;border:1px solid #eee;margin:8px 0;border-radius:8px"><b>${u.username}</b> - ${u.email}<br><small>Av ₦${u.av||0} | Pd ₦${u.pd||0} | Dep ₦${u.dep||0} | Ref ${u.refCode} | Earn ₦${u.refEarn||0}</small><br>${u.email!==ADMIN? `<button class="btn-reject" onclick="tempDeleteUser('${u.email}')">Temp</button><button class="btn-reject" style="background:#000" onclick="permanentDeleteUser('${u.email}')">Perm</button>`:''}</div>`).join('');
}
if(tab==='pendingBal'){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]').filter(u=> (u.pd||0)>0 );
c.innerHTML='<h4>Pending → Available</h4>'+(users.length?users.map(u=>`<div style="border:1px solid #eee;padding:10px;margin:8px 0"><b>${u.username}</b><br>Pending: ₦${u.pd} | Av: ₦${u.av}<br><button class="btn-approve" onclick="approvePendingBal('${u.email}')">Approve All</button></div>`).join(''):'No pending');
}
if(tab==='allTasksAdmin'){let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');c.innerHTML='<h4>Tasks</h4>'+tasks.map(t=>`<div style="padding:8px;border-bottom:1px solid #eee">${t.name} - ${t.remaining}/${t.qty} <button onclick="deleteTask('${t.id}')">Delete</button></div>`).join('');}
if(tab==='proofs'){let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]').filter(p=>p.status==='pending');c.innerHTML='<h4>Pending Proofs</h4>'+(proofs.length?proofs.map(p=>`<div style="border:1px solid #eee;padding:10px;margin:8px 0"><b>${p.taskName}</b><br>${p.user}<br><img src="${p.proof}" style="width:100%;max-width:220px"><br><button class="btn-approve" onclick="approveProof('${p.id}')">Approve → Pending</button><button class="btn-reject" onclick="rejectProof('${p.id}')">Reject</button></div>`).join(''):'No pending');}
if(tab==='depositsAdmin'){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]').filter(d=>d.status==='pending');c.innerHTML='<h4>Deposits</h4>'+(deps.length?deps.map(d=>`<div style="border:1px solid #eee;padding:10px;margin:8px 0">${d.user} - ₦${d.amount}<br><button class="btn-approve" onclick="approveDeposit('${d.id}')">Approve</button><button class="btn-reject" onclick="rejectDeposit('${d.id}')">Reject</button></div>`).join(''):'No pending');}
if(tab==='withdrawalsAdmin'){
let wds=JSON.parse(localStorage.getItem('mt_withdrawals')||'[]').filter(w=>w.status==='pending');
c.innerHTML='<h4>Withdrawals - Charge ₦20 ONLY for withdrawal</h4>'+(wds.length?wds.map(w=>`<div style="border:1px solid #eee;padding:10px;margin:8px 0"><b>${w.user}</b><br>₦${w.amount} - Charge ₦20 - Net ₦${w.net}<br>${w.bank} - ${w.accNum}<br><button class="btn-approve" onclick="approveWithdrawal('${w.id}')">Pay Net ₦${w.net}</button><button class="btn-reject" onclick="rejectWithdrawal('${w.id}')">Refund</button></div>`).join(''):'No pending');
}
if(tab==='referralsAdmin'){
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');
let withRefs=users.filter(u=>u.referredBy);
c.innerHTML='<h4>Referrals 10%</h4>'+(withRefs.length?withRefs.map(u=>`<div style="border:1px solid #eee;padding:8px;margin:5px 0">${u.email} by ${u.referredBy}</div>`).join(''):'No referrals');
}
}
function approvePendingBal(email){let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===email);if(!u)return;u.av=(u.av||0)+u.pd;u.pd=0;localStorage.setItem('mt_users',JSON.stringify(users));alert('Approved');showAdmin('pendingBal');}
function tempDeleteUser(email){if(email===ADMIN)return;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===email);if(u){u.status='suspended';localStorage.setItem('mt_users',JSON.stringify(users));showAdmin('users');}}
function permanentDeleteUser(email){if(email===ADMIN)return;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');users=users.filter(x=>x.email!==email);localStorage.setItem('mt_users',JSON.stringify(users));showAdmin('users');}
function approveProof(id){
let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');let p=proofs.find(x=>x.id===id);if(!p)return;
let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');let t=tasks.find(x=>x.id===p.taskId);if(t){t.remaining--;localStorage.setItem('mt_tasks',JSON.stringify(tasks));}
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===p.user);
if(u){u.pd=(u.pd||0)+(t?t.priceEarn:20);localStorage.setItem('mt_users',JSON.stringify(users));}
p.status='approved';localStorage.setItem('mt_proofs',JSON.stringify(proofs));showAdmin('proofs');
}
function rejectProof(id){let proofs=JSON.parse(localStorage.getItem('mt_proofs')||'[]');let p=proofs.find(x=>x.id===id);if(!p)return;p.status='rejected';localStorage.setItem('mt_proofs',JSON.stringify(proofs));showAdmin('proofs');}
function approveDeposit(id){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]');let d=deps.find(x=>x.id===id);if(!d)return;let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===d.user);if(u){u.dep=(u.dep||0)+d.amount;localStorage.setItem('mt_users',JSON.stringify(users));}d.status='approved';localStorage.setItem('mt_deposits',JSON.stringify(deps));showAdmin('depositsAdmin');}
function rejectDeposit(id){let deps=JSON.parse(localStorage.getItem('mt_deposits')||'[]');let d=deps.find(x=>x.id===id);if(!d)return;d.status='rejected';localStorage.setItem('mt_deposits',JSON.stringify(deps));showAdmin('depositsAdmin');}
function approveWithdrawal(id){
let wds=JSON.parse(localStorage.getItem('mt_withdrawals')||'[]');let w=wds.find(x=>x.id===id);if(!w)return;
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===w.user);
if(u){
if(!u.hasWithdrawn && u.referredBy){
let ref=users.find(x=>x.email===u.referredBy);
if(ref){let bonus=Math.floor(w.amount*0.10);ref.av=(ref.av||0)+bonus;ref.refEarn=(ref.refEarn||0)+bonus;}
u.firstWithdrawalDone=true;
}
u.hasWithdrawn=true;
localStorage.setItem('mt_users',JSON.stringify(users));
}
w.status='approved';localStorage.setItem('mt_withdrawals',JSON.stringify(wds));
alert('Approved Net ₦'+w.net+' after ₦20 charge ONLY for withdrawal');
showAdmin('withdrawalsAdmin');
}
function rejectWithdrawal(id){
let wds=JSON.parse(localStorage.getItem('mt_withdrawals')||'[]');let w=wds.find(x=>x.id===id);if(!w)return;
let users=JSON.parse(localStorage.getItem('mt_users')||'[]');let u=users.find(x=>x.email===w.user);if(u){u.av=(u.av||0)+w.amount;localStorage.setItem('mt_users',JSON.stringify(users));}
w.status='rejected';localStorage.setItem('mt_withdrawals',JSON.stringify(wds));showAdmin('withdrawalsAdmin');
}
function deleteTask(id){let tasks=JSON.parse(localStorage.getItem('mt_tasks')||'[]');tasks=tasks.filter(t=>t.id!==id);localStorage.setItem('mt_tasks',JSON.stringify(tasks));showAdmin('allTasksAdmin');}
window.onload=init;
// ONLINE ONLY - DELETE OLD SW & CACHE
if('serviceWorker' in navigator){
navigator.serviceWorker.getRegistrations().then(function(regs){ for(let r of regs){ r.unregister(); } });
}
if(window.caches){ caches.keys().then(function(names){ for(let n of names){ caches.delete(n); } }); }
