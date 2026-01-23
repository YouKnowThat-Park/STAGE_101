import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Link from 'next/link';
import { useGoodsRanking } from 'src/hooks/cart_history/useGoodsRanking';
import { GoodsRankingProps } from 'src/lib/api/cart_history/cartGoodsRanking';

const COLORS = ['#C9A66B', '#8E7A4A', '#5F5332', '#3E3721', '#262012'];

const GoodsGraphModal = ({ onClose }: { onClose: () => void }) => {
  const ranking: GoodsRankingProps[] = useGoodsRanking().data ?? [];

  const total = ranking.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-[#111] p-6 rounded-xl w-[540px] text-white relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          ✕
        </button>
        <h2 className="text-center mb-4 text-[#C9A66B] font-bold">많이 판매 된 굿즈</h2>

        <div className="flex gap-6 items-center">
          <div className="w-[260px] h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ranking}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {ranking.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    if (typeof value !== 'number') return '';
                    return `${value}개 (${Math.round((value / total) * 100)} %)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {ranking.map((item, index) => {
              const percent = Math.round((item.value / total) * 100);

              return (
                <div
                  key={item.name}
                  className="flex items-center gap-3 text-sm hover:text-[#C9A66B] transition"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <Link href={`/shop/${item.id}`}>
                    <span className="flex-1 truncate">
                      {index + 1}. {item.name}
                    </span>
                  </Link>
                  <span className="font-semibold">{item.value}개</span>
                  <span className="text-gray-400">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoodsGraphModal;
