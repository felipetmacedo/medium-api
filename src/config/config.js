require("dotenv").config();

module.exports = {
	dialect: "postgres",
	host: process.env.DATABASE_HOST,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	port: process.env.DATABASE_PORT || 5434,
	define: {
		timestamps: true,
		underscored: true,
		underscoredAll: true, // Fixed typo from 'unrderscoredAll'
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
	dialectOptions: {
		timezone: "America/Sao_Paulo",
	},
	timezone: "America/Sao_Paulo",
};
