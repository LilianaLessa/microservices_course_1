import { ExpirationCompleteEvent,  Publisher, Subjects } from "@liliana-lessa-microservices-1/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
