import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Logger } from 'angular2-logger/core';

@Injectable()
export class XtremandLogger {

	constructor(public router: Router, public logger: Logger) { }

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

	info(...infoMessages) {
		for (const infoMessage of infoMessages) {
			this.logger.info(infoMessage);
		}
	}
	error(...errorMessages) {
		for (const err of errorMessages) {
			this.logger.error(err);
		}
	}
	errorPage(error: any) {
		this.router.navigate(['/home/error-occured-page/', error.status]);
	}


}