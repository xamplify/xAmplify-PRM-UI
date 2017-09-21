import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from 'angular2-logger/core';

@Injectable()
export class XtremandLogger {

	constructor(public router: Router, public logger: Logger) { }

	log(...logMessages) {
		for (const logMessage of logMessages) {
			this.logger.warn(logMessage);
		}
	}

	info(...infoMessages) {
		for (const infoMessage of infoMessages) {
			this.logger.info(infoMessage);
		}
	}

	warn(...warnMessages) {
		for (const warnMessage of warnMessages) {
			this.logger.warn(warnMessage);
		}
	}

	debug(...debugMessages) {
		for (const debugMessage of debugMessages) {
			this.logger.debug(debugMessage);
		}
	}

	error(...errorMessages) {
		for (const err of errorMessages) {
			this.logger.error(err);
		}
	}
	
	errorPage(error: any) {
		this.router.navigate(['/home/error/', error.status]);
		this.error(JSON.parse(error['_body']).message);
	}


}