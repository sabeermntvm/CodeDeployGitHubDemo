import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AsyncSubject } from 'rxjs/AsyncSubject';

@Injectable()
export class CommunicationService {
  private _communication: Subject<CommunicationModel>;
  constructor() {
    this._communication = new Subject<CommunicationModel>();
  }

  public broadcast(communicationModel: CommunicationModel) {
    this._communication.next(communicationModel);
  }

  public subscribe(key: string): Subject<CommunicationModel> {
    let observable = new Subject<CommunicationModel>();
    this._communication.subscribe((value) => {
      if (value.Key == key) {
        observable.next(value);
      }
    });
    return observable;
  }
}

export class CommunicationModel {
  public Key: string;
  public data: any;
}