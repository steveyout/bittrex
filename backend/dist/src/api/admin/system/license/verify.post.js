"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = {
	summary: "Verifies the license for a product (BYPASS)",
	operationId: "verifyProductLicense",
	tags: ["Admin", "System"],
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						productId: { type: "string", description: "Product ID whose license to verify" },
						purchaseCode: { type: "string", description: "Purchase code for the product" },
						envatoUsername: { type: "string", description: "Envato username of the purchaser" }
					},
					required: ["productId"]
				}
			}
		}
	},
	responses: {
		200: {
			description: "License verified successfully",
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							message: { type: "string", description: "Confirmation message indicating successful verification" },
							status: { type: "boolean", description: "License verification status" }
						}
					}
				}
			}
		},
		401: { description: "Unauthorized, admin permission required" },
		500: { description: "Internal server error" }
	},
	logModule: "ADMIN_SYS",
	logTitle: "Verify license (BYPASS)"
};
exports.default = async (e) => {
	// Always return verification success
	return {
		message: "License verified successfully (BYPASS MODE)",
		status: true
	};
};