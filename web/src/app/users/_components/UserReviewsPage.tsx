'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getValidImageUrl } from 'src/app/shop/_components/getValidImageUrl';
import { useInfiniteReviews } from 'src/hooks/review/useInfiniteReviews';
import { useUserReservationRanking } from 'src/hooks/reservation/useUserReservationRanking';
import { usePublicUserProfile } from 'src/hooks/user/usePublicUserProfile';

const formatDateToKST = (dateString: string) => {
  if (!dateString) return '날짜 정보 없음';

  return new Date(dateString).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
};

const getRankLabel = (rank: number) => {
  if (rank === 1) return 'BOX OFFICE NO.1';
  if (rank > 1 && rank <= 3) return 'TOP COLLECTOR';
  if (rank > 3 && rank <= 10) return 'STAGE REGULAR';
  return 'AUDIENCE MEMBER';
};

const UserReviewsPage = ({ userId }: { userId: string }) => {
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = usePublicUserProfile(userId);
  const { data: ranking, isLoading: isRankingLoading } = useUserReservationRanking(userId);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isReviewsLoading } =
    useInfiniteReviews(sortOption, userId);

  const reviews = data?.pages.flatMap((page) => page.reviews ?? []) ?? [];
  const reviewCount = data?.pages[0]?.totalCount ?? reviews.length;
  const displayName = profile?.nickname || reviews[0]?.display_name || '익명 관람객';
  const profileImage = getValidImageUrl(profile?.profile_img || '/default.png');
  const reservationCount = ranking?.reservation_count ?? 0;
  const rank = ranking?.rank ?? 0;
  const rankLabel = getRankLabel(rank);

  if (isProfileError) {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-20 text-white">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/5 px-6 py-16 text-center">
          <p className="text-2xl font-black">사용자 정보를 찾을 수 없어요</p>
          <p className="mt-3 text-sm text-white/60">
            이미 삭제된 계정이거나 접근할 수 없는 사용자입니다.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:border-[#C9A66B]/40 hover:text-white"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,166,107,0.20),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(94,129,244,0.16),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-12 lg:flex-row lg:items-stretch">
          <div className="flex-1 rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-[28px] border border-[#C9A66B]/35 bg-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.28)]">
                {isProfileLoading ? (
                  <div className="h-full w-full animate-pulse bg-white/10" />
                ) : (
                  <Image
                    src={profileImage}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[11px] tracking-[0.34em] text-white/45">PUBLIC USER ARCHIVE</p>
                <h1 className="mt-3 truncate text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {displayName}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
                  STAGE101에서 남긴 후기와 예매 활동을 모아보는 공개 아카이브입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:w-[420px] lg:grid-cols-1">
            <div className="rounded-[28px] border border-[#C9A66B]/25 bg-[linear-gradient(150deg,rgba(201,166,107,0.22),rgba(255,255,255,0.03))] px-5 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
              <p className="text-[11px] tracking-[0.28em] text-[#F3DEB8]/70">RESERVATION RANK</p>
              <p className="mt-3 text-3xl font-black text-[#F7DEAF]">
                {isRankingLoading ? '...' : rank > 0 ? `#${rank}` : 'UNRANKED'}
              </p>
              <p className="mt-2 text-xs font-semibold tracking-[0.22em] text-white/72">
                {rankLabel}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-5">
              <p className="text-[11px] tracking-[0.24em] text-white/45">REVIEWS</p>
              <p className="mt-3 text-3xl font-black text-white">{reviewCount}</p>
              <p className="mt-2 text-sm text-white/58">공개된 작성 리뷰</p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-5">
              <p className="text-[11px] tracking-[0.24em] text-white/45">TICKETS</p>
              <p className="mt-3 text-3xl font-black text-white">
                {isRankingLoading ? '...' : reservationCount}
              </p>
              <p className="mt-2 text-sm text-white/58">확정된 누적 예매</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-white/45">REVIEW TICKETS</p>
            <h2 className="mt-2 text-2xl font-bold text-white">남긴 리뷰</h2>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setSortOption('newest')}
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                sortOption === 'newest'
                  ? 'bg-[#C9A66B] text-black'
                  : 'text-white/70 hover:text-white',
              ].join(' ')}
            >
              최신순
            </button>
            <button
              onClick={() => setSortOption('oldest')}
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                sortOption === 'oldest'
                  ? 'bg-[#C9A66B] text-black'
                  : 'text-white/70 hover:text-white',
              ].join(' ')}
            >
              오래된순
            </button>
          </div>
        </div>

        {isReviewsLoading && (
          <ul className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <li
                key={`user-review-skeleton-${index}`}
                className="animate-pulse rounded-[30px] border border-white/10 bg-white/[0.05] p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-1/3 rounded bg-white/10" />
                    <div className="h-3 w-full rounded bg-white/10" />
                    <div className="h-3 w-2/3 rounded bg-white/10" />
                  </div>
                  <div className="h-[100px] w-[100px] rounded-xl bg-white/10" />
                </div>
                <div className="mt-3 flex gap-4">
                  <div className="h-3 w-20 rounded bg-white/10" />
                  <div className="h-3 w-16 rounded bg-white/10" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isReviewsLoading && reviews.length === 0 && (
          <div className="rounded-[32px] border border-dashed border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-6 py-16 text-center">
            <p className="text-xl font-bold text-white">아직 공개된 리뷰가 없어요</p>
            <p className="mt-3 text-sm leading-7 text-white/58">
              이 사용자가 리뷰를 남기기 시작하면 티켓처럼 차곡차곡 이곳에 쌓이게 됩니다.
            </p>
          </div>
        )}

        {!isReviewsLoading && reviews.length > 0 && (
          <ul className="grid gap-4">
            {reviews.map((review) => {
              const theaterName = review.theater?.name || '공연 제목';
              const reviewImgUrl = getValidImageUrl(review.image_url || '/default.png');

              return (
                <li
                  key={review.id}
                  className="relative overflow-hidden rounded-[30px] border border-black bg-white p-4 text-black shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 border-b border-black pb-1">
                        <div>
                          <h2 className="text-2xl font-black text-[#C9A66B]">STAGE_101</h2>
                          <h4 className="mt-1 text-lg font-black">{theaterName}</h4>
                        </div>
                        <div className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-black/60">
                          REVIEW TICKET
                        </div>
                      </div>

                      <p className="mt-3 min-h-[64px] break-words text-sm leading-6 text-gray-600">
                        {review.comment}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-700">
                        <p>작성일 {formatDateToKST(review.created_at)}</p>
                        <p>작성자 {displayName}</p>
                      </div>
                    </div>

                    <div className="hidden w-[112px] shrink-0 sm:block">
                      <div className="relative h-[112px] overflow-hidden rounded-2xl border border-black bg-white">
                        <Image
                          src={reviewImgUrl}
                          alt={theaterName}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {hasNextPage && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="rounded-full border border-[#C9A66B]/35 bg-[#C9A66B]/12 px-6 py-3 text-sm font-semibold text-[#F3DEB8] transition hover:bg-[#C9A66B]/18 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isFetchingNextPage ? '리뷰 불러오는 중...' : '리뷰 더 보기'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default UserReviewsPage;
