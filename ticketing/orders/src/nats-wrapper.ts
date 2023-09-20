import nats, { Stan } from "node-nats-streaming";

class NatsWrappper {
    private _stan?: Stan;

    get stan() {
        if (!this._stan) {
            throw new Error('Cannot access nats client before connecting');
        }
        
        return this._stan;
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._stan = nats.connect(clusterId, clientId, {url});

        return new Promise<void>((resolve, reject) => {
            this.stan.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });

            this.stan.on('error', (err) => {
                reject(err);
            });
        });
    }
}

export const natsWrappper = new NatsWrappper();