import { Stream } from 'model/stream-model';
import { Event } from 'model/event-model';
import Moralis from 'moralis';

export const bootstrapMoralis = () => {
  Moralis.Object.registerSubclass('Stream', Stream);
  Moralis.Object.registerSubclass('Event', Event);
};
