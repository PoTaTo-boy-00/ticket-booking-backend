"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateParams = exports.validateBody = void 0;
const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.issues
        });
    }
    req.body = result.data;
    next();
};
exports.validateBody = validateBody;
const validateParams = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.issues
        });
    }
    req.params = result.data;
    next();
};
exports.validateParams = validateParams;
const validateQuery = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.issues
        });
    }
    req.query = result.data;
    next();
};
exports.validateQuery = validateQuery;
//# sourceMappingURL=validate.middleware.js.map