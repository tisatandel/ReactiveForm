import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path:'form',
        loadComponent:() => import('./form/form').then(m => m.Form)
    
    },
    {
        path:'home',
        component:Home
    },
    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'

    }
];
