// reorder(["a", "b", "c", "d"], 1, 3) -> ["a", "c", "d", "b"]
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default reorder;
