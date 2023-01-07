import React, {
  FC,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { ZoneFeature } from "../../types/zone";

export const buildTree = (
  data: ZoneFeature[],
  tree?: Omit<ReactFolderTreeType, "children"> & {
    children: ReactFolderTreeType[] | string[];
  },
  path: number[] = []
): ReactFolderTreeType => {
  if (!tree) {
    const topParent = data.find(
      (d) => !d.properties.parentZoneId
    ) as ZoneFeature;

    const { id, displayName, childZoneIds } = topParent?.properties || {};
    tree = {
      name: displayName,
      id,
      children: childZoneIds,
      _path: [],
      isOpen: true,
    };
  }

  if (!tree?.children?.length) return { ...tree, children: [] };

  const formattedChildObj = tree.children.map((childId, i) => {
    path.length ? (path[path.length - 1] = i) : path.push(i);

    const childData = data.find((d) => d.properties.id === childId);

    if (!childData)
      return { id: "notfound", name: "child not found", _path: [] };

    const { id, displayName, childZoneIds } = childData?.properties;
    const childTreeObj = buildTree(
      data,
      { id: id, name: displayName, children: childZoneIds, _path: path },
      [...path, 0]
    );
    childTreeObj._path = [...path];
    return childTreeObj;
  });

  return { ...tree, children: formattedChildObj };
};

type ReactFolderTreeType = {
  id: string;
  name: string;
  checked?: boolean;
  isOpen?: boolean;
  children?: ReactFolderTreeType[];
  _path: number[];
};

interface TreeViewProps {
  data: ReactFolderTreeType;
  onSelect: (selectedZoneIds: string[]) => void;
}

const TreeView: FunctionComponent<TreeViewProps> = ({ data, onSelect }) => {
  const [tree, setTree] = useState(data);

  const findTargetNode = (root: ReactFolderTreeType, path: number[]) => {
    if (path && !path.length) return root;

    let currentNode = root;

    for (const idx of path) {
      if (currentNode.children?.length) {
        currentNode = currentNode.children[idx];
      }
    }
    return currentNode;
  };
  const uncheckAllChildren = (children: ReactFolderTreeType[]) => {
    let childrenNodeQueue = [...children];

    while (childrenNodeQueue.length) {
      const currentChildNode = childrenNodeQueue[0];
      currentChildNode.checked = false;

      if (currentChildNode.children?.length) {
        childrenNodeQueue.push(...currentChildNode.children);
      }

      childrenNodeQueue.shift();
    }
  };
  const uncheckAllDirectParents = (
    root: ReactFolderTreeType,
    path: number[]
  ) => {
    if (path && !path.length) return root;

    let currentNode = root;

    for (const idx of path) {
      currentNode.checked = false;

      if (currentNode.children?.length) {
        currentNode = currentNode.children[idx];
      }
    }
    return currentNode;
  };

  const handleSelect = (checkStatus: boolean, selectedTreePath: number[]) => {
    setTree((root) => {
      const currentNode = findTargetNode(root, selectedTreePath);
      if (!currentNode.checked) {
        uncheckAllDirectParents(root, selectedTreePath);
        currentNode.children && uncheckAllChildren(currentNode.children);
      }
      currentNode.checked = checkStatus;

      return { ...root };
    });
  };

  const handleFolderToggle = (treePath: number[]) => {
    setTree((root) => {
      const currentNode = findTargetNode(root, treePath);
      currentNode.isOpen = !currentNode.isOpen;
      return { ...root };
    });
  };

  useEffect(() => {
    const nodeQueue = [tree];
    const selectedNodes = [];
    while (nodeQueue.length) {
      const currentNode = nodeQueue[0];

      currentNode.checked && selectedNodes.push(currentNode.id);

      currentNode.children && nodeQueue.push(...currentNode.children);

      nodeQueue.shift();
    }

    onSelect(selectedNodes);
    return () => {};
  }, [tree]);

  return (
    <>
      <h1 className="text-xl font-medium mb-4">Select zones to embed</h1>
      <div className="ml-[26px]">
        <TreeNodes
          data={tree}
          handleSelect={handleSelect}
          handleFolderToggle={handleFolderToggle}
        />
      </div>
    </>
  );
};

interface TreeNodesProps {
  data: ReactFolderTreeType;
  handleSelect: (checkStatus: boolean, selectedTreePath: number[]) => void;
  handleFolderToggle: (selectedTreePath: number[]) => void;
}

const TreeNodes: FunctionComponent<TreeNodesProps> = ({
  data,
  handleSelect,
  handleFolderToggle,
}) => {
  return data.children?.length ? (
    <Folder
      data={data}
      handleSelect={handleSelect}
      handleFolderToggle={handleFolderToggle}
    >
      {data.children.map((child: any) => (
        <TreeNodes
          key={child.id}
          data={child}
          handleSelect={handleSelect}
          handleFolderToggle={handleFolderToggle}
        />
      ))}
    </Folder>
  ) : (
    <File data={data} handleSelect={handleSelect} />
  );
};

interface FolderProps {
  data: ReactFolderTreeType;
  handleSelect: (checkStatus: boolean, selectedTreePath: number[]) => void;
  handleFolderToggle: (selectedTreePath: number[]) => void;
}

const Folder: FC<PropsWithChildren<FolderProps>> = ({
  data,
  handleSelect,
  handleFolderToggle,
  children,
}) => {
  return (
    <>
      <div className="ml-[-26px] mb-2">
        <span
          onClick={() => handleFolderToggle(data._path)}
          className="cursor-pointer w-5 h-5 p-[2px] inline-flex mr-[6px] align-text-bottom"
        >
          {data.isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="#68696c"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="#68696c"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </span>
        <input
          id={`zone-checkbox-${data.id}`}
          type="checkbox"
          checked={data.checked}
          onChange={(e) => {
            handleSelect(e.target.checked, data._path);
          }}
          className="w-5 h-5 border-gray-600 border-2 text-blue-600 focus:ring-0 cursor-pointer align-text-bottom"
        />
        <label
          htmlFor={`zone-checkbox-${data.id}`}
          className="text-[17px] leading-5 text-gray-800 cursor-pointer ml-[6px]"
        >
          {data.name}
        </label>
      </div>
      <ul className="ml-5">{data.isOpen ? children : <></>}</ul>
    </>
  );
};

interface FileProps {
  data: ReactFolderTreeType;
  handleSelect: (checkStatus: boolean, selectedTreePath: number[]) => void;
}

const File: FC<FileProps> = ({ data, handleSelect }) => {
  return (
    <li className="gap-3 mb-2">
      <input
        id={`zone-checkbox-${data.id}`}
        type="checkbox"
        checked={data.checked}
        onChange={(e) => {
          handleSelect(e.target.checked, data._path);
        }}
        className="w-5 h-5 border-gray-600 border-2 text-blue-600 focus:ring-0 cursor-pointer align-text-bottom"
      />
      <label
        htmlFor={`zone-checkbox-${data.id}`}
        className="text-[17px] leading-5 text-gray-800 cursor-pointer ml-[6px]"
      >
        {data.name}
      </label>
    </li>
  );
};

export default TreeView;
