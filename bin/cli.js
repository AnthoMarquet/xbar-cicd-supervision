#! /usr/bin/env node

// <xbar.title>GitHub Actions Status</xbar.title>
// <xbar.version>v1.0</xbar.version>
// <xbar.author>Anthony Marquet</xbar.author>
// <xbar.author.github>AnthoMarquet</xbar.author.github>
// <xbar.desc>GitHub Actions status</xbar.desc>
// <xbar.image>https://github.com/anthomarquet/xbar-cicd-supervision/blob/master/images/sample.png?raw=true</xbar.image>
// <xbar.dependencies>node</xbar.dependencies>
// <xbar.abouturl>https://github.com/anthomarquet/xbar-cicd-supervision</xbar.abouturl>

const main = require('../lib/main')

main.start()
  .then(() => {
    process.exit(0)
  })
