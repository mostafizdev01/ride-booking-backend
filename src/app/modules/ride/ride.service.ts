import { io } from "../../../server";
import { IRider } from "./ride.interface"
import { Ride } from "./ride.model"

/// create ride
const CreateRide = async (payload: Partial<IRider>) => {
    const ride = await Ride.create(payload)
    io.emit("newRide", ride)
    return ride
}

/// get all rides
const AllRides = async () => {
    const allRides = await Ride.find()
    return allRides

}

// update ride or post ride
const UpdateRide = async (rideId: string, payload: Partial<IRider>) => {
     
    const newUpdateRide = await Ride.findByIdAndUpdate(rideId, payload, {new: true, runValidators: true})
    return newUpdateRide

}

export const RiderServices = {
    CreateRide,
    UpdateRide,
    AllRides
}