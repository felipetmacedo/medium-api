import BaseModel from "./base";

export default class Post extends BaseModel {
	static load(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				title: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				content: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				total_likes: {
					type: DataTypes.INTEGER,
					allowNull: false,
					defaultValue: 0,
				},
			},
			{
				paranoid: true,
				timestamps: true,
				sequelize,
				modelName: "post",
				tableName: "posts",
				createdAt: "created_at",
				updatedAt: "updated_at",
				deletedAt: "deleted_at",
			}
		);
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
		this.hasMany(models.PostLike, { foreignKey: "post_id", as: "likes" });
	}
}
