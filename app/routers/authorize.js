exports.authorize = (roles = []) =>{

    return [

        (req, res, next) => {
                if (roles.length && !roles.includes(req.user.type)) {
                                        return res.status(401).json({ message: 'Unauthorized' });
                }

            next();
        }
    ];
}

