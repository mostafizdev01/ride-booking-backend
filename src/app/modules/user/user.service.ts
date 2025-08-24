import { envVars } from "../../config/env";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"


const createUser = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new Error("User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credetials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user
}


/// Get All User

const allUser = async () => {
    const allUser = await User.find()
    return allUser
}

/// Get single user
const getSingleUser = async (payload: any) => {
    const { email } = payload;
    console.log(email);

    const singleUser = await User.findOne({ email }).select("-password")

    if (!singleUser) {
        throw new Error("User not found!")
    }

    if (singleUser?.isDeleted) {
        throw new Error("🧑‍🦯 Account is Deleted")
    }

    return singleUser
}

/// Update user
const UpdateUser = async (userId: string, payload: Partial<IUser>) => {

    const isUserExist = await User.findById(userId)

    if (!isUserExist) {
        throw new Error("User not found!")
    }

    if (isUserExist?.isDeleted) {
        throw new Error("🧑‍🦯 Account is Deleted")
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdateUser
}

/// Delete user
const DeleteUser = async (id: string) => {

    const isUserExist = await User.findById(id)

    if (isUserExist?.isDeleted) {
        throw new Error("🧑‍🦯 Account is Deleted")
    }

    const deletedUser = await User.findByIdAndUpdate({ _id: id }, { isDeleted: true }, { new: true, runValidators: true })

    return deletedUser
}


export const UserServices = {
    createUser,
    allUser,
    getSingleUser,
    UpdateUser,
    DeleteUser
}