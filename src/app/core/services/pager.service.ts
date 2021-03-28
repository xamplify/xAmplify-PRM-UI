import * as _ from 'underscore';
import {Pagination} from '../models/pagination';

export class PagerService {

    getPager(totalItems: number, currentPage: number , pageSize: number) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number, endPage: number;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        let startIndex = 0;
        let endIndex = pageSize - 1;

        // create an array of pages to ng-repeat in the pager control
        let pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }



    getPagedItems(pagination:Pagination,list:any[]){
        try{
            let pager = this.getPager(pagination.totalRecords, pagination.pageIndex, pagination.maxResults);
           let startIndex = pager.startIndex;
           let endIndex = pager.endIndex + 1;
           pagination.pagedItems = list.slice(startIndex, endIndex);
           pagination.pager = pager;
           return pagination;

        }catch(error){
           console.error(error);
        }
    }

    goToAnotherPage(pagination:Pagination,list:any[]){
        if (pagination.pageIndex < 1 || pagination.pageIndex > pagination.pager.totalPages) {
            return;
        }
    }


}
