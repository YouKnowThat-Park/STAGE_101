'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTheaterReviewPreview } from 'src/hooks/review/useTheaterReviewPreview';
import { useUserStore } from 'src/store/userStore';
import { TheaterDetailResponse } from 'src/types/theater/theater-type';
import LoginModal from 'src/ui/modal/LoginModal';

export interface Props {
  theaterId: string;
  data: TheaterDetailResponse;
}

const TheaterDetail = ({ theaterId, data }: Props) => {
  const { name, description, main_img, show_time, total_time, price, type } = data;

  const router = useRouter();
  const { id } = useUserStore();
  const [showModal, setShowModal] = useState(false);
  const { data: previewReviews = [], isLoading: isReviewLoading } = useTheaterReviewPreview(
    theaterId,
    2,
  );

  const lowerType = String(type).toLowerCase();

  const label = lowerType.includes('musical')
    ? 'MUSICAL'
    : lowerType.includes('concert')
      ? 'CONCERT'
      : 'CINEMA';

  const handleReservationGo = async () => {
    if (!id) {
      setShowModal(true);
      return;
    }

    sessionStorage.setItem('allowPaymentsAccess', 'true');
    await new Promise((resolve) => setTimeout(resolve, 30));
    router.push(`/payments/${theaterId}`);
  };

  const formatReviewDate = (dateString: string) => {
    if (!dateString) return '날짜 정보 없음';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,200,80,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(80,160,255,0.12),_transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-black" />

        <div className="relative mx-auto w-full max-w-6xl px-5 py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            <div className="rounded-2xl bg-white/5 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
              <Image
                src={main_img}
                alt={name}
                width={600}
                height={900}
                className="mx-auto h-auto w-full max-w-[360px] rounded-xl object-cover"
                priority
              />
            </div>

            <div className="flex h-full flex-col rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={[
                    'rounded-full px-3 py-1 text-xs font-semibold ring-1',
                    lowerType
                      ? 'bg-yellow-500/15 text-yellow-200 ring-yellow-500/30'
                      : 'bg-sky-500/15 text-sky-200 ring-sky-500/30',
                  ].join(' ')}
                >
                  {label}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/15">
                  STAGE_101 ORIGINAL
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/15">
                  {type}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{name}</h1>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
                  <p className="text-xs text-white/60">상영 시간</p>
                  <p className="mt-1 text-lg font-semibold">
                    {show_time} <span className="text-white/60">/ {total_time}분</span>
                  </p>
                </div>
                <div className="rounded-xl bg-black/30 p-4 ring-1 ring-white/10">
                  <p className="text-xs text-white/60">가격</p>
                  <p className="mt-1 text-lg font-extrabold text-yellow-300">
                    {Number(price).toLocaleString()}원
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-white/75 sm:text-base">
                {description.length > 150 ? `${description.slice(0, 150)}...` : description}
              </p>

              <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleReservationGo}
                  className="w-full rounded-xl bg-yellow-500 px-6 py-3 font-extrabold text-black shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-400 sm:w-auto"
                >
                  예매하기
                </button>
                <div className="text-xs text-white/55">
                  * 포트폴리오용 테스트 결제입니다. 실제 결제나 예매는 진행되지 않습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-14">
        <section className="relative mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,166,107,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(120,180,255,0.08),transparent_35%)]" />

          <div className="relative">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-white/45">SHOW OVERVIEW</p>
              <h2 className="mt-2 text-2xl font-bold text-white">작품 소개</h2>
            </div>

            <div className="mt-5 rounded-2xl bg-black/25 p-5 ring-1 ring-white/10 backdrop-blur-sm">
              <p className="line-clamp-6 text-sm leading-7 text-white/78 sm:text-[15px]">
                {description}
              </p>
              <div className="mt-4 flex justify-end">
                <button className="text-sm font-semibold text-yellow-200/90">더 보기</button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-white/45">AUDIENCE NOTES</p>
              <h2 className="mt-1 text-xl font-bold text-white">리뷰 미리보기</h2>
            </div>
            <p className="text-sm text-white/55">최근 등록된 관람 후기를 먼저 만나보세요.</p>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {isReviewLoading &&
              Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`preview-skeleton-${index}`}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 animate-pulse"
                >
                  <div className="h-4 w-24 rounded bg-white/10" />
                  <div className="mt-4 h-3 w-full rounded bg-white/10" />
                  <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
                  <div className="mt-6 h-3 w-32 rounded bg-white/10" />
                </div>
              ))}

            {!isReviewLoading &&
              previewReviews.map((review) => (
                <article
                  key={review.id}
                  className="group rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4 transition hover:border-yellow-400/30 hover:bg-white/[0.07]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-[11px] font-semibold text-yellow-200 ring-1 ring-yellow-500/25">
                      REVIEW
                    </span>
                    <span className="text-xs text-white/45">
                      {formatReviewDate(review.created_at)}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/80 sm:text-[15px]">
                    {review.comment}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {review.display_name || '익명 관람객'}
                      </p>
                      <p className="text-xs text-white/45">{name} 관람 후기</p>
                    </div>

                    {review.image_url ? (
                      <Image
                        src={review.image_url}
                        alt="리뷰 이미지"
                        width={52}
                        height={52}
                        className="h-[52px] w-[52px] rounded-xl object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-white/5 text-[10px] font-semibold tracking-[0.2em] text-white/35 ring-1 ring-white/10">
                        STAGE
                      </div>
                    )}
                  </div>
                </article>
              ))}

            {!isReviewLoading && previewReviews.length === 0 && (
              <div className="lg:col-span-2 rounded-2xl border border-dashed border-white/15 bg-black/20 px-5 py-8 text-center">
                <p className="text-base font-semibold text-white">아직 등록된 리뷰가 없어요.</p>
                <p className="mt-2 text-sm text-white/55">
                  첫 관람 후기를 남기면 이 공연의 분위기를 가장 먼저 전할 수 있어요.
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="text-sm font-semibold text-yellow-200/90">더 보기</button>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-white/45">VISITOR GUIDE</p>
              <h2 className="mt-1 text-2xl font-bold text-white">관람 전 체크 포인트</h2>
            </div>
            <p className="text-sm text-white/50">현장 관람 전에 알아두면 좋은 안내를 정리했어요.</p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-3">
              <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
                <p className="text-sm font-semibold text-white">입장 시간</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  공연 시작 이후에는 입장이 제한되거나 지정된 타이밍에만 입장할 수 있어요.
                </p>
              </div>
              <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
                <p className="text-sm font-semibold text-white">촬영 및 기록</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  공연 중 사진 촬영, 녹음, 영상 촬영은 금지되며 현장 안내에 따라 제재될 수 있어요.
                </p>
              </div>
              <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
                <p className="text-sm font-semibold text-white">변경 및 취소</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  취소와 환불 규정은 기획사 정책 및 공연 운영 상황에 따라 달라질 수 있습니다.
                </p>
              </div>
              <div className="rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
                <p className="text-sm font-semibold text-white">운영 변동</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  모든 공연은 주최 측 사정에 따라 세부 일정이나 진행 방식이 변경될 수 있습니다.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-[radial-gradient(circle_at_top,rgba(201,166,107,0.16),transparent_45%),rgba(0,0,0,0.28)] p-5">
              <div className="inline-flex rounded-full bg-yellow-500/12 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-yellow-100 ring-1 ring-yellow-500/20">
                IMPORTANT
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">테스트용 예매 페이지 안내</h3>
              <p className="mt-3 text-sm leading-7 text-white/72">
                현재 페이지는 실제 상용 예매 화면이 아니라 STAGE_101 프로젝트용 데모 콘텐츠입니다.
              </p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                예매와 결제 흐름은 UI 테스트를 위한 체험용 시나리오이며, 실제 결제나 실거래는
                발생하지 않습니다.
              </p>

              <div className="mt-5 rounded-2xl bg-black/25 px-4 py-3 ring-1 ring-white/10">
                <p className="text-xs leading-6 text-white/55">
                  운영 상황에 따라 공연 일정과 세부 안내는 변경될 수 있으니 최종 확인 정보는 별도
                  기준을 따라주세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </section>
    </div>
  );
};

export default TheaterDetail;
