export const successResponse = (res, msg) => {
    let data = {
        status: true,
        message: msg
    }
    return res.status(200).json(data);
}

export const successResponseWithData = (res, msg, resdata) => {
    let data = {
        status: true,
        message: msg,
        data: resdata
    }
    return res.status(200).json(data);
}

export const errorResponse = (res, msg) => {
    let data = {
        status: false,
        message: msg
    }
    return res.status(500).json(data);
}

export const errorResponseWithData = (res, msg, resdata) => {
    let data = {
        status: false,
        message: msg,
        data: resdata
    }
    return res.status(500).json(data);
}

export const notFoundResponse = (res, msg) => {
    let data = {
        status: false,
        message: msg
    }
    return res.status(404).json(data);
}

export const validationErrorWithData = (res, msg, errData) => {
    let data = {
        status: false,
        message: msg,
        data: errData
    }
    return res.status(406).json(data);
}

export const unauthorizedResponse = (res, msg) => {
    let data = {
        status: false,
        message: msg
    }
    return res.status(401).json(data);
}

export const forbiddenAccess = (res, msg) => {
    let data = {
        status: false,
        message: msg
    }
    return res.status(403).json(data);
}

export const invalidImage = (res, msg) => {
    let data = {
        status: false,
        message: msg
    }
    return res.status(422).json(data);
}

export const alreadyResponse = (res, msg) => {
    const data = {
        status: false,
        message: msg,
    };
    return res.status(403).json(data);
};

export const BadResponse = (res, msg) => {
    const data = {
        status: false,
        message: msg,
    };
    return res.status(400).json(data);
};
