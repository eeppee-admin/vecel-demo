// import { createClient } from 'redis';
// const client = createClient({ url: 'redis://localhost:6379' });

// // L1/L2 混合缓存
// export async function layeredCache(key, ttl, fallback) {
//   const l1 = await client.get(`mem:${key}`);
//   if (l1) return JSON.parse(l1);

//   const l2 = await client.get(`disk:${key}`);
//   if (l2) {
//     await client.setEx(`mem:${key}`, ttl, l2);
//     return JSON.parse(l2);
//   }

//   const data = await fallback();
//   await client.multi()
//     .setEx(`mem:${key}`, ttl, JSON.stringify(data))
//     .setEx(`disk:${key}`, ttl * 10, JSON.stringify(data))
//     .exec();
  
//   return data;
// }