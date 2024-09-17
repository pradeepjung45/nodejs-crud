class Response {
    constructor(status = false, code = 400, message = "", data = null) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    static success(data = null, message = "Request successful") {
        return new Response(true, 200, message, data);
    }

    static badRequest(message = "Bad request") {
        return new Response(false, 400, message);
    }

    static notFound(message = "Not found") {
        return new Response(false, 404, message);
    }

    static unauthorized(message = "Unauthorized") {
        return new Response(false, 401, message);
    }
}

module.exports = Response;
