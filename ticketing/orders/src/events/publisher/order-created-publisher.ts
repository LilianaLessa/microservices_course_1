import { OrderCreatedEvent, Publisher, Subjects } from "@liliana-lessa-microservices-1/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}
