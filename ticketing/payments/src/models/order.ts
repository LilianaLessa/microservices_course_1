import mongoose from 'mongoose';
import { OrderStatus } from '@liliana-lessa-microservices-1/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties 
// that are required to create a new order
interface OrderAttrs {
    id: string
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

// An interface that describes the properties that a order document has
interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

// An interface that describes the properties that a order has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc,
    findByEvent(event: {id: string, version: number}): Promise<OrderDoc | null>

}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created
        },
    },
    {
        toJSON: {
            transform (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
         }
    }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        price: attrs.price,
        status: attrs.status,
    });
}

orderSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Order.findOne({
        _id: event.id,
        version: event.version-1
    });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus };
