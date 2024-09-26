export const anonymize = () => {
  const anonymizedDate = new Date(0, 0, 0);
  const anonymizedString = 'Anonymized';
  return {
    avatarUrl: null,
    placeOfResidence: null,
    defaultBusinessId: null,
    birthDate: anonymizedDate,
    created: anonymizedDate,
    updated: anonymizedDate,
    email: anonymizedString,
    firstName: anonymizedString,
    lastName: anonymizedString,
    deleted: new Date(),
  };
};
