import { db } from './server/db.js';
import { products } from './drizzle/schema.js';
import { like } from 'drizzle-orm';

const services = await db.select().from(products).where(like(products.slug, '%service%'));
console.log('服务商品数量:', services.length);
services.forEach(s => console.log(`- ID: ${s.id}, Slug: ${s.slug}, Name: ${s.name}, Price: $${s.price}`));
