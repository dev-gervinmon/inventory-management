"use client";

import { useMemo, useState } from "react";
import { useSearch } from "@/lib/hooks/useSearch";
import { usePagination } from "@/lib/hooks/usePagination";
import { useSort } from "@/lib/hooks/useSort";
import SortableHeader from "@/components/common/sortable-header";
import Pagination from "@/components/common/pagination";
import MessageBanner from "@/components/common/message-banner";
import DateGroupHeader from "@/components/common/date-group-header";
import { useMessage } from "@/lib/hooks/useMessage";
import ActivitySearch from "@/components/filters/activity-search";
import ActivityDetailModal from "@/components/modals/activity-detail-modal";
import { formatActivityDate, groupItemsByDate } from "@/lib/utils/activities";
import {
  DEFAULT_ACTIVITY_PAGINATION,
  ACTION_TYPE_MAP,
} from "@/lib/constants/activities";
import type { Activity } from "@/lib/types/activities";

interface ActivityTableProps {
  activities: Activity[];
  currentActionType?: string;
  currentEntityType?: string;
}

export default function ActivityTable({
  activities,
  currentActionType,
  currentEntityType,
}: ActivityTableProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { message } = useMessage({
    autoClose: true,
    timeout: 5000,
  });

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    // Small delay to let animation finish before clearing selected activity
    setTimeout(() => setSelectedActivity(null), 150);
  };

  // Search functionality
  const { filteredItems: searchedActivities, setSearch } = useSearch(
    activities,
    {
      searchableFields: ["entityName", "message"],
    }
  );

  // Apply additional filters (action type and entity type)
  const filteredActivities = useMemo(() => {
    let filtered = [...searchedActivities];

    // Filter by entity type (Product, Category, Subcategory)
    if (currentEntityType && currentEntityType !== "all") {
      filtered = filtered.filter(
        (activity) => activity.entityType === currentEntityType
      );
    }

    // Filter by action type
    if (currentActionType && currentActionType !== "all") {
      filtered = filtered.filter(
        (activity) => activity.actionType === currentActionType
      );
    }

    return filtered;
  }, [searchedActivities, currentActionType, currentEntityType]);

  // Sort functionality
  const { sortedItems, sortKey, sortDirection, toggleSort } = useSort({
    items: filteredActivities,
    initialSortKey: "createdAt",
    initialDirection: "desc",
  });

  // Pagination
  const {
    paginatedItems,
    currentPage,
    totalPages,
    setCurrentPage,
    startIndex,
    endIndex,
  } = usePagination(sortedItems, { itemsPerPage: DEFAULT_ACTIVITY_PAGINATION });

  // Group paginated items by date
  const groupedItems = useMemo(() => {
    return groupItemsByDate<Activity>(paginatedItems);
  }, [paginatedItems]);

  const isEmpty = activities.length === 0;
  const noResults = !isEmpty && paginatedItems.length === 0;
  const totalItems = sortedItems.length;

  return (
    <div className="space-y-4">
      {/* Message Banner */}
      {message && (
        <MessageBanner
          message={{
            text: message.text,
            type: message.type,
          }}
        />
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
        <ActivitySearch onSearchChange={setSearch} />
      </div>

      {/* Results Count */}
      {!isEmpty && (
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 px-1">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} {totalItems === 1 ? "activity" : "activities"}
          </span>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isEmpty ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Activities Yet
            </h3>
            <p className="text-sm text-gray-600">
              Activity history will appear here as you work with products.
            </p>
          </div>
        ) : noResults ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-sm text-gray-600">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {groupedItems.map((group) => (
              <div
                key={group.date}
                className="mb-0 overflow-hidden border-b border-gray-200 last:border-b-0"
              >
                <DateGroupHeader
                  label={group.date}
                  itemCount={group.items.length}
                />
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <SortableHeader
                        label="Action"
                        sortKey="actionType"
                        currentSortKey={sortKey}
                        sortDirection={sortDirection}
                        onSort={toggleSort}
                        className="px-4 py-3 text-left"
                      />
                      <SortableHeader
                        label="Entity"
                        sortKey="entityName"
                        currentSortKey={sortKey}
                        sortDirection={sortDirection}
                        onSort={toggleSort}
                        className="px-4 py-3 text-left"
                      />
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Message
                      </th>
                      <SortableHeader
                        label="Date"
                        sortKey="createdAt"
                        currentSortKey={sortKey}
                        sortDirection={sortDirection}
                        onSort={toggleSort}
                        className="px-4 py-3 text-left"
                      />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {group.items.map((item) => {
                      const activity = item as Activity;
                      const typeInfo = ACTION_TYPE_MAP[activity.actionType] || {
                        label: activity.actionType,
                        emoji: "📋",
                        color: "bg-gray-100 text-gray-700",
                      };
                      return (
                        <tr
                          key={activity.id}
                          className="hover:bg-blue-50 transition cursor-pointer"
                          onClick={() => handleActivityClick(activity)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleActivityClick(activity);
                            }
                          }}
                        >
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}
                            >
                              <span>{typeInfo.emoji}</span>
                              <span>{typeInfo.label}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900">
                              {activity.entityName}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">
                              {activity.message}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs text-gray-500"
                              title={new Date(
                                activity.createdAt
                              ).toLocaleString()}
                            >
                              {formatActivityDate(activity.createdAt)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Card View with Date Groups */}
      <div className="md:hidden space-y-2">
        {isEmpty ? (
          <div className="bg-white rounded-lg border border-gray-200 text-center py-12 px-4">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Activities Yet
            </h3>
            <p className="text-sm text-gray-600">
              Activity history will appear here as you work with products.
            </p>
          </div>
        ) : noResults ? (
          <div className="bg-white rounded-lg border border-gray-200 text-center py-12 px-4">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-sm text-gray-600">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          groupedItems.map((group) => (
            <div
              key={group.date}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <DateGroupHeader
                label={group.date}
                itemCount={group.items.length}
              />
              <div className="divide-y divide-gray-100">
                {group.items.map((item) => {
                  const activity = item as Activity;
                  const typeInfo = ACTION_TYPE_MAP[activity.actionType] || {
                    label: activity.actionType,
                    emoji: "📋",
                    color: "bg-gray-100 text-gray-700",
                  };
                  return (
                    <div
                      key={activity.id}
                      className="p-4 hover:bg-blue-50 transition cursor-pointer"
                      onClick={() => handleActivityClick(activity)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleActivityClick(activity);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}
                        >
                          <span>{typeInfo.emoji}</span>
                          <span>{typeInfo.label}</span>
                        </span>
                        <span
                          className="text-xs text-gray-500"
                          title={new Date(activity.createdAt).toLocaleString()}
                        >
                          {formatActivityDate(activity.createdAt)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.entityName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isEmpty && !noResults && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsStart={startIndex + 1}
          itemsEnd={Math.min(endIndex, totalItems)}
          totalItems={totalItems}
          entityName="activities"
        />
      )}

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
