export enum MdfAmountType {
	FUND_ADDED = 0,FUND_REMOVED
}

export namespace MdfAmountType {
	export function values() {

		return Object.keys(MdfAmountType).filter(
			(type) => isNaN(<any>type) && type !== 'values'
		  );
		  
	  
	}
  }	

