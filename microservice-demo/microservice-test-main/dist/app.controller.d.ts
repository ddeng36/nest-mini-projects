import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    private userClient;
    calc(str: any): Observable<TResult>;
}
