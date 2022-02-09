import { Router } from 'express';

import { AuthMiddleware } from '@middlewares';
import { AttendanceRoutes } from '@routes';

export default class Routes {
	constructor() {
		this.routess = new Router();

		this.attendanceRoutes = new AttendanceRoutes();
	}

	setup() {
		this.routess.use('/attendance', AuthMiddleware.isAuthorized, this.attendanceRoutes.setup());
		this.routess.get('/health', (req, res) => res.status(200).send('OK'));

		return this.routess;
	}
}
