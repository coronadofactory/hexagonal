/*!
 * Controller
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Job instance
 * Date: 2026-02-14
 */

class Job {

    constructor(id, worker, payload) {
        this.id=id;
        this.worker=worker
        this.payload=payload;

        this.status=PENDING;
        this.status={};
    }
    
    getId() {
        return this.id;
    }

    getWorker() {
        return this.worker;
    }

    setStatus(status) {
        this.status=status;
    }

    getPayload() {
        return this.payload;
    }

    init(total) {
        this.progress=0;
        this.state = {total:total, current:0, progress:0};
    }

    next(idProcessed) {
        this.state.current++;
        this.state.progress=Math.round((this.state.current / this.state.total) * 100);
        this.state.idProcessed=idProcessed;
    }

    complete() {
        this.progress = 100;
        this.state.progress=this.progress;
        delete this.state.current;
        delete this.state.idProcessed;
    }

    getCurrent() {
        return this.state.current;
    }

    getTotal() {
        return this.state.total;
    }

    getProgress() {
        return this.state.progress;
    }

    getStatus() {
        return {
            id: this.id,
            status: this.status,
            state: this.state
        }
    }

    setError(err) {
        this.err=err;
    }

}

const PENDING = "pending";

module.exports = Job;