import 'colors';
import path from 'path';
import Koa from 'koa';
import convert from 'koa-convert';
import json from 'koa-json';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import session from 'koa-session-store';

const configPath = process.env.NODE_ENV === 'development' ? '../bin/dev.config.js' : '../bin/dev.config.js';
const CONFIG = require(configPath);

const app = new Koa();
app.keys = ['user'];

// middlewares
app.use(convert(bodyparser()));
app.use(convert(json()));
app.use(convert(session(app)));

// 环境中间件
CONFIG.middlewares(app);

import customResponse from './middlewares/response';
app.use(customResponse);

import router from './routers/index';
app.use(router.routes()).use(router.allowedMethods());


app.use(ctx => {
	if (ctx.path === '/favicon.ico') return;

	if (ctx.status === 404) {
		ctx.customResponse.error('接口不存在', 404);
	}
});

app.on('error', function(err, ctx) {
	console.log(err);
});

app.listen(CONFIG.PORT, function(error) {
	if (error) {
		return console.log(error);
	}
	console.log(`Listening at http://localhost:${CONFIG.PORT}`);
});
