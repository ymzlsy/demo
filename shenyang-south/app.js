/* ============ 沈阳南需求原型 Demo · 交互逻辑（细化版）============ */

/* ---------- 数据 ---------- */
// 场地树（依勾老师脑图 wb1 真实字典）
const PLACE_TREE={name:'沈阳动车段动车实训基地',level:'集团公司级',children:[
  {name:'实训场地（设备）',level:'实训',children:[
    {name:'CR400BF 综合实训室',level:'实训室',cnt:'4 台设备'},
    {name:'CRH5 综合实训室',level:'实训室',cnt:'4 台设备'},
    {name:'救援联挂实训室',level:'实训室',cnt:'3 台设备'},
    {name:'虚拟检修实训室(VR)',level:'实训室',cnt:'4 台设备'},
    {name:'电钳工实训室',level:'实训室',cnt:'3 台设备'},
  ]},
  {name:'段级培训场地',level:'段级·分母320分/天',children:[
    {name:'职培科教室',level:'职培科',children:[
      {name:'职培科教室1：学习室',level:'教室'},
      {name:'职培科教室2：微机教室',level:'教室'},
      {name:'职培科教室3：外网教室',level:'教室'},
    ]},
    {name:'实训基地教室',level:'基地',children:[
      {name:'沈南所多功能教室',level:'教室'},
      {name:'沈南所 MOOC 录制室',level:'教室'},
      {name:'沈北所实训理论教室',level:'教室'},
    ]},
  ]},
  {name:'车间级培训场地',level:'车间级·分母12分/天',children:[
    {name:'沈南所',level:'车间',children:[
      {name:'学习室',level:'室'},{name:'一级修-待检室',level:'室'},{name:'二级修-待检室',level:'室'},{name:'临修-待检室',level:'室'},{name:'值班室',level:'室'},
    ]},
    {name:'沈北所',level:'车间',children:[
      {name:'学习室',level:'室'},{name:'二级修-综合/车下/探伤 待检室',level:'室'},
      {name:'一级修-甲班 技检/维修/综合 待检室',level:'室'},{name:'一级修-乙班 技检/维修/综合 待检室',level:'室'},
      {name:'临修待检室 / 值班室',level:'室'},
    ]},
    {name:'长春所 / 大连所',level:'车间',cnt:'同构·待补'},
  ]},
]};

// 设备隶属树（课程→一套设备→二级→三级）
const DEV_TREE={
  '受电弓检修台':{course:'受电弓检查',l1:'CR400BF 综合实训装置',l2:'受电弓检修主机',l3:['碳滑板更换工装','弓网调整组件']},
  '图罩开关设备':{course:'图罩开关操作',l1:'CR400BF 综合实训装置',l2:'图罩开关控制台',l3:['开关执行机构']},
  'J5 救援联挂主机':{course:'救援连挂作业',l1:'救援联挂实训装置',l2:'J5 救援联挂主机',l3:['连挂操作终端','气路控制组件']},
  'VR 工位 #1':{course:'虚拟检修流程',l1:'VR 虚拟检修装置',l2:'VR 主机 #1',l3:['头显','手柄','换插板组件']},
};
const ROOMS={
  'CR400BF 综合实训室':[
    {nm:'受电弓检修台',st:'using',user:'张伟 · 第5期轮训班',course:'受电弓检查',time:'09:00-10:00',cap:'1/1',task:'受电弓检查'},
    {nm:'图罩开关设备',st:'reserved',user:'10:30 李强预约',course:'图罩开关操作',time:'10:30-11:30',cap:'0/1',task:'图罩开关操作'},
    {nm:'电环路系统台',st:'using',user:'王磊 · 个人练功',course:'HMI操作复位',time:'09:20-09:50',cap:'1/2',task:'HMI操作复位'},
    {nm:'HMI 操作台',st:'idle',user:'—',course:'—',time:'下一场 14:00',cap:'0/1',task:'HMI操作复位'},
  ],
  'CRH5 综合实训室':[
    {nm:'CRH5 主控台',st:'using',user:'赵敏 · 资格性培训',course:'小复位操作',time:'09:00-10:30',cap:'2/3',task:'小复位操作'},
    {nm:'空调照明台',st:'idle',user:'—',course:'—',time:'空闲',cap:'0/1',task:'空调照明操作'},
    {nm:'制动系统台',st:'fault',user:'—',course:'—',time:'报修中',cap:'0/1',task:'制动检查'},
    {nm:'TDTSL 操作台',st:'using',user:'刘洋 · 个人练功',course:'TBPS查看',time:'09:30-10:00',cap:'1/1',task:'TBPS查看操作'},
  ],
  '救援联挂实训室':[
    {nm:'J5 救援联挂主机',st:'using',user:'孙浩 · 第5期轮训班',course:'救援连挂作业',time:'08:30-10:00',cap:'3/4',task:'救援连挂作业'},
    {nm:'探伤检测台 #1',st:'reserved',user:'19:00 每月一练',course:'探伤板更换',time:'19:00-22:45',cap:'0/1',task:'探伤板更换'},
    {nm:'连挂操作终端',st:'idle',user:'—',course:'—',time:'空闲',cap:'0/2',task:'救援连挂作业'},
  ],
  '虚拟检修实训室(VR)':[
    {nm:'VR 工位 #1',st:'using',user:'周强',course:'人身安全体验',time:'09:00-09:40',cap:'1/1',task:'虚拟检修流程'},
    {nm:'VR 工位 #2',st:'using',user:'吴军',course:'虚拟检修流程',time:'09:10-09:50',cap:'1/1',task:'虚拟检修流程'},
    {nm:'VR 工位 #3',st:'idle',user:'—',course:'—',time:'空闲',cap:'0/1',task:'虚拟检修流程'},
    {nm:'VR 工位 #4',st:'idle',user:'—',course:'—',time:'空闲',cap:'0/1',task:'虚拟检修流程'},
  ],
  '电钳工实训室':[
    {nm:'万用表实操台',st:'using',user:'郑凯',course:'万用表使用',time:'09:00-09:45',cap:'1/2',task:'万用表使用'},
    {nm:'电环路接线台',st:'idle',user:'—',course:'—',time:'空闲',cap:'0/2',task:'接线作业'},
    {nm:'钳工实操台',st:'idle',user:'—',course:'—',time:'空闲',cap:'0/1',task:'钳工作业'},
  ],
};
const ST_LABEL={using:'使用中',idle:'空闲',fault:'故障',reserved:'已预约'};

// 教室
const CLASSROOMS=[
  {nm:'理论教室 1',active:true,teacher:'马建国',course:'动车组结构原理',cls:'第5期轮训班',time:'08:30-10:00'},
  {nm:'理论教室 2',active:true,teacher:'李红',course:'安全规章',cls:'地勤资格性班',time:'09:00-11:00'},
  {nm:'理论教室 3',active:false},
  {nm:'综合教室',active:true,teacher:'王志强',course:'应急处置案例',cls:'第5期轮训班',time:'09:30-11:30'},
  {nm:'段库 教室 A',active:true,teacher:'孙磊',course:'车型能力提升',cls:'车间长培训',time:'08:00-12:00'},
  {nm:'段库 教室 B',active:false},{nm:'段库 教室 C',active:false},
];

// 老师库（选老师用）：年度课时档位 12/16/20=合格/良好/优秀
const TEACHERS=[
  {nm:'马建国',dept:'沈南所 检修车间',phone:'138****2011',year:8,total:142},
  {nm:'李红',dept:'沈南所 乘务车间',phone:'139****3022',year:20,total:310},
  {nm:'王志强',dept:'段库 教研室',phone:'137****4033',year:16,total:256},
  {nm:'孙磊',dept:'沈北所 检修车间',phone:'135****5044',year:4,total:88},
  {nm:'赵敏',dept:'沈南所 转向架',phone:'136****6055',year:12,total:175},
  {nm:'刘洋',dept:'沈南所 电气',phone:'134****7066',year:6,total:120},
  {nm:'周建华',dept:'长春所 检修',phone:'130****8077',year:0,total:35},
];
function gradeOf(y){return y>=20?{g:3,t:'优秀'}:y>=16?{g:2,t:'良好'}:y>=12?{g:1,t:'合格'}:{g:0,t:'未达标'};}

// 每周一练（在线学习）
const WEEKLY=[
  {t:'动车组制动系统原理',p:'12题/已答8',min:18},
  {t:'应急故障处置闯关',p:'10题/已答10',min:12},
  {t:'安全规章日测',p:'5题/已答3',min:6},
];

const DEV_OPTS=['受电弓检修台','图罩开关设备','电环路系统台','HMI 操作台','VR 工位','J5 救援联挂主机','探伤检测台','万用表实操台','理论教室1','理论教室2','限车/限场（现场真车·离线）'];
const DAYS=['周一 11/10','周二 11/11','周三 11/12','周四 11/13','周五 11/14'];
const SLOTS=[{t:'第1-2节',h:'08:00-10:00'},{t:'第3-4节',h:'10:00-12:00'},{t:'第5-6节',h:'14:00-16:00'},{t:'第7-8节',h:'16:00-18:00'}];
const BOARD=[
  [[{nm:'受电弓检查',sub:'CR400BF·受电弓检修台',type:'dev',ban:'第5期轮训班',course:'受电弓检查',teacher:'张伟',place:'受电弓检修台'}],
   [{nm:'救援连挂作业',sub:'救援联挂室·J5主机',type:'dev',ban:'第5期轮训班',course:'救援连挂',teacher:'孙浩',place:'J5救援联挂主机'}],
   [{nm:'动车组结构原理',sub:'理论教室1',type:'room',ban:'第5期轮训班',course:'结构原理',teacher:'马建国',place:'理论教室1'}],
   [{nm:'小复位操作',sub:'CRH5·主控台',type:'dev',ban:'地勤资格性班',course:'小复位',teacher:'赵敏',place:'CRH5主控台'}],[]],
  [[{nm:'图罩开关操作',sub:'CR400BF·图罩开关',type:'dev',ban:'第5期轮训班',course:'图罩开关',teacher:'李强',place:'图罩开关设备'}],
   [{nm:'安全规章',sub:'理论教室2',type:'room',ban:'地勤资格性班',course:'安全规章',teacher:'李红',place:'理论教室2'}],
   [{nm:'⚠ 冲突：HMI操作',sub:'电环路台·与个人预约重叠',type:'conflict',ban:'第5期轮训班',course:'HMI操作',teacher:'待定',place:'电环路系统台'}],[],
   [{nm:'万用表使用',sub:'电钳工室',type:'dev',ban:'地勤资格性班',course:'万用表',teacher:'郑凯',place:'万用表实操台'}]],
  [[],[{nm:'应急处置案例',sub:'综合教室',type:'room',ban:'第5期轮训班',course:'应急处置',teacher:'王志强',place:'综合教室'}],
   [{nm:'TBPS查看操作',sub:'CRH5·TDTSL台',type:'dev',ban:'地勤资格性班',course:'TBPS查看',teacher:'刘洋',place:'TDTSL操作台'}],
   [{nm:'虚拟检修流程',sub:'VR室·工位1-2',type:'dev',ban:'第5期轮训班',course:'虚拟检修',teacher:'周强',place:'VR工位'}],[]],
  [[{nm:'探伤板更换',sub:'救援联挂室·探伤台',type:'dev',ban:'第5期轮训班',course:'探伤板更换',teacher:'每月一练',place:'探伤检测台'}],[],
   [{nm:'空调照明操作',sub:'CRH5·空调照明台',type:'dev',ban:'地勤资格性班',course:'空调照明',teacher:'待定',place:'空调照明台'}],
   [{nm:'车型能力提升',sub:'段库教室A',type:'room',ban:'车间长培训',course:'车型能力',teacher:'孙磊',place:'段库教室A'}],[]],
];

/* ---------- 导航 ---------- */
const NAV={
  twin:[{g:'数字孪生实训管控'},
    {v:'twin-home',ic:'🏠',t:'总览首页'},
    {v:'twin-dash',ic:'📊',t:'段·车间数据看板'},
    {v:'twin-train',ic:'⚙️',t:'实训场地（设备级）'},
    {v:'twin-class',ic:'🏫',t:'教室管控+点名'}],
  sched:[{g:'预约排课管理'},
    {v:'sched-smart',ic:'⚡',t:'智能排课（专项）'},
    {v:'sched-board',ic:'📅',t:'课表总览'},
    {v:'sched-manual',ic:'🧩',t:'手动排课（层级筛选）'},
    {v:'sched-flex',ic:'🙋',t:'弹性预约（月/周/个人）'},
    {v:'sched-grab',ic:'🙋‍♂️',t:'师资抢单'}]
};
// 师资抢单数据（脑图img2：预约排课管理→师资抢单）
const GRAB_ORDERS=[
  {course:'受电弓检查',place:'CR400BF·受电弓检修台',time:'11/12 周二 8-10节',ban:'第5期轮训班',need:'CR400BF 资质',status:'待接单'},
  {course:'救援连挂作业',place:'救援联挂室·J5主机',time:'11/13 周三 1-2节',ban:'地勤资格性班',status:'待接单'},
  {course:'安全规章',place:'理论教室2',time:'11/12 周二 3-4节',ban:'地勤资格性班',status:'已接单·李红'},
];
let curMod='twin',curView='twin-home';
function renderNav(){document.getElementById('sidenav').innerHTML=NAV[curMod].map(n=>n.g?`<div class="group">${n.g}</div>`:`<a data-v="${n.v}" class="${n.v===curView?'active':''}" onclick="go('${n.v}')"><span class="ic">${n.ic}</span>${n.t}</a>`).join('');}
function go(v){curView=v;document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.dataset.view===v));document.querySelectorAll('.sidenav a').forEach(a=>a.classList.toggle('active',a.dataset.v===v));document.getElementById('main').scrollTop=0;}
document.querySelectorAll('.modswitch button').forEach(b=>b.onclick=()=>{curMod=b.dataset.mod;document.querySelectorAll('.modswitch button').forEach(x=>x.classList.toggle('active',x===b));curView=NAV[curMod][1].v;renderNav();go(curView);});

/* ---------- 4.5 场地树 ---------- */
function renderTree(){
  function node(n){const has=n.children&&n.children.length;const badge=n.level&&n.level!=='—'?`<span class="lvl-badge">${n.level}</span>`:'';const cnt=n.cnt?`<span class="cnt">${n.cnt}</span>`:'';const click=ROOMS[n.name]?`onclick="openRoom('${n.name}')"`:'';
    return `<div class="node"><span class="label" ${click}>${has?'▸':'·'} ${n.name} ${badge} ${cnt}</span>`+(has?`<div class="children">${n.children.map(node).join('')}</div>`:'')+`</div>`;}
  document.getElementById('placeTree').innerHTML=node(PLACE_TREE);
}
function openRoom(name){go('twin-train');selectRoom(name);}

/* ---------- 4.5 数据看板 ---------- */
const DASH={年度:{kpi:[['年度参培','12,480','人次'],['考核完成','86%','up'],['考试合格率','92.4%','up'],['设备利用率','61%',''],['计划兑现率','78%','warn']],
  campus:[['沈南校区',7200],['沈北校区',3100],['长春所',1400],['大连所',780]],
  hot:[['受电弓检修台',420],['J5救援联挂',360],['VR 工位',310],['CRH5主控台',250],['万用表台',180]],
  prog:[['培训班计划','plan',82],['日常培训','daily',74],['考试人数完成','plan',91]],
  util:[['CR400BF实训设备',68,'实训分母480分/天'],['职培科微机教室',72,'段级分母320分/天'],['沈南所MOOC录制室',58,'段级分母320分/天'],['沈南所一级修待检室',83,'车间级分母12分/天'],['沈北所探伤待检室',76,'车间级分母12分/天']]},
  月度:{kpi:[['月度参培','1,180','人次'],['考核完成','73%','warn'],['考试合格率','90.1%','up'],['设备利用率','58%',''],['计划兑现率','69%','warn']],
  campus:[['沈南校区',640],['沈北校区',300],['长春所',150],['大连所',90]],
  hot:[['受电弓检修台',48],['VR 工位',41],['J5救援联挂',36],['CRH5主控台',28],['万用表台',19]],
  prog:[['培训班计划','plan',69],['日常培训','daily',61],['考试人数完成','plan',77]],
  util:[['CR400BF实训设备',63,'实训分母480分/天'],['职培科微机教室',67,'段级分母320分/天'],['沈南所MOOC录制室',52,'段级分母320分/天'],['沈南所一级修待检室',78,'车间级分母12分/天'],['沈北所探伤待检室',71,'车间级分母12分/天']]}};
// 座位级占用：教室 → 座位数组（0空 1有人 2电脑占用）
const SEATS={
  '理论教室 1':[2,2,1,2,0,1,2,2, 1,2,2,0,1,2,2,1, 0,1,2,2,1,0,2,1],
  '理论教室 2':[1,1,0,1,1,0,0,1, 0,1,1,0,0,1,1,0, 0,0,1,1,0,0,1,0],
  '综合教室':[2,1,2,1,2,0,1,2, 0,1,0,1,2,0,1,0, 0,0,1,0,1,0,0,1],
  '段库 教室 A':[2,2,2,2,1,1,2,2, 2,2,1,2,2,1,2,2, 1,2,2,1,2,2,1,2],
};
let dashCur='年度';
function dashScope(btn,s){document.querySelectorAll('[data-view="twin-dash"] .seg button').forEach(b=>b.classList.toggle('on',b===btn));dashCur=s;renderDash();}
function renderDash(){
  const d=DASH[dashCur];
  document.getElementById('kpiRow').innerHTML=d.kpi.map(k=>`<div class="kpi"><div class="v ${k[2]==='up'?'up':k[2]==='warn'?'warn':''}">${k[1]}</div><div class="l">${k[0]}${k[2]&&k[2]!=='up'&&k[2]!=='warn'?'（'+k[2]+'）':k[2]==='up'||k[2]==='warn'?'':''}</div></div>`).join('');
  const mx=Math.max(...d.campus.map(c=>c[1]));
  document.getElementById('barCampus').innerHTML=d.campus.map(c=>`<div class="bar"><span class="bn">${c[0]}</span><span class="bt"><span class="bf" style="width:${c[1]/mx*100}%"></span></span><span class="bv">${c[1]}</span></div>`).join('');
  const mh=Math.max(...d.hot.map(c=>c[1]));
  document.getElementById('barHot').innerHTML=d.hot.map(c=>`<div class="bar"><span class="bn">${c[0]}</span><span class="bt"><span class="bf hot" style="width:${c[1]/mh*100}%"></span></span><span class="bv">${c[1]}h</span></div>`).join('');
  // 进度（区分培训班计划/日常培训）
  document.getElementById('progRow').innerHTML=d.prog.map(p=>`<div class="prog"><div class="ph"><span class="pt">${p[0]}<span class="ty ${p[1]}">${p[1]==='plan'?'培训班计划':'日常培训'}</span></span><span class="muted">${p[2]}%</span></div><div class="pbar"><span class="pf ${p[1]}" style="width:${p[2]}%"></span></div></div>`).join('');
  // 利用率（分母480/分层）
  document.getElementById('barUtil').innerHTML=d.util.map(c=>`<div class="bar"><span class="bn">${c[0]}</span><span class="bt"><span class="bf" style="width:${c[1]}%"></span></span><span class="bv">${c[1]}%</span><span class="muted" style="width:140px;font-size:11px">${c[2]}</span></div>`).join('');
}
function renderSeats(){
  const rooms=Object.keys(SEATS);const sel=document.getElementById('seatRoom');
  if(!sel.options.length)sel.innerHTML=rooms.map(r=>`<option>${r}</option>`).join('');
  const room=sel.value||rooms[0];const seats=SEATS[room];
  document.getElementById('seatGrid').innerHTML=seats.map((s,i)=>{
    const cls=s===2?'pc':s===1?'occ':'';const pc=s===2?'<span class="pcdot">💻</span>':'';
    return `<div class="seat ${cls}">${pc}${i+1}</div>`;}).join('');
}

/* ---------- 4.5 实训场地 ---------- */
function renderRoomList(){document.getElementById('roomList').innerHTML=Object.keys(ROOMS).map(r=>{const u=ROOMS[r].filter(d=>d.st==='using').length;return `<div class="tree"><span class="label" onclick="selectRoom('${r}')">${r} <span class="cnt">${u}/${ROOMS[r].length} 用</span></span></div>`;}).join('');}
let curRoom='CR400BF 综合实训室';
function selectRoom(name){if(!ROOMS[name])name='CR400BF 综合实训室';curRoom=name;document.getElementById('roomTitle').textContent=name;document.getElementById('trainRoomName').textContent=name;
  // 任务下拉
  const tasks=[...new Set(ROOMS[name].map(d=>d.task))];
  document.getElementById('taskHL').innerHTML='<option value="">— 不筛选，显示全部 —</option>'+tasks.map(t=>`<option>${t}</option>`).join('');
  renderDevGrid();
}
function renderDevGrid(hlTask){
  document.getElementById('devGrid').innerHTML=ROOMS[curRoom].map(d=>{
    const hl=hlTask&&d.task===hlTask?'hl':(hlTask?'dim':'');
    return `<div class="dev ${d.st} ${hl}" onclick='openDev(${JSON.stringify(d).replace(/'/g,"&#39;")}, "${curRoom}")'>
      <span class="led"></span><div class="nm">${d.nm}</div><div class="meta">容量 ${d.cap}<br>${d.time}</div><span class="st">${ST_LABEL[d.st]}</span></div>`;}).join('');
}
function highlightByTask(){const t=document.getElementById('taskHL').value;renderDevGrid(t);if(t)toast(`已高亮「${t}」关联的设备（任务→硬设关系→设备亮起）`,'🔗');}
function remoteCtl(lvl){const map={'设备':'已下发：单台设备远程关机指令','实训室':'已下发：'+curRoom+' 统一关机','校区':'已下发：沈南校区总开关关机','上电':'已下发：远程上电'};toast(map[lvl]+'（车间级管理员权限·演示）','🔌');}
function applyRole(){const r=document.getElementById('roleSel').value;document.getElementById('ctlBtns').style.display=r==='admin'?'block':'none';document.getElementById('ctlHidden').style.display=r==='admin'?'none':'block';}
function dispatchHint(){const v=document.getElementById('smDispatch').value;const m={same:'同级=群发该层级下面所有直接下级单位；班组业务辅导员则指派到学员。',one:'指定下级=只发给选中的某一个下级单位。',peer:'平级科室=仅"段职培科专职"可向平级科室(如安全科/技术科)派发，再由平级科室向下转派，其上级可夺回。'};document.getElementById('dispHint').textContent=m[v];}

function openDev(d,room){
  const tree=DEV_TREE[d.nm];
  let treeHtml='';
  if(tree){treeHtml=`<h2 style="margin:18px 0 8px;font-size:14px">任务-设备隶属关系</h2>
    <div class="dev-tree">
      <div class="lv1">📋 课程/任务：<span class="hit">${tree.course}</span></div>
      <div class="lv1">⚙️ 一套设备：${tree.l1}</div>
      <div class="lv2">└ 二级：<span class="hit">${tree.l2}</span></div>
      ${tree.l3.map(x=>`<div class="lv3">└ 三级：${x}</div>`).join('')}
    </div>
    <p class="hint">★ 学员只认课程/任务名；选任务经"硬设关系"自动点亮到末端设备。</p>`;}
  document.getElementById('drawerTitle').textContent=d.nm;
  document.getElementById('drawerBody').innerHTML=`
    <div class="kv"><span>所属实训室</span><b>${room}</b></div>
    <div class="kv"><span>设备状态</span><b style="color:${d.st==='using'?'var(--success)':d.st==='fault'?'var(--error)':'var(--text)'}">${ST_LABEL[d.st]}</b></div>
    <div class="kv"><span>当前使用人</span><b>${d.user}</b></div>
    <div class="kv"><span>当前课程/任务</span><b>${d.course}</b></div>
    <div class="kv"><span>时间段</span><b>${d.time}</b></div>
    <div class="kv"><span>容量</span><b>${d.cap}</b></div>
    ${treeHtml}
    <h2 style="margin:18px 0 10px;font-size:14px">设备视频监控</h2>
    <div class="video-wrap" style="grid-template-columns:1fr"><div class="video-main"><span class="live">● LIVE</span><span class="cap">摄像头对准：${d.nm}</span>📹 实时画面</div></div>
    <div style="display:flex;gap:8px;margin-top:10px"><div class="cam on">机位 1（主）</div><div class="cam">机位 2</div></div>
    <h2 style="margin:18px 0 10px;font-size:14px">历史使用记录（数据孪生·点定位录像）</h2>
    <div class="kv"><span>11-09 14:00-15:00</span><b>李明 · 受电弓检查 · 合格 ▶</b></div>
    <div class="kv"><span>11-08 09:00-10:00</span><b>王芳 · 图罩开关 · 良好 ▶</b></div>
    <div style="margin-top:16px;display:flex;gap:8px"><button class="btn sm" onclick="remoteCtl('设备')">远程关机</button><button class="btn sm" onclick="remoteCtl('上电')">远程上电</button></div>`;
  document.getElementById('drawer').classList.add('open');document.getElementById('drawerMask').classList.add('open');
}
function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('drawerMask').classList.remove('open');}

/* ---------- 4.5 教室管控 + 点名流程 ---------- */
function renderClassrooms(){document.getElementById('clsGrid').innerHTML=CLASSROOMS.map((c,i)=>c.active?`
  <div class="cls active" onclick="checkinFlow(${i})"><span class="live-badge">● 上课中</span><div class="nm">${c.nm}</div><div class="who"><b>${c.teacher}</b> 老师<br>${c.course}<br><span class="muted">${c.cls} · ${c.time}</span></div></div>`:`
  <div class="cls empty" onclick="checkinFlow(${i})"><span class="live-badge">空闲</span><div class="nm">${c.nm}</div><div class="who muted">点击模拟教员开课</div></div>`).join('');}
const ROSTER=['张伟','李强','王磊','赵敏','刘洋','孙浩','周强','吴军','郑凯','马建','李红','王志'];
let checked=new Set();
function checkinFlow(i){
  const c=CLASSROOMS[i];checked=new Set(c.active?ROSTER.slice(0,8):[]);
  openModal(`教室点名 · ${c.nm}`,`
    <div class="note">流程：教员工卡登录 → 选课程任务 → <b>参陪人员点名</b> → 点「开始培训」→ 系统记录录像时间标签，回看可定位。</div>
    <div class="field"><label>教员（工卡登录）</label><input class="input" value="${c.active?c.teacher:'（刷工卡登录）'}" readonly></div>
    <div class="field"><label>课程/培训任务</label><select class="input"><option>${c.active?c.course:'动车组结构原理'}</option><option>应急处置案例</option></select></div>
    <div class="field"><label>参陪人员点名（点选到场人员，共 ${ROSTER.length} 人）</label>
      <div class="checkin-grid" id="ckGrid"></div>
      <div class="hint">已到 <b id="ckCount">0</b> / ${ROSTER.length} 人</div></div>
    <div style="display:flex;gap:10px;margin-top:8px">
      <button class="btn primary" onclick="startTrain()">▶ 开始培训（生成录像时间标签）</button>
      <button class="btn" onclick="closeModal()">取消</button></div>
    <div id="trainTag"></div>`);
  renderCk();
}
function renderCk(){document.getElementById('ckGrid').innerHTML=ROSTER.map(p=>`<div class="ck ${checked.has(p)?'on':''}" onclick="toggleCk('${p}')">${p}</div>`).join('');document.getElementById('ckCount').textContent=checked.size;}
function toggleCk(p){checked.has(p)?checked.delete(p):checked.add(p);renderCk();}
function startTrain(){const t=new Date();const ts=`REC-${String(t.getHours()).padStart(2,'0')}${String(t.getMinutes()).padStart(2,'0')}-CAM01`;
  document.getElementById('trainTag').innerHTML=`<div class="note" style="background:var(--success-bg);border-color:#b7eb8f;color:#389e0d;margin-top:12px">✅ 已开始培训。到场 <b>${checked.size}</b> 人已计入考勤；录像时间标签 <b>${ts}</b> 已打点，回看录像可直接定位此刻。</div>`;
  toast('培训已开始，录像时间标签已生成','▶');}

/* ---------- 4.8 智能排课 ---------- */
let courses=[],smStep=1;
function renderSteps(){const labels=['建计划','添加课程','一键排课','选老师'];document.getElementById('smSteps').innerHTML=labels.map((l,i)=>`<div class="stp ${smStep>i+1?'done':smStep===i+1?'cur':''}"><span class="n">${i+1}</span>${l}</div>`).join('');}
function fillDevOpts(){document.getElementById('smDev').innerHTML=DEV_OPTS.map(d=>`<option>${d}</option>`).join('');}
function addCourse(){const dev=document.getElementById('smDev').value;const nm=document.getElementById('smCourse').value.trim()||'(未命名)';const form=document.getElementById('smForm').value;const dur=+document.getElementById('smDur').value;const offline=dev.includes('限车');courses.push({dev,nm,form,dur,offline});document.getElementById('smCourse').value='';smStep=2;renderCourseList();renderSteps();if(offline)toast('限车/限场=离线设备：不占在线排课资源，靠平板下载任务→现场考核→事后同步','🚃');}
function renderCourseList(){document.getElementById('smCount').textContent=courses.length+' 门';const el=document.getElementById('smList');if(!courses.length){el.innerHTML='<div class="empty-state">尚未添加课程</div>';return;}
  // 标签：同一设备重复添加用 #1 #2
  const seen={};el.innerHTML=courses.map((c,i)=>{seen[c.dev]=(seen[c.dev]||0)+1;const tag=courses.filter(x=>x.dev===c.dev).length>1?` 标签#${seen[c.dev]}`:'';const off=c.offline?' <span class="off-tag">离线</span>':'';return `<div class="pk"><span class="tag">${c.dev}${tag}</span><span class="nm">${c.nm}${off}</span><span class="du">${c.form}·${c.dur}学时</span><span class="rm" style="cursor:pointer" onclick="rmCourse(${i})">✕</span></div>`;}).join('');}
function rmCourse(i){courses.splice(i,1);renderCourseList();}
// 按岗位自动算人数（脑图：计划培训人数按培训对象岗位自动算并回显）
const POST_HEAD={'轨道车司机':157,'地勤机械师':92,'随车机械师':128,'车辆钳工':64,'电力钳工':45};
function calcHeadcount(post){const k=Object.keys(POST_HEAD).find(p=>post&&post.includes(p.slice(0,3)));document.getElementById('smHead').value=k?POST_HEAD[k]+' 人（岗位库自动统计）':(post?'按岗位库匹配中…':'—');}
function oneClick(){if(!courses.length){toast('请先添加待排课程','⚠️');return;}
  const grid=Array.from({length:4},()=>Array.from({length:5},()=>null));
  grid[0][2]={nm:'已占用·他班',type:'conflict'};
  let di=0,si=0,placed=0;
  courses.forEach(c=>{let tries=0;while(tries<20){if(!grid[si][di]){grid[si][di]={nm:c.nm,sub:c.dev+' · '+c.dur+'学时',type:'dev',teacher:''};placed++;di++;if(di>=5){di=0;si=(si+1)%4;}break;}di++;if(di>=5){di=0;si=(si+1)%4;}tries++;}});
  window._smGrid=grid;renderTable('smTable',grid,true,true);smStep=3;renderSteps();toast(`已为 ${placed} 门课自动排课，避开 1 处占用冲突。点课程块选老师`,'⚡');}

/* 选老师 modal */
let tchSortKey='year',tchAsc=true,curSlotRef=null;
function pickTeacher(s,d){curSlotRef={s,d};const cell=window._smGrid[s][d];if(!cell||cell.type==='conflict')return;openTeacherModal(cell.nm);}
function openTeacherModal(courseName){
  openModal(`为「${courseName}」选/通知老师`,`
    <div class="note">选老师提示：部门/电话/年度课时/总课时；可按年度课时<b>正/倒排</b>，<b>优先推荐学时不足的老师</b>。学时档位 12/16/20 = 合格/良好/优秀。</div>
    <div style="margin-bottom:8px"><button class="btn sm" onclick="sortTch('year')">按年度课时排序（倒排优先少的）</button> <button class="btn sm" onclick="sortTch('total')">按总课时</button></div>
    <table class="tch-table" id="tchTable"></table>`);
  renderTchTable();
}
function sortTch(k){if(tchSortKey===k)tchAsc=!tchAsc;else{tchSortKey=k;tchAsc=true;}renderTchTable();}
function renderTchTable(){
  const arr=[...TEACHERS].sort((a,b)=>tchAsc?a[tchSortKey]-b[tchSortKey]:b[tchSortKey]-a[tchSortKey]);
  document.getElementById('tchTable').innerHTML=`<tr><th>姓名</th><th>部门</th><th>电话</th><th onclick="sortTch('year')">年度课时↕</th><th>档位</th><th>总课时</th><th></th></tr>`+
    arr.map(t=>{const g=gradeOf(t.year);return `<tr class="${t.year<12?'low':''}"><td><b>${t.nm}</b></td><td>${t.dept}</td><td>${t.phone}</td><td>${t.year}</td><td><span class="grade g${g.g}">${g.t}</span></td><td>${t.total}</td><td><span class="btn sm pick-t" onclick="assignTch('${t.nm}')">指派/通知</span></td></tr>`;}).join('');
}
function assignTch(nm){if(curSlotRef){const c=window._smGrid[curSlotRef.s][curSlotRef.d];c.teacher=nm;c.sub=(c.sub.split(' · 老师')[0])+' · 老师'+nm;renderTable('smTable',window._smGrid,true,true);}smStep=4;renderSteps();closeModal();toast(`已指派/通知老师：${nm}`,'📣');}

/* ---------- 课表渲染 ---------- */
function renderTable(id,grid,draggable,pickTch){const tb=document.getElementById(id);let html=`<tr><th class="time-col">时间</th>${DAYS.map(d=>`<th>${d}</th>`).join('')}</tr>`;
  for(let s=0;s<4;s++){html+=`<tr><td class="time-col"><b>${SLOTS[s].t}</b><br>${SLOTS[s].h}</td>`;
    for(let d=0;d<5;d++){const cell=grid[s][d];const arr=Array.isArray(cell)?cell:(cell?[cell]:[]);let inner='';
      arr.forEach(c=>{const click=pickTch&&c.type!=='conflict'?`onclick="pickTeacher(${s},${d})"`:'';inner+=`<div class="slot ${c.type}" ${draggable&&c.type!=='conflict'?'draggable="true"':''} ${click} data-s="${s}" data-d="${d}"><div class="nm">${c.nm}</div><div class="sub">${c.sub||''}</div></div>`;});
      html+=`<td class="cell" data-s="${s}" data-d="${d}">${inner}</td>`;}
    html+=`</tr>`;}
  tb.innerHTML=html;if(draggable)bindDrag(tb);}
function bindDrag(tb){let dragEl=null;tb.querySelectorAll('.slot[draggable]').forEach(el=>{el.addEventListener('dragstart',()=>{dragEl=el;el.classList.add('dragging');});el.addEventListener('dragend',()=>{el.classList.remove('dragging');tb.querySelectorAll('td').forEach(t=>t.classList.remove('drop-ok'));});});
  tb.querySelectorAll('td.cell').forEach(td=>{td.addEventListener('dragover',e=>{e.preventDefault();td.classList.add('drop-ok');});td.addEventListener('dragleave',()=>td.classList.remove('drop-ok'));td.addEventListener('drop',e=>{e.preventDefault();td.classList.remove('drop-ok');if(dragEl){td.appendChild(dragEl);toast('已调整该课程时间','✏️');}});});}

/* ---------- 课表总览筛选 ---------- */
function flatBoard(){const a=[];BOARD.forEach((row,s)=>row.forEach((cell,d)=>cell.forEach(c=>a.push({...c,s,d}))));return a;}
function initFilters(){const all=flatBoard();const u=k=>[...new Set(all.map(x=>x[k]))];fillSel('fBan',u('ban'),'全部班级');fillSel('fCourse',u('course'),'全部课程');fillSel('fTeacher',u('teacher'),'全部老师');fillSel('fPlace',u('place'),'全部教室/设备');['fBan','fCourse','fTeacher','fPlace'].forEach(id=>document.getElementById(id).onchange=renderBoard);}
function fillSel(id,arr,all){document.getElementById(id).innerHTML=`<option value="">${all}</option>`+arr.map(x=>`<option>${x}</option>`).join('');}
function resetFilter(){['fBan','fCourse','fTeacher','fPlace'].forEach(id=>document.getElementById(id).value='');renderBoard();}
function renderBoard(){const fb=v('fBan'),fc=v('fCourse'),ft=v('fTeacher'),fp=v('fPlace');const grid=Array.from({length:4},()=>Array.from({length:5},()=>[]));
  BOARD.forEach((row,s)=>row.forEach((cell,d)=>cell.forEach(c=>{if(fb&&c.ban!==fb)return;if(fc&&c.course!==fc)return;if(ft&&c.teacher!==ft)return;if(fp&&c.place!==fp)return;grid[s][d].push(c);})));
  renderTable('boardTable',grid,false,false);}
function v(id){return document.getElementById(id).value;}

/* ---------- 手动排课：层级筛选式 ---------- */
const MANUAL_BUSY={ // 占用：date|slot -> 已占用地点
  '0|0':['受电弓检修台','理论教室1'],'1|0':['图罩开关设备'],'0|2':['J5救援联挂主机']
};
const PLACES_DEV=['受电弓检修台','图罩开关设备','电环路系统台','HMI操作台','J5救援联挂主机','VR工位'];
const PLACES_ROOM=['理论教室1','理论教室2','综合教室','段库教室A'];
let mp={date:null,slot:null,form:null,place:null};
function renderManual(){
  setOpts('stepDate',DAYS.map((d,i)=>({v:i,t:d})),'date',null);
  setOpts('stepSlot',SLOTS.map((s,i)=>({v:i,t:s.t+' '+s.h})),'slot',mp.date===null);
  setOpts('stepForm',[{v:'实作',t:'实作（选设备）'},{v:'理论',t:'理论（选教室）'}],'form',mp.slot===null);
  let places=[];if(mp.form==='实作')places=PLACES_DEV;else if(mp.form==='理论')places=PLACES_ROOM;
  const busy=(mp.date!==null&&mp.slot!==null)?(MANUAL_BUSY[mp.date+'|'+mp.slot]||[]):[];
  setOpts('stepPlace',places.map(p=>({v:p,t:p,busy:busy.includes(p)})),'place',mp.form===null);
  const r=document.getElementById('pickResult');
  if(mp.place)r.innerHTML=`✅ 可排：<b>${DAYS[mp.date]} · ${SLOTS[mp.slot].t} · ${mp.form} · ${mp.place}</b>　<span class="btn sm" onclick="manualSave()">保存（落库加锁）</span>`;
  else r.innerHTML='按 ①→②→③→④ 逐层选择；选到地点时已占用项立即标红禁选。';
}
function setOpts(id,opts,key,disabled){
  const box=document.querySelector('#'+id+' .sp-opts');
  box.innerHTML=opts.map(o=>{const on=mp[key]===o.v?'on':'';const b=o.busy?'busy':'';const cls=disabled?'disabled':'';return `<span class="sp-opt ${on} ${b} ${cls}" ${(!disabled&&!o.busy)?`onclick="pickStep('${key}','${o.v}')"`:''}>${o.t}${o.busy?'（占用）':''}</span>`;}).join('');
}
function pickStep(key,val){if(key==='date')val=+val;if(key==='slot')val=+val;mp[key]=val;
  // 选上层后重置下层
  if(key==='date'){mp.slot=null;mp.form=null;mp.place=null;}
  if(key==='slot'){mp.form=null;mp.place=null;}
  if(key==='form'){mp.place=null;}
  renderManual();
  if(key==='place'){const busy=(MANUAL_BUSY[mp.date+'|'+mp.slot]||[]);if(busy.includes(val)){toast('该地点此时段已占用','⛔');}}
}
function manualSave(){toast('已落库（演示）。并发场景下按(地点,日期,节次)加锁，后到者会被拦','🔒');mp={date:null,slot:null,form:null,place:null};renderManual();}

/* ---------- 弹性预约 ---------- */
function flexTab(btn,pane){document.querySelectorAll('#flexTabs .mode-tab').forEach(t=>t.classList.toggle('active',t===btn));document.querySelectorAll('.flex-pane').forEach(p=>p.style.display=p.dataset.pane===pane?'block':'none');}
const PEOPLE=['张伟','李强','王磊','赵敏','刘洋','孙浩','周强','吴军','郑凯','马建','李红','王志','陈成','杨光','黄海'];
let picked=new Set();
function renderPeople(){document.getElementById('peoplePick').innerHTML=PEOPLE.map(p=>`<span class="pp ${picked.has(p)?'on':''}" onclick="togglePerson('${p}')">${p}</span>`).join('');document.getElementById('pcount').textContent=picked.size;document.getElementById('ptime').textContent=picked.size*15;}
function togglePerson(p){picked.has(p)?picked.delete(p):picked.add(p);renderPeople();}
function renderBook(id,axisId,busy){document.getElementById(id).innerHTML=Array.from({length:16},(_,i)=>`<div class="book-cell ${busy.includes(i)?'busy':''}" data-i="${i}" onclick="toggleCell(this)"></div>`).join('');document.getElementById(axisId).innerHTML=Array.from({length:16},(_,i)=>i%2===0?`<span>${i}</span>`:'<span></span>').join('');}
function toggleCell(c){if(c.classList.contains('busy'))return;c.classList.toggle('sel');}
function bookToast(){toast('预约已提交，待审批/确认','✅');}
// 每周一练
function renderWeek(){document.getElementById('weekList').innerHTML=WEEKLY.map(w=>`<div class="week-item"><div class="wt">${w.t}<div class="wp">${w.p}</div></div><div class="wp">${w.min} 分钟</div></div>`).join('');
  const min=36;document.getElementById('weekRing').style.background=`conic-gradient(var(--primary) ${min/60*360}deg,#f0f2f5 0)`;document.getElementById('weekRing').innerHTML=`<div style="background:#fff;width:92px;height:92px;border-radius:50%;display:flex;align-items:center;justify-content:center">${Math.round(min/60*100)}%</div>`;}
let wkMin=36;
function weekLearn(){wkMin=Math.min(60,wkMin+12);document.getElementById('weekMin').textContent=wkMin;document.getElementById('weekRing').style.background=`conic-gradient(var(--primary) ${wkMin/60*360}deg,#f0f2f5 0)`;document.getElementById('weekRing').firstElementChild.textContent=Math.round(wkMin/60*100)+'%';if(wkMin>=60)toast('本周一学已达 1 学时，任务完成','🎉');else toast('+12 分钟','📖');}

/* ---------- 师资抢单 ---------- */
function renderGrab(){
  const el=document.getElementById('grabList');if(!el)return;
  el.innerHTML=GRAB_ORDERS.map((o,i)=>`<div class="grab-card ${o.status.startsWith('已')?'taken':''}">
    <div class="gc-main"><div class="gc-course">${o.course}</div><div class="gc-meta">${o.place} · ${o.time} · ${o.ban}${o.need?' · 需'+o.need:''}</div></div>
    <div class="gc-act">${o.status.startsWith('已')?`<span class="gc-done">${o.status}</span>`:`<button class="btn sm primary" onclick="grabOrder(${i})">抢单接单</button>`}</div></div>`).join('');
}
function grabOrder(i){GRAB_ORDERS[i].status='已接单·我（当前教员）';renderGrab();toast('已接单——进入我的课表，等管理人员确认','🙋‍♂️');}

/* ---------- 整天汇总（4.5）---------- */
const TODAY_SUMMARY={
  classes:[
    {ban:'第5期轨道车司机轮训班',type:'plan',xz:'适应性',report:'45/45',plan:100,jie:'8/12节',exam:'—'},
    {ban:'地勤机械师资格性培训班',type:'plan',xz:'资格性',report:'30/30',plan:100,jie:'6/8节',exam:'90%'},
    {ban:'检修车间·每月一练(探伤板更换)',type:'daily',xz:'日常',report:'12/15人',plan:80,jie:'实时',exam:'8/15'},
  ]
};
function renderTodaySummary(){
  const el=document.getElementById('todaySummary');if(!el)return;
  el.innerHTML=TODAY_SUMMARY.classes.map(c=>`
    <div class="sum-card">
      <div class="sum-h"><span class="ty ${c.type}">${c.type==='plan'?'培训班计划':'日常培训'}</span><span class="xz">${c.xz}</span></div>
      <div class="sum-ban">${c.ban}</div>
      <div class="sum-row"><span>报到</span><b>${c.report}</b></div>
      <div class="sum-prog"><span>计划 ${c.plan}%</span><div class="pbar"><span class="pf plan" style="width:${c.plan}%"></span></div></div>
      <div class="sum-row"><span>课节进度</span><b>${c.jie}</b><span style="margin-left:auto">考试 ${c.exam}</span></div>
    </div>`).join('');
}

/* ---------- 通用 ---------- */
function openModal(title,html){document.getElementById('modalTitle').textContent=title;document.getElementById('modalBody').innerHTML=html;document.getElementById('modalMask').classList.add('open');}
function closeModal(){document.getElementById('modalMask').classList.remove('open');}
function toast(msg,ic='✅'){const t=document.getElementById('toast');document.getElementById('toastMsg').textContent=msg;t.querySelector('span').textContent=ic;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400);}
function tickClock(){const d=new Date();document.getElementById('clock').textContent=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}

/* ---------- init ---------- */
renderNav();go('twin-home');
renderTree();renderDash();renderRoomList();selectRoom('CR400BF 综合实训室');renderClassrooms();renderSeats();
fillDevOpts();renderCourseList();renderSteps();renderTable('smTable',Array.from({length:4},()=>Array.from({length:5},()=>null)),true,true);
initFilters();renderBoard();renderManual();
renderPeople();renderBook('monthBook','monthAxis',[3,4,9]);renderBook('personBook','personAxis',[5,6,7,12,13]);renderWeek();
renderGrab();renderTodaySummary();
tickClock();setInterval(tickClock,30000);
