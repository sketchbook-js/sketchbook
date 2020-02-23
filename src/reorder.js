import { set } from "set-fns";

/*
  Reorder the elements in an array.

  Params:
    list: list of elements to reorder.
    reorderIndexes: either a Number or an Array of Numbers. These Numbers are the indexes of the elements we want to reorder in the list argument.
      If reorderIndexes is an array, the element in the list argument at index `reorderIndexes[0]` will be placed at index `endIndex` and the elements in the list argument represented by the rest of the indexes in reorderIndexes will be sorted in ascending order.
    endIndex: the index at which we want to put the element at index `reorderIndexes[0] || reorderIndexes` after having removed the element at index `reorderIndexes[0] || reorderIndexes` in the list argument.
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
