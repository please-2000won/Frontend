interface CurrencyInput {
  lable: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const CurrencyInput = ({ label, value, onChange, placeholder }: any) => {
  return (
    <div className="flex flex-col gap-5">
      <label className="text-black font-semibold text-[16px]">{label}</label>
      <div className="flex bg-gray-100 rounded-lg p-4 items-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full text-right text-[20px] rounded-lg outline-none"
        />
        <span className="text-gray-300 text-[20px] pl-3">원</span>
      </div>
    </div>
  );
};

export default CurrencyInput;
