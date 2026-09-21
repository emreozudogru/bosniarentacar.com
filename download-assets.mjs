import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
const assets = [
 ['octavia.jpg', 'Skoda Octavia III Facelift 03.jpg'],
 ['verso.jpg', '2014 Toyota Verso Excel D-4d 1.6 facelift Front.jpg'],
 ['picasso.jpg', 'Citroën Grand C4 Picasso HDi 110 Tendance (Facelift) – Frontansicht, 16. April 2011, Düsseldorf.jpg'],
 ['mostar.jpg', 'Mostar old bridge - panoramio.jpg'],
];
await Promise.all(assets.map(async ([local, title]) => {
 const name = title.replaceAll(' ', '_');
 const hash = createHash('md5').update(name).digest('hex');
 const width = local === 'mostar.jpg' ? 1920 : 960;
 const url = `https://thumb.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash.slice(0,2)}/${encodeURIComponent(name)}/${width}px-${encodeURIComponent(name)}`;
 const response = await fetch(url, {signal: AbortSignal.timeout(20000)});
 if (!response.ok) throw new Error(`${local}: ${response.status}`);
 await writeFile(`assets/${local}`, Buffer.from(await response.arrayBuffer()));
 console.log(local, 'downloaded');
}));
