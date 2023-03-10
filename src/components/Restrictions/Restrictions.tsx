import React, { FC } from "react";

interface RestrictionsProps {
  zoneStatus: "SAFE" | "RISKY" | "DANGEROUS";
}

const Restrictions: FC<RestrictionsProps> = ({ zoneStatus }) => {
  let restrictions: { type: "RED" | "YELLOW"; message: string }[] = [];

  switch (zoneStatus) {
    case "SAFE":
      restrictions = [
        {
          type: "RED",
          message: "Yuz niqobini doim taqib yuring",
        },
        {
          type: "YELLOW",
          message: "Katta yig'ilishlarda qatnashishdan saqlaning",
        },
        {
          type: "YELLOW",
          message: "Ijtimoiy masofani saqlang",
        },
      ];
      break;
    case "RISKY":
      restrictions = [
        {
          type: "RED",
          message: "Yuz niqobini doim taqib yuring",
        },
        {
          type: "YELLOW",
          message: "Katta yig'ilishlarda qatnashishdan saqlaning",
        },
        {
          type: "YELLOW",
          message: "Ijtimoiy masofani saqlang",
        },
      ];
      break;
    case "DANGEROUS":
      restrictions = [
        {
          type: "RED",
          message: "Yuz niqobini doim taqib yuring",
        },
        {
          type: "RED",
          message: "Uyda qoling, soat 18:00 dan 10:00 gacha",
        },
        {
          type: "YELLOW",
          message: "Jamoat joylarida qo'lqop kiying",
        },
        {
          type: "YELLOW",
          message: "Katta yig'ilishlarda qatnashishdan saqlaning",
        },
        {
          type: "YELLOW",
          message: "Ijtimoiy masofani saqlang",
        },
      ];
      break;

    default:
      break;
  }

  return (
    <>
      <h3 className="mb-4 text-lg font-medium">Cheklovlar</h3>
      <ul>
        {restrictions.map((restriction) => {
          return (
            <li className="flex gap-2 my-4">
              {restriction.type === "RED" ? (
                <span className="w-6 h-6 flex justify-center items-center bg-[#EA5C73] rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.6}
                    stroke="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              ) : (
                <span className="w-6 h-6 flex justify-center items-center bg-[#FF7F42] rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </span>
              )}

              {restriction.message}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Restrictions;
