"use strict";
Object.defineProperty(exports,"__esModule",{value:!0});exports.logQueue=void 0;
let logUpdate;
async function getLogUpdate() {
	if (!logUpdate) {
		logUpdate = (await import("log-update")).default;
	}
	return logUpdate;
}
class LogQueueManager {
	constructor() {
		this.queue = [];
		this.processing = false;
		this.liveModeActive = false;
		this.liveTaskCount = 0;
		this.pendingPrints = [];
		this.lastLiveContent = "";
	}
	static getInstance() {
		LogQueueManager.instance || (LogQueueManager.instance = new LogQueueManager());
		return LogQueueManager.instance;
	}
	liveStart() {
		this.liveTaskCount++;
		this.liveModeActive = true;
	}
	liveUpdate(e) {
		this.queue.push({ type: "live-update", content: e });
		this.processQueue();
	}
	liveClear() {
		this.queue.push({ type: "live-clear" });
		this.processQueue();
	}
	liveDone(e) {
		this.queue.push({ type: "live-done", finalOutput: e });
		this.processQueue();
	}
	print(e) {
		this.queue.push({ type: "print", content: e });
		this.processQueue();
	}
	printAtomic(e) {
		this.queue.push({ type: "print-atomic", lines: e });
		this.processQueue();
	}
	isLiveModeActive() {
		return this.liveModeActive;
	}
	getLiveTaskCount() {
		return this.liveTaskCount;
	}
	async processQueue() {
		if (!this.processing) {
			this.processing = true;
			while (this.queue.length > 0) {
				const e = this.queue.shift();
				const log_update = await getLogUpdate();
				switch (e.type) {
					case "live-update":
						if (this.pendingPrints.length > 0 && this.liveModeActive) {
							log_update.clear();
							for (const p of this.pendingPrints) console.log(p);
							this.pendingPrints = [];
						}
						this.liveModeActive = true;
						this.lastLiveContent = e.content;
						log_update(e.content);
						break;
					case "live-clear":
						log_update.clear();
						this.lastLiveContent = "";
						break;
					case "live-done":
						this.liveTaskCount = Math.max(0, this.liveTaskCount - 1);
						if (this.liveTaskCount > 0) {
							if (e.finalOutput) {
								log_update.clear();
								console.log(e.finalOutput);
							}
						} else {
							if (e.finalOutput) {
								log_update.clear();
								console.log(e.finalOutput);
							} else log_update.done();
							this.liveModeActive = false;
							this.lastLiveContent = "";
							for (const p of this.pendingPrints) console.log(p);
							this.pendingPrints = [];
						}
						break;
					case "print":
						this.liveModeActive ? this.pendingPrints.push(e.content) : console.log(e.content);
						break;
					case "print-atomic":
						if (this.liveModeActive) {
							const t = this.lastLiveContent;
							log_update.clear();
							for (const p of this.pendingPrints) console.log(p);
							this.pendingPrints = [];
							console.log(e.lines.join("\n"));
							this.liveTaskCount > 0 && t && log_update(t);
						} else console.log(e.lines.join("\n"));
						break;
				}
			}
			this.processing = false;
		}
	}
	async flush() {
		const log_update = await getLogUpdate();
		if (this.liveModeActive) {
			log_update.done();
			this.liveModeActive = false;
			this.liveTaskCount = 0;
		}
		for (const p of this.pendingPrints) console.log(p);
		this.pendingPrints = [];
	}
}
exports.logQueue = LogQueueManager.getInstance();
exports.default = exports.logQueue;