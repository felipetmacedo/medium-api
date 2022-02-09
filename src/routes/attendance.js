import { AttendanceSchema } from '@schemas';
import { AttendanceController } from '@controllers';
import BaseRoutes from './base';

export default class AttendanceRoutes extends BaseRoutes {
	constructor() {
		super();
		this.attendanceController = new AttendanceController();
	}

	setup() {
		this.router.get('/', this.SchemaValidator.validate(AttendanceSchema.list), this.attendanceController.list);
		this.router.get('/:id', this.SchemaValidator.validate(AttendanceSchema.find), this.attendanceController.find);
		this.router.put('/:id', this.SchemaValidator.validate(AttendanceSchema.update), this.attendanceController.update);
		this.router.delete('/:id', this.SchemaValidator.validate(AttendanceSchema.remove), this.attendanceController.remove);
		this.router.post('/', this.SchemaValidator.validate(AttendanceSchema.create), this.attendanceController.create);

		return this.router;
	}
}
