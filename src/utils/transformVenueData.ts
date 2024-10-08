export const transformVenueData = (data) => {
  const newRows = {};
  let counter = 1;
  for (const key of Object.keys(data.groups)) {
    const group = data.groups[key];
    group.groupId = counter;
    newRows[counter] = group;
    counter++;
  }
  data.rows = newRows;
  delete data.groups;
  return data;
};
