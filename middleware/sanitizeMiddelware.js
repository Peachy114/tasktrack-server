import xss from 'xss';

const xssOptions = {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
};

const sanitizeValue = (value) => {
    if (typeof value === 'string') return xss(value.trim(), xssOptions);
    if (typeof value === 'object' && value !== null) return sanitizeObject(value);
    return value;
};

const sanitizeObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        obj[key] = sanitizeValue(obj[key]);
    });
    return obj;
};

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);
    next();
};

export default sanitizeMiddleware;