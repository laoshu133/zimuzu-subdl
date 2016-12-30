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

    const cli = 'node index.js';
    const testOutput = '_test_out';

    before(() => {
        return rimraf(testOutput);
    });

    after(() => {
        return rimraf(testOutput);
    });

    it('Test help', () => {
        return exec(`${cli} -h`)
        .then(stdout => {
            stdout.should.to.contain('-k, --key');
        });
    });

    it('Test <Man of Steel>', () => {
        return exec(`${cli} -k "超人 钢铁" -o ${testOutput}`)
        .then(stdout => {
            stdout.should.to.contain('操作完成');
        });
    });

    it('Test <Man of Steel> use [-u]', () => {
        return exec(`${cli} -u 'http://www.zimuzu.tv/search?keyword=%E8%B6%85%E4%BA%BA+%E9%92%A2%E9%93%81&type=subtitle' -o ${testOutput}`)
        .then(stdout => {
            stdout.should.to.contain('操作完成');
        });
    });
});
