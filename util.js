const fs = require('fs')
const path = require('path');

const ingore = ['_media']
const dir = './'
const dirs = fs.readdirSync(dir)
let sidebar = ''

dirs.forEach(file => {
    const pathNow = path.join(dir, file);
    const dotIndex = pathNow.indexOf('.')
    const stats = fs.statSync(pathNow);

    if (stats.isDirectory()) {
        // 是文件夹
        if (dotIndex === -1 && (ingore.indexOf(pathNow) === -1)) {
            walk(pathNow)
        }
    }
});

function walk(p) {
    const files = fs.readdirSync(p)
    console.log(`* ${p}\r\n`)
    sidebar += `* ${p}\r\n`
    files.forEach(file => {
        const pathNow = path.join(p, file)
        const stats = fs.statSync(pathNow)

        if(stats.isFile()) {
            console.log(`    * [${file}](${pathNow})`)
            sidebar += `    * [${file}](${pathNow})\r\n`
        } else {
            walk(pathNow)
        }
    })
}

fs.writeFile('_sidebar.md', sidebar,  function(err) {
    if (err) {
        return console.error(err);
    }
    console.log("数据写入成功！");
 });