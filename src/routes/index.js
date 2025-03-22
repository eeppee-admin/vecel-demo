import { readdirSync } from 'fs';
import { join } from 'path';

const ROUTE_DIR = './src/routes';

export const registerRoutes = (app) => {
  // 自动加载路由文件
  readdirSync(join(ROUTE_DIR, 'app')).forEach(file => {
    if (!file.endsWith('.js')) return;
    const route = require(`../routes/app/${file}`);
    app.use(`/app/${file.split('.')[0]}`, route.default);
  });

  // API路由单独处理
  readdirSync(join(ROUTE_DIR, 'api')).forEach(file => {
    if (!file.endsWith('.js')) return;
    const route = require(`../routes/api/${file}`);
    app.use(`/api/${file.split('.')[0]}`, route.default);
  });
};