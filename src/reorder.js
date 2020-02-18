import { set } from "set-fns";

const reorder = (
  list,
  startIndex,
  endIndex,
  unshiftedElementsPredicate = null,
  shiftedElementsPredicate = null
) => {
  if (
    startIndex < 0 ||
    startIndex >= list.length ||
    endIndex < 0 ||
    endIndex >= list.length
  ) {
    return list;
  }
  const singleElementReorderedList = Array.from(list);
  const [removed] = singleElementReorderedList.splice(startIndex, 1);
  singleElementReorderedList.splice(endIndex, 0, removed);

  if (!unshiftedElementsPredicate || !shiftedElementsPredicate) {
    return singleElementReorderedList;
  }

  const multipleElementReorderedList = singleElementReorderedList.filter(
    layer => unshiftedElementsPredicate(layer)
  );
  const elementsToShiftList = singleElementReorderedList.filter(layer =>
    shiftedElementsPredicate(layer)
  );

  // If filtered arrays have overlap, predicates are invalid.
  if (
    elementsToShiftList.filter(elem =>
      set(multipleElementReorderedList).has(elem)
    ).length > 0
  ) {
    return "invalid predicate(s)";
  }

  multipleElementReorderedList.splice(
    singleElementReorderedList.findIndex(layer => layer.id === removed.id) + 1,
    0,
    ...elementsToShiftList
  );

  return multipleElementReorderedList;
};

// Find index is removed.id
//

export default reorder;
