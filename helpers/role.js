const isAdmin = (req,res,next)=>{
    switch (process.env.NODE_ENV) {
        case "test":
            next()
            break;
        default:
            req.locals.payload.role == "admin"? next() : res.status(401).send("Not admin")
            break;
    }
}
const isManager = (req,res,next)=>{
    switch (process.env.NODE_ENV) {
        case "test":
            next()
            break;
        default:
            let roles = ["admin", "manager"]
            roles.includes(req.locals.payload.role) ? next() : res.status(401).send("Not manager")
            break;
    }
}
const isEmployee = (req,res,next)=>{
    switch (process.env.NODE_ENV) {
        case "test":
            next()
            break;
        default:
            let roles = ["admin", "manager"]
            req.locals.payload.employeeId == req.params.employeeId || roles.includes(req.locals.payload.role) ? next() : res.status(401).send("Not employee")
            break;
    }
}
const isUser = (req,res,next)=>{
    switch (process.env.NODE_ENV) {
        case "test":
            next()
            break;
        default:
            // req.locals.payload.userId == req.params.userId ? next() : res.status(401).send("Not User")
            next()
            break;
    }
}

module.exports = {isAdmin, isManager, isEmployee, isUser};
