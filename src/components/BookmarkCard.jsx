import { useEffect, useState, useContext } from "react";

import Badge from "./Badge";
import Avatar from "./Avatar";
import IconButton from "./IconButton";

import { HeartIcon, DeleteIcon, HeartFilledIcon } from "./Icons";

import { AuthStateContext } from "./Dashboard";

import { fetchLinkPreview } from "../utils/fetchLinkPreview";
import { deleteFromBookmarks } from "../utils/deleteFromBookmarks";
import { addToFavorites } from "../utils/addToFavorites";
import { deleteFromFavorites } from "../utils/deleteFromFavorites";

const badges = {
  react: { color: "#026AA2", backgroundColor: "#F0F9FF" },
  css: { color: "#027A48", backgroundColor: "#ECFDF3" },
  javascript: { color: "#B54708", backgroundColor: "#FFFAEB" },
};

function BookmarkCard({ bookmark }) {
  const [linkPreview, setLinkPreview] = useState(null);
  const [isDeletingFromBookmarks, setIsDeletingFromBookmarks] = useState(false);
  const [isUpdatingFavorites, setIsUpdatingFavorites] = useState(false);

  const { authState } = useContext(AuthStateContext);

  useEffect(() => {
    fetchLinkPreview(bookmark, setLinkPreview);
  }, [bookmark]);

  return (
    <div className="bookmark-card flex rounded-2xl p-6 hover:bg-gray-25">
      <div className="mr-6 h-auto w-[10.5rem] min-w-[10.5rem]">
        <a href={bookmark.url} target="_blank" rel="noreferrer">
          <img
            className="h-full w-full rounded-lg object-cover"
            src={linkPreview === null ? "src/assets/bookmark.svg" : linkPreview}
            alt={bookmark.title}
          />
        </a>
      </div>
      <div className="flex w-full flex-col">
        <div className="mb-4 flex items-center">
          <Badge
            text={bookmark.tag}
            color={badges[bookmark.tag].color}
            backgroundColor={badges[bookmark.tag].backgroundColor}
          />
        </div>
        <a href={bookmark.url} target="_blank" rel="noreferrer">
          <span className="mb-2 text-dxs font-semibold text-gray-900">
            {bookmark.title}
          </span>
        </a>
        <span className="mb-6 text-tmd font-regular text-gray-600">
          {bookmark.description}
        </span>
        <div className="flex items-center justify-between">
          <Avatar size={2.5} value={bookmark.userDisplayName} radius={1.25} />
          {authState.isLoggedIn && authState.activeUser && (
            <div className="grid grid-cols-[auto_auto] gap-x-3">
              <IconButton
                Icon={DeleteIcon}
                onClick={async (e) => {
                  await deleteFromBookmarks(
                    e,
                    setIsDeletingFromBookmarks,
                    bookmark,
                    authState
                  );
                }}
                isLoading={isDeletingFromBookmarks}
              />
              {bookmark.likes &&
              bookmark.likes[authState.activeUser.uid] === true ? (
                <IconButton
                  Icon={HeartFilledIcon}
                  onClick={async (e) => {
                    await deleteFromFavorites(
                      e,
                      setIsUpdatingFavorites,
                      authState,
                      bookmark
                    );
                  }}
                  isLoading={isUpdatingFavorites}
                />
              ) : (
                <IconButton
                  Icon={HeartIcon}
                  onClick={async (e) => {
                    await addToFavorites(
                      e,
                      setIsUpdatingFavorites,
                      authState,
                      bookmark
                    );
                  }}
                  isLoading={isUpdatingFavorites}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookmarkCard;
