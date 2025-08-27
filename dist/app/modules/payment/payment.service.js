"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = exports.getInvoiceDownloadUrl = void 0;
const payment_model_1 = require("./payment.model");
const AppHelpers_1 = __importDefault(require("../../errorHelpers/AppHelpers"));
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // const payment = await Payment.findOne({ booking: bookingId })
    // if (!payment) {
    //     throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    // }
    // const booking = await Ride.findById(payment.booking)
    // const userAddress = (booking?.user as any).address
    // const userEmail = (booking?.user as any).email
    // const userPhoneNumber = (booking?.user as any).phone
    // const userName = (booking?.user as any).name
    // const sslPayload: ISSLCommerz = {
    //     address: userAddress,
    //     email: userEmail,
    //     phoneNumber: userPhoneNumber,
    //     name: userName,
    //     amount: payment.amount,
    //     transactionId: payment.transactionId
    // }
    // const sslPayment = await SSLService.sslPaymentInit(sslPayload)
    // return {
    //     paymentUrl: sslPayment.GatewayPageURL
    // }
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const session = await Booking.startSession();
    // session.startTransaction()
    // try {
    //     const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
    //         status: PAYMENT_STATUS.PAID,
    //     }, { new: true, runValidators: true, session: session })
    //     if (!updatedPayment) {
    //         throw new AppError(401, "Payment not found")
    //     }
    //     const updatedBooking = await Booking
    //         .findByIdAndUpdate(
    //             updatedPayment?.booking,
    //             { status: BOOKING_STATUS.COMPLETE },
    //             { new: true, runValidators: true, session }
    //         )
    //         .populate("tour", "title")
    //         .populate("user", "name email")
    //     if (!updatedBooking) {
    //         throw new AppError(401, "Booking not found")
    //     }
    //     const invoiceData: IInvoiceData = {
    //         bookingDate: updatedBooking.createdAt as Date,
    //         guestCount: updatedBooking.guestCount,
    //         totalAmount: updatedPayment.amount,
    //         tourTitle: (updatedBooking.tour as unknown as ITour).title,
    //         transactionId: updatedPayment.transactionId,
    //         userName: (updatedBooking.user as unknown as IUser).name
    //     }
    //     const pdfBuffer = await generatePdf(invoiceData)
    //     const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice")
    //     if (!cloudinaryResult) {
    //         throw new AppError(401, "Error uploading pdf")
    //     }
    //     const emailData = { ...invoiceData, invoiceUrl: cloudinaryResult.secure_url }
    //     await Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: cloudinaryResult.secure_url }, { runValidators: true, session })
    //     await sendEmail({
    //         to: (updatedBooking.user as unknown as IUser).email,
    //         subject: "Your Booking Invoice",
    //         templateName: "invoice",
    //         templateData: emailData,
    //         attachments: [
    //             {
    //                 filename: "invoice.pdf",
    //                 content: pdfBuffer,
    //                 contentType: "application/pdf"
    //             }
    //         ]
    //     })
    //     await session.commitTransaction(); //transaction
    //     session.endSession()
    //     return { success: true, message: "Payment Completed Successfully" }
    // } catch (error) {
    //     await session.abortTransaction(); // rollback
    //     session.endSession()
    //     // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
    //     throw error
    // }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const session = await Booking.startSession();
    // session.startTransaction()
    // try {
    //     const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
    //         status: PAYMENT_STATUS.FAILED,
    //     }, { new: true, runValidators: true, session: session })
    //     await Booking
    //         .findByIdAndUpdate(
    //             updatedPayment?.booking,
    //             { status: BOOKING_STATUS.FAILED },
    //             { runValidators: true, session }
    //         )
    //     await session.commitTransaction(); //transaction
    //     session.endSession()
    //     return { success: false, message: "Payment Failed" }
    // } catch (error) {
    //     await session.abortTransaction(); // rollback
    //     session.endSession()
    //     // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
    //     throw error
    // }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const session = await Booking.startSession();
    // session.startTransaction()
    // try {
    //     const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
    //         status: PAYMENT_STATUS.CANCELLED,
    //     }, { runValidators: true, session: session })
    //     await Booking
    //         .findByIdAndUpdate(
    //             updatedPayment?.booking,
    //             { status: BOOKING_STATUS.CANCEL },
    //             { runValidators: true, session }
    //         )
    //     await session.commitTransaction(); //transaction
    //     session.endSession()
    //     return { success: false, message: "Payment Cancelled" }
    // } catch (error) {
    //     await session.abortTransaction(); // rollback
    //     session.endSession()
    //     // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
    //     throw error
    // }
});
const getInvoiceDownloadUrl = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId)
        .select("invoiceUrl");
    if (!payment) {
        throw new AppHelpers_1.default(401, "Payment not found");
    }
    if (!payment.invoiceUrl) {
        throw new AppHelpers_1.default(401, "No invoice found");
    }
    return payment.invoiceUrl;
});
exports.getInvoiceDownloadUrl = getInvoiceDownloadUrl;
exports.PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    getInvoiceDownloadUrl: exports.getInvoiceDownloadUrl,
    cancelPayment,
};
