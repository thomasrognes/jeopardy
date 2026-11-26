import React from "react";
import { CATEGORY_IDS } from "../../game/categories";
import { useBoard } from "../../hooks/boardHooks";

export function CategoryFields() {
  const { categoryNames, setCategoryName } = useBoard();

  return (
    <>
      {CATEGORY_IDS.map((categoryId, index) => {
        const value = categoryNames[categoryId] ?? categoryId;
        return (
          <input
            type="text"
            className="text-field"
            aria-label={`Kategori ${index + 1}`}
            placeholder={categoryId}
            autoComplete="off"
            value={value}
            onChange={(e) => setCategoryName(categoryId, e.target.value)}
            onFocus={(e) => e.target.select()}
            // Et tomt felt får tilbake standardnavnet.
            onBlur={() =>
              setCategoryName(categoryId, value.trim() || categoryId)
            }
            key={categoryId}
          />
        );
      })}
    </>
  );
}
