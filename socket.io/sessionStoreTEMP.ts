// TODO: replace with Redis store

import { v4 as uuidv4 } from 'uuid';

interface Session {
  username: string,
  sessionID: string,
  lobbyID?: string,
}

const sessionStore: Session[] = [];

export function createSession(username: string) {
  const sessionID = uuidv4();
  const session = {
    username,
    sessionID,
  };
  sessionStore.push(session);
  return sessionID;
}

export function findSession(sessionID: string) {
  return sessionStore.find((session) => session.sessionID === sessionID);
}

export default {
  createSession,
  findSession,
};
