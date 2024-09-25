export const getOneYearExpiryDate = () => {
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 1);
  return currentDate;
};
