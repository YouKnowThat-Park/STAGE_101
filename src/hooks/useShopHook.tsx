import { ShopType } from '@/types/shop-type';
import React, { useEffect, useState } from 'react';

const useShopHook = (shopId?: string) => {
  // ✅ shopId를 매개변수로 추가
  const [items, setItems] = useState<ShopType[]>([]);
  const [item, setItem] = useState<ShopType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = shopId ? `/api/shop/${shopId}` : `/api/shop`; // ✅ ID 여부에 따라 API 변경
        const res = await fetch(url);
        if (!res.ok) throw new Error('데이터를 불러오는 데 실패했습니다.');
        const data = await res.json();

        if (shopId) {
          setItem(data); // ✅ 특정 상품 저장
        } else {
          setItems(data); // ✅ 전체 상품 목록 저장
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId]); // ✅ shopId가 변경될 때마다 실행

  return { items, item, loading, error };
};

export default useShopHook;
