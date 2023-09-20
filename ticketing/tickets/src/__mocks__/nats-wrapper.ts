export const natsWrappper = {
    stan: {
        publish: jest.fn().mockImplementation(
            (subject: string, data: string, callback: () => void) => {
                callback();
            }
        )
    }
};
