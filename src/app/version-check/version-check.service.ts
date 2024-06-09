import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReferenceService } from 'app/core/services/reference.service';
import { EnvService } from 'app/env.service';
@Injectable()
export class VersionCheckService {

	// this will be replaced by actual hash post-build.js
	private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

	constructor(public envService: EnvService,private http: HttpClient, public referenceService: ReferenceService) { }


    /**
     * Checks in every set frequency the version of frontend application
     * @param url
     * @param {number} frequency - in milliseconds, defaults to 30 minutes
     */
	public initVersionCheck(frequency: number = this.envService.reloadIntervalInMilliSeconds) {
		if(this.envService.CLIENT_URL.indexOf('http://localhost:4200/')>-1 || this.envService.CLIENT_URL.indexOf('https://xtremand.com/')>-1){
			setInterval(() => {
				this.checkVersion();
			}, frequency);
		}
		
	}

    /**
     * Will do the call and check if the hash has changed or not
     * @param url
     */
	private checkVersion() {
		let url = this.envService.versionFilePath;
		// timestamp these requests to invalidate caches
		this.http.get(url + '?t=' + new Date().getTime())
			.first()
			.subscribe(
				(response: any) => {
					console.log("Method Called On:-"+new Date());
					console.log(response);
					if (response != null &&response != undefined) {
						const hash = response.hash;
						if(this.currentHash!=hash){
							console.log("Post Build Hash:-"+this.currentHash);
						}
						const hashChanged = this.hasHashChanged(this.currentHash, hash);
						console.log("Hash Changed:-"+hashChanged);
						let reloadAfterDeployment = this.envService.reloadAfterDeployment;
						let logoutAndReloadAfterDeployment = this.envService.logoutAndReloadAfterDeployment;
						// If new version, do something
						if (hashChanged && reloadAfterDeployment ) {
							this.referenceService.newVersionDeployed = true;
						}else{
							this.referenceService.newVersionDeployed = false;
						}
						// store the new hash so we wouldn't trigger versionChange again
						// only necessary in case you did not force refresh
						this.currentHash = hash;
					}
				},
				(err) => {
					console.error(err, 'Could not get version');
				}
			);
	}

    /**
     * Checks if hash has changed.
     * This file has the JS hash, if it is a different one than in the version.json
     * we are dealing with version change
     * @param currentHash
     * @param newHash
     * @returns {boolean}
     */
	private hasHashChanged(currentHash: string, newHash: any): boolean {
		if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
			return false;
		}

		return currentHash !== newHash;
	}

}
