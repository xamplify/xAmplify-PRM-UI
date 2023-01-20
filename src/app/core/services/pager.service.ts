import * as _ from 'underscore';
import {Pagination} from '../models/pagination';

export class PagerService {
/***https://stackoverflow.com/questions/58969824/i-have-10-pages-i-am-on-4th-page-then-i-want-2-3-4-5-6-as-page-numbers*/

    getPager(totalItems: number, currentPage: number , pageSize: number) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number, endPage: number;
        if (totalPages <= 5) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
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
