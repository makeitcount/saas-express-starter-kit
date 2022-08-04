/**
 * @file Service for jobs and queues
*/

"use strict";
exports.createWorker = createWorker;
exports.add = add;

// Library for queue/jobs system
// Source: https://github.com/OptimalBits/bull
// Reference: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md
const Queue = require("bull");

const WorkerJobs = require('./WorkerJobs');

// Redis configurations, it will be required by bull package as storage for queues
const REDIS_CONFIG = {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_PORT || 'localhost',
    password: process.env.REDIS_PORT || ""
}

const defaultJobOptions = {
    attempts: 1,
    removeOnComplete: 100,
    removeOnFail: 100,
    stackTraceLimit: 10,
    delay: 20000
}

const DEFAULT_JOB_CONCURRENCY = process.env.DEFAULT_JOB_CONCURRENCY || 1;

// List of processor fn for different queue workers
const Queue_Processor_Map = {
    "email": {
        'send.now': WorkerJobs.sendEmail
    }
}

// Stores active queues objects
var Active_Queues = {
    "email": null
};

init()

function init(){
    for(let q in Queue_Processor_Map){
        for(let job in Queue_Processor_Map[q]){
            createWorker(q, job)
        }
    }
}

/**
 * Creates a queue
 * @param {String} name of the queue
 */
function createQueue(name){
    if(name && Active_Queues[name]){
        return Active_Queues[name];
    }
    let q = new Queue(name || 'master_queue', {
            redis: REDIS_CONFIG
        })
    Active_Queues[name || 'master_queue'] = q;
    return q;
}
 
/**
 * Sets a processor function for a named job in a queue
 * @param {String} queueName 
 * @param {String} jobName 
 * @param {Function} workFn 
 */
function createWorker(queueName, jobName){
    let q = createQueue(queueName);
    q.process(jobName, DEFAULT_JOB_CONCURRENCY, async function(job, done) { 
        await Queue_Processor_Map[queueName][jobName](job.data);
        done();
    });    
    return q;
}

/**
 * Adds a new job to a queue.
 * @param {String} queueName 
 * @param {String} jobName 
 * @param {Objet} data 
 * @param {Object} jobOptions 
 */
function add(queueName, jobName, data, jobOptions){
    let q = createQueue(queueName);
    return q.add(jobName, data, jobOptions || defaultJobOptions)
}