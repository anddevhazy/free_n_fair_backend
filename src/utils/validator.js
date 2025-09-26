// election dataset schema must be validated

export const validateElectionSchema = (dataset) => {
  if (!Array.isArray(dataset)) return false;

  return dataset.every(
    (record) =>
      record.voterId &&
      typeof record.voterId === "string" &&
      record.candidate &&
      typeof record.candidate === "string" &&
      record.votes &&
      !isNaN(parseInt(record.votes, 10)) &&
      record.timestamp &&
      typeof record.timestamp === "string"
  );
};
