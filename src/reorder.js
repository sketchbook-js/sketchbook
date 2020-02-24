import { set } from "set-fns";

/*
  Reorder the elements in an array.

  Params:
    list: list of elements to reorder.
    reorderIndexes: either a Number or an Array of Numbers. These Numbers are the indexes of the elements we want to reorder in the list argument.
      If reorderIndexes is a Number, reorder(["a", "b", "c", "d"], 1, 3) -> ["a", "c", "d", "b"]
      If reorderIndexes is an Array, the element at index reorderIndexes[0] will be reordered as above. The elements in `list` at the indexes in the rest of the array will be sorted by their natural index and placed to the right of the new position of the element at index `endIndex`
    endIndex: the index in `list` at which we want to put the element at index `reorderIndexes[0] || reorderIndexes` after having removed the element at index `reorderIndexes[0] || reorderIndexes` in `list`.
*/
const reorder = (list, reorderIndexes, endIndex) => {
  const leadIndex = Array.isArray(reorderIndexes)
    ? reorderIndexes[0]
    : reorderIndexes;
  if (
    leadIndex < 0 ||
    leadIndex >= list.length ||
    endIndex < 0 ||
    endIndex >= list.length
  ) {
    return list;
  }
  const singleElementReorderedList = Array.from(list);
  const [removed] = singleElementReorderedList.splice(leadIndex, 1);
  singleElementReorderedList.splice(endIndex, 0, removed);

  if (!Array.isArray(reorderIndexes)) {
    return singleElementReorderedList;
  }

  // Remove leadIndex and its duplicates before adjusting the indexes as doing so afterward will delete values that were adjusted to become the leadIndex. Other duplicates will be removed when when a set is created from this array.
  const filteredReorderIndexes = reorderIndexes.filter(
    elemIndex => elemIndex !== leadIndex
  );

  // Due to the single element reorder, the indexes may not point to the correct elements anymore. This is fixed here.
  const adjustedReorderIndexes = filteredReorderIndexes.map(elemIndex =>
    elemIndex < leadIndex && elemIndex >= endIndex
      ? elemIndex + 1
      : elemIndex > leadIndex && elemIndex <= endIndex
      ? elemIndex - 1
      : elemIndex
  );

  const adjustedReorderIndexesSet = set(adjustedReorderIndexes);

  const multipleElementReorderedList = singleElementReorderedList.filter(
    (_, i) => !adjustedReorderIndexesSet.has(i)
  );
  const elementsToShiftList = singleElementReorderedList.filter((_, i) =>
    adjustedReorderIndexesSet.has(i)
  );

  multipleElementReorderedList.splice(
    multipleElementReorderedList.findIndex(elem => elem === removed) + 1,
    0,
    ...elementsToShiftList
  );

  return multipleElementReorderedList;
};

export default reorder;
