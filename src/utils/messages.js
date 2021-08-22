/**************************************************
  Internal Functions
***************************************************/

const generateCreatedAt = () => {
  return new Date().getTime();
};

/**************************************************
  Exported Functions
***************************************************/

const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: generateCreatedAt(),
  };
};

const generateLocationMessage = (username, locationURL) => {
  return {
    username,
    locationURL,
    createdAt: generateCreatedAt(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
