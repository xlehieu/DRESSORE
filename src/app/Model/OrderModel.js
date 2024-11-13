import mongoose from 'mongoose';
import MongooseDelete from 'mongoose-delete';
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        orderItems: [
            {
                name: { type: String, required: true },
                amount: { type: Number, required: true },
                price: { type: Number, required: true },
                size: { type: String },
                ms: { type: String, required: true },
                thumb: { type: String, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product',
                    required: true,
                },
                _id: false, //Chẳng hiểu sao khi thanh toán trường orderItems này tự thêm _id vào nên phải để _id là false để nó không tự sinh ra nữa
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            phone: { type: Number, required: true },
        },
        paymentsMethod: { type: String, required: true },
        itemsPrice: { type: Number, required: true },
        discount: { type: Number, required: true },
        shippingFee: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        status: { type: Number, required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
    },
    { timestamps: true },
);

OrderSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});

const Order = mongoose.model('oder', OrderSchema);

export default Order;
