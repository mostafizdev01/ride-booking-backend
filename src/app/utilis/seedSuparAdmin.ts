import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import bcryptjs from "bcryptjs"
import { User } from "../modules/user/user.model";

const seedSuparAdmin = async () => {
    try {
        const isSuparAdmin = await User.findOne({ email: envVars.SUPAR_ADMIN_EMAIL })

        if (isSuparAdmin) {
            console.log("already supar admin added");
            return
        }
        const hasedPassword = await bcryptjs.hash(envVars.SUPAR_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPAR_ADMIN_EMAIL
        }

        const payload: IUser = {
            name: "Supar Admin",
            role: Role.SUPER_ADMIN,
            email: envVars.SUPAR_ADMIN_EMAIL,
            password: hasedPassword,
            isApproved: true,
            auths: [authProvider],
            currentLocation: {
                type: "Point",
                coordinates: [90.3675, 23.7465]
            }
        }

        await User.create(payload)
        console.log("user from suparadmin");

    } catch (error) {
        console.log(error);
    }
};

export default seedSuparAdmin;