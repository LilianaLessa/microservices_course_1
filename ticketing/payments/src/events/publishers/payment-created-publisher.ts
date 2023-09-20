import { PaymentCreatedEvent, Publisher, Subjects } from "@liliana-lessa-microservices-1/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
