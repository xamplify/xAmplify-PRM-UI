import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReferenceService } from 'app/core/services/reference.service';

@Injectable()
export class VersionCheckService {
	frequencyInterVal = 1000 * 60;

	// this will be replaced by actual hash post-build.js
	private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

	constructor(private http: HttpClient, private referenceService: ReferenceService) { }


    /**
     * Checks in every set frequency the version of frontend application
     * @param url
     * @param {number} frequency - in milliseconds, defaults to 30 minutes
     */
	public initVersionCheck(url: string, frequency: number = this.frequencyInterVal) {
		console.log("Version File Path:-" + url);
		setInterval(() => {
			this.checkVersion(url);
		}, frequency);
	}

    /**
     * Will do the call and check if the hash has changed or not
     * @param url
     */
	private checkVersion(url: string) {
		// timestamp these requests to invalidate caches
		this.http.get(url + '?t=' + new Date().getTime())
			.first()
			.subscribe(
				(response: any) => {
					if (response != undefined) {
						const hash = response.hash;
						const hashChanged = this.hasHashChanged(this.currentHash, hash);
						// If new version, do something
						if (hashChanged) {
							let self = this;
							self.referenceService.showSweetAlertProcessingLoader('New Update Is Available');
							setTimeout(function () {
								location.reload();
							}, 5000);
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
