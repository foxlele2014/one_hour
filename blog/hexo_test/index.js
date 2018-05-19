#!/usr/bin/env node

function run() {
    var comment = process.argv[2];
    return `git add . && git commit -m ${comment} && git push origin master`;
}

run();
