class ResponseSuccess {
  constructor(status, message, data = null) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success(message, data, status=200) {
    return new ResponseSuccess(status, message, data);
  }
}

module.exports = ResponseSuccess;
