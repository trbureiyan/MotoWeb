export const validateSchema = (schema) =>(req, res, next) => {
    try{
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        res.status(400)
        .json({ error: error.issues?.map((issue) => issue.message) || ['Datos inválidos.'] });
    }
}
