import { ZodError } from "zod";
export function validateRequestBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: "Invalid Request Payload",
                    issues: error.errors.map((e) => ({
                        field: e.path.join("."),
                        message: e.message
                    }))
                });
                return;
            }
            next(error);
        }
    };
}
