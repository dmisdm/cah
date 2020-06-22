import { Server, Room, Client } from "colyseus";
import http, { createServer } from "http";
import express from "express";
import {
  GameState,
  Player,
  JoinOptions,
  MessageType,
  CardSubmition,
  WhiteCard,
} from "../src/common/Schema";
import { ArraySchema } from "@colyseus/schema";

const port = Number(process.env.port) || 3001;

const app = express();
app.use(express.json());

const gameServer = new Server({
  server: createServer(app),
});

class CAHRoom extends Room<GameState> {
  onCreate(options: any) {
    this.setState(new GameState(this.roomId));
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  onAuth(client: Client, options: any, request: http.IncomingMessage) {
    return true;
  }

  // When client successfully join the room
  onJoin(client: Client, options: JoinOptions, auth: any) {
    this.state.addPlayer({ sessionId: client.sessionId, name: options.name });
  }

  // When a client sends a message
  onMessage(client: Client, message: MessageType) {
    switch (message[0]) {
      case "startGame":
        this.state.startGame();
        break;
      case "submitWhiteCards":
        this.state.submitCards(
          new CardSubmition(
            this.state.players[client.sessionId],
            new ArraySchema(
              ...message[1].map((card) => new WhiteCard(card.text))
            )
          )
        );
        break;
      case "decideWinner":
        this.state.decideWinner(this.state.submitions[message[1]]);
        break;
    }
  }

  // When a client leaves the room
  async onLeave(client: Client, consented: boolean) {
    this.state.players[client.sessionId].connected = false;

    try {
      if (consented) {
        this.state.removePlayer(client.sessionId);
        return;
      }

      await this.allowReconnection(client, 60);

      this.state.players[client.sessionId].connected = true;
    } catch (e) {
      this.state.removePlayer(client.sessionId);
    }
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {}
}

gameServer.define("cah", CAHRoom);

gameServer.listen(port);
