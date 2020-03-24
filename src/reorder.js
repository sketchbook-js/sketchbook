/*
 * Reorder the elements of an array using their indices.
 * @param {Array<T>} list - An array of elements to be reorder.
 * @param {number|Array<number>} originalIndices - Index or indices of the
 * elements to be reordered. If multiple indices are provided then the order
 * they are specified in will be preserved in the resulting array.
 * @param {number} targetIndex - The index the reordered items should appear in
 * the resulting array.
 * @return {Array<T>} A new array with the items from the original array
 * reordered.
 * @example
 * reorder(["a", "b", "c", "d"], [2, 0], 1); // -> ["b", "c", "a", "d"]
 */

const reorder = (list, originalIndices, targetIndex) => {
  const originalIndicesAsArray = Array.isArray(originalIndices)
    ? originalIndices
    : [originalIndices];
  const itemsBeingMoved = originalIndicesAsArray.map(i => list[i]);
  const itemsNotMoving = list.filter(
    (_, i) => !originalIndicesAsArray.includes(i)
  );

  const reorderedList = itemsNotMoving;
  reorderedList.splice(targetIndex, 0, ...itemsBeingMoved);

  return reorderedList;
};

export default reorder;
