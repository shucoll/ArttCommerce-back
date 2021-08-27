export const areFriends = (user1, user2) => {
  if (
    user1.followings.includes(user2._id) &&
    user2.followings.includes(user1._id)
  )
    return true;

  return false;
};

export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
