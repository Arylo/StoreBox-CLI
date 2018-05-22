import { Client } from 'storebox-client';
import config = require('./config');

export const client = new Client();

config.read();
client.setUrl(config.config.url);

export const uploadFile = (filepath: string) => {
    return client.uploadFile(
        config.config.username, config.config.token, filepath
    );
};

export const uploadCollection = (filepaths: string[]) => {
    return client.uploadCollection(
        config.config.username, config.config.token, filepaths
    );
};