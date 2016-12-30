require('chai').should();

describe('Test CLI', () => {
    const Promise = require('bluebird');
    const childProcess = require('child_process');
    const rimraf = Promise.promisify(require('rimraf'));
    const exec = function(cmd, options) {
        return new Promise((resolve, reject) => {
            options = Object.assign({
                cwd: process.cwd(),
                env: process.env
            }, options);

            childProcess.exec(cmd, options, (err, stdout) => {
                if(err) {
                    reject(err);

                    return;
                }

                resolve(stdout);
            });
        });
    };

    const testOutput = '_test_out';

    before(() => {
        return rimraf(testOutput);
    });

    after(() => {
        return rimraf(testOutput);
    });

    it('Test help', () => {
        return exec('zimuzu-subdl -h')
        .then(stdout => {
            stdout.should.to.contain('-k, --key');
        });
    });

    it('Test Westworld S01', () => {
        return exec('zimuzu-subdl -k "西部世界 第1季" -o ' + testOutput)
        .then(stdout => {
            stdout.should.to.contain('操作完成');
        });
    });
});
