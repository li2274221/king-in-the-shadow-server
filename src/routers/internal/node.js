import router from '../router';
import Node from '../../models/node';
import ShadowrocksService from '../../services/shadowrocks';
import {
	internalAuth
} from '../../middlewares/internal-auth';

import EmailService from '../../services/email';

/**
 * 初始化所有节点
 */
router.post('nodes/reload', internalAuth, async function (ctx, next) {

	try {
		const nodes = await Node.getList();

		await Promise.all(nodes.map(node => {
			return ShadowrocksService.initializeServer(node.id);
		}));

		EmailService.sender('li2274221@gmail.com', 'VPN service reload success', 'RT');
		ctx.customResponse.success('初始化成功！');

	} catch (error) {
		ctx.customResponse.error(error.message);

		EmailService.sender('li2274221@gmail.com', 'VPN service reload failed', 'RT');
	}
});

