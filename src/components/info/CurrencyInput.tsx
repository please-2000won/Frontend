import InfoTooltip from '../InfoTooltip';

interface CurrencyInputProps {
  label: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  unit?: string;
  // 라벨 옆 (i) 아이콘에 표시할 부연 설명
  hint?: string;
}

const CurrencyInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  unit = '원',
  hint,
}: CurrencyInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className="text-[15px] font-semibold text-black">{label}</span>
        {hint && <InfoTooltip text={hint} />}
      </div>
      {/* label로 감싸 필드 아무 곳이나 클릭해도 입력창에 포커스되도록 한다. */}
      <label className="flex cursor-text items-center gap-2 rounded-lg bg-gray-100 px-4 py-3.5 focus-within:ring-2 focus-within:ring-primary-mint-800">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-right text-[16px] outline-none"
        />
        <span className="shrink-0 text-[16px] text-gray-700">{unit}</span>
      </label>
    </div>
  );
};

export default CurrencyInput;
