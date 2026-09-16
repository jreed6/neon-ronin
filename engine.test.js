import test from 'node:test';import assert from 'node:assert/strict';import {createState,step,platforms} from './engine.js';
const active=()=>{const s=createState();s.mode='playing';return s;};
test('complete the level with normal movement and combat inputs',()=>{
  const s=active();let airborne=0;
  for(let i=0;i<3600&&s.mode==='playing';i++){
    const p=s.player;airborne=p.ground?0:airborne+1;
    const roof=platforms.find(f=>f.h>30&&p.x>=f.x&&p.x<f.x+f.w);
    const nearEdge=roof&&roof.x+roof.w-p.x<95;
    step(s,1/60,{right:true,slash:true,star:true,jump:(p.ground&&nearEdge)||(p.jumps===1&&airborne===23)});
  }
  assert.equal(s.mode,'won');assert(s.player.hp>0);assert(s.kills>0);
});
test('a slash deflects incoming shots; lethal damage ends a run',()=>{
  const s=active();s.enemies=[];s.player.y=463;
  s.shots.push({x:120,y:490,w:10,h:6,vx:-200,vy:0,enemy:true,life:2});
  step(s,.016,{slash:true});assert.equal(s.shots.length,0);assert.equal(s.player.hp,100);
  s.player.hp=10;s.player.y=800;step(s,.016);assert.equal(s.mode,'dead');
});
test('land, run, double jump and reject a third jump',()=>{const s=active();for(let i=0;i<60;i++)step(s,1/60);assert.equal(s.player.y,463);assert.equal(s.player.ground,true);step(s,1/60,{right:true,jump:true});assert(s.player.x>80);assert.equal(s.player.jumps,1);step(s,1/60,{jump:true});assert.equal(s.player.jumps,2);const vy=s.player.vy;step(s,1/60,{jump:true});assert(s.player.vy>vy);});
test('sword and stars damage enemies, kills restore ammunition',()=>{const s=active();s.player.x=630;s.player.y=463;s.enemies=s.enemies.slice(0,1);step(s,.016,{slash:true});assert.equal(s.enemies[0].hp,1);step(s,.016,{star:true});for(let i=0;i<15;i++)step(s,.016);assert.equal(s.kills,1);assert.equal(s.player.stars,8);});
test('three enemy types exist and ranged enemies fire',()=>{const s=active();assert.equal(new Set(s.enemies.map(e=>e.type)).size,3);s.player.x=1430;s.player.y=438;let fired=false;for(let i=0;i<150;i++){step(s,1/60);fired ||= s.shots.some(b=>b.enemy);}assert(fired);});
test('fall recovers at checkpoint, damage is limited by invulnerability',()=>{const s=active();s.player.x=2260;step(s,.016);assert.equal(s.checkpoint,2250);s.player.y=800;step(s,.016);assert.equal(s.player.x,2250);assert.equal(s.player.hp,76);assert(s.player.inv>0);});
test('paused states freeze and exit wins',()=>{const s=active();s.mode='paused';step(s,1,{right:true});assert.equal(s.player.x,80);s.mode='playing';s.player.x=5530;s.player.y=463;step(s,.016);assert.equal(s.mode,'won');});
test('every rooftop gap can be crossed using double jump',()=>{for(let i=0;i<4;i++){const roofs=platforms.filter(f=>f.h>30),left=roofs[i],right=roofs[i+1],s=active();s.enemies=[];s.player.x=left.x+left.w-75;s.player.y=left.y-62;s.player.ground=true;step(s,1/60,{right:true,jump:true});for(let j=0;j<95;j++)step(s,1/60,{right:true,jump:j===22});assert(s.player.x>right.x);assert.equal(s.player.hp,100);assert.equal(s.player.ground,true);}});

