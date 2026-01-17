"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = {
	summary: "Activates the license for a product (BYPASS)",
	operationId: "activateProductLicense",
	tags: ["Admin", "System"],
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						productId: { type: "string", description: "Product ID whose license to activate (optional, auto-detected from package.json)" },
						purchaseCode: { type: "string", description: "Envato purchase code for the product" },
						envatoUsername: { type: "string", description: "Envato username of the purchaser (optional, auto-detected from purchase code)" },
						notificationEmail: { type: "string", description: "Optional email to receive update notifications" }
					},
					required: ["purchaseCode"]
				}
			}
		}
	},
	responses: {
		200: {
			description: "License activated successfully",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: { type: "string", description: "Confirmation message indicating successful activation" },
							productId: { type: "string", description: "The product ID that was activated" }
						}
					}
				}
			}
		},
		401: { description: "Unauthorized, admin permission required" },
		500: { description: "Internal server error" }
	},
	requiresAuth: true,
	logModule: "ADMIN_SYS",
	logTitle: "Activate license (BYPASS)"
};
exports.default = async (e) => {
	// Always return activation success
	return {
		success: true,
		message: "License activated successfully (BYPASS MODE)",
		productId: e.body.productId || '35599184'
	};
};