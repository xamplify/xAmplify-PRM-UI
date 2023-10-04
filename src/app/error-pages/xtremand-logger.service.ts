import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from './services/logger.service';

@Injectable()
export class XtremandLogger {

  errorMessage='';
	constructor(public router: Router, public logger: LoggerService) { }

	log(...logMessages) {
		for (const logMessage of logMessages) {
			this.logger.log(logMessage);
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
			this.logger.log(debugMessage);
		}
	}

	error(...errorMessages) {
		for (const err of errorMessages) {
			this.logger.error(err);
		}
	}

	errorPage(error: any) {
	  this.router.navigate(['/home/error/', error.status]);
	  if(error['_body']!=undefined){
		this.error(JSON.parse(error['_body']).message);
	  }
	}

	showClientErrors(componentName:string,methodName:string,error:any){
	    this.logger.error("Component:-"+componentName+":\nMethod:-"+methodName+",\n"+error);
	}


}
