#!/usr/bin/env node

function run() {
    var comment = process.argv[2];
    return `git add . && mastergit commit -m ${comment} && git push origin `;
}

run();
