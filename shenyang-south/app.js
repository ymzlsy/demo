/* ============ 沈阳南需求原型 Demo · 交互逻辑 ============ */

/* ---------- 数据 ---------- */
// 场地树（对齐勾老师：集团→校区→车间→实训室/教室；只示意，待共建字典）
const PLACE_TREE = {
  name:'沈阳动车段动车实训基地', level:'集团公司级',
  children:[
    {name:'沈南校区', level:'校区', children:[
      {name:'沈南动车所', level:'车间', children:[
        {name:'CR400BF 综合实训室', level:'实训室', cnt:'4 台设备'},
        {name:'CRH5 综合实训室', level:'实训室', cnt:'4 台设备'},
        {name:'救援联挂实训室', level:'实训室', cnt:'3 台设备'},
        {name:'虚拟检修实训室(VR)', level:'实训室', cnt:'4 台设备'},
        {name:'电钳工实训室', level:'实训室', cnt:'3 台设备'},
        {name:'理论教室 1 / 2 / 3', level:'教室', cnt:'3 间'},
      ]},
      {name:'段库（总部）', level:'车间', children:[
        {name:'教室 A / B / C', level:'教室', cnt:'3 间·待列名'},
      ]},
    ]},
    {name:'沈北校区', level:'校区', children:[
      {name:'沈北动车所', level:'车间', children:[
        {name:'综合实训室', level:'实训室', cnt:'多台·平面图待标注'},
        {name:'理论教室群', level:'教室', cnt:'若干'},
      ]},
    ]},
    {name:'异地车间（接入）', level:'—', children:[
      {name:'长春动车所', level:'车间', cnt:'接入'},
      {name:'大连动车所', level:'车间', cnt:'接入'},
    ]},
  ]
};

// 实训室 → 设备（设备级占用，对齐勾老师）
const ROOMS = {
  'CR400BF 综合实训室':[
    {nm:'受电弓检修台', st:'using', user:'张伟 · 第5期轮训班', course:'受电弓检查', time:'09:00-10:00', cap:'1/1'},
    {nm:'图罩开关设备', st:'reserved', user:'10:30 李强预约', course:'图罩开关操作', time:'10:30-11:30', cap:'0/1'},
    {nm:'电环路系统台', st:'using', user:'王磊 · 个人练功', course:'HMI操作复位', time:'09:20-09:50', cap:'1/2'},
    {nm:'HMI 操作台', st:'idle', user:'—', course:'—', time:'下一场 14:00', cap:'0/1'},
  ],
  'CRH5 综合实训室':[
    {nm:'CRH5 主控台', st:'using', user:'赵敏 · 资格性培训', course:'小复位操作', time:'09:00-10:30', cap:'2/3'},
    {nm:'空调照明台', st:'idle', user:'—', course:'—', time:'空闲', cap:'0/1'},
    {nm:'制动系统台', st:'fault', user:'—', course:'—', time:'报修中', cap:'0/1'},
    {nm:'TDTSL 操作台', st:'using', user:'刘洋 · 个人练功', course:'TBPS查看', time:'09:30-10:00', cap:'1/1'},
  ],
  '救援联挂实训室':[
    {nm:'J5 救援联挂主机', st:'using', user:'孙浩 · 第5期轮训班', course:'救援连挂作业', time:'08:30-10:00', cap:'3/4'},
    {nm:'探伤检测台 #1', st:'reserved', user:'19:00 每月一练', course:'探伤板更换', time:'19:00-22:45', cap:'0/1'},
    {nm:'连挂操作终端', st:'idle', user:'—', course:'—', time:'空闲', cap:'0/2'},
  ],
  '虚拟检修实训室(VR)':[
    {nm:'VR 工位 #1', st:'using', user:'周强', course:'人身安全体验', time:'09:00-09:40', cap:'1/1'},
    {nm:'VR 工位 #2', st:'using', user:'吴军', course:'虚拟检修流程', time:'09:10-09:50', cap:'1/1'},
    {nm:'VR 工位 #3', st:'idle', user:'—', course:'—', time:'空闲', cap:'0/1'},
    {nm:'VR 工位 #4', st:'idle', user:'—', course:'—', time:'空闲', cap:'0/1'},
  ],
  '电钳工实训室':[
    {nm:'万用表实操台', st:'using', user:'郑凯', course:'万用表使用', time:'09:00-09:45', cap:'1/2'},
    {nm:'电环路接线台', st:'idle', user:'—', course:'—', time:'空闲', cap:'0/2'},
    {nm:'钳工实操台', st:'idle', user:'—', course:'—', time:'空闲', cap:'0/1'},
  ],
};
const ST_LABEL={using:'使用中',idle:'空闲',fault:'故障',reserved:'已预约'};

// 教室管控
const CLASSROOMS=[
  {nm:'理论教室 1', active:true, teacher:'马建国', course:'动车组结构原理', cls:'第5期轮训班', time:'08:30-10:00'},
  {nm:'理论教室 2', active:true, teacher:'李红', course:'安全规章', cls:'地勤资格性班', time:'09:00-11:00'},
  {nm:'理论教室 3', active:false},
  {nm:'综合教室', active:true, teacher:'王志强', course:'应急处置案例', cls:'第5期轮训班', time:'09:30-11:30'},
  {nm:'段库 教室 A', active:true, teacher:'孙磊', course:'车型能力提升', cls:'车间长培训', time:'08:00-12:00'},
  {nm:'段库 教室 B', active:false},
  {nm:'段库 教室 C', active:false},
];

// 设备选项（智能排课）
const DEV_OPTS=['受电弓检修台','图罩开关设备','电环路系统台','HMI 操作台','VR 工位','J5 救援联挂主机','探伤检测台','万用表实操台','理论教室1','理论教室2'];

// 课表示例数据（日期×节次）
const DAYS=['周一 11/10','周二 11/11','周三 11/12','周四 11/13','周五 11/14'];
const SLOTS=[{t:'第1-2节',h:'08:00-10:00'},{t:'第3-4节',h:'10:00-12:00'},{t:'第5-6节',h:'14:00-16:00'},{t:'第7-8节',h:'16:00-18:00'}];
// board[slotIdx][dayIdx] = [ {nm,sub,type,ban,course,teacher,place} ]
const BOARD=[
  [ [{nm:'受电弓检查',sub:'CR400BF·受电弓检修台',type:'dev',ban:'第5期轮训班',course:'受电弓检查',teacher:'张伟',place:'受电弓检修台'}],
    [{nm:'救援连挂作业',sub:'救援联挂室·J5主机',type:'dev',ban:'第5期轮训班',course:'救援连挂',teacher:'孙浩',place:'J5救援联挂主机'}],
    [{nm:'动车组结构原理',sub:'理论教室1',type:'room',ban:'第5期轮训班',course:'结构原理',teacher:'马建国',place:'理论教室1'}],
    [{nm:'小复位操作',sub:'CRH5·主控台',type:'dev',ban:'地勤资格性班',course:'小复位',teacher:'赵敏',place:'CRH5主控台'}],
    [] ],
  [ [{nm:'图罩开关操作',sub:'CR400BF·图罩开关',type:'dev',ban:'第5期轮训班',course:'图罩开关',teacher:'李强',place:'图罩开关设备'}],
    [{nm:'安全规章',sub:'理论教室2',type:'room',ban:'地勤资格性班',course:'安全规章',teacher:'李红',place:'理论教室2'}],
    [{nm:'⚠ 冲突：HMI操作',sub:'电环路台·与个人预约重叠',type:'conflict',ban:'第5期轮训班',course:'HMI操作',teacher:'待定',place:'电环路系统台'}],
    [],
    [{nm:'万用表使用',sub:'电钳工室',type:'dev',ban:'地勤资格性班',course:'万用表',teacher:'郑凯',place:'万用表实操台'}] ],
  [ [],
    [{nm:'应急处置案例',sub:'综合教室',type:'room',ban:'第5期轮训班',course:'应急处置',teacher:'王志强',place:'综合教室'}],
    [{nm:'TBPS查看操作',sub:'CRH5·TDTSL台',type:'dev',ban:'地勤资格性班',course:'TBPS查看',teacher:'刘洋',place:'TDTSL操作台'}],
    [{nm:'虚拟检修流程',sub:'VR室·工位1-2',type:'dev',ban:'第5期轮训班',course:'虚拟检修',teacher:'周强',place:'VR工位'}],
    [] ],
  [ [{nm:'探伤板更换',sub:'救援联挂室·探伤台',type:'dev',ban:'第5期轮训班',course:'探伤板更换',teacher:'每月一练',place:'探伤检测台'}],
    [],
    [{nm:'空调照明操作',sub:'CRH5·空调照明台',type:'dev',ban:'地勤资格性班',course:'空调照明',teacher:'待定',place:'空调照明台'}],
    [{nm:'车型能力提升',sub:'段库教室A',type:'room',ban:'车间长培训',course:'车型能力',teacher:'孙磊',place:'段库教室A'}],
    [] ],
];

/* ---------- 导航 ---------- */
const NAV={
  twin:[
    {g:'数字孪生实训管控'},
    {v:'twin-home',ic:'🏠',t:'总览首页'},
    {v:'twin-train',ic:'⚙️',t:'实训场地（设备级）'},
    {v:'twin-class',ic:'🏫',t:'教室管控'},
  ],
  sched:[
    {g:'预约排课管理'},
    {v:'sched-smart',ic:'⚡',t:'智能排课（专项培训）'},
    {v:'sched-board',ic:'📅',t:'课表总览'},
    {v:'sched-month',ic:'👥',t:'每月一练（组队）'},
    {v:'sched-person',ic:'🙋',t:'个人练功预约'},
  ]
};
let curMod='twin', curView='twin-home';

function renderNav(){
  const el=document.getElementById('sidenav');
  el.innerHTML=NAV[curMod].map(n=>n.g?`<div class="group">${n.g}</div>`
    :`<a data-v="${n.v}" class="${n.v===curView?'active':''}" onclick="go('${n.v}')"><span class="ic">${n.ic}</span>${n.t}</a>`).join('');
}
function go(v){
  curView=v;
  document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.dataset.view===v));
  document.querySelectorAll('.sidenav a').forEach(a=>a.classList.toggle('active',a.dataset.v===v));
  document.getElementById('main').scrollTop=0;
}
document.querySelectorAll('.modswitch button').forEach(b=>b.onclick=()=>{
  curMod=b.dataset.mod;
  document.querySelectorAll('.modswitch button').forEach(x=>x.classList.toggle('active',x===b));
  curView=NAV[curMod][1].v;
  renderNav(); go(curView);
});

/* ---------- 4.5 渲染 ---------- */
function renderTree(){
  function node(n){
    const has=n.children&&n.children.length;
    const badge=n.level&&n.level!=='—'?`<span class="lvl-badge">${n.level}</span>`:'';
    const cnt=n.cnt?`<span class="cnt">${n.cnt}</span>`:'';
    const click=ROOMS[n.name]?`onclick="openRoom('${n.name}')"`:'';
    return `<div class="node"><span class="label" ${click}>${has?'▸':'·'} ${n.name} ${badge} ${cnt}</span>`
      +(has?`<div class="children">${n.children.map(node).join('')}</div>`:'')+`</div>`;
  }
  document.getElementById('placeTree').innerHTML=node(PLACE_TREE);
}
function openRoom(name){
  if(ROOMS[name]){curMod='sched';/*noop*/}
  go('twin-train'); selectRoom(name);
}
function renderRoomList(){
  document.getElementById('roomList').innerHTML=Object.keys(ROOMS).map(r=>{
    const using=ROOMS[r].filter(d=>d.st==='using').length;
    return `<div class="tree"><span class="label" onclick="selectRoom('${r}')">${r} <span class="cnt">${using}/${ROOMS[r].length} 用</span></span></div>`;
  }).join('');
}
function selectRoom(name){
  if(!ROOMS[name])name='CR400BF 综合实训室';
  document.getElementById('roomTitle').textContent=name;
  document.getElementById('trainRoomName').textContent=name;
  document.getElementById('devGrid').innerHTML=ROOMS[name].map((d,i)=>`
    <div class="dev ${d.st}" onclick='openDev(${JSON.stringify(d).replace(/'/g,"&#39;")}, "${name}")'>
      <span class="led"></span>
      <div class="nm">${d.nm}</div>
      <div class="meta">容量 ${d.cap}<br>${d.time}</div>
      <span class="st">${ST_LABEL[d.st]}</span>
    </div>`).join('');
}
function openDev(d,room){
  document.getElementById('drawerTitle').textContent=d.nm;
  document.getElementById('drawerBody').innerHTML=`
    <div class="kv"><span>所属实训室</span><b>${room}</b></div>
    <div class="kv"><span>设备状态</span><b style="color:${d.st==='using'?'var(--success)':d.st==='fault'?'var(--error)':'var(--text)'}">${ST_LABEL[d.st]}</b></div>
    <div class="kv"><span>当前使用人</span><b>${d.user}</b></div>
    <div class="kv"><span>当前课程/任务</span><b>${d.course}</b></div>
    <div class="kv"><span>时间段</span><b>${d.time}</b></div>
    <div class="kv"><span>容量</span><b>${d.cap}</b></div>
    <h2 style="margin:18px 0 10px;font-size:14px">设备视频监控</h2>
    <div class="video-wrap" style="grid-template-columns:1fr">
      <div class="video-main"><span class="live">● LIVE</span><span class="cap">摄像头对准：${d.nm}</span>📹 实时画面</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <div class="cam on">机位 1（主）</div><div class="cam">机位 2</div>
    </div>
    <h2 style="margin:18px 0 10px;font-size:14px">历史使用记录</h2>
    <div class="kv"><span>11-09 14:00-15:00</span><b>李明 · 受电弓检查 · 合格</b></div>
    <div class="kv"><span>11-08 09:00-10:00</span><b>王芳 · 图罩开关 · 良好</b></div>
    <p class="hint" style="margin-top:14px">★ 数据孪生：设备占用与录像时间标签一比一对应，点开可定位录像回放。</p>`;
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerMask').classList.add('open');
}
function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('drawerMask').classList.remove('open');}
function renderClassrooms(){
  document.getElementById('clsGrid').innerHTML=CLASSROOMS.map(c=>c.active?`
    <div class="cls active"><span class="live-badge">● 上课中</span>
      <div class="nm">${c.nm}</div>
      <div class="who"><b>${c.teacher}</b> 老师<br>${c.course}<br><span class="muted">${c.cls} · ${c.time}</span></div>
    </div>`:`
    <div class="cls empty"><span class="live-badge">空闲</span>
      <div class="nm">${c.nm}</div><div class="who muted">当前无课程</div>
    </div>`).join('');
}

/* ---------- 4.8 智能排课 ---------- */
let courses=[];
function fillDevOpts(){
  document.getElementById('smDev').innerHTML=DEV_OPTS.map(d=>`<option>${d}</option>`).join('');
}
function addCourse(){
  const dev=document.getElementById('smDev').value;
  const nm=document.getElementById('smCourse').value.trim()||'(未命名课程)';
  const dur=document.getElementById('smDur').value;
  courses.push({dev,nm,dur:+dur});
  document.getElementById('smCourse').value='';
  renderCourseList();
}
function renderCourseList(){
  document.getElementById('smCount').textContent=courses.length+' 门';
  const el=document.getElementById('smList');
  if(!courses.length){el.innerHTML='<div class="empty-state">尚未添加课程</div>';return;}
  el.innerHTML=courses.map((c,i)=>`<div class="pk"><span class="tag">${c.dev}</span><span class="nm">${c.nm}</span><span class="du">${c.dur}学时</span><span class="rm" style="cursor:pointer" onclick="rmCourse(${i})">✕</span></div>`).join('');
}
function rmCourse(i){courses.splice(i,1);renderCourseList();}
function oneClick(){
  if(!courses.length){toast('请先添加待排课程','⚠️');return;}
  // 简单排课：依次填入空格，避开已占用
  const grid=Array.from({length:4},()=>Array.from({length:5},()=>null));
  // 预置一些"别人的占用"
  grid[0][2]={nm:'已占用·他班',type:'conflict'};
  let di=0,si=0,placed=0;
  courses.forEach(c=>{
    // 找下一个空格
    let tries=0;
    while(tries<20){
      if(!grid[si][di]){grid[si][di]={nm:c.nm,sub:c.dev+' · '+c.dur+'学时',type:'dev'};placed++;
        di++; if(di>=5){di=0;si=(si+1)%4;} break;}
      di++; if(di>=5){di=0;si=(si+1)%4;} tries++;
    }
  });
  renderTable('smTable',grid,true);
  toast(`已为 ${placed} 门课自动排课，避开 ${1} 处占用冲突`,'⚡');
}

/* ---------- 课表渲染（含拖拽） ---------- */
function renderTable(id,grid,draggable){
  const tb=document.getElementById(id);
  let html=`<tr><th class="time-col">时间</th>${DAYS.map(d=>`<th>${d}</th>`).join('')}</tr>`;
  for(let s=0;s<4;s++){
    html+=`<tr><td class="time-col"><b>${SLOTS[s].t}</b><br>${SLOTS[s].h}</td>`;
    for(let d=0;d<5;d++){
      const cell=grid[s][d];
      let inner='';
      const arr=Array.isArray(cell)?cell:(cell?[cell]:[]);
      arr.forEach(c=>{ inner+=`<div class="slot ${c.type}" ${draggable&&c.type!=='conflict'?'draggable="true"':''} data-s="${s}" data-d="${d}"><div class="nm">${c.nm}</div><div class="sub">${c.sub||''}</div></div>`; });
      html+=`<td class="cell" data-s="${s}" data-d="${d}">${inner}</td>`;
    }
    html+=`</tr>`;
  }
  tb.innerHTML=html;
  if(draggable)bindDrag(tb);
}
function bindDrag(tb){
  let dragEl=null;
  tb.querySelectorAll('.slot[draggable]').forEach(el=>{
    el.addEventListener('dragstart',e=>{dragEl=el;el.classList.add('dragging');});
    el.addEventListener('dragend',e=>{el.classList.remove('dragging');tb.querySelectorAll('td').forEach(t=>t.classList.remove('drop-ok'));});
  });
  tb.querySelectorAll('td.cell').forEach(td=>{
    td.addEventListener('dragover',e=>{e.preventDefault();td.classList.add('drop-ok');});
    td.addEventListener('dragleave',e=>td.classList.remove('drop-ok'));
    td.addEventListener('drop',e=>{e.preventDefault();td.classList.remove('drop-ok');if(dragEl){td.appendChild(dragEl);toast('已调整该课程时间','✏️');}});
  });
}

/* ---------- 课表总览 + 筛选 ---------- */
function flatBoard(){const a=[];BOARD.forEach((row,s)=>row.forEach((cell,d)=>cell.forEach(c=>a.push({...c,s,d}))));return a;}
function initFilters(){
  const all=flatBoard();
  const uniq=k=>[...new Set(all.map(x=>x[k]))];
  fillSel('fBan',uniq('ban'),'全部班级');
  fillSel('fCourse',uniq('course'),'全部课程');
  fillSel('fTeacher',uniq('teacher'),'全部老师');
  fillSel('fPlace',uniq('place'),'全部教室/设备');
  ['fBan','fCourse','fTeacher','fPlace'].forEach(id=>document.getElementById(id).onchange=renderBoard);
}
function fillSel(id,arr,all){document.getElementById(id).innerHTML=`<option value="">${all}</option>`+arr.map(x=>`<option>${x}</option>`).join('');}
function resetFilter(){['fBan','fCourse','fTeacher','fPlace'].forEach(id=>document.getElementById(id).value='');renderBoard();}
function renderBoard(){
  const fb=document.getElementById('fBan').value,fc=document.getElementById('fCourse').value,
        ft=document.getElementById('fTeacher').value,fp=document.getElementById('fPlace').value;
  const grid=Array.from({length:4},()=>Array.from({length:5},()=>[]));
  BOARD.forEach((row,s)=>row.forEach((cell,d)=>cell.forEach(c=>{
    if(fb&&c.ban!==fb)return; if(fc&&c.course!==fc)return;
    if(ft&&c.teacher!==ft)return; if(fp&&c.place!==fp)return;
    grid[s][d].push(c);
  })));
  renderTable('boardTable',grid,false);
}

/* ---------- 每月一练 + 个人预约 ---------- */
const PEOPLE=['张伟','李强','王磊','赵敏','刘洋','孙浩','周强','吴军','郑凯','马建','李红','王志','陈成','杨光','黄海'];
let picked=new Set();
function renderPeople(){
  document.getElementById('peoplePick').innerHTML=PEOPLE.map(p=>`<span class="pp ${picked.has(p)?'on':''}" onclick="togglePerson('${p}')">${p}</span>`).join('');
  document.getElementById('pcount').textContent=picked.size;
  document.getElementById('ptime').textContent=picked.size*15;
}
function togglePerson(p){picked.has(p)?picked.delete(p):picked.add(p);renderPeople();}
function renderBook(id,axisId,busy){
  const el=document.getElementById(id);
  el.innerHTML=Array.from({length:16},(_,i)=>`<div class="book-cell ${busy.includes(i)?'busy':''}" data-i="${i}" onclick="toggleCell(this)"></div>`).join('');
  document.getElementById(axisId).innerHTML=Array.from({length:16},(_,i)=>i%2===0?`<span>${i}</span>`:'<span></span>').join('');
}
let bookSel=[];
function toggleCell(c){ if(c.classList.contains('busy'))return; c.classList.toggle('sel'); }
function bookToast(){toast('预约已提交，待审批/确认','✅');}

/* ---------- 通用 ---------- */
function toast(msg,ic='✅'){const t=document.getElementById('toast');document.getElementById('toastMsg').textContent=msg;t.querySelector('span').textContent=ic;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}
function tickClock(){const d=new Date();document.getElementById('clock').textContent=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}

/* ---------- init ---------- */
renderNav(); go('twin-home');
renderTree(); renderRoomList(); selectRoom('CR400BF 综合实训室'); renderClassrooms();
fillDevOpts(); renderCourseList(); renderTable('smTable',Array.from({length:4},()=>Array.from({length:5},()=>null)),true);
initFilters(); renderBoard();
renderPeople(); renderBook('monthBook','monthAxis',[3,4,9]); renderBook('personBook','personAxis',[5,6,7,12,13]);
tickClock(); setInterval(tickClock,30000);
