import * as Colyseus from "colyseus.js";
import { Subject, Observable } from "rxjs";
import { AppError } from "./lib/AppError";
import { Session } from "./Persistence";
import { MatchMakeError } from "colyseus.js/lib/Client";
import { GameState } from "./common/Schema";

export class CAHRoom extends Colyseus.Room<GameState> {
  send(data: string) {
    super.send(data);
  }
}

class GameOrchestrator {
  constructor(private client: Colyseus.Client) {}

  public joinGame = async (
    session: Session,
    name: string
  ): Promise<Observable<CAHRoom> | AppError> => {
    const subj = new Subject<CAHRoom>();
    return (session.id
      ? this.client.reconnect(session.roomId, session.id)
      : this.client.joinById(session.roomId, { name })
    )
      .then((room) => {
        room.onStateChange(() => {
          subj.next(room as any);
        });
        return subj;
      })
      .catch((e) => {
        if (e instanceof MatchMakeError) {
          if (e.code === 4214) {
            return new AppError("SessionExpired");
          }
          if (e.code === 4212) {
            return new AppError("RoomNotFound");
          }
        }
        return new AppError("Unknown");
      });
  };

  public createGame = (name: string): Observable<CAHRoom> => {
    const subj = new Subject<CAHRoom>();
    this.client.create("cah", { name }).then((room) => {
      room.onStateChange(() => {
        subj.next(room as any);
      });
    });
    return subj;
  };
}
const colyseusClient = new Colyseus.Client("ws://localhost:3001");

export const orchestrator = new GameOrchestrator(colyseusClient);
