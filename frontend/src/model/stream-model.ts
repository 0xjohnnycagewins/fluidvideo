import Moralis from 'moralis';

export class Stream extends Moralis.Object {
  public title: string = '';
  public streamId?: string;
  public streamerAddress?: string;
  public fees: number = 0;
  public viewersCount: number = 0;

  constructor() {
    super('Stream');
  }
}
