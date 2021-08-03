import { Router } from 'express';

import AuthMiddleware from './middlewares/auth';
import AttendanceRoutes from './routes/attendance';

class Routes {
	constructor() {
		this.routes = new Router();

		this.attendanceRoutes = new AttendanceRoutes();
	}

	setup() {
		this.routes.use('/attendance', [AuthMiddleware.isAuthorized], this.attendanceRoutes.setup());
		this.routes.get('/health', (req, res) => res.status(200).send('OK'));

		return this.routes;
	}
}

export default Routes;
