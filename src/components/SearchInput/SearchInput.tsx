import React, { FC, useState } from "react";
import { useAppStore } from "../../App";
import { ZoneFeature, ZoneFeatureCollection } from "../../types/zone";
import { getParentZonesString } from "../../utils/getParentZonesString";
import { getZoneStatusProps } from "../../utils/getZoneStatusProps";
import { useCombobox } from "downshift";

interface SearchInputProps {
  data: ZoneFeatureCollection;
}

const SearchInput: FC<SearchInputProps> = ({ data }) => {
  const setSelectedZoneId = useAppStore(
    (state: any) => state.setSelectedZoneId
  );

  function ComboBox() {
    const [items, setItems] = React.useState(data.features);
    const stateReducer = React.useCallback(
      (state: any, actionAndChanges: any) => {
        const { type, changes } = actionAndChanges;
        // returning an uppercased version of the item string.
        switch (type) {
          // case useCombobox.stateChangeTypes.FunctionSelectItem:
          //   return {
          //     // return normal changes.
          //     ...changes,
          //     // but taking the change from default reducer and uppercasing it.
          //     inputValue: "",
          //   };
          // also on selection.
          case useCombobox.stateChangeTypes.ItemClick:
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.InputBlur:
            return {
              ...changes,
              // if we had an item selected.
              ...(changes.selectedItem && {
                // we will show it uppercased.
                inputValue: "",
              }),
            };
          default:
            return changes; // otherwise business as usual.
        }
      },
      []
    );

    const {
      isOpen,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
      reset,
    } = useCombobox({
      onInputValueChange({ inputValue }) {
        setItems(() => {
          if (!inputValue) return data.features;
          return data.features.filter((zone) => {
            return zone.properties.alias.some((name) =>
              name?.toLowerCase().includes(inputValue?.toLowerCase())
            );
          });
        });
      },
      items,
      itemToString(item) {
        return item ? item.properties.displayName : "";
      },
      onSelectedItemChange: ({ selectedItem }) => {
        setSelectedZoneId(selectedItem?.properties.id);
      },
      stateReducer,
    });

    return (
      <div>
        <div className="relative">
          <input
            {...getInputProps({
              placeholder: "Search for the city...",
              onChange: reset,
            })}
            className="w-full h-12 rounded-full px-4 py-2 pl-12 bg-[#F5F7FD] border-none"
          ></input>
          <span className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </span>
        </div>
        {isOpen && (
          <ul
            {...getMenuProps()}
            className="w-ful max-h-[300px] mt-2 shadow-md py-6 rounded-3xl overflow-scroll"
          >
            <p className="text-xs font-medium uppercase text-[#B5B3C0] mb-3 px-6">
              Search Results
            </p>
            <div className="flex flex-col gap-4">
              {items.map((item, index) => (
                <li
                  className="flex gap-5 cursor-pointer px-6"
                  key={`${item.properties.id}${index}`}
                  style={{
                    backgroundColor:
                      highlightedIndex === index ? "#f5f7fd" : "unset",
                  }}
                  {...getItemProps({ item, index })}
                >
                  <div>
                    <div
                      className="h-2 w-2 rounded-full mt-2"
                      style={{
                        backgroundColor: getZoneStatusProps(
                          item.properties.status
                        ).textInWhiteBg,
                      }}
                    ></div>
                  </div>
                  <div>
                    <div className="font-medium text-base">
                      {item.properties.displayName}
                    </div>
                    <div className="text-[#A5A3B2]">
                      {getParentZonesString(item, data, [])}
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </ul>
        )}
      </div>
    );
  }
  return <ComboBox />;
};

export default SearchInput;
