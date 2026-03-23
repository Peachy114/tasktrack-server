class BaseController {
    sendSuccess(res, data, status = 200) {
        return res.status(status).json(data);
    }

    sendError(res, message, status = 500) {
        return res.status(status).json({ error: message });
    }

    sendNotFound(res, message = 'Not found') {
        return res.status(404).json({ error: message });
    }

    sendForbidden(res, message = 'Forbidden') {
        return res.status(403).json({ error: message });
    }

    sendBadRequest(res, message) {
        return res.status(400).json({ error: message });
    }
}

export default BaseController;