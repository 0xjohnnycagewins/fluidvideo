import Moralis from 'moralis';

export enum EventType {
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
  TIP = 'TIP',
  NONE = 'NONE',
}

export class Event extends Moralis.Object {
  public type: EventType = EventType.NONE;
  public from?: string;
  public to?: string;
  public amount?: number;

  constructor() {
    super('Event');
  }
}
