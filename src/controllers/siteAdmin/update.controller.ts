import { StatusCodes } from "http-status-codes";
import User from "../../db/models/user";
import { Roles } from "../../lib/roles";
import S3 from '../../services/upload';
export const updateAdmin = async (req, res) => {
    try {
        const admin = await User.findOne({
            _id: req.user.id,
            role_id: Roles.ADMIN
        })

        if (!admin) {
            return res.status(StatusCodes.NOT_FOUND).json({
                type: "error",
                status: false,
                message: "User Not Found"
            })
        }

        Object.entries(req.body).forEach(([key, value]) => {
            admin[key] = value;
        });

        await admin.save();
        let response = {};
        if(typeof (req.files) != 'undefined' && req.files != null){
            const upload_data = {
                db_response: admin,
                file: req.files[0]
            }
            await S3.deleteFile(JSON.parse(JSON.stringify(admin)));
            const image_uri = await S3.uploadFile(upload_data);
            response = await User.findByIdAndUpdate(admin._id, { $set: { "profile_photo": image_uri.Location } }, { new: true });
        }
        return res.status(StatusCodes.OK).json({
            type: "success",
            status: true,
            message: "Admin Updated",
            data: response
        });
    } catch (Err) {
        console.log(Err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Admin not found',
        });
    }
};
