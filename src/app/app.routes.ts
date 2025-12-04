import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { AccountSettings } from './components/pages/account-settings/account-settings';
import { Profile } from './components/pages/profile/profile';
import { Signatures } from './components/pages/signatures/signatures';
import { MyStores } from './components/pages/my-stores/my-stores';
import { UpdatePassword } from './components/pages/update-password/update-password';
import { CreateStore } from './components/pages/create-store/create-store';
import { EditStore } from './components/pages/edit-store/edit-store';
import { MyProducts } from './components/pages/store/my-products/my-products';
import { EditProduct } from './components/pages/store/edit-product/edit-product';
import { CreateProduct } from './components/pages/store/create-product/create-product';
import { ProductPage } from './components/pages/product-page/product-page';
import { StorePage } from './components/pages/store-page/store-page';
import { StoresList } from './components/pages/stores-list/stores-list';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Home
    },
    {
        path: 'reset-password',
        component: Home
    },
    {
        path: 'stores',
        component: StoresList
    },
    {
        path: 'store',
        component: StorePage
    },
    {
        path: 'product',
        component: ProductPage
    },
    {
        path: 'account-settings',
        component: AccountSettings,
        children: [
            {
                path: 'profile',
                component: Profile
            },
            {
                path: 'signatures',
                component: Signatures
            },
            {
                path: 'my-stores',
                component: MyStores
            },
            {
                path: 'update-password',
                component: UpdatePassword
            },
            {
                path: 'create-store',
                component: CreateStore
            },
            {
                path: 'edit-store',
                component: EditStore
            },
            {
                path: 'products',
                component: MyProducts,
            },
            {
                path: 'edit-product',
                component: EditProduct
            },
            {
                path: 'create-product',
                component: CreateProduct
            }
        ]
    },
];
