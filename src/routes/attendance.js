import { Router } from 'express';

import SchemaValidator from '../utils/schema-validator';
import AttendanceSchema from '../schemas/attendance';
import AttendanceController from '../controllers/attendance';

class AttendanceRoutes {
	constructor() {
		this.router = new Router();

		this.attendanceController = new AttendanceController();
	}

	setup() {
		this.router.get('/', SchemaValidator.validate(AttendanceSchema.list), this.attendanceController.list);
		this.router.get('/:id', SchemaValidator.validate(AttendanceSchema.find), this.attendanceController.find);
		this.router.put('/:id', SchemaValidator.validate(AttendanceSchema.update), this.attendanceController.update);
		this.router.delete('/:id', SchemaValidator.validate(AttendanceSchema.remove), this.attendanceController.remove);
		this.router.post('/', SchemaValidator.validate(AttendanceSchema.create), this.attendanceController.create);

		return this.router;
	}
}

export default AttendanceRoutes;
