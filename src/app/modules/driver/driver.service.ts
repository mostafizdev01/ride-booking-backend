import { IDriver } from "./driver.interface";
import { Driver } from "./driver.model";


const createDriver = async (payload: Partial<IDriver>) => {

    const driver = await Driver.create(payload)
    return driver

}

const GetAllDriver = async () => {

    const driver = await Driver.find().populate("userId", "-_id -password -auths")
    return driver

}

const GetSigleDriver = async (id: string) => {

    const driver = await Driver.findOne({_id: id}).populate("userId", "-_id -password -auths")
    return driver

}

export const DriverServices = {
    createDriver,
    GetAllDriver,
    GetSigleDriver,
}