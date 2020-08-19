export class MdfRequestStatusAndBalanceInfo {
    // Request Status
    createdDate: String;
    requestAmount: number;
    requestOwner: String;
    allocatedAmount: number;
    reimburseAmount: number;

    // Request Balances
    partnerOrganization: String;
    totalMdfAccountBalance: number;
    totalUsedBalance: number;
    totalAvailableBalance: number;
}