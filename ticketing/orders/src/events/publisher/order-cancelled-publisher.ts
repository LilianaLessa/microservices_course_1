import { OrderCancelledEvent, Publisher, Subjects } from "@liliana-lessa-microservices-1/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
