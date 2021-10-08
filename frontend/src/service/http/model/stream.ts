import { MultiStream } from 'service/http/model/multistream';
import { Profile } from 'service/http/model/profile';

export interface Stream {
  lastSeen: number;
  isActive: boolean;
  record: boolean;
  suspended: boolean;
  sourceSegments: number;
  transcodedSegments: number;
  sourceSegmentsDuration: number;
  transcodedSegmentsDuration: number;
  sourceBytes: number;
  transcodedBytes: number;
  id: string;
  kind: string; // TODO enum
  name: string;
  region: string;
  userId: string;
  profiles: Profile[];
  createdAt: number;
  streamKey: string;
  ingestRate: number;
  playbackId: string;
  renditions: object;
  multistream: MultiStream;
  outgoingRate: number;
}
