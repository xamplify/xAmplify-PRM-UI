import { ContactList } from '../models/contact-list';
import { Pagination } from '../../core/models/pagination';
export class UserListPaginationWrapper {
    userList: ContactList;
    pagination : Pagination;
}