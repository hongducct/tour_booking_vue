<template>
  <LayoutAuthenticated>
    <SectionMain>
      <!-- Header Section -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <StarIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-200">Quản lý Đánh giá</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Quản lý và kiểm duyệt đánh giá từ khách hàng
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6">
            <button
              @click="activeTab = 'tour'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'tour'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              <div class="flex items-center gap-2 dark:text-gray-200">
                <MapIcon class="w-5 h-5" />
                Đánh giá Tour
                <span
                  v-if="tourStats.total > 0"
                  class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs dark:bg-gray-700 dark:text-gray-200"
                >
                  {{ tourStats.total }}
                </span>
              </div>
            </button>
            <button
              @click="activeTab = 'blog'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'blog'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              <div class="flex items-center gap-2 dark:text-gray-200">
                <DocumentTextIcon class="w-5 h-5" />
                Đánh giá Blog
                <span
                  v-if="blogStats.total > 0"
                  class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs dark:bg-gray-700 dark:text-gray-200"
                >
                  {{ blogStats.total }}
                </span>
              </div>
            </button>
          </nav>
        </div>

        <!-- Filters Section -->
        <div class="p-6">
          <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div class="flex flex-col sm:flex-row gap-4 flex-1">
              <div class="flex items-center gap-3">
                <AdjustmentsHorizontalIcon class="w-5 h-5 text-gray-500" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Hiển thị:</span>
                <select
                  v-model="perPage"
                  @change="fetchReviews"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div class="flex items-center gap-3">
                <FunnelIcon class="w-5 h-5 text-gray-500" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Trạng thái:</span
                >
                <select
                  v-model="statusFilter"
                  @change="fetchReviews"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <button
              @click="fetchReviews"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-gray-100"
            >
              <ArrowPathIcon class="w-4 h-4" />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews Content -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Người đánh giá
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {{ activeTab === 'tour' ? 'Tour' : 'Blog' }}
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Điểm
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Nội dung
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Ngày gửi
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="review in currentReviews"
                :key="review.id"
                @click="openReviewModal(review)"
                class="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td class="px-6 py-4 text-sm font-medium text-gray-900">#{{ review.id }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="review.user?.avatar || '/default-avatar.png'"
                      :alt="review.user?.username || 'N/A'"
                      class="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ review.user?.username || 'N/A' }}
                      </div>
                      <div class="text-xs text-gray-500">{{ review.user?.email || '' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 max-w-xs truncate">
                    {{ getReviewableName(review) }}
                  </div>
                  <div v-if="activeTab === 'tour'" class="text-xs text-gray-500">
                    {{ review.reviewable?.category || '' }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-1">
                    <StarIcon
                      v-for="n in 5"
                      :key="n"
                      :class="['w-4 h-4', n <= review.rating ? 'text-yellow-400' : 'text-gray-300']"
                      fill="currentColor"
                    />
                    <span class="ml-1 text-sm font-medium text-gray-600"
                      >({{ review.rating }})</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs">
                    <p class="line-clamp-2">{{ review.comment || 'Không có nội dung' }}</p>
                  </div>
                </td>
                <td class="px-6 py-4" @click.stop>
                  <div class="relative">
                    <button
                      :class="getStatusClass(review.status)"
                      @click="toggleDropdown(review.id)"
                      class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                    >
                      {{ getStatusText(review.status) }}
                      <ChevronDownIcon class="w-3 h-3" />
                    </button>
                    <div
                      v-if="activeDropdown === review.id"
                      class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
                    >
                      <button
                        @click="changeReviewStatus(review, 'approved')"
                        class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                      >
                        Approved
                      </button>
                      <button
                        @click="changeReviewStatus(review, 'pending')"
                        class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Pending
                      </button>
                      <button
                        @click="changeReviewStatus(review, 'rejected')"
                        class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ formatDate(review.created_at) }}
                </td>
                <td class="px-6 py-4" @click.stop>
                  <div class="flex items-center gap-2">
                    <button
                      @click="deleteReview(review.id)"
                      class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden space-y-4 p-4">
          <div
            v-for="review in currentReviews"
            :key="review.id"
            @click="openReviewModal(review)"
            class="bg-gray-50 rounded-lg p-4 space-y-3 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-600">#{{ review.id }}</span>
              <span class="text-xs text-gray-500">{{ formatDate(review.created_at) }}</span>
            </div>

            <div class="flex items-center gap-3">
              <img
                :src="review.user?.avatar || '/default-avatar.png'"
                :alt="review.user?.username || 'N/A'"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ review.user?.username || 'N/A' }}</div>
                <div class="text-sm text-gray-500 truncate">
                  {{ getReviewableName(review) }}
                </div>
                <div
                  v-if="activeTab === 'tour' && review.reviewable?.category"
                  class="text-xs text-gray-400"
                >
                  {{ review.reviewable.category }}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <StarIcon
                  v-for="n in 5"
                  :key="n"
                  :class="['w-4 h-4', n <= review.rating ? 'text-yellow-400' : 'text-gray-300']"
                  fill="currentColor"
                />
                <span class="ml-1 text-sm text-gray-600">({{ review.rating }})</span>
              </div>

              <div class="relative" @click.stop>
                <button
                  :class="getStatusClass(review.status)"
                  @click="toggleDropdown(review.id)"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getStatusText(review.status) }}
                  <ChevronDownIcon class="w-3 h-3" />
                </button>
                <div
                  v-if="activeDropdown === review.id"
                  class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
                >
                  <button
                    @click="changeReviewStatus(review, 'approved')"
                    class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                  >
                    Approved
                  </button>
                  <button
                    @click="changeReviewStatus(review, 'pending')"
                    class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Pending
                  </button>
                  <button
                    @click="changeReviewStatus(review, 'rejected')"
                    class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>

            <div v-if="review.comment" class="text-sm text-gray-700 bg-white p-3 rounded-lg">
              {{ review.comment }}
            </div>

            <div
              class="flex items-center justify-end gap-2 pt-2 border-t border-gray-200"
              @click.stop
            >
              <button
                @click="deleteReview(review.id)"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                <TrashIcon class="w-4 h-4" />
                Xóa
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="currentReviews.length === 0" class="text-center py-12">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <StarIcon class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Không có đánh giá {{ activeTab === 'tour' ? 'tour' : 'blog' }} nào
          </h3>
          <p class="text-gray-500">
            Chưa có đánh giá {{ activeTab === 'tour' ? 'tour' : 'blog' }} nào được tạo.
          </p>
        </div>

        <!-- Enhanced Pagination -->
        <div v-if="currentReviews.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700">
              Hiển thị <span class="font-medium">{{ currentPagination.from || 1 }}</span> đến
              <span class="font-medium">{{ currentPagination.to || currentReviews.length }}</span>
              trong
              <span class="font-medium">{{
                currentPagination.total || currentReviews.length
              }}</span>
              kết quả
            </div>

            <div class="flex items-center gap-3">
              <!-- First Page Button -->
              <button
                :disabled="currentPagination.current_page <= 1"
                @click="goToPage(1)"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang đầu"
              >
                <ChevronLeftIcon class="w-4 h-4" />
                <ChevronLeftIcon class="w-4 h-4 -ml-2" />
              </button>

              <!-- Previous Page Button -->
              <button
                :disabled="!currentPagination.prev_page_url"
                @click="goToPage(currentPagination.current_page - 1)"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon class="w-4 h-4" />
                Trước
              </button>

              <!-- Page Input -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-700">Trang</span>
                <input
                  v-model="pageInputValue"
                  @keyup.enter="goToInputPage"
                  @blur="goToInputPage"
                  type="number"
                  :min="1"
                  :max="currentPagination.last_page"
                  class="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :placeholder="currentPagination.current_page.toString()"
                />
                <span class="text-sm text-gray-700">/ {{ currentPagination.last_page }}</span>
              </div>

              <!-- Next Page Button -->
              <button
                :disabled="!currentPagination.next_page_url"
                @click="goToPage(currentPagination.current_page + 1)"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
                <ChevronRightIcon class="w-4 h-4" />
              </button>

              <!-- Last Page Button -->
              <button
                :disabled="currentPagination.current_page >= currentPagination.last_page"
                @click="goToPage(currentPagination.last_page)"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang cuối"
              >
                <ChevronRightIcon class="w-4 h-4" />
                <ChevronRightIcon class="w-4 h-4 -ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Review Detail Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closeModal"
      >
        <div
          class="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <StarIcon class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">
                  Chi tiết đánh giá #{{ selectedReview?.id }}
                </h2>
                <p class="text-sm text-gray-500">{{ formatDate(selectedReview?.created_at) }}</p>
              </div>
            </div>
            <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <XMarkIcon class="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 space-y-6">
            <!-- Review Content -->
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <StarIcon class="w-5 h-5 text-yellow-500" />
                Nội dung đánh giá
              </h3>

              <div class="space-y-4">
                <!-- Rating -->
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1">
                    <StarIcon
                      v-for="n in 5"
                      :key="n"
                      :class="[
                        'w-6 h-6',
                        n <= selectedReview?.rating ? 'text-yellow-400' : 'text-gray-300',
                      ]"
                      fill="currentColor"
                    />
                  </div>
                  <span class="text-2xl font-bold text-gray-900"
                    >{{ selectedReview?.rating }}/5</span
                  >
                </div>

                <!-- Title -->
                <div v-if="selectedReview?.title">
                  <span class="text-gray-500 text-sm">Tiêu đề:</span>
                  <div class="font-semibold text-lg text-gray-900">{{ selectedReview?.title }}</div>
                </div>

                <!-- Comment -->
                <div v-if="selectedReview?.comment">
                  <span class="text-gray-500 text-sm">Bình luận:</span>
                  <div class="mt-2 p-4 bg-white rounded-lg border text-gray-900 leading-relaxed">
                    {{ selectedReview?.comment }}
                  </div>
                </div>

                <!-- Status and Actions -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div class="flex items-center gap-3">
                    <span class="text-gray-500 text-sm">Trạng thái:</span>
                    <div class="relative">
                      <button
                        :class="getStatusClass(selectedReview?.status)"
                        @click="toggleModalDropdown"
                        class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors hover:shadow-md"
                      >
                        {{ getStatusText(selectedReview?.status) }}
                        <ChevronDownIcon class="w-4 h-4" />
                      </button>
                      <div
                        v-if="showModalDropdown"
                        class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]"
                      >
                        <button
                          @click="changeModalReviewStatus('approved')"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 first:rounded-t-lg transition-colors"
                          :class="{
                            'bg-green-50 text-green-700': selectedReview?.status === 'approved',
                          }"
                        >
                          <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                            Approved
                          </div>
                        </button>
                        <button
                          @click="changeModalReviewStatus('pending')"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                          :class="{
                            'bg-yellow-50 text-yellow-700': selectedReview?.status === 'pending',
                          }"
                        >
                          <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            Pending
                          </div>
                        </button>
                        <button
                          @click="changeModalReviewStatus('rejected')"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 last:rounded-b-lg transition-colors"
                          :class="{
                            'bg-red-50 text-red-700': selectedReview?.status === 'rejected',
                          }"
                        >
                          <div class="flex items-center gap-2">
                            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                            Rejected
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="selectedReview?.replied_at" class="text-sm text-gray-500">
                    Đã phản hồi: {{ formatDate(selectedReview?.replied_at) }}
                  </div>
                </div>

                <!-- Booking Info -->
                <div v-if="selectedReview?.booking_id" class="bg-blue-50 p-3 rounded-lg">
                  <span class="text-blue-700 text-sm font-medium">
                    Đánh giá từ booking #{{ selectedReview?.booking_id }}
                  </span>
                </div>
              </div>
            </div>
            <!-- Review Info -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- User Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon class="w-5 h-5 text-blue-600" />
                  Thông tin người đánh giá
                </h3>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <img
                      :src="selectedReview?.user?.avatar || '/default-avatar.png'"
                      :alt="selectedReview?.user?.username"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div class="font-medium text-gray-900">
                        {{ selectedReview?.user?.username || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ selectedReview?.user?.email || 'N/A' }}
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">Họ tên:</span>
                      <div class="font-medium">
                        {{ selectedReview?.user?.first_name }} {{ selectedReview?.user?.last_name }}
                      </div>
                    </div>
                    <div>
                      <span class="text-gray-500">Số điện thoại:</span>
                      <div class="font-medium">
                        {{ selectedReview?.user?.phone_number || 'N/A' }}
                      </div>
                    </div>
                    <div>
                      <span class="text-gray-500">Giới tính:</span>
                      <div class="font-medium">{{ selectedReview?.user?.gender || 'N/A' }}</div>
                    </div>
                    <div>
                      <span class="text-gray-500">Trạng thái:</span>
                      <span
                        :class="getUserStatusClass(selectedReview?.user?.user_status)"
                        class="inline-flex px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {{ selectedReview?.user?.user_status || 'N/A' }}
                      </span>
                    </div>
                  </div>
                  <div v-if="selectedReview?.user?.address">
                    <span class="text-gray-500 text-sm">Địa chỉ:</span>
                    <div class="font-medium text-sm">{{ selectedReview?.user?.address }}</div>
                  </div>
                </div>
              </div>

              <!-- Tour/Blog Information -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapIcon v-if="activeTab === 'tour'" class="w-5 h-5 text-green-600" />
                  <DocumentTextIcon v-else class="w-5 h-5 text-purple-600" />
                  Thông tin {{ activeTab === 'tour' ? 'Tour' : 'Blog' }}
                </h3>
                <div class="space-y-3">
                  <div>
                    <span class="text-gray-500 text-sm"
                      >Tên {{ activeTab === 'tour' ? 'tour' : 'blog' }}:</span
                    >
                    <div class="font-medium">{{ getReviewableName(selectedReview) }}</div>
                  </div>
                  <div v-if="activeTab === 'tour'">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span class="text-gray-500">Thể loại:</span>
                        <div class="font-medium">
                          {{ selectedReview?.reviewable?.category || 'N/A' }}
                        </div>
                      </div>
                      <div>
                        <span class="text-gray-500">Số ngày:</span>
                        <div class="font-medium">
                          {{ selectedReview?.reviewable?.days || 'N/A' }} ngày
                        </div>
                      </div>
                      <div>
                        <span class="text-gray-500">Số đêm:</span>
                        <div class="font-medium">
                          {{ selectedReview?.reviewable?.nights || 'N/A' }} đêm
                        </div>
                      </div>
                      <div>
                        <span class="text-gray-500">Loại:</span>
                        <div class="font-medium">
                          {{ selectedReview?.reviewable?.type || 'N/A' }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="selectedReview?.reviewable?.description">
                    <span class="text-gray-500 text-sm">Mô tả:</span>
                    <div
                      class="text-sm mt-1 p-3 bg-white rounded border max-h-32 overflow-y-auto"
                      v-html="selectedReview?.reviewable?.description"
                    ></div>
                  </div>
                  <div
                    v-if="
                      selectedReview?.reviewable?.features &&
                      selectedReview?.reviewable?.features.length > 0
                    "
                  >
                    <span class="text-gray-500 text-sm">Tính năng:</span>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span
                        v-for="feature in selectedReview?.reviewable?.features"
                        :key="feature.id"
                        class="inline-flex px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {{ feature.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              @click="closeModal"
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
            <button
              @click="(deleteReview(selectedReview?.id), closeModal())"
              class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Xóa đánh giá
            </button>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import axios from 'axios'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/admin/SectionMain.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {
  StarIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MapIcon,
  DocumentTextIcon,
  XMarkIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'

const notifySuccess = (message) => {
  toast(message, {
    theme: 'auto',
    type: 'success',
    position: 'top-center',
    dangerouslyHTMLString: true,
  })
}
const notifyError = (message) => {
  toast(message, {
    theme: 'auto',
    type: 'error',
    position: 'top-center',
    dangerouslyHTMLString: true,
  })
}

// Tab management
const activeTab = ref('tour')

// Modal management
const showModal = ref(false)
const selectedReview = ref(null)
const showModalDropdown = ref(false)

// Data storage
const tourReviews = ref([])
const blogReviews = ref([])
const tourPagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  from: null,
  to: null,
  total: null,
})
const blogPagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
  from: null,
  to: null,
  total: null,
})

// Stats for tabs
const tourStats = ref({ total: 0 })
const blogStats = ref({ total: 0 })

// Filters and controls
const statusFilter = ref('')
const perPage = ref(10)
const activeDropdown = ref(null)
const baseUrl = import.meta.env.VITE_API_BASE_URL

// Page input for pagination
const pageInputValue = ref('')

// Computed properties
const currentReviews = computed(() => {
  return activeTab.value === 'tour' ? tourReviews.value : blogReviews.value
})

const currentPagination = computed(() => {
  return activeTab.value === 'tour' ? tourPagination.value : blogPagination.value
})

// Watch for tab changes
watch(activeTab, () => {
  fetchReviews()
  pageInputValue.value = '' // Reset page input when switching tabs
})

// Modal functions
function openReviewModal(review) {
  selectedReview.value = review
  showModal.value = true
  showModalDropdown.value = false
  document.body.style.overflow = 'hidden' // Prevent background scrolling
}

function closeModal() {
  showModal.value = false
  selectedReview.value = null
  showModalDropdown.value = false
  document.body.style.overflow = 'auto' // Restore scrolling
}

function toggleModalDropdown() {
  showModalDropdown.value = !showModalDropdown.value
}

async function changeModalReviewStatus(newStatus) {
  if (!selectedReview.value) return

  try {
    const oldStatus = selectedReview.value.status
    selectedReview.value.status = newStatus
    showModalDropdown.value = false

    await axios.put(
      `${baseUrl}/reviews/${selectedReview.value.id}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      },
    )
    
        // Show success message
        const statusText = getStatusText(newStatus)
        notifySuccess(`Cập nhật trạng thái thành "${statusText}" thành công.`)

    // Update the review in the main list as well
    const reviewIndex = currentReviews.value.findIndex((r) => r.id === selectedReview.value.id)
    if (reviewIndex !== -1) {
      currentReviews.value[reviewIndex].status = newStatus
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    // Revert the status change
    fetchReviews(currentPagination.value.current_page)
    notifyError('Cập nhật trạng thái thất bại.')
  }
}

async function fetchReviews(page = 1) {
  try {
    const type = activeTab.value
    let url = `${baseUrl}/reviews?type=${type}&page=${page}&per_page=${perPage.value}`
    if (statusFilter.value) {
      url += `&status=${statusFilter.value}`
    }

    const response = await axios.get(url)

    const reviewsData = response.data.data
    const paginationData = {
      current_page: response.data.meta.current_page,
      last_page: response.data.meta.last_page,
      next_page_url: response.data.links.next,
      prev_page_url: response.data.links.prev,
      from: response.data.meta.from,
      to: response.data.meta.to,
      total: response.data.meta.total,
    }

    if (type === 'tour') {
      tourReviews.value = reviewsData
      tourPagination.value = paginationData
      tourStats.value.total = paginationData.total
    } else {
      blogReviews.value = reviewsData
      blogPagination.value = paginationData
      blogStats.value.total = paginationData.total
    }

    // Clear page input after successful fetch
    pageInputValue.value = ''
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error)
    notifyError('Lỗi khi tải danh sách đánh giá.')
  }
}

// Fetch both tour and blog stats on initial load
async function fetchStats() {
  try {
    // Fetch tour stats
    const tourResponse = await axios.get(`${baseUrl}/reviews?type=tour&per_page=1`)
    tourStats.value.total = tourResponse.data.meta.total

    // Fetch blog stats
    const blogResponse = await axios.get(`${baseUrl}/reviews?type=blog&per_page=1`)
    blogStats.value.total = blogResponse.data.meta.total
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error)
  }
}

function getReviewableName(review) {
  if (activeTab.value === 'tour') {
    return review.reviewable?.name || 'N/A'
  } else {
    // For blog reviews, we might need to show title or description preview
    return review.title || review.reviewable?.name || 'N/A'
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function toggleDropdown(reviewId) {
  activeDropdown.value = activeDropdown.value === reviewId ? null : reviewId
}

function getStatusClass(status) {
  const classes = {
    approved: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  }
  return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

function getUserStatusClass(status) {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    banned: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusText(status) {
  const texts = {
    approved: 'Đã duyệt',
    pending: 'Chờ duyệt',
    rejected: 'Từ chối',
  }
  return texts[status] || status
}

async function changeReviewStatus(review, newStatus) {
  try {
    const oldStatus = review.status
    review.status = newStatus
    activeDropdown.value = null

    await axios.put(
      `${baseUrl}/reviews/${review.id}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      },
    )

    // Show success message
    const statusText = getStatusText(newStatus)
    notifySuccess(`Cập nhật trạng thái thành "${statusText}" thành công.`)
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error)
    // Revert the status change
    fetchReviews(currentPagination.value.current_page)
    notifyError('Cập nhật trạng thái thất bại.')
  }
}

async function deleteReview(reviewId) {
  if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.'))
    return

  try {
    await axios.delete(`${baseUrl}/reviews/${reviewId}`)

    // Remove from current reviews array
    if (activeTab.value === 'tour') {
      tourReviews.value = tourReviews.value.filter((review) => review.id !== reviewId)
    } else {
      blogReviews.value = blogReviews.value.filter((review) => review.id !== reviewId)
    }

    notifySuccess('Xóa đánh giá thành công.')

    // If current page is empty and not the first page, go to previous page
    if (currentReviews.value.length === 0 && currentPagination.value.current_page > 1) {
      goToPage(currentPagination.value.current_page - 1)
    }

    // Update stats
    fetchStats()
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error)
    notifyError('Xóa đánh giá thất bại.')
  }
}

function goToPage(page) {
  if (page >= 1 && page <= currentPagination.value.last_page) {
    fetchReviews(page)
  }
}

function goToInputPage() {
  const page = parseInt(pageInputValue.value, 10)
  if (isNaN(page) || page < 1 || page > currentPagination.value.last_page) {
    notifyError(`Vui lòng nhập số trang hợp lệ từ 1 đến ${currentPagination.value.last_page}.`)
    return
  }
  fetchReviews(page)
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.relative')) {
    activeDropdown.value = null
    showModalDropdown.value = false
  }
}

// Close modal on Escape key
function handleKeyDown(event) {
  if (event.key === 'Escape' && showModal.value) {
    closeModal()
  }
}

onMounted(() => {
  fetchStats()
  fetchReviews()
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

// Cleanup event listeners
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = 'auto' // Ensure scrolling is restored
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.fixed.inset-0.bg-black.bg-opacity-50.z-50 {
  backdrop-filter: blur(7px);
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
