const responses = {
    USER_RESPONSES: {
      COULD_NOT_FIND_USER: "Could not find user.",
      EMAIL_NOT_FOUND: "Email not found.",
      EMAIL_ALREADY_EXISTS: "Email is already registered.",
      USERNAME_ALREADY_EXISTS: "Username is already taken.",
      DUPLICATE_FACE_ID: "Duplicate face ID",
      EMAIL_NOT_VERIFIED: "Email not verified.",
      INCORRECT_CREDENTIALS: "Incorrect credentials.",
      PASSWORD_CHANGED_SUCCESS: "Password changed successfully.",
      FORGET_PASSWORD_EMAIL_SENT: "Forget password email sent.",
      USER_UPDATED: "User data has been updated.",
      COULD_NOT_UPDATE_USER: "Could not update user.",
      INCORRECT_OLD_PASSWORD: "Old password is incorrect.",
    },
    ENTITY_RESPONSES: {
      NOT_FOUND: "Could not find any record for this entity yet.",
      SUCCESS:"Data retrieved successfully"
    },
    ERROR_RESPONSES: {
      INVALID_REQUEST: "The request is invalid. Please check your input and try again.",
      TOKEN_NOT_PROVIDED: "Token not provided.",
      INVALID_TOKEN: "Invalid token."
    },
    
    genericResponse: (status, success, data = null, error = null, message = null) => {
      return {
        status: {
          code: status,
          success: success,
        },
        data: data,
        error: error,
        message: message,
      };
    },
  };
  
  module.exports = responses;
  