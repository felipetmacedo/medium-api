
import Attendance from '../models/attendance';
import ExceptionUtils from '../utils/exception';

class AttendanceService {

	async list({ meta, filter }) {
		const itensPerPage = (meta.per_page && meta.per_page < 50) ? meta.per_page : 20;
		const page = ~~meta.page || 1;
		const offset = ((page - 1) * itensPerPage);
		const promises = [];
		const scopes = [{
			method: ['defaultWhere', filter.company_id]
		}];

		promises.push(Attendance.scope(...scopes).findAll({
			attributes: ['id', 'type'],
			order: [['id', 'DESC']],
			limit: itensPerPage,
			offset,
			raw: false,
			where: filter
		}));

		if (page === 1) {
			promises.push(Attendance.scope(...scopes).count({
				where: filter
			}));
		}

		const [attendances, totalItems] = await Promise.all(promises);

		const resp = {
			items: attendances
		};

		if (page === 1) {
			resp.total_items = totalItems;
		}

		return resp;
	}

	async find({ filter }) {
		const attendance = await Attendance.scope({
			method: ['defaultWhere', filter.company_id]
		}).findOne({
			where: filter,
			attributes: ['id', 'type']
		});

		if (!attendance) {
			throw new ExceptionUtils('NOT_FOUND');
		}

		return attendance;
	}

	async create(attendance) {
		const transaction = await Attendance.sequelize.transaction();

		try {
			const attendanceCreated = await Attendance.create(attendance, { transaction });

			await transaction.commit();

			attendanceCreated;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async update({ changes, filter }) {
		const transaction = await Attendance.sequelize.transaction();

		try {
			const attendanceUpdated = await Attendance.update(changes, {
				where: filter,
				transaction,
				returning: true
			});

			await transaction.commit();

			return attendanceUpdated[1][0];
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}

export default AttendanceService;
