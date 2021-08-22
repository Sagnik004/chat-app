const users = [];

/*************
  Add user
*************/
const addUser = ({ id, username, room }) => {
  // Clean up data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate input
  if (!username || !room) {
    return {
      error: 'Username and room are required!',
    };
  }

  // Same username in same room?
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Can't have more than 1, stop...
  if (existingUser) {
    return {
      error: 'Username is in use!',
    };
  }

  // All good, joining you to chat room...
  const user = { id, username, room };
  users.push(user);
  return {
    user,
  };
};

/*************
  Remove user
**************/
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

/***********
  Get user
************/
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

/*******************
  Get users in room
********************/
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
