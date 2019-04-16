import { History } from '../models/History';
import { ApiBaseService } from './api-base.service';
import { Injectable } from '@angular/core';

@Injectable()

export class HistoryService extends ApiBaseService {

    public GetHistory(): History[] {
        let histories = new Array<History>();

        let history = new History();
        history.Year = 2018;
        history.Quarter = 1;
        history.BuildingSF = 48000;
        history.VacantSF = 12000;
        history.VacancyRate = 25;
        history.DirectAvailable = 17000;
        history.NetAbsoprtion = 0;
        history.OccupancyPercentage = 75;

        histories.push(history);


        history = new History();
        history.Year = 2017;
        history.Quarter = 4;
        history.BuildingSF = 48000;
        history.VacantSF = 12000;
        history.VacancyRate = 25;
        history.DirectAvailable = 12000;
        history.NetAbsoprtion = -12000;
        history.OccupancyPercentage = 75;

        histories.push(history);


        history = new History();
        history.Year = 2017;
        history.Quarter = 3;
        history.BuildingSF = 48000;
        history.VacantSF = 0;
        history.VacancyRate = 0;
        history.DirectAvailable = 0;
        history.NetAbsoprtion = 0;
        history.OccupancyPercentage = 100;

        histories.push(history);


        history = new History();
        history.Year = 2017;
        history.Quarter = 2;
        history.BuildingSF = 48000;
        history.VacantSF = 0;
        history.VacancyRate = 0
        history.DirectAvailable = 0;
        history.NetAbsoprtion = 0;
        history.OccupancyPercentage = 100;

        histories.push(history);


        history = new History();
        history.Year = 2017;
        history.Quarter = 1;
        history.BuildingSF = 48000;
        history.VacantSF = 0;
        history.VacancyRate = 0;
        history.DirectAvailable = 4000;
        history.NetAbsoprtion = 24000;
        history.OccupancyPercentage = 100;

        histories.push(history);



        history = new History();
        history.Year = 2016;
        history.Quarter = 4;
        history.BuildingSF = 48000;
        history.VacantSF = 24000;
        history.VacancyRate = 50;
        history.DirectAvailable = 24000;
        history.NetAbsoprtion = 0;
        history.OccupancyPercentage = 50;

        histories.push(history);



        return histories;
    }

}