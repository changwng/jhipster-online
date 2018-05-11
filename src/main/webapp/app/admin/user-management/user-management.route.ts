import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';

import { Principal, User, UserService } from 'app/core';
import { UserMgmtComponent } from './user-management.component';
import { UserMgmtDetailComponent } from './user-management-detail.component';
import { UserMgmtUpdateComponent } from './user-management-update.component';
import { UserDeleteDialogComponent } from './user-management-delete-dialog.component';

@Injectable()
export class UserResolve implements CanActivate {
    constructor(private principal: Principal) {}

    canActivate() {
        return this.principal.identity().then(account => this.principal.hasAnyAuthority(['ROLE_ADMIN']));
    }
}

@Injectable()
export class UserMgmtResolve implements Resolve<any> {
    constructor(private service: UserService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['login'] ? route.params['login'] : null;
        if (id) {
            return this.service.find(id);
        }
        return new User();
    }
}

export const userMgmtRoute: Routes = [
    {
        path: 'user-management',
        component: UserMgmtComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            pageTitle: 'Users',
            defaultSort: 'id,asc'
        }
    },
    {
        path: 'user-management/:login/view',
        component: UserMgmtDetailComponent,
        resolve: {
            user: UserMgmtResolve
        },
        data: {
            pageTitle: 'Users'
        }
    },
    {
        path: 'user-management/new',
        component: UserMgmtUpdateComponent,
        resolve: {
            user: UserMgmtResolve
        }
    },
    {
        path: 'user-management/:login/edit',
        component: UserMgmtUpdateComponent,
        resolve: {
            user: UserMgmtResolve
        }
    }
];

export const userDialogRoute: Routes = [
    {
        path: 'user-management/:login/delete',
        component: UserDeleteDialogComponent,
        resolve: {
            user: UserMgmtResolve
        },
        outlet: 'popup'
    }
];
