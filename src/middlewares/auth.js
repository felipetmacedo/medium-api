import { AuthUtils } from "@utils";

export default class AuthMiddleware {
	static isAuthorized(req, res, next) {
		try {
			const errorResponse = {
				status: "error",
				code: 403,
				message:
					"Sessão expirada. Logue novamente no sistema para obter acesso.",
			};

			const token = AuthUtils.getBearerToken(req);
			const decodedToken = AuthUtils.decodeData(token);

			if (!decodedToken || !decodedToken.id) {
				res.status(403).json(errorResponse);

				return;
			}

			req.auth = {
				id: decodedToken.id,
			};

			next();
		} catch (error) {
			console.error(error);
			res.status(403).json({
				status: "error",
				code: 403,
				message:
					"Sessão expirada. Logue novamente no sistema para obter acesso.",
			});
		}
	}
}
