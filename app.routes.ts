import { Routes } from '@angular/router';
import { hmi } from './hmi/hmi';
import { Login } from './login/login';
import { Register } from './register/register';
import { LadingPage } from './lading-page/lading-page';
import { WaterQualityChart } from './components/water-quality-chart/water-quality-chart';
import { WaterQualityReport } from './components/water-quality-report/water-quality-report';


export const routes: Routes = [
    {path: 'hmi', component: hmi},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: '', component: LadingPage},
    {path: 'water', component: WaterQualityChart},
    {path: 'water2', component: WaterQualityReport},

];
