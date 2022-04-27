/* eslint-disable prefer-const */
/* eslint-disable no-useless-escape */
// import jwt from "jsonwebtoken";
import StatusCodes from "http-status-codes";
import User from '../../db/models/user';
const List_POST = async (req, res) => {
    try {
        if(req.user.role_id == 'admin'){
            let { page, limit, sort, cond } = req.body;
            if (!page || page < 1) {
                page = 1;
            }
            if (!limit) {
                limit = 10;
            }
            if (!cond) {
                cond = {}
            }
            if (!sort) {
                sort = { "createdAt": -1 }
            }
            limit = parseInt(limit);
            const user = await User.find(cond).sort(sort).skip((page - 1) * limit).limit(limit)
            user.forEach(oneUser => oneUser.populate('paymentMethods'))
    
            const user_count = await User.find(cond).count()
            const totalPages = Math.ceil(user_count / limit);
            res.status(StatusCodes.OK).send({
                status:true,
                type: 'success',
                message: "User List Fetch Successfully",
                page: page,
                limit: limit,
                totalPages: totalPages,
                total: user_count,
                data: user,
            });
        }else{
            res.status(400).send({
                status:false,
                type: 'error',
                message: "You Are Not Authorized User"
            });
        }
        
        
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status:false,
            type: 'error',
            message: error.message
        });
    }
}
export default List_POST