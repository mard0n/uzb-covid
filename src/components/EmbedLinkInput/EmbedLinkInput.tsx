import React, { FC, MouseEvent, useRef } from "react";

interface EmbedLinkInputProps {
  link: string;
}

const EmbedLinkInput: FC<EmbedLinkInputProps> = ({ link }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  let timer: ReturnType<typeof setTimeout>;

  const handleLinkCopy = (e: MouseEvent<HTMLButtonElement>) => {
    const copyInput = inputRef.current;
    copyInput?.select();
    copyInput?.setSelectionRange(0, 99999);

    copyInput?.value && navigator.clipboard.writeText(copyInput?.value);

    e.currentTarget.innerText = "Copied";
    clearTimeout(timer);
    timer = setTimeout(() => {
      (e.target as HTMLElement).innerText = "Copy";
    }, 3000);
  };
  return (
    <div className="relative">
      <input
        ref={inputRef}
        className="h-12 w-full rounded-full px-4 py-3 pr-[70px]"
        type="text"
        value={link}
        onChange={() => {}}
      />
      <div className="absolute right-4 top-0 h-full flex justify-center">
        <button onClick={handleLinkCopy}>Copy</button>
      </div>
    </div>
  );
};

export default EmbedLinkInput;
