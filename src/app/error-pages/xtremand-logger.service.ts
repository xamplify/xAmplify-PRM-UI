import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Logger } from 'angular2-logger/core';

@Injectable()
export class XtremandLogger {

	constructor(public router: Router, public logger: Logger) { }

	warn(data: any) { this.logger.warn(data); }

	debug(data: any) {
		this.logger.debug(data);
	}

	info(info: string, data: any) {
		this.logger.info(info, data);
	}

	errorPage(error: any) {
		this.router.navigate(['/home/error-occured-page/', error.status]);
	}

	error(cause: string, methodName: string, componentName: string) {
		const message = 'Error In ' + methodName + '() ' + componentName;
		this.logger.error(message + ':', cause);
	}
}