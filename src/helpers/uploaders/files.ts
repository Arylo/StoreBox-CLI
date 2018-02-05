import * as fs from 'fs-extra';
import { isAbsolute } from 'path';
import { get } from '../config';
import request = require('request');
import ora = require("ora");
import glob = require("glob");
import flatten = require('lodash.flatten');

export const handler = (filepaths: string[]) => {
    const filePaths = flatten([...filepaths].map((filepath) => {
        if (!isAbsolute(filepath)) {
            filepath = `${process.cwd()}/${filepath}`;
        }
        return filepath;
    }).map((filepath) => {
        return glob.sync(filepath);
    })).filter((filepath) => {
        return fs.existsSync(filepath) && fs.statSync(filepath).isFile();
    });

    const config = get();

    const upload = (index = 0) => {
        if (filePaths.length === index) {
            return;
        }
        const filepath = filePaths[index];
        const steam = fs.createReadStream(filepath);
        let data = "";
        const progress = ora(`Uploading ${filepath}`).start();
        request.post({
            url: config.file_upload_url,
            formData: { file: steam },
            timeout: 5000
        })
            .auth(config.username, config.token)
            .on("data", (d) => {
                data += d.toString();
            })
            .on("error", (error) => {
                if (error) {
                    console.log(error);
                }
                progress.fail(`Upload Fail ${filepath}`);
                upload(index + 1);
            })
            .on("end", () => {
                let obj;
                try {
                    obj = JSON.parse(data);
                } catch (error) {

                }
                if (obj && obj.message) {
                    progress.fail(obj.message);
                } else {
                    progress.succeed(`Upload Success ${filepath}`);
                }
                upload(index + 1);
            });
    };

    // Start Upload
    upload();

};
