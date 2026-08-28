import React from 'react';

interface CategoryCardProps {
  title: string;
  children: React.ReactNode; //태그 사이에 들어오는 타입을 모두 받음
}

const CategoryCard = ({ title, children }: CategoryCardProps) => {
  return (
    <div className="bg-white w-full border border-system-background p-[26px] first:rounded-t-2xl last:rounded-b-2xl">
      <div className="bg-primary-mint-900 text-[16px] font-bold text-white px-[10px] py-[5px] rounded-md inline-block mb-5 text-center items-center">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CategoryCard;
