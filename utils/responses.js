const State = {
  SUCCESS: "SUCCESS",
  NOT_FOUND: "NOT_FOUND",
  FAILED: "FAILED",
  UNAUTHORIZED: "UNAUTHORIZED",
};

class Response {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

class NotesResponse extends Response {
  constructor(status, message, notes = []) {
    super(status, message);
    this.notes = notes;
  }

  static unauthorized(message) {
    return new NotesResponse(State.UNAUTHORIZED, message);
  }

  static success(notes) {
    return new NotesResponse(State.SUCCESS, "Task successful", notes);
  }
}

class NoteResponse extends Response {
  constructor(status, message, noteId = null) {
    super(status, message);
    this.noteId = noteId;
  }

  static unauthorized(message) {
    return new NoteResponse(State.UNAUTHORIZED, message);
  }

  static failed(message) {
    return new NoteResponse(State.FAILED, message);
  }

  static notFound(message) {
    return new NoteResponse(State.NOT_FOUND, message);
  }

  static success(id) {
    return new NoteResponse(State.SUCCESS, "Task successful", id);
  }
}

class AuthResponse extends Response {
  constructor(status, message, token = null) {
    super(status, message);
    this.token = token;
  }

  static failed(message) {
    return new AuthResponse(State.FAILED, message);
  }

  static unauthorized(message) {
    return new AuthResponse(State.UNAUTHORIZED, message);
  }

  static success(token, message) {
    return new AuthResponse(State.SUCCESS, message, token);
  }
}

module.exports = { State, NotesResponse, NoteResponse, AuthResponse };
