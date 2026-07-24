import sharp from 'sharp';
import fs from 'fs';

// Procedural botanical illustrations — cohesive placeholder photography
// for the florist catalogue. Swapped for the client's real photos later.

const SIZE = 900;

function petalPath(cx, cy, len, wid, angle, shape) {
  // returns an SVG path for one petal pointing outward from (cx,cy)
  const rad = (angle * Math.PI) / 180;
  const tipX = cx + Math.cos(rad) * len;
  const tipY = cy + Math.sin(rad) * len;
  const perp = rad + Math.PI / 2;
  const bx = Math.cos(perp) * wid;
  const by = Math.sin(perp) * wid;
  const midX = cx + Math.cos(rad) * len * 0.5;
  const midY = cy + Math.sin(rad) * len * 0.5;
  if (shape === 'pointed') {
    return `M ${cx} ${cy} Q ${midX + bx} ${midY + by} ${tipX} ${tipY} Q ${midX - bx} ${midY - by} ${cx} ${cy} Z`;
  }
  // rounded
  return `M ${cx} ${cy} C ${midX + bx} ${midY + by} ${tipX + bx * 0.3} ${tipY + by * 0.3} ${tipX} ${tipY} C ${tipX - bx * 0.3} ${tipY - by * 0.3} ${midX - bx} ${midY - by} ${cx} ${cy} Z`;
}

function bloom(cx, cy, r, colors, opts = {}) {
  const { petals = 8, shape = 'rounded', rings = 2, center = '#F2C94C', rot = 0 } = opts;
  let out = '';
  for (let ring = rings; ring >= 1; ring--) {
    const rr = r * (0.6 + 0.4 * (ring / rings));
    const col = colors[Math.min(ring - 1, colors.length - 1)];
    const offset = ring % 2 === 0 ? (360 / petals) / 2 : 0;
    for (let i = 0; i < petals; i++) {
      const a = rot + offset + (360 / petals) * i;
      out += `<path d="${petalPath(cx, cy, rr, rr * 0.42, a, shape)}" fill="${col}" opacity="${0.92}"/>`;
    }
  }
  out += `<circle cx="${cx}" cy="${cy}" r="${r * 0.24}" fill="${center}"/>`;
  out += `<circle cx="${cx}" cy="${cy}" r="${r * 0.24}" fill="url(#dot)" opacity="0.5"/>`;
  return out;
}

function leaf(cx, cy, len, angle, color) {
  const rad = (angle * Math.PI) / 180;
  const tipX = cx + Math.cos(rad) * len;
  const tipY = cy + Math.sin(rad) * len;
  const perp = rad + Math.PI / 2;
  const w = len * 0.28;
  const bx = Math.cos(perp) * w, by = Math.sin(perp) * w;
  const midX = cx + Math.cos(rad) * len * 0.5, midY = cy + Math.sin(rad) * len * 0.5;
  return `<path d="M ${cx} ${cy} Q ${midX + bx} ${midY + by} ${tipX} ${tipY} Q ${midX - bx} ${midY - by} ${cx} ${cy} Z" fill="${color}"/>`;
}

function stem(x1, y1, x2, y2, color) {
  return `<path d="M ${x1} ${y1} Q ${(x1 + x2) / 2 + 20} ${(y1 + y2) / 2} ${x2} ${y2}" stroke="${color}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
}

function svg(bg1, bg2, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <radialGradient id="bg" cx="42%" cy="38%" r="80%">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </radialGradient>
    <radialGradient id="dot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00000000"/>
      <stop offset="100%" stop-color="#00000030"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="0" /></filter>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#00000022"/>
    </filter>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <g filter="url(#shadow)">${content}</g>
</svg>`;
}

const G = { deep: '#3B5A46', mid: '#5E7D63', sage: '#8AA88C' };

const products = [
  { file: 'buket-nezhnost', bg: ['#FBF1F0', '#F3D9D9'], build: (c) =>
      stem(c-10,760,c-40,470,G.mid)+stem(c+70,760,c+120,500,G.mid)+stem(c,760,c+30,430,G.mid)+
      leaf(c-40,600,150,150,G.mid)+leaf(c+110,620,150,30,G.sage)+
      bloom(c-90,470,120,['#F6C9D4','#EFB0C0','#E79DB2'],{petals:9,rings:2,center:'#F7E7B0'})+
      bloom(c+150,500,110,['#F3D2DD','#EBB9C9'],{petals:8,rings:2,center:'#F5E3A8'})+
      bloom(c+30,410,150,['#F9D6DE','#F2BECD','#EAA6BC'],{petals:10,rings:3,center:'#F6E4A6'}) },
  { file: 'buket-aloe-serdce', bg: ['#FCEFEC', '#EBC9C2'], build: (c) =>
      stem(c-30,770,c-30,470,G.deep)+stem(c+60,770,c+110,500,G.deep)+stem(c,770,c+20,430,G.deep)+
      leaf(c-50,610,160,150,G.deep)+leaf(c+120,630,150,30,G.mid)+
      bloom(c-70,470,120,['#C0392B','#A82D22','#8E241B'],{petals:10,rings:3,center:'#7C1E16'})+
      bloom(c+130,500,110,['#B93326','#9E2A1F'],{petals:9,rings:2,center:'#7C1E16'})+
      bloom(c+30,415,150,['#CB4133','#B12E23','#961F17'],{petals:11,rings:3,center:'#7C1E16'}) },
  { file: 'buket-vesenniy', bg: ['#FBF7EA', '#E7E7CE'], build: (c) =>
      stem(c-60,770,c-70,500,G.mid)+stem(c,770,c+10,470,G.mid)+stem(c+70,770,c+120,510,G.mid)+
      leaf(c-70,620,150,140,G.mid)+leaf(c+120,640,150,40,G.sage)+
      bloom(c-70,500,95,['#E8746B','#D95C52'],{petals:6,shape:'pointed',rings:2,center:'#F4C64E'})+
      bloom(c+10,460,105,['#F2C14E','#E8A93B'],{petals:6,shape:'pointed',rings:2,center:'#C0392B'})+
      bloom(c+120,510,95,['#EAB0D0','#DE96BE'],{petals:6,shape:'pointed',rings:2,center:'#F4C64E'}) },
  { file: 'buket-lavanda', bg: ['#F5F1F8', '#DBD0E8'], build: (c) =>
      stem(c-40,770,c-60,460,G.mid)+stem(c+40,770,c+70,480,G.mid)+stem(c,770,c,440,G.mid)+
      leaf(c-60,610,150,150,G.mid)+leaf(c+90,630,150,35,G.sage)+
      bloom(c-70,470,110,['#B39DDB','#9C82CC','#8368BC'],{petals:9,rings:3,center:'#EDE3F5'})+
      bloom(c+90,490,100,['#A78BD0','#8E6FC0'],{petals:8,rings:2,center:'#EDE3F5'})+
      bloom(c,430,130,['#BBA6E0','#A186CE','#876BBE'],{petals:10,rings:3,center:'#EDE3F5'}) },
  { file: 'kompoziciya-provans', bg: ['#F3F5F1', '#D6DFD3'], build: (c) =>
      `<rect x="${c-150}" y="560" width="300" height="220" rx="18" fill="#C9A66B"/><rect x="${c-150}" y="560" width="300" height="40" rx="18" fill="#B8934F"/>`+
      bloom(c-90,520,95,['#EDE7F2','#D9CEE8'],{petals:9,rings:2,center:'#C9B96E'})+
      bloom(c+90,530,90,['#B39DDB','#9C82CC'],{petals:8,rings:2,center:'#EDE3F5'})+
      bloom(c,470,120,['#F1ECF6','#DDD3EC','#C6B7E0'],{petals:10,rings:3,center:'#C9B96E'})+
      leaf(c-120,560,120,200,G.sage)+leaf(c+120,560,120,-20,G.mid) },
  { file: 'kompoziciya-rassvet', bg: ['#FDF3EA', '#F3D9C0'], build: (c) =>
      `<rect x="${c-150}" y="560" width="300" height="220" rx="18" fill="#E4E0D8"/><rect x="${c-150}" y="560" width="300" height="40" rx="18" fill="#D3CDBF"/>`+
      bloom(c-90,520,95,['#F6B27A','#EE9A5B'],{petals:9,rings:2,center:'#C0392B'})+
      bloom(c+90,530,90,['#F3C98B','#EBB268'],{petals:8,rings:2,center:'#D9603F'})+
      bloom(c,470,120,['#F8C08A','#F1A867','#E89049'],{petals:10,rings:3,center:'#C0392B'})+
      leaf(c-120,560,120,200,G.mid)+leaf(c+120,560,120,-20,G.sage) },
  { file: 'orhideya', bg: ['#F8F4F6', '#E7DAE2'], build: (c) =>
      `<rect x="${c-70}" y="600" width="140" height="180" rx="14" fill="#E9E4DC"/>`+
      stem(c,600,c-10,300,G.mid)+
      bloom(c-30,330,95,['#F3DCE8','#E8BFD5'],{petals:5,shape:'pointed',rings:1,center:'#C86FA6'})+
      bloom(c+40,430,88,['#F0D2E1','#E4B2CE'],{petals:5,shape:'pointed',rings:1,center:'#C86FA6'})+
      bloom(c-40,520,80,['#F5E1EC','#EBC6DA'],{petals:5,shape:'pointed',rings:1,center:'#C86FA6'}) },
  { file: 'sukkulent', bg: ['#F1F5EF', '#D3E0CF'], build: (c) =>
      `<rect x="${c-120}" y="560" width="240" height="210" rx="16" fill="#C98A6B"/><rect x="${c-120}" y="560" width="240" height="36" rx="16" fill="#B5765A"/>`+
      bloom(c,470,150,['#7FA96F','#6B9A5C','#578A4B'],{petals:12,shape:'pointed',rings:3,center:'#4C7D43'})+
      bloom(c,470,80,['#9BBE8B','#86AE76'],{petals:8,shape:'pointed',rings:2,center:'#5E9150'}) },
  { file: 'roza-kustovaya', bg: ['#FBEFF0', '#E6C9CC'], build: (c) =>
      `<rect x="${c-110}" y="580" width="220" height="200" rx="16" fill="#D8D2C7"/><rect x="${c-110}" y="580" width="220" height="34" rx="16" fill="#C6BFB1"/>`+
      stem(c-30,580,c-50,440,G.deep)+stem(c+40,580,c+60,470,G.deep)+
      leaf(c-50,530,110,160,G.deep)+leaf(c+70,540,110,20,G.mid)+
      bloom(c-55,440,95,['#D64C5B','#BE3A48'],{petals:9,rings:2,center:'#9A2C38'})+
      bloom(c+60,470,88,['#CF4553','#B63340'],{petals:8,rings:2,center:'#9A2C38'})+
      bloom(c,410,110,['#DB5261','#C43F4D','#AC2E3B'],{petals:10,rings:3,center:'#9A2C38'}) },
  { file: 'buket-makaruny', bg: ['#FDF0F3', '#F1D2DC'], build: (c) =>
      stem(c-30,770,c-40,470,G.mid)+stem(c+50,770,c+90,500,G.mid)+
      leaf(c-50,600,140,150,G.mid)+leaf(c+100,620,140,30,G.sage)+
      bloom(c-60,470,110,['#F4B8CB','#EC9CB7'],{petals:9,rings:2,center:'#F6E4A6'})+
      bloom(c+100,500,100,['#F1C6D6','#E8A9C0'],{petals:8,rings:2,center:'#F6E4A6'})+
      bloom(c+20,420,130,['#F7C2D2','#F0A6BF','#E88BAC'],{petals:10,rings:3,center:'#F6E4A6'})+
      `<circle cx="${c-140}" cy="690" r="34" fill="#EEA9C0"/><circle cx="${c-140}" cy="690" r="34" fill="none" stroke="#E48FAC" stroke-width="6"/><circle cx="${c+150}" cy="700" r="34" fill="#F2CE7E"/><circle cx="${c+150}" cy="700" r="34" fill="none" stroke="#E4B85F" stroke-width="6"/>` },
  { file: 'gortenziya-oblako', bg: ['#EEF4F8', '#CFE0EC'], build: (c) => {
      let cluster = '';
      const pts = [[-70,-30],[70,-20],[0,-90],[-40,50],[50,50],[0,20],[-110,20],[110,10]];
      for (const [dx,dy] of pts) cluster += bloom(c+dx, 470+dy, 62, ['#AEC9E6','#93B4DA'],{petals:4,rings:1,center:'#7FA3CE'});
      return stem(c,770,c,540,G.mid)+leaf(c,600,150,120,G.mid)+leaf(c,600,150,60,G.sage)+cluster;
    } },
  { file: 'podsolnuhi', bg: ['#FBF6E6', '#E9DCA9'], build: (c) =>
      stem(c-60,780,c-80,470,G.deep)+stem(c+50,780,c+80,500,G.deep)+stem(c,780,c+10,430,G.deep)+
      leaf(c-80,620,160,140,G.deep)+leaf(c+90,640,150,40,G.mid)+
      bloom(c-80,470,120,['#F4C640','#E9B02E'],{petals:14,shape:'pointed',rings:2,center:'#6B4423'})+
      bloom(c+90,500,110,['#F2BE3A','#E5A828'],{petals:14,shape:'pointed',rings:2,center:'#6B4423'})+
      bloom(c+10,420,145,['#F6CB44','#EBB531'],{petals:16,shape:'pointed',rings:2,center:'#6B4423'}) },
];

fs.mkdirSync('public/products', { recursive: true });
for (const p of products) {
  const markup = svg(p.bg[0], p.bg[1], p.build(SIZE / 2));
  await sharp(Buffer.from(markup)).jpeg({ quality: 86 }).toFile(`public/products/${p.file}.jpg`);
  console.log('rendered', p.file);
}
console.log('ALL DONE', products.length);
