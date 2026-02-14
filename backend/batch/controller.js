/*!
 * Controller
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: Job controller adapter to NodeJS streams
 * Date: 2026-02-14
 */

class Controller {

  constructor(job, eventEmitter) {
    this.job = job;
    this.emitter = eventEmitter;
  }

  init(total) {
    this.job.init(total);
    this._setStatus(INITIALIZING);
    this._log(logProcessing(total));
  }

  transform(id, message) {
    this.job.next(id);
    this._setStatus(RUNNING);
    this._log(logRunning(this));
    if (message) this._appLog(`${message}`);
  }

  flush() {
    this._appLog("Flush");
  }

  final() {
    this._appLog("End");
  }

  _setStatus(status) {
    this.job.setStatus(status);
    this._emitUpdate();
  }

  _emitUpdate() {
    this.emitter.emit('jobUpdated', this.job.getStatus());
  }

  _log(message) {
    const entry = `[${new Date().toLocaleTimeString()}] ${message}`;
    this.emitter.emit('jobLog', { id: this.job.getId(), message: entry });
  }

  _appLog(message) {
    const entry = `[${new Date().toLocaleTimeString()}] ${message}`;
    this.emitter.emit('appLog', { id: this.job.getId(), message: entry });
  }

}

const INITIALIZING = "initializing";
const RUNNING = "running";

const logProcessing = (total) => `Iniciando procesamiento de ${total} registros`;
const logRunning = (THIS) => `Procesando registros ${THIS.job.getCurrent()} de ${THIS.job.getTotal()}. ${THIS.job.getProgress()}% del proceso`;

module.exports = Controller;