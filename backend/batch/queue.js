/*!
 * Queue
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Mini Queue Manager
 * Date: 2026-02-14
 */

class Queue {

    constructor(workers) {

      this.workers=workers;

      this.queue = [];
      this.processing = false;
      this.emitter = new EventEmitter();

      this.setupListeners();
    }
  
    setupListeners() {
      
      this.emitter.on("jobUpdated", data => {
        console.log("📊 Job Update:", data);
      });
  
      this.emitter.on("jobLog", data => {
        console.log("📝 Log:", data.message);
      });

      this.emitter.on("appLog", data => {
        console.log("📝 Log App:", data.message);
      });

    }
  
    enqueue(worker, payload) {
      const job = new Job(Date.now(), worker, payload);
      this.queue.push(job);
      console.log("✅ Job enqueued:", job.getId());
      this._process();
      return job;
    }

    async _process() {
      if (this.processing) return;
      this.processing = true;
  
      while (this.queue.length > 0) {
        const job = this.queue.shift();
        await this._submit(job);
      }
  
      this.processing = false;
    }
  
    async _submit(job) {
      job.setStatus(SUBMITTED);
      const controller = new Controller(job, this.emitter);
  
      try {
        await this.workers[job.getWorker()](job, controller);
        job.complete();
      } catch (err) {
        job.setStatus(ERROR);
        job.setError(err);
      }

    }
    
  }

  const Job = require('./job');
  const Controller = require("./controller");
  const EventEmitter = require("events");

  const SUBMITTED = "submitted";
  const ERROR = "error";
  
  module.exports = Queue;