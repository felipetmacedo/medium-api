import BaseModel from './base';

export default class Attendance extends BaseModel {
	static load(sequelize, DataTypes) {
		return super.init({
			type: DataTypes.STRING(15)
		}, {
			timestamps: true,
			paranoid: true,
			sequelize: sequelize,
			modelName: 'attendance',
			tableName: 'new_attendances',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			scopes: {
				defaultWhere: companyId => {
					return {
						paranoid: false,
						where: {
							deleted_at: null,
							company_id: companyId
						}
					};
				}
			}
		});
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: 'user_id', as: 'doctor' });
		this.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
	}
}
