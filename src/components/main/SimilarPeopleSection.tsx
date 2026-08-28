import Tag from './Tag';
import { SIMILAR_PEOPLE } from './mockData';

const SimilarPeopleSection = () => {
  return (
    <section className="bg-primary-mint-200">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-5 py-16">
        <div className="flex flex-col gap-5 text-primary-mint-900">
          <h2 className="text-[32px] font-semibold tracking-[-2px] sm:text-[40px]">
            나와 유사한 사람들은 어떨까?
          </h2>
          <p className="text-[16px] font-medium leading-relaxed tracking-[-1px] sm:text-[20px]">
            Peer Group에서 가장 유사도가 높은 사람들이에요.
            <br />
            프로필을 눌러 정보를 확인할 수 있어요.
          </p>
        </div>
        <div className="flex flex-col gap-5 sm:flex-row">
          {SIMILAR_PEOPLE.map((person, index) => (
            <button
              key={`${person.nickname}-${index}`}
              type="button"
              className="flex flex-1 flex-col gap-[45px] rounded-[16px] bg-white p-[26px] text-left transition-shadow hover:shadow-md"
            >
              <Tag>{person.similarity}</Tag>
              <p className="text-right text-[24px] font-bold tracking-[-1.2px] text-primary-mint-900">
                {person.nickname}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarPeopleSection;
