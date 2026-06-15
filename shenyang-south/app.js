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
  {nm:'职培科教室1：学习室',active:true,teacher:'马建国',course:'动车组结构原理',cls:'第5期轮训班',time:'08:30-10:00'},
  {nm:'职培科教室2：微机教室',active:true,teacher:'李红',course:'安全规章',cls:'地勤资格性班',time:'09:00-11:00'},
  {nm:'职培科教室3：外网教室',active:false},
  {nm:'沈南所多功能教室',active:true,teacher:'王志强',course:'应急处置案例',cls:'第5期轮训班',time:'09:30-11:30'},
  {nm:'沈南所 MOOC 录制室',active:true,teacher:'宋婷',course:'MOOC课件录制',cls:'兼职师资培训',time:'14:00-16:00'},
  {nm:'沈北所实训理论教室',active:true,teacher:'孙磊',course:'车型能力提升',cls:'车间长培训',time:'08:00-12:00'},
  {nm:'沈南所学习室',active:true,teacher:'曹磊',course:'劳动安全教育',cls:'上半年安全培训',time:'09:00-10:00'},
  {nm:'沈南所一级修-待检室',active:false},
  {nm:'沈北所学习室',active:true,teacher:'牟广利',course:'培训管理制度宣贯',cls:'职培专职培训',time:'10:00-11:30'},
  {nm:'沈北所二级修-待检室',active:false},
  {nm:'长春所学习室',active:false},
  {nm:'大连所学习室',active:false},
];

// 老师库（选老师用）：年度课时档位 12/16/20=合格/良好/优秀
const TEACHERS=[
  {nm:'马建国',dept:'沈南所 检修车间',phone:'138****2011',year:22,total:348,spec:'CR400BF/CRH5 综合检修',cert:'高级技师'},
  {nm:'李红',dept:'沈南所 乘务车间',phone:'139****3022',year:20,total:310,spec:'安全规章/应急处置',cert:'高级技师'},
  {nm:'王志强',dept:'段库 教研室',phone:'137****4033',year:16,total:256,spec:'车辆结构原理/教学设计',cert:'技师'},
  {nm:'孙磊',dept:'沈北所 检修车间',phone:'135****5044',year:14,total:228,spec:'转向架/制动系统',cert:'技师'},
  {nm:'赵敏',dept:'沈南所 转向架',phone:'136****6055',year:12,total:175,spec:'CRH5 复位操作',cert:'高级工'},
  {nm:'刘洋',dept:'沈南所 电气',phone:'134****7066',year:10,total:160,spec:'电气系统/HMI操作',cert:'高级工'},
  {nm:'周建华',dept:'长春所 检修',phone:'130****8077',year:8,total:135,spec:'虚拟检修/VR教学',cert:'高级工'},
  {nm:'张国栋',dept:'沈北所 乘务车间',phone:'131****9088',year:24,total:380,spec:'随车机械师实操',cert:'高级技师'},
  {nm:'陈伟',dept:'大连所 检修车间',phone:'132****1099',year:6,total:98,spec:'受电弓/电环路系统',cert:'技师'},
  {nm:'吕强',dept:'沈北所 一级修甲班',phone:'133****2100',year:4,total:72,spec:'钳工实操/基本技能',cert:'高级工'},
  {nm:'任忠义',dept:'沈北所 一级修甲班',phone:'186****3111',year:2,total:45,spec:'每周一学辅导/日常培训',cert:'中级工'},
  {nm:'韩雪梅',dept:'段库 职培科',phone:'188****4122',year:26,total:412,spec:'培训管理/课程体系设计',cert:'高级技师'},
  {nm:'牟广利',dept:'沈北所 职培专职',phone:'187****5133',year:15,total:240,spec:'培训计划编制/排课管理',cert:'技师'},
  {nm:'林志远',dept:'沈南所 电钳工班',phone:'185****6144',year:11,total:168,spec:'电钳工/万用表/接线作业',cert:'高级工'},
  {nm:'杨帆',dept:'长春所 乘务车间',phone:'183****7155',year:7,total:112,spec:'空调照明系统',cert:'高级工'},
  {nm:'黄海波',dept:'大连所 检修车间',phone:'182****8166',year:3,total:56,spec:'探伤检测/超声波',cert:'中级工'},
  {nm:'郑凯',dept:'沈南所 电钳工班',phone:'181****9177',year:9,total:145,spec:'电环路接线/钳工作业',cert:'高级工'},
  {nm:'田明',dept:'沈南所 检修车间',phone:'189****0188',year:5,total:82,spec:'救援联挂/连挂操作',cert:'中级工'},
  {nm:'曹磊',dept:'段库 安全科',phone:'180****1199',year:13,total:208,spec:'劳动安全/冬季防寒',cert:'技师'},
  {nm:'宋婷',dept:'段库 教研室',phone:'177****2200',year:17,total:270,spec:'MOOC制作/课件开发',cert:'高级技师'},
  {nm:'高建军',dept:'沈南所 运用车间',phone:'176****3211',year:19,total:298,spec:'供断电操作/安全防护',cert:'技师'},
  {nm:'徐磊',dept:'沈北所 二级修',phone:'175****4222',year:8,total:130,spec:'轮轴防松/轮对检修',cert:'高级工'},
  {nm:'程志刚',dept:'长春所 检修',phone:'158****5233',year:1,total:18,spec:'新入职/见习带教',cert:'初级工'},
];
function gradeOf(y){return y>=20?{g:3,t:'优秀'}:y>=16?{g:2,t:'良好'}:y>=12?{g:1,t:'合格'}:{g:0,t:'未达标'};}

// 每周一练（在线学习）
const WEEKLY=[
  {t:'必知必会题库 126-150题',p:'25题/已答18',min:22},
  {t:'动车组制动系统原理',p:'12题/已答8',min:18},
  {t:'应急故障处置闯关',p:'10题/已答10',min:12},
  {t:'安全规章日测',p:'5题/已答3',min:6},
  {t:'两学一执行·规章100条',p:'20题/已答0',min:0},
  {t:'冬季防寒措施专项',p:'8题/已答5',min:8},
];

const DEV_OPTS=['受电弓检修台','图罩开关设备','电环路系统台','HMI 操作台','CRH5 主控台','空调照明台','制动系统台','TDTSL 操作台','J5 救援联挂主机','探伤检测台 #1','连挂操作终端','VR 工位 #1','VR 工位 #2','VR 工位 #3','VR 工位 #4','万用表实操台','电环路接线台','钳工实操台','职培科教室1：学习室','职培科教室2：微机教室','职培科教室3：外网教室','沈南所多功能教室','沈南所 MOOC 录制室','沈北所实训理论教室','限车/限场（现场真车·离线）'];
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
  sched:[{g:'培训计划管理'},
    {v:'sched-plan',ic:'📋',t:'培训计划管理（分层）'},
    {g:'预约排课管理'},
    {v:'sched-smart',ic:'⚡',t:'智能排课（专项）'},
    {v:'sched-board',ic:'📅',t:'课表总览'},
    {v:'sched-manual',ic:'🧩',t:'手动排课（层级筛选）'},
    {v:'sched-flex',ic:'🙋',t:'弹性预约（月/周/个人）'},
    {v:'sched-grab',ic:'🙋‍♂️',t:'师资抢单'}],
  base:[{g:'基础数据管理'},
    {v:'base-teacher',ic:'👨‍🏫',t:'师资管理'},
    {v:'base-equip',ic:'🔧',t:'设备/场地字典'},
    {v:'base-course',ic:'📚',t:'课程模板库'},
    {v:'base-post',ic:'👥',t:'岗位人员库'}]
};
// ===== 培训计划管理（分层）=====
const PLAN_LEVELS=[
  {k:'国铁',full:'国铁级',creator:'国铁集团职教部门',type:'年度纲要/专项纲要',placeholder:true},
  {k:'集团',full:'集团公司级',creator:'沈阳局集团职教/人力部门',type:'年度/专项',placeholder:true},
  {k:'站段',full:'站段级',creator:'段职培科专职',type:'年度培训计划 / 专项培训计划'},
  {k:'车间',full:'车间级',creator:'车间职培专职（编制）+ 职培副职（审核）',type:'专项培训 / 每月一练'},
  {k:'班组',full:'班组级',creator:'班组业务辅导员',type:'专项 / 日常（每周一学+每月一练）'},
];
// 站段级：真实取自 20260226 沈阳动车段2026年职工业务培训计划
const PLAN_DATA={
  站段:[
    {no:1,cat:'专项',name:'沈阳动车段2026年春运培训班',code:'sydcd-2026-001',form:'非脱产',xz:'适应性',obj:'重点行车岗位',plan:870,real:862,h:2,q:'一季度',dept:'职培科',st:'执行中',courses:3},
    {no:2,cat:'专项',name:'2026年一季度调图培训班',code:'sydcd-2026-002',form:'非脱产',xz:'适应性',obj:'重点行车岗位',plan:870,real:870,h:2,q:'一季度',dept:'职培科',st:'已完成',courses:2},
    {no:3,cat:'专项',name:'2026年二季度及暑运调图培训班',code:'sydcd-2026-003',form:'非脱产',xz:'适应性',obj:'重点行车岗位',plan:870,real:650,h:2,q:'一季度',dept:'职培科',st:'执行中',courses:2},
    {no:6,cat:'专项',name:'地勤机械师（运用）岗位轮训班',code:'sydcd-2026-006',form:'脱产',xz:'适应性',obj:'重点行车岗位',plan:972,real:245,h:16,q:'一~四季度',dept:'职培科',st:'执行中',courses:4},
    {no:7,cat:'专项',name:'随车机械师岗位轮训班',code:'sydcd-2026-007',form:'脱产',xz:'适应性',obj:'重点行车岗位',plan:311,real:0,h:16,q:'一~四季度',dept:'职培科',st:'已下达',courses:0},
    {no:8,cat:'专项',name:'调度员（值班员）岗位轮训班',code:'sydcd-2026-008',form:'脱产',xz:'适应性',obj:'重点行车岗位',plan:112,real:0,h:16,q:'二~四季度',dept:'职培科',st:'已下达',courses:0},
    {no:9,cat:'专项',name:'地勤机械师（高级修）岗位轮训班',code:'sydcd-2026-009',form:'脱产',xz:'适应性',obj:'高级修地勤机械师',plan:580,real:0,h:16,q:'二·三季度',dept:'职培科',st:'已下达',courses:0},
    {no:10,cat:'专项',name:'钳工岗位轮训班',code:'sydcd-2026-010',form:'脱产',xz:'适应性',obj:'钳工',plan:157,real:0,h:16,q:'二·三季度',dept:'职培科',st:'已下达',courses:0},
    {no:11,cat:'专项',name:'动态检车员岗位轮训班',code:'sydcd-2026-011',form:'脱产',xz:'适应性',obj:'动态检车员',plan:65,real:0,h:16,q:'二季度',dept:'职培科',st:'编制中',courses:0},
    {no:12,cat:'专项',name:'2026上半年劳动安全再培训',code:'sydcd-2026-012',form:'非脱产',xz:'适应性',obj:'在岗操作技能人员',plan:3300,real:0,h:4,q:'二季度',dept:'职培科',st:'编制中',courses:0},
    {no:13,cat:'专项',name:'2026下半年劳动安全再培训',code:'sydcd-2026-013',form:'非脱产',xz:'适应性',obj:'在岗操作技能人员',plan:3300,real:0,h:4,q:'三季度',dept:'职培科',st:'编制中',courses:0},
    {no:14,cat:'专项',name:'在职班组长轮训班',code:'sydcd-2026-018',form:'脱产',xz:'适应性',obj:'在职班组长',plan:10,real:0,h:16,q:'四季度',dept:'职培科',st:'待审核',courses:0},
    {no:15,cat:'专项',name:'调车作业人员培训班',code:'sydcd-2026-014',form:'非脱产',xz:'适应性',obj:'调车作业人员',plan:330,real:0,h:2,q:'四季度',dept:'职培科',st:'待审核',courses:0},
    {no:16,cat:'专项',name:'动力分散动车组司机岗前轮训班',code:'sydcd-2026-015',form:'脱产',xz:'适应性',obj:'动车组司机',plan:16,real:16,h:450,q:'一季度',dept:'职培科',st:'已完成',courses:6},
    {no:17,cat:'专项',name:'冬季运行安全防控措施培训班',code:'sydcd-2026-016',form:'非脱产',xz:'适应性',obj:'机械师/值班员/动态检车员',plan:2170,real:0,h:3,q:'四季度',dept:'职培科',st:'编制中',courses:0},
    {no:18,cat:'专项',name:'兼职师资业务提高培训班',code:'sydcd-2026-017',form:'脱产',xz:'适应性',obj:'兼职教师',plan:35,real:0,h:4,q:'三季度',dept:'职培科',st:'已下达',courses:1},
  ],
  车间:[
    {no:1,cat:'专项',name:'地勤机械师轮训（二级修）第1、2期',code:'承接段sydcd-2026-006',form:'脱产',xz:'适应性',obj:'二级修综合/车下/探伤班组',plan:120,real:48,h:'16学时',q:'8月第2周',dept:'沈北所·承接段下达',st:'执行中',courses:2},
    {no:2,cat:'专项',name:'地勤机械师轮训（一级修）第3期',code:'承接段sydcd-2026-006',form:'脱产',xz:'适应性',obj:'一级修甲/乙班',plan:96,real:0,h:'16学时',q:'8月第4周',dept:'沈北所·承接段下达',st:'已下达',courses:0},
    {no:3,cat:'专项',name:'钳工轮训班·沈北所承接',code:'承接段sydcd-2026-010',form:'脱产',xz:'适应性',obj:'沈北所钳工岗位',plan:42,real:0,h:'16学时',q:'8月·9月',dept:'沈北所·承接段下达',st:'已下达',courses:0},
    {no:4,cat:'专项',name:'动态检车员轮训·沈南所',code:'承接段sydcd-2026-011',form:'脱产',xz:'适应性',obj:'动态检车员',plan:28,real:0,h:'16学时',q:'7月第3周',dept:'沈南所·承接段下达',st:'已下达',courses:1},
    {no:5,cat:'日常',sub:'每月一练',name:'8月每月一练·基本技能实作演练 CR400',code:'空计划',form:'脱产',xz:'日常',obj:'地勤机械师各班组',plan:0,real:0,h:'实作',q:'8月第3周',dept:'沈北所·勾博文编',st:'执行中',courses:1,detail:'下发各班组：CR400基本技能实作 / 库外看车巡视 / 接触网供断电操作 / 空泵站巡检'},
    {no:6,cat:'日常',sub:'每月一练',name:'8月每月一练·探伤板更换实作',code:'空计划',form:'脱产',xz:'日常',obj:'动态检车员各班组',plan:0,real:0,h:'实作',q:'8月第3周',dept:'沈南所·编',st:'执行中',courses:1,detail:'探伤板拆装与超声波校验'},
    {no:7,cat:'日常',sub:'每月一练',name:'9月每月一练·救援联挂实作',code:'空计划',form:'脱产',xz:'日常',obj:'地勤机械师各班组',plan:0,real:0,h:'实作',q:'9月第2周',dept:'沈北所·勾博文编',st:'编制中',courses:0},
  ],
  班组:[
    {no:1,cat:'日常',sub:'每周一学',name:'每周一学·必知必会题库101-125题',code:'空计划',form:'非脱产',xz:'日常',obj:'①②③④号地勤机械师 24人',plan:24,real:24,h:'1学时/周',q:'8月第1周',dept:'一级修甲班技检·工长吕强/辅导员任忠义',st:'已完成',courses:1},
    {no:2,cat:'日常',sub:'每周一学',name:'每周一学·必知必会题库126-150题',code:'空计划',form:'非脱产',xz:'日常',obj:'①②③④号地勤机械师 24人',plan:24,real:18,h:'1学时/周',q:'8月第2周',dept:'一级修甲班技检·辅导员任忠义',st:'执行中',courses:1},
    {no:3,cat:'日常',sub:'每周一学',name:'每周一学·两学一执行题库201-210题',code:'空计划',form:'非脱产',xz:'日常',obj:'一级修乙班 22人',plan:22,real:15,h:'1学时/周',q:'8月第1周',dept:'一级修乙班·辅导员张磊',st:'执行中',courses:1},
    {no:4,cat:'日常',sub:'每月一练',name:'每月一练·基本技能实作演练 CR400',code:'空计划',form:'脱产',xz:'日常',obj:'本班组应训12人',plan:12,real:8,h:'15min×人',q:'8月第3周',dept:'一级修甲班技检·辅导员任忠义',st:'执行中',courses:1},
    {no:5,cat:'日常',sub:'每月一练',name:'每月一练·库外看车巡视一次作业',code:'空计划',form:'脱产',xz:'日常',obj:'本班组应训12人',plan:12,real:0,h:'15min×人',q:'8月第3周',dept:'一级修甲班技检·辅导员任忠义',st:'已下达',courses:0},
    {no:6,cat:'日常',sub:'每月一练',name:'每月一练·探伤板更换',code:'空计划',form:'脱产',xz:'日常',obj:'探伤班组8人',plan:8,real:5,h:'15min×人',q:'8月第3周',dept:'二级修探伤班·辅导员赵刚',st:'执行中',courses:1},
    {no:7,cat:'专项',name:'班组级钳工专项·承接段轮训',code:'承接sydcd-2026-010',form:'脱产',xz:'适应性',obj:'本班组钳工',plan:8,real:0,h:'16学时',q:'二·三季度',dept:'一级修甲班·辅导员任忠义',st:'已下达',courses:0},
    {no:8,cat:'专项',name:'班组级随车机械师轮训承接',code:'承接sydcd-2026-007',form:'脱产',xz:'适应性',obj:'本班组随车机械师6人',plan:6,real:0,h:'16学时',q:'三季度',dept:'乘务甲班·辅导员王建明',st:'已下达',courses:0},
  ],
};
// 各层级可建的培训类型（决定新建表单）
const CAT_BY_LEVEL={
  站段:[{cat:'专项',label:'专项培训（年度培训班）'}],
  车间:[{cat:'专项',label:'专项培训（承接段计划）'},{cat:'日常',sub:'每月一练',label:'日常·每月一练（下发班组）'}],
  班组:[{cat:'专项',label:'专项培训（承接上级）'},{cat:'日常',sub:'每周一学',label:'日常·每周一学'},{cat:'日常',sub:'每月一练',label:'日常·每月一练'}],
};
let planFilterCat='';// 类型筛选
let planScope='level';// level=只看本层 / all=全部层级总览
const ST_PLAN={'编制中':'#8c8c8c','待审核':'#faad14','已下达':'#1677ff','执行中':'#52c41a','已完成':'#13c2c2'};
let curPlanLevel='站段',planRole='段职培科专职';

// 师资抢单数据（脑图img2：预约排课管理→师资抢单）
const GRAB_ORDERS=[
  {course:'受电弓检查',place:'CR400BF·受电弓检修台',time:'11/12 周二 8-10节',ban:'第5期轮训班',need:'CR400BF 资质',status:'待接单'},
  {course:'救援连挂作业',place:'救援联挂室·J5主机',time:'11/13 周三 1-2节',ban:'地勤资格性班',need:'救援联挂资质',status:'待接单'},
  {course:'制动系统检查',place:'CRH5·制动系统台',time:'11/14 周四 3-4节',ban:'第5期轮训班',need:'CRH5 资质',status:'待接单'},
  {course:'虚拟检修流程',place:'VR实训室·工位1-4',time:'11/12 周二 5-6节',ban:'地勤资格性班',status:'待接单'},
  {course:'探伤板更换',place:'救援联挂室·探伤台',time:'11/15 周五 7-8节',ban:'8月每月一练',need:'探伤资质',status:'待接单'},
  {course:'电环路系统操作',place:'CR400BF·电环路台',time:'11/14 周四 1-2节',ban:'电钳工轮训班',need:'电钳工资质',status:'待接单'},
  {course:'安全规章',place:'理论教室2',time:'11/12 周二 3-4节',ban:'地勤资格性班',status:'已接单·李红'},
  {course:'动车组结构原理',place:'理论教室1',time:'11/10 周一 1-2节',ban:'第5期轮训班',status:'已接单·马建国'},
  {course:'应急处置案例',place:'综合教室',time:'11/12 周二 5-6节',ban:'第5期轮训班',status:'已接单·王志强'},
  {course:'劳动安全教育',place:'职培科教室1',time:'11/11 周二 3-4节',ban:'上半年安全培训',status:'已接单·曹磊'},
];
let curMod='twin',curView='twin-home';
function renderNav(){document.getElementById('sidenav').innerHTML=NAV[curMod].map(n=>n.g?`<div class="group">${n.g}</div>`:`<a data-v="${n.v}" class="${n.v===curView?'active':''}" onclick="go('${n.v}')"><span class="ic">${n.ic}</span>${n.t}</a>`).join('');}
function go(v){curView=v;document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.dataset.view===v));document.querySelectorAll('.sidenav a').forEach(a=>a.classList.toggle('active',a.dataset.v===v));document.getElementById('main').scrollTop=0;if(v==='sched-smart'){renderSmartPlanBar&&renderSmartPlanBar();renderSmPlanSource&&renderSmPlanSource();}}
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
  '职培科教室1：学习室':[2,2,1,2,0,1,2,2, 1,2,2,0,1,2,2,1, 0,1,2,2,1,0,2,1, 0,0,1,2,0,1,2,0, 1,2,0,1,0,2,1,0, 0,1,2,0,1,0,0,2],
  '职培科教室2：微机教室':[2,2,2,2,1,2,2,2, 2,2,1,2,2,1,2,2, 0,2,2,1,2,2,0,2, 2,1,2,2,1,2,2,0, 0,2,1,2],
  '职培科教室3：外网教室':[1,1,0,1,1,0,0,1, 0,1,1,0,0,1,1,0, 0,0,1,1,0,0,1,0, 0,1,0,0,1,0],
  '沈南所多功能教室':[2,1,2,1,2,0,1,2, 0,1,0,1,2,0,1,0, 0,0,1,0,1,0,0,1, 1,2,0,1,2,0,1,2, 0,1,0,1,0,0,1,0, 1,0,0,1,2,0,1,0, 0,1,0,0,1,2,0,1, 0,0,1,0],
  '沈南所 MOOC 录制室':[2,2,1,2,0,1,2,2,1,0,0,2],
  '沈北所实训理论教室':[1,2,0,1,2,0,1,2, 0,1,2,0,1,0,1,2, 0,1,0,0,1,2,0,1, 0,0,1,0,1,2,0,1, 0,1,0,0,1,0,0,1],
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
const POST_HEAD={
  '轨道车司机':157,'地勤机械师（运用）':972,'地勤机械师（高级修）':580,
  '随车机械师':311,'车辆钳工':157,'电力钳工':45,'动态检车员':65,
  '调度员（值班员）':112,'调车作业人员':330,'动车组司机':16,
  '在岗操作技能人员':3300,'兼职教师':35,'在职班组长':10,
  '机动车驾驶员':37,'供断电操作人员':276,'美工人员':100,
  '新职人员':200,'全体职工':2988,
};
// 课程模板库（可复用课程模板，供排课"添加课程"引用）
const COURSE_TEMPLATES=[
  {id:'C001',name:'受电弓检查',cat:'实作',equip:'受电弓检修台',room:'CR400BF 综合实训室',dur:1,obj:'地勤机械师',desc:'CR400BF受电弓碳滑板状态检查、弓网调整',freq:'高'},
  {id:'C002',name:'图罩开关操作',cat:'实作',equip:'图罩开关设备',room:'CR400BF 综合实训室',dur:1,obj:'地勤机械师',desc:'图罩开关控制台操作流程',freq:'高'},
  {id:'C003',name:'HMI操作复位',cat:'实作',equip:'HMI 操作台',room:'CR400BF 综合实训室',dur:1,obj:'地勤机械师',desc:'人机界面操作与故障复位',freq:'中'},
  {id:'C004',name:'电环路系统操作',cat:'实作',equip:'电环路系统台',room:'CR400BF 综合实训室',dur:2,obj:'电力钳工',desc:'电环路接线、测量、故障排查',freq:'中'},
  {id:'C005',name:'小复位操作',cat:'实作',equip:'CRH5 主控台',room:'CRH5 综合实训室',dur:1,obj:'地勤机械师',desc:'CRH5系列小复位标准操作',freq:'高'},
  {id:'C006',name:'制动系统检查',cat:'实作',equip:'制动系统台',room:'CRH5 综合实训室',dur:2,obj:'地勤机械师',desc:'制动系统全流程检查与测试',freq:'高'},
  {id:'C007',name:'空调照明操作',cat:'实作',equip:'空调照明台',room:'CRH5 综合实训室',dur:1,obj:'地勤机械师',desc:'空调系统与车内照明控制',freq:'低'},
  {id:'C008',name:'TBPS查看操作',cat:'实作',equip:'TDTSL 操作台',room:'CRH5 综合实训室',dur:1,obj:'动态检车员',desc:'TBPS运行数据查看与分析',freq:'中'},
  {id:'C009',name:'救援连挂作业',cat:'实作',equip:'J5 救援联挂主机',room:'救援联挂实训室',dur:2,obj:'地勤机械师',desc:'救援连挂标准作业流程（含气路）',freq:'高'},
  {id:'C010',name:'探伤板更换',cat:'实作',equip:'探伤检测台 #1',room:'救援联挂实训室',dur:1,obj:'动态检车员',desc:'探伤板拆装与校验',freq:'中'},
  {id:'C011',name:'虚拟检修流程',cat:'实作',equip:'VR 工位',room:'虚拟检修实训室(VR)',dur:1,obj:'地勤机械师',desc:'VR环境下整车虚拟检修',freq:'中'},
  {id:'C012',name:'人身安全体验',cat:'实作',equip:'VR 工位',room:'虚拟检修实训室(VR)',dur:1,obj:'全员',desc:'VR人身安全事故沉浸体验',freq:'低'},
  {id:'C013',name:'万用表使用',cat:'实作',equip:'万用表实操台',room:'电钳工实训室',dur:1,obj:'电力钳工',desc:'万用表基本测量与故障定位',freq:'高'},
  {id:'C014',name:'接线作业',cat:'实作',equip:'电环路接线台',room:'电钳工实训室',dur:2,obj:'电力钳工',desc:'电路板接线实操',freq:'中'},
  {id:'C015',name:'钳工作业',cat:'实作',equip:'钳工实操台',room:'电钳工实训室',dur:2,obj:'车辆钳工',desc:'钳工基础技能实作',freq:'高'},
  {id:'C016',name:'动车组结构原理',cat:'理论',equip:'—',room:'理论教室',dur:2,obj:'地勤机械师',desc:'动车组整体结构与工作原理',freq:'高'},
  {id:'C017',name:'安全规章',cat:'理论',equip:'—',room:'理论教室',dur:2,obj:'全员',desc:'铁路安全规章制度学习',freq:'高'},
  {id:'C018',name:'应急处置案例',cat:'理论',equip:'—',room:'理论教室',dur:1,obj:'地勤机械师',desc:'典型应急故障处置案例分析',freq:'中'},
  {id:'C019',name:'车型能力提升',cat:'理论',equip:'—',room:'理论教室',dur:2,obj:'车间长/班组长',desc:'新车型技术能力提升培训',freq:'低'},
  {id:'C020',name:'劳动安全教育',cat:'理论',equip:'—',room:'理论教室',dur:1,obj:'在岗操作技能人员',desc:'劳动安全法规与案例教育',freq:'中'},
  {id:'C021',name:'冬季运行安全防控',cat:'理论',equip:'—',room:'理论教室',dur:1,obj:'机械师/值班员',desc:'冬季防寒措施与应急预案',freq:'低'},
  {id:'C022',name:'库外看车巡视一次作业',cat:'实作',equip:'限车/限场（现场真车·离线）',room:'现场',dur:1,obj:'地勤机械师',desc:'库外真车巡视标准作业（离线考核）',freq:'中'},
  {id:'C023',name:'接触网供断电操作',cat:'实作',equip:'限车/限场（现场真车·离线）',room:'现场',dur:1,obj:'供断电操作人员',desc:'接触网供断电标准操作（离线现场）',freq:'中'},
  {id:'C024',name:'空泵站一次巡检',cat:'实作',equip:'限车/限场（现场真车·离线）',room:'现场',dur:1,obj:'地勤机械师',desc:'空泵站巡检标准流程（离线现场）',freq:'低'},
];
// 设备台账（设备/场地字典维护用）
const EQUIP_REGISTRY=[
  {id:'E001',name:'受电弓检修台',room:'CR400BF 综合实训室',type:'实作设备',model:'JA-SDG-400',status:'正常',maint:'2026-03-15',sn:'SN202501001',vendor:'捷安高科'},
  {id:'E002',name:'图罩开关设备',room:'CR400BF 综合实训室',type:'实作设备',model:'JA-TZKG-01',status:'正常',maint:'2026-04-20',sn:'SN202501002',vendor:'捷安高科'},
  {id:'E003',name:'电环路系统台',room:'CR400BF 综合实训室',type:'实作设备',model:'JA-DHL-02',status:'正常',maint:'2026-03-10',sn:'SN202501003',vendor:'捷安高科'},
  {id:'E004',name:'HMI 操作台',room:'CR400BF 综合实训室',type:'实作设备',model:'JA-HMI-01',status:'正常',maint:'2026-05-01',sn:'SN202501004',vendor:'捷安高科'},
  {id:'E005',name:'CRH5 主控台',room:'CRH5 综合实训室',type:'实作设备',model:'JA-CRH5-MC',status:'正常',maint:'2026-04-15',sn:'SN202502001',vendor:'捷安高科'},
  {id:'E006',name:'空调照明台',room:'CRH5 综合实训室',type:'实作设备',model:'JA-KTZM-01',status:'正常',maint:'2026-06-01',sn:'SN202502002',vendor:'捷安高科'},
  {id:'E007',name:'制动系统台',room:'CRH5 综合实训室',type:'实作设备',model:'JA-ZD-03',status:'故障',maint:'2026-06-10',sn:'SN202502003',vendor:'捷安高科'},
  {id:'E008',name:'TDTSL 操作台',room:'CRH5 综合实训室',type:'实作设备',model:'JA-TDTSL-01',status:'正常',maint:'2026-05-20',sn:'SN202502004',vendor:'捷安高科'},
  {id:'E009',name:'J5 救援联挂主机',room:'救援联挂实训室',type:'实作设备',model:'JA-JY-J5',status:'正常',maint:'2026-04-01',sn:'SN202503001',vendor:'捷安高科'},
  {id:'E010',name:'探伤检测台 #1',room:'救援联挂实训室',type:'实作设备',model:'JA-TS-01',status:'正常',maint:'2026-05-15',sn:'SN202503002',vendor:'捷安高科'},
  {id:'E011',name:'连挂操作终端',room:'救援联挂实训室',type:'实作设备',model:'JA-LG-T01',status:'正常',maint:'2026-06-15',sn:'SN202503003',vendor:'捷安高科'},
  {id:'E012',name:'VR 工位 #1',room:'虚拟检修实训室(VR)',type:'VR设备',model:'JA-VR-HTC-01',status:'正常',maint:'2026-03-20',sn:'SN202504001',vendor:'捷安高科'},
  {id:'E013',name:'VR 工位 #2',room:'虚拟检修实训室(VR)',type:'VR设备',model:'JA-VR-HTC-02',status:'正常',maint:'2026-03-20',sn:'SN202504002',vendor:'捷安高科'},
  {id:'E014',name:'VR 工位 #3',room:'虚拟检修实训室(VR)',type:'VR设备',model:'JA-VR-HTC-03',status:'正常',maint:'2026-03-20',sn:'SN202504003',vendor:'捷安高科'},
  {id:'E015',name:'VR 工位 #4',room:'虚拟检修实训室(VR)',type:'VR设备',model:'JA-VR-HTC-04',status:'正常',maint:'2026-03-20',sn:'SN202504004',vendor:'捷安高科'},
  {id:'E016',name:'万用表实操台',room:'电钳工实训室',type:'实作设备',model:'JA-WYB-02',status:'正常',maint:'2026-04-10',sn:'SN202505001',vendor:'捷安高科'},
  {id:'E017',name:'电环路接线台',room:'电钳工实训室',type:'实作设备',model:'JA-DHL-JX',status:'正常',maint:'2026-05-10',sn:'SN202505002',vendor:'捷安高科'},
  {id:'E018',name:'钳工实操台',room:'电钳工实训室',type:'实作设备',model:'JA-QG-01',status:'正常',maint:'2026-06-05',sn:'SN202505003',vendor:'捷安高科'},
  {id:'E019',name:'职培科教室1：学习室',room:'职培科教室',type:'理论教室',model:'—',status:'正常',maint:'—',sn:'—',vendor:'—',seats:48},
  {id:'E020',name:'职培科教室2：微机教室',room:'职培科教室',type:'理论教室',model:'—',status:'正常',maint:'—',sn:'—',vendor:'—',seats:36},
  {id:'E021',name:'职培科教室3：外网教室',room:'职培科教室',type:'理论教室',model:'—',status:'正常',maint:'—',sn:'—',vendor:'—',seats:30},
  {id:'E022',name:'沈南所多功能教室',room:'实训基地教室',type:'理论教室',model:'—',status:'正常',maint:'—',sn:'—',vendor:'—',seats:60},
  {id:'E023',name:'沈南所 MOOC 录制室',room:'实训基地教室',type:'特种教室',model:'—',status:'正常',maint:'—',sn:'—',vendor:'—',seats:12},
  {id:'E024',name:'沈北所实训理论教室',room:'实训基地教室',type:'理论教室',model:'—',status:'正常',maint:'—',sn:'—',vendor:'—',seats:40},
];
function calcHeadcount(post){const k=Object.keys(POST_HEAD).find(p=>post&&post.includes(p.slice(0,3)));document.getElementById('smHead').value=k?POST_HEAD[k]+' 人（岗位库自动统计）':(post?'按岗位库匹配中…':'—');}
function oneClick(){if(!courses.length){toast('请先添加待排课程','⚠️');return;}
  const grid=Array.from({length:4},()=>Array.from({length:5},()=>null));
  grid[0][2]={nm:'已占用·他班',type:'conflict'};
  let di=0,si=0,placed=0;
  const banTag=currentPlan?currentPlan.name:'(未绑定计划)';
  courses.forEach(c=>{let tries=0;while(tries<20){if(!grid[si][di]){grid[si][di]={nm:c.nm,sub:c.dev+' · '+c.dur+'学时',type:'dev',teacher:'',ban:banTag};placed++;di++;if(di>=5){di=0;si=(si+1)%4;}break;}di++;if(di>=5){di=0;si=(si+1)%4;}tries++;}});
  window._smGrid=grid;renderTable('smTable',grid,true,true);smStep=3;renderSteps();
  toast(currentPlan?`已为「${currentPlan.name}」排 ${placed} 门课，避开占用冲突。这些课已归属该计划，点课程块选老师`:`已排 ${placed} 门课。⚠未绑定计划`,'⚡');}

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

/* ---------- 培训计划管理（金字塔 + 下达拆解链）---------- */
// 金字塔每层：谁、管什么颗粒度、单位数量级
const PYRAMID=[
  {k:'国铁',full:'国铁级',who:'国铁集团职教部门',manage:'定全国大方向（最粗）',unit:'1（全国）',ph:true},
  {k:'集团',full:'集团公司级',who:'沈阳局集团职教/人力',manage:'把国铁方向细化，分给各段',unit:'十几个站段',ph:true},
  {k:'站段',full:'站段级（沈阳动车段）',who:'段职培科专职',manage:'定本段今年办哪些"培训班"（到班，870人这种）',unit:'几十个培训班'},
  {k:'车间',full:'车间级（动车所）',who:'车间职培专职（如勾博文）',manage:'把段的培训班拆到"每月、每个班组学啥"',unit:'各所·每月计划'},
  {k:'班组',full:'班组级',who:'班组业务辅导员（如任忠义）',manage:'落到"这周谁学哪几道题、谁练CR400"（最细）',unit:'到岗位·到人'},
];
// 钳工培训贯穿拆解链：一条段级计划怎么一层层拆下去
const RELAY_CHAIN=[
  {level:'站段级',who:'段职培科专职',color:'#1677ff',
   plan:'钳工岗位轮训班',meta:'编号 sydcd-2026-010 · 全段钳工 157 人 · 每期16学时 · 二三季度',
   detail:'段里只定"今年要给全段157个钳工办轮训"——这是一句话的大计划，没说具体哪天、在哪、学哪道题。',
   down:'下达给承训车间（沈北所等）'},
  {level:'车间级',who:'车间职培专职 勾博文',color:'#13c2c2',
   plan:'沈北所·8月 钳工培训月度计划',meta:'编制 勾博文 / 审核 牟广利',
   detail:'车间接到段的"钳工轮训"任务，拆成本所8月的安排：本所钳工分到一级修甲/乙班，排好"每周一学+每月一练"。',
   down:'拆解下达给各班组'},
  {level:'班组级',who:'业务辅导员 任忠义',color:'#52c41a',
   plan:'一级修甲班·8月钳工培训',meta:'本班组应训 24 人 · 工长吕强 / 辅导员任忠义',
   detail:'班组再拆到"本班这24人，这4周分别学啥、这月练啥"：',
   items:['每周一学：必知必会题库 第1周101-125 / 第2周126-150 / 第3周151-175 / 第4周176-200','每月一练：第3周 CR400 基本技能实作演练（组队）'],
   down:'指派到具体学员'},
  {level:'学员',who:'班组成员（老张/老李…）',color:'#722ed1',
   plan:'个人学习/练功任务',meta:'到人',
   detail:'每个人收到自己的任务：老张这周学101-125题（在线答题凑1学时）、本月去练CR400实作（自己弹性预约时间，到点下机）。',
   down:null},
];
function renderPyramid(){
  const el=document.getElementById('pyramid');if(!el)return;
  el.innerHTML=PYRAMID.map((l,i)=>{
    const w=52+i*12; // 越往下越宽
    return `<div class="pyr-row"><div class="pyr-bar ${l.k===curPlanLevel?'on':''} ${l.ph?'ph':''}" style="width:${w}%" onclick="setPlanLevel('${l.k}')">
      <div class="pyr-lv">${l.full}${l.ph?' <i>(脑图未展开·待确认)</i>':''}</div>
      <div class="pyr-desc"><b>${l.who}</b>　${l.manage}</div></div></div>`;
  }).join('');
}
function renderRelay(){
  const el=document.getElementById('relayChain');if(!el)return;
  el.innerHTML=RELAY_CHAIN.map((c,i)=>{
    const hl=PYRAMID.find(p=>p.full.startsWith(c.level)||c.level.startsWith(p.full.slice(0,3)));
    const isCur=hl&&hl.k===curPlanLevel;
    return `<div class="relay-card ${isCur?'cur':''}" style="border-left-color:${c.color}">
      <div class="rc-head"><span class="rc-lv" style="background:${c.color}">${c.level}</span><span class="rc-who">${c.who}</span></div>
      <div class="rc-plan">${c.plan}</div>
      <div class="rc-meta">${c.meta}</div>
      <div class="rc-detail">${c.detail}</div>
      ${c.items?'<ul class="rc-items">'+c.items.map(x=>`<li>${x}</li>`).join('')+'</ul>':''}
    </div>${c.down?`<div class="relay-arr">⬇ <span>${c.down}</span></div>`:''}`;
  }).join('');
}
function setPlanLevel(k){curPlanLevel=k;renderPyramid();renderRelay();renderPlanLevel();}
function renderPlanLevel(){
  const lv=PLAN_LEVELS.find(l=>l.k===curPlanLevel);
  const py=PYRAMID.find(l=>l.k===curPlanLevel);
  document.getElementById('pyrInfo').innerHTML=`<b>${py.full}</b>：由 <b>${py.who}</b> 创建；管的是「${py.manage}」；单位量级：${py.unit}`;
  document.getElementById('curLevelName').textContent=py.full;
  document.getElementById('curLevelSrc').textContent={站段:'来自 2026 年度培训计划表（真实）',车间:'来自 沈北所 8 月培训计划（真实·勾博文编）',班组:'来自 班组每周一学/每月一练（真实）',国铁:'脑图未展开',集团:'脑图未展开'}[curPlanLevel];
  // 视图范围切换（本层 / 全部）+ 类型筛选 Tab
  const scopeEl=document.getElementById('planScopeTabs');
  if(scopeEl)scopeEl.innerHTML=`<span class="scope-tab ${planScope==='level'?'on':''}" onclick="setPlanScope('level')">只看本层（${py.full}）</span><span class="scope-tab ${planScope==='all'?'on':''}" onclick="setPlanScope('all')">📊 看全部层级（总览）</span>`;
  const tabEl=document.getElementById('planCatTabs');
  if(tabEl){
    const cats=[{v:'',t:'全部类型'},{v:'专项',t:'专项培训'},{v:'日常',t:'日常培训(每周一学/每月一练)'}];
    tabEl.innerHTML=cats.map(c=>`<span class="cat-tab ${planFilterCat===c.v?'on':''}" onclick="setPlanCat('${c.v}')">${c.t}</span>`).join('')
      +`<button class="btn primary sm" style="margin-left:auto" onclick="openCreatePlan()">＋ 新建${planScope==='all'?'计划':py.full+'计划'}</button>`;
  }
  // 组装数据
  let rows=[];
  if(planScope==='all'){
    ['站段','车间','班组'].forEach(k=>{(PLAN_DATA[k]||[]).forEach(p=>rows.push({...p,_lv:k}));});
    document.getElementById('curLevelName').textContent='全部层级';
    document.getElementById('curLevelSrc').textContent='站段+车间+班组合并总览，可按层级颜色区分';
  } else {
    rows=(PLAN_DATA[curPlanLevel]||[]).map(p=>({...p,_lv:curPlanLevel}));
    document.getElementById('curLevelName').textContent=py.full;
  }
  if(planFilterCat)rows=rows.filter(p=>p.cat===planFilterCat);
  const body=document.getElementById('planTbody');
  if(planScope==='level'&&lv.placeholder){body.innerHTML=`<tr><td colspan="11" class="empty-state">${lv.full}计划由上级职教部门创建，脑图未展开字段——本层为只读占位，字段待向甲方确认。</td></tr>`;return;}
  if(!rows.length){body.innerHTML=`<tr><td colspan="11" class="empty-state">暂无计划，点右上「新建」创建</td></tr>`;return;}
  const lvColor={站段:'#1677ff',车间:'#13c2c2',班组:'#52c41a'};
  body.innerHTML=rows.map((p,idx)=>`<tr>
    <td>${planScope==='all'?`<span class="lv-badge" style="background:${lvColor[p._lv]}">${p._lv}</span>`:p.no}</td>
    <td><span class="cat-badge ${p.cat==='专项'?'zx':'rc'}">${p.cat}${p.sub?'·'+p.sub:''}</span><br><b>${p.name}</b>${p.detail?`<br><span class="muted" style="font-size:11px">${p.detail}</span>`:''}</td>
    <td>${p.code}</td>
    <td>${p.form}/${p.xz}</td>
    <td>${p.obj}</td>
    <td>${p.plan||'—'}${p.real?` / 实${p.real}`:''}${p.plan&&p.real?`<br><span class="muted" style="font-size:11px">兑现 ${Math.round(p.real/p.plan*100)}%</span>`:''}</td>
    <td>${p.h}</td>
    <td>${p.q}</td>
    <td style="font-size:11px">${p.dept}</td>
    <td><span class="plan-st" style="background:${ST_PLAN[p.st]}22;color:${ST_PLAN[p.st]}">${p.st}</span></td>
    <td><span class="link-a" onclick="editPlanByLv('${p._lv}',${p.no},'${p.cat}')">编辑</span> · ${p.cat==='专项'?`<span class="link-a" onclick="goSchedule('${p._lv}',${p.no})">课程/排课(${p.courses})</span>`:`<span class="link-a" onclick="go('sched-flex')">去弹性预约</span>`}</td>
  </tr>`).join('');
}
function setPlanCat(v){planFilterCat=v;renderPlanLevel();}
function setPlanScope(s){planScope=s;renderPlanLevel();}
function editPlanByLv(lv,no,cat){curPlanLevel=lv;const p=(PLAN_DATA[lv]||[]).find(x=>x.no===no&&x.cat===cat);openCreatePlan(p);}

/* 新建/编辑计划：先选层级 → 层级决定可建类型 → 动态表单 */
let createLevel='站段';
function openCreatePlan(editData){
  createLevel=(editData&&editData._lv)||curPlanLevel;
  if(!['站段','车间','班组'].includes(createLevel))createLevel='站段';
  const isEdit=!!editData;
  openModal(isEdit?'编辑计划':'新建计划',`
    <div class="note">★ <b>先选计划层级</b>——层级决定能建什么类型（站段级只能建专项；车间级＝专项+每月一练；班组级最全）。再选类型，表单字段随之变化。</div>
    <div class="field"><label>计划层级<span class="req">*</span> ${isEdit?'<span class="muted">（编辑时不可改层级）</span>':''}</label>
      <div class="seg" id="createLvSeg"></div></div>
    <div class="field"><label>培训类型<span class="req">*</span> <span class="muted" id="catHint"></span></label>
      <div class="seg" id="catSeg"></div></div>
    <div id="planForm"></div>
    <div style="display:flex;gap:10px;margin-top:14px">
      <button class="btn primary" onclick="savePlan()">${isEdit?'保存修改':'保存计划'}</button>
      <button class="btn" onclick="closeModal()">取消</button></div>`);
  renderCreateLvSeg(isEdit);
  renderCreateCats();
}
function renderCreateLvSeg(disabled){
  const lvs=[{k:'站段',t:'站段级'},{k:'车间',t:'车间级'},{k:'班组',t:'班组级'}];
  document.getElementById('createLvSeg').innerHTML=lvs.map(l=>`<button class="${l.k===createLevel?'on':''}" ${disabled?'disabled style="opacity:.5"':`onclick="changeCreateLevel('${l.k}')"`}>${l.t}</button>`).join('');
}
function changeCreateLevel(lv){createLevel=lv;renderCreateLvSeg(false);renderCreateCats();}
function renderCreateCats(){
  const py=PYRAMID.find(l=>l.k===createLevel);
  const cats=CAT_BY_LEVEL[createLevel]||[];
  document.getElementById('catHint').textContent=`（${py.full}由 ${py.who} 创建，可建：${cats.map(c=>c.label.replace(/（.*?）/,'')).join(' / ')}）`;
  document.getElementById('catSeg').innerHTML=cats.map((c,i)=>`<button class="${i===0?'on':''}" onclick="planTypeForm('${c.cat}','${c.sub||''}')">${c.label}</button>`).join('');
  const c0=cats[0]||{cat:'专项'};
  planTypeForm(c0.cat,c0.sub||'');
}
function planTypeForm(cat,sub){
  document.querySelectorAll('#catSeg button').forEach(b=>b.classList.toggle('on',b.textContent.includes(cat)&&(!sub||b.textContent.includes(sub))));
  const el=document.getElementById('planForm');
  if(cat==='专项'){
    el.innerHTML=`<div class="form-tag zx">专项培训 = 集中办培训班，要排课/定老师（具体计划）</div>
      <div class="row" style="gap:10px"><div class="field" style="flex:1"><label>项目编号</label><input class="input" value="sydcd-2026-0XX（自动生成）" readonly></div>
        <div class="field" style="flex:1"><label>培训班名称<span class="req">*</span></label><input class="input" placeholder="唯一·必填，如：钳工岗位轮训班"></div></div>
      <div class="row" style="gap:10px"><div class="field" style="flex:1"><label>培训性质<span class="muted">枚举来自职培网</span></label><select class="input"><option>适应性</option><option>安全培训</option><option>资格性</option></select></div>
        <div class="field" style="flex:1"><label>培训形式</label><select class="input"><option>脱产</option><option>非脱产</option></select></div></div>
      <div class="row" style="gap:10px"><div class="field" style="flex:1"><label>培训对象(岗位·手输)</label><input class="input" placeholder="如：钳工" oninput="document.getElementById('cpHead')&&(document.getElementById('cpHead').value=(POST_HEAD[Object.keys(POST_HEAD).find(k=>this.value.includes(k.slice(0,2)))]||'按岗位库统计')+' 人')"></div>
        <div class="field" style="flex:1"><label>计划人数<span class="muted">按岗位自动算</span></label><input class="input" id="cpHead" value="—" readonly></div></div>
      <div class="row" style="gap:10px"><div class="field" style="flex:1"><label>每期培训时间(学时·0.5倍数)</label><select class="input"><option>2</option><option>4</option><option selected>16</option></select></div>
        <div class="field" style="flex:1"><label>主办部门</label><select class="input"><option>职培科</option><option>安全科</option></select></div></div>
      <div class="field"><label>实施季度(多选·须带年份)</label><div class="seg"><button class="on">2026二季度</button><button class="on">三季度</button><button>四季度</button></div></div>
      <div class="hint">★ 保存后状态=编制中→可"提交下达"；在该计划下点"进入排课"配课程(设备/教室/时长)→一键排课→选老师。</div>`;
  } else if(sub==='每周一学'){
    el.innerHTML=`<div class="form-tag rc">日常·每周一学 = 在线学习/答题，凑够1学时（空计划，不排死时间）</div>
      <div class="field"><label>学习内容来源<span class="req">*</span></label><select class="input"><option>必知必会题库(一级修岗位) 101-125题</option><option>两学一执行题库 201-210题</option><option>标准化作业指导书/故障案例</option></select></div>
      <div class="row" style="gap:10px"><div class="field" style="flex:1"><label>常规/临时</label><select class="input"><option>常规性</option><option>临时性</option></select></div>
        <div class="field" style="flex:1"><label>周期</label><input class="input" value="每周（本月第1~4周）" readonly></div></div>
      <div class="field"><label>对象(班组/岗位)</label><input class="input" placeholder="如：一级修甲班 ①②③④号地勤机械师"></div>
      <div class="field"><label>要求</label><input class="input" value="每周累计 ≥ 1学时（约60分钟），零散答题可凑" readonly></div>
      <div class="hint">★ 空计划：只给学习内容+周期+对象，不排死时间。下发后学员在"弹性预约-每周一学"里自己随时学。</div>`;
  } else {
    el.innerHTML=`<div class="form-tag rc">日常·每月一练 = 实作演练（组队/单人），空计划，学员弹性预约</div>
      <div class="field"><label>实作演练项目<span class="req">*</span></label><select class="input"><option>CR400 基本技能实作演练</option><option>库外看车巡视一次作业</option><option>接触网供断电操作演练</option><option>空泵站一次巡检</option></select></div>
      <div class="row" style="gap:10px"><div class="field" style="flex:1"><label>关联设备</label><select class="input"><option>CR400BF综合实训设备</option><option>探伤检测台</option></select></div>
        <div class="field" style="flex:1"><label>周期</label><input class="input" value="每月（本月第3周）" readonly></div></div>
      <div class="field"><label>参练人员(组队·从班组选)</label><input class="input" placeholder="如：本班组应训12人，辅导员勾选名单"></div>
      <div class="field"><label>时长规则</label><input class="input" value="15分钟 × 人数（到点强制下机）" readonly></div>
      <div class="hint">★ 空计划：只给项目+设备+人，不排死时间。下发后在"弹性预约-每月一练"里组队预约设备时段，没考完下次接着考。</div>`;
  }
}
function savePlan(){closeModal();toast('计划已保存（演示）。专项→进排课配课程；日常→学员弹性预约','📋');}
function editPlan(idx){const p=(planFilterCat?PLAN_DATA[curPlanLevel].filter(x=>x.cat===planFilterCat):PLAN_DATA[curPlanLevel])[idx];openCreatePlan(p);}
/* === 计划 → 课程 → 排课 串联 === */
let currentPlan=null; // 当前正在排课的专项计划
function goSchedule(lv,no){
  const p=(PLAN_DATA[lv]||[]).find(x=>x.no===no);
  currentPlan={...p,_lv:lv};
  closeModal();go('sched-smart');renderSmartPlanBar();renderSmPlanSource();
  toast(`已进入「${p.name}」的排课：在这条计划下加课程→一键排课`,'🔗');
}
function clearSmartPlan(){currentPlan=null;renderSmartPlanBar();renderSmPlanSource();}
function renderSmartPlanBar(){
  const el=document.getElementById('smartPlanBar');if(!el)return;
  if(currentPlan){
    el.innerHTML=`<div class="plan-ctx"><span class="pc-tag">正在为计划排课</span><b>${currentPlan.name}</b><span class="pc-meta">${currentPlan.code} · ${currentPlan.obj} · 计划${currentPlan.plan||'—'}人 · 实施${currentPlan.q}</span><span class="link-a" style="margin-left:auto" onclick="go('sched-plan')">↩ 回计划管理换一条</span></div>`;
  } else {
    el.innerHTML=`<div class="plan-ctx none"><span class="pc-tag warn">未选计划</span>本页要在某条<b>专项计划</b>下排课。请先去 <span class="link-a" onclick="go('sched-plan')">培训计划管理</span> 选一条计划点「课程/排课」进来。（下方为演示，正式必须带计划）</div>`;
  }
}
function renderSmPlanSource(){
  const el=document.getElementById('smPlanSource');if(!el)return;
  if(currentPlan){
    el.innerHTML=`<div class="src-plan"><div class="sp-row"><span>培训班</span><b>${currentPlan.name}</b></div>
      <div class="sp-row"><span>项目编号</span>${currentPlan.code}</div>
      <div class="sp-row"><span>对象/人数</span>${currentPlan.obj} · ${currentPlan.plan||'—'}人</div>
      <div class="sp-row"><span>实施季度</span>${currentPlan.q} <span class="muted">（下面加的课程周期必须落在此季度内）</span></div>
      <div class="hint">★ 计划已在「培训计划管理」建好，这里不再重复建计划，只在它下面加课程并排课。</div></div>`;
  } else {
    el.innerHTML=`<div class="note" style="background:var(--warning-bg);border-color:#ffe58f;color:#874d00">未绑定计划——下方为演示。正式流程：从培训计划管理选专项计划进来。</div>`;
  }
}
function planDrill(name,n){
  if(!n){toast('该计划尚未挂课程，点"课程/排课"进入添加','📋');return;}
  openModal(`「${name}」下的课程`,`<div class="note">计划是粗的上层、课程是细的下层（父子从属）。课程绑定设备/教室、形式、时长；课程周期强校验落在计划季度内。</div>
    <table class="tch-table"><tr><th>课程名</th><th>形式</th><th>设备/教室</th><th>时长</th><th>老师</th><th>排课状态</th></tr>
    <tr><td>受电弓检查</td><td>实作</td><td>受电弓检修台</td><td>1学时</td><td>张伟</td><td><span class="plan-st" style="background:#52c41a22;color:#52c41a">已排</span></td></tr>
    <tr><td>动车组结构原理</td><td>理论</td><td>理论教室1</td><td>2学时</td><td>马建国</td><td><span class="plan-st" style="background:#52c41a22;color:#52c41a">已排</span></td></tr>
    <tr><td>应急处置案例</td><td>理论</td><td>综合教室</td><td>1学时</td><td>待选</td><td><span class="plan-st" style="background:#faad1422;color:#d48806">待排</span></td></tr></table>
    <button class="btn primary" style="margin-top:12px" onclick="closeModal();go('sched-smart')">＋ 在此计划下继续加课程/排课</button>`);
}

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

/* ---------- 基础数据管理 ---------- */
// 师资管理
let tchFilter='',tchDeptFilter='';
function renderBaseTeacher(){
  const depts=[...new Set(TEACHERS.map(t=>t.dept.split(' ')[0]))];
  const sel=document.getElementById('btDeptFilter');
  if(sel&&!sel.options.length){sel.innerHTML='<option value="">全部部门</option>'+depts.map(d=>`<option>${d}</option>`).join('');}
  let arr=TEACHERS;
  if(tchDeptFilter)arr=arr.filter(t=>t.dept.includes(tchDeptFilter));
  if(tchFilter)arr=arr.filter(t=>t.nm.includes(tchFilter)||t.spec.includes(tchFilter));
  const el=document.getElementById('btBody');if(!el)return;
  document.getElementById('btCount').textContent=arr.length+'/'+TEACHERS.length;
  const stBar={高级技师:'#52c41a',技师:'#1677ff',高级工:'#13c2c2',中级工:'#faad14',初级工:'#ff4d4f'};
  el.innerHTML=arr.map(t=>{const g=gradeOf(t.year);return `<tr>
    <td><b>${t.nm}</b></td><td>${t.dept}</td><td>${t.phone}</td>
    <td><span style="font-size:11px;padding:1px 8px;border-radius:10px;background:${stBar[t.cert]||'#f5f5f5'}22;color:${stBar[t.cert]||'#8c8c8c'}">${t.cert}</span></td>
    <td>${t.spec}</td><td>${t.year}</td><td><span class="grade g${g.g}">${g.t}</span></td><td>${t.total}</td>
    <td><span class="link-a" onclick="toast('编辑师资（演示）','✏️')">编辑</span></td></tr>`;}).join('');
}
function btSearch(){tchFilter=document.getElementById('btSearch').value;renderBaseTeacher();}
function btDeptChange(){tchDeptFilter=document.getElementById('btDeptFilter').value;renderBaseTeacher();}

// 设备/场地字典
let eqFilter='',eqTypeFilter='';
function renderBaseEquip(){
  const types=[...new Set(EQUIP_REGISTRY.map(e=>e.type))];
  const sel=document.getElementById('beTypeFilter');
  if(sel&&!sel.options.length){sel.innerHTML='<option value="">全部类型</option>'+types.map(t=>`<option>${t}</option>`).join('');}
  let arr=EQUIP_REGISTRY;
  if(eqTypeFilter)arr=arr.filter(e=>e.type===eqTypeFilter);
  if(eqFilter)arr=arr.filter(e=>e.name.includes(eqFilter)||e.room.includes(eqFilter));
  const el=document.getElementById('beBody');if(!el)return;
  document.getElementById('beCount').textContent=arr.length+'/'+EQUIP_REGISTRY.length;
  const stColor={正常:'#52c41a',故障:'#ff4d4f',维修中:'#faad14',停用:'#8c8c8c'};
  el.innerHTML=arr.map(e=>`<tr>
    <td>${e.id}</td><td><b>${e.name}</b></td><td>${e.room}</td><td>${e.type}</td>
    <td>${e.model}</td><td>${e.sn}</td>
    <td><span class="plan-st" style="background:${stColor[e.status]||'#f5f5f5'}22;color:${stColor[e.status]||'#8c8c8c'}">${e.status}</span></td>
    <td>${e.maint}</td><td>${e.vendor}</td>${e.seats?`<td>${e.seats}座</td>`:'<td>—</td>'}
    <td><span class="link-a" onclick="toast('编辑设备（演示）','✏️')">编辑</span></td></tr>`).join('');
}
function beSearch(){eqFilter=document.getElementById('beSearch').value;renderBaseEquip();}
function beTypeChange(){eqTypeFilter=document.getElementById('beTypeFilter').value;renderBaseEquip();}

// 课程模板库
let ctFilter='',ctCatFilter='';
function renderBaseCourse(){
  let arr=COURSE_TEMPLATES;
  if(ctCatFilter)arr=arr.filter(c=>c.cat===ctCatFilter);
  if(ctFilter)arr=arr.filter(c=>c.name.includes(ctFilter)||c.obj.includes(ctFilter)||c.desc.includes(ctFilter));
  const el=document.getElementById('bcBody');if(!el)return;
  document.getElementById('bcCount').textContent=arr.length+'/'+COURSE_TEMPLATES.length;
  el.innerHTML=arr.map(c=>`<tr>
    <td>${c.id}</td><td><b>${c.name}</b></td>
    <td><span class="cat-badge ${c.cat==='实作'?'zx':'rc'}">${c.cat}</span></td>
    <td>${c.equip}</td><td>${c.room}</td><td>${c.dur}学时</td><td>${c.obj}</td>
    <td style="max-width:200px;font-size:12px;color:var(--text-2)">${c.desc}</td>
    <td><span class="plan-st" style="background:${c.freq==='高'?'#ff4d4f':c.freq==='中'?'#faad14':'#52c41a'}22;color:${c.freq==='高'?'#ff4d4f':c.freq==='中'?'#faad14':'#52c41a'}">${c.freq}频</span></td>
    <td><span class="link-a" onclick="useCourseTemplate('${c.name}','${c.equip}')">引用到排课</span> · <span class="link-a" onclick="toast('编辑模板（演示）','✏️')">编辑</span></td></tr>`).join('');
}
function bcSearch(){ctFilter=document.getElementById('bcSearch').value;renderBaseCourse();}
function bcCatChange(){ctCatFilter=document.getElementById('bcCatFilter').value;renderBaseCourse();}
function useCourseTemplate(name,equip){go('sched-smart');document.getElementById('smCourse').value=name;toast(`已引用课程模板「${name}」到排课，设备请选「${equip}」`,'📚');}

// 岗位人员库
function renderBasePost(){
  const el=document.getElementById('bpBody');if(!el)return;
  const keys=Object.keys(POST_HEAD);
  document.getElementById('bpCount').textContent=keys.length;
  const total=Object.values(POST_HEAD).reduce((a,b)=>a+b,0);
  document.getElementById('bpTotal').textContent=total.toLocaleString();
  el.innerHTML=keys.map((k,i)=>{
    const n=POST_HEAD[k];const pct=Math.round(n/total*100);
    return `<tr>
    <td>${i+1}</td><td><b>${k}</b></td><td style="text-align:right">${n.toLocaleString()}</td>
    <td><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:14px;background:#f0f2f5;border-radius:7px;overflow:hidden"><div style="height:100%;width:${Math.min(pct*2,100)}%;background:var(--primary);border-radius:7px"></div></div><span class="muted">${pct}%</span></div></td>
    <td><span class="link-a" onclick="toast('编辑岗位（演示）','✏️')">编辑</span></td></tr>`;}).join('');
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
renderGrab();renderTodaySummary();renderPyramid();renderRelay();renderPlanLevel();
renderBaseTeacher();renderBaseEquip();renderBaseCourse();renderBasePost();
tickClock();setInterval(tickClock,30000);
