function ensureAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }
    next();
}

function ensureRole(role) {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.role !== role) {
            console.log(`Access denied for user: ${req.session.user?.username || 'Guest'}`);
            return res.status(403).send('Access denied');
        }
        next();
    };
}

function checkRole(requiredRole) {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.role !== requiredRole) {
            return res.status(403).send('Access denied');
        }
        next();
    };
}

// Экспорт всех функций
module.exports = {
    ensureAuthenticated,
    ensureRole,
    checkRole,
};
