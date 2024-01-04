#! /usr/bin/env node

// <xbar.title>GitHub Actions Status</xbar.title>
// <xbar.version>v1.1</xbar.version>
// <xbar.author>Anthony Marquet</xbar.author>
// <xbar.author.github>AnthoMarquet</xbar.author.github>
// <xbar.desc>GitHub Actions status</xbar.desc>
// <xbar.image>https://github.com/AnthoMarquet/xbar-cicd-supervision/blob/master/images/sample.png?raw=true</xbar.image>
// <xbar.dependencies>node</xbar.dependencies>
// <xbar.abouturl>https://github.com/AnthoMarquet/xbar-cicd-supervision</xbar.abouturl>

const github = require('./github')
const moment = require('moment')
const humanizeDuration = require("humanize-duration")

module.exports.start = async () => {

    let output = []
    let status = []
    let title = "Github Actions"
    let titleSeparator = ''
    let projectSubSeperator = '--'
    let branchSubSeperator = '---'

    //Add Title Menu in Xbar
    process.stdout.write(title)
    console.log()
    
    const workflows = await github.getWorkflows()
    
    for (let i = 0; i < workflows.length; i++) {

        const workflow = workflows[i]

        if (workflow.state == 'active') {

            const runs = await github.getRuns(workflow.id)
            const branches = []

            for (let i = 0; i < runs.length; i++) {
                if(runs[i].head_branch){
                    head_branch = runs[i].head_branch
                    if(!branches.includes(head_branch)){
                        branches.push(head_branch)
                    }
                }
            }

            for (let i = 0; i < branches.length; i++) {
                const branch = await github.getLastRunFromBranch(branches[i])
                const jobs = await github.getJobs(branch.id);

                print_menu(output, titleSeparator,branch.conclusion, branch.head_branch, { html_url: branch.html_url })           
                print_menu(output, projectSubSeperator,branch.conclusion, branch.head_commit.message, { html_url: branch.html_url })

                for (let j = 0; j < jobs.length; j++) {
                    const job = jobs[j]
                    for (let k = 0; k < job.steps.length; k++) {
                        const step = job.steps[k]
                        print_menu(output, branchSubSeperator, step.conclusion, step.name, { itemDuration: step, html_url: job.html_url })
                    }
                }
                status.push({
                  icon: icon(branch.conclusion)
                })
            }
        }
    }

    console.log('---')

    for (let i = 0; i < output.length; i++) {
        console.log(output[i])
    }
}

function print_menu(output, level, status, name, options) {
    let duration = ''
    if (options.itemDuration != undefined) {
        let item = options.itemDuration
        const diff = moment(item.completed_at).diff(moment(item.started_at), 'milliseconds')
        duration = '\x1b[0;36m' + ` (${humanizeDuration(diff)})` + '\x1b[0m'
    }
    let href = ` | href=${options.html_url} | dropdown=true`
    output.push(`${level} ${icon(status)} ${name}${duration}${href}`)
}

async function submenus(output, github, name, run) {
    var jobs = await github.getJobs(run.id);

    print(output, '', run.conclusion, name, { html_url: run.html_url })

    for (let j = 0; j < jobs.length; j++) {

        const job = jobs[j]
        print(output, '--', job.conclusion, job.name, { itemDuration: job, html_url: job.html_url })

        for (let k = 0; k < job.steps.length; k++) {

            const step = job.steps[k]
            print(output, '---', step.conclusion, step.name, { itemDuration: step, html_url: job.html_url })
        }
    }
}

function icon(status) {
    switch (status) {
        case 'success': return '\x1b[0;32m●\x1b[0m'
        case 'failure': return '\x1b[0;31m●\x1b[0m'
        case 'cancelled': return '\x1b[0;37m●\x1b[0m'
        case 'pending': return '\x1b[0;34m●\x1b[0m'
        case 'skipped': return '\x1b[0;30m●\x1b[0m'
        default: return '\x1b[0;34m●\x1b[0m'
    }
}

